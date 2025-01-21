import server from '@adonisjs/core/services/server'
import { Server, Socket } from 'socket.io'
import { HttpContext } from '@adonisjs/core/http'
import authConfig from '#config/auth'
import sessionConfig from '#config/session'

import emitter from '@adonisjs/core/services/emitter'
import Room from '#models/room'
import Daberna from '#models/daberna'
import i18nManager from '@adonisjs/i18n/services/main'
import env from '#start/env'
import Helper, { __, getSettings } from '#services/helper_service'
import { storage } from '#start/globals'
import app from '@adonisjs/core/services/app'
import Encryption from '@adonisjs/core/services/encryption'
import { CookieClient } from '@adonisjs/http-server'
import { ServerResponse } from 'node:http'
import qs from 'qs'
import { Request } from '@adonisjs/core/http'
import config from '@adonisjs/core/services/config'

import SocketHttpContextMiddleware from '#middleware/socket/socket_http_context_middleware'
import SocketAuthMiddleware from '#middleware/socket/socket_auth_middleware'
import User from '#models/user'
import { DateTime } from 'luxon'
declare module 'socket.io' {
  interface Socket {
    context: HttpContext
  }
}
export default class SocketIo {
  private user: any
  private socket
  public static wsIo: Server
  public static timer
  constructor(/*protected app: ApplicationService*/) {
    // console.log('*********   socket service created ')
    // console.log(Daberna.makeCard())
  }

  public async init() {
    // console.log('*********   socket service inited ')
    SocketIo.wsIo = new Server(server.getNodeServer(), {
      cors: {
        origin: '*',
        allowedHeaders: ['request-room'],
        // origin: ["'https://daberna.soheilmarket.ir'", 'https://pwa.soheilmarket.ir'],
      },
    })

    // SocketIo.wsIo.use(SocketHttpContextMiddleware({ guards: ['admin_web'] }))
    // SocketIo.wsIo.use(SocketAuthMiddleware({ guards: ['admin_api'] }))

    SocketIo.wsIo.on('connection', async (socket) => {
      this.socket = socket

      console.log('*****  ws server service connected')
      const token = socket.handshake.auth.token ?? socket.handshake.headers.token
      const roomType = socket.handshake.headers['request-room']

      // console.log(socket.handshake.headers)
      if (token) {
        this.user = await this.getTokenUser({ socket, token })
      } else {
        this.user = await this.getSessionUser(socket)
      }
      // else this.user = this.authenticateSessionUser({ socket })

      if (roomType) {
        const res = await socket.join(`room-${roomType}`)

        // const room = await Room.findBy('type', roomType)
        // if (room)
        //   await emitter.emit('room-update', {
        //     type: roomType,
        //     cmnd: 'card-added',
        //     players: room.players,
        //     start_with_me: room.startWithMe,
        //     seconds_remaining: room.playerCount > 1 ? room.secondsRemaining : room.maxSeconds,
        //     player_count: room.playerCount,
        //     card_count: room.cardCount,
        //   })
        socket.emit('request-room-accepted', roomType)

        // RoomController.startGame(await Room.query().where('id', 1))
      }

      // socket.on('request-room', async (data) => {
      //   // logger.info(data)
      //   socket.join(`room-${data.type}`)
      //   socket.emit('request-room-accepted', data)
      // })
      if (this.user)
        emitter.on(`user-${this.user.id}-info`, (data: any) => {
          socket.emit(`user-${this.user.id}-info`, data)
        })

      emitter.on('room-update', (data: any) => {
        SocketIo.wsIo.to(`room-${data.type}`).volatile.emit(`room-update`, data)
        // logger.info(data)
      })

      emitter.on('game-start', (data: any) => {
        console.log('----------inner game start')
        socket.to(`room-${data.room_type}`).volatile.emit(`game-start`, data)
        // logger.info(socket.id)
      })
    })

    // emitter.on('game-start', (data: any) => {
    //   console.log('*********outer game start')
    //   console.log(SocketIo.wsIo)

    //   SocketIo.wsIo.emit(`game-start`, data)
    //   SocketIo.wsIo.to(`room-${data.room_type}`).emit(`game-start`, data)
    //   // logger.info(socket.id)
    // })

    emitter.on('custom', (data: any) => {
      console.log('*********custom emit')
      SocketIo.wsIo?.emit(data.event, data)
    })

    this.setTimeChecker()
  }
  public async emitToRoom(room: string, event: string, data: any) {
    // var room = SocketIo.wsIo.sockets.adapter.rooms[room]

    SocketIo.wsIo?.to(`${room}`).volatile.emit(event, data)
  }
  public async emit(event: string, data: any) {
    emitter.emit('custom', { ...data, event: event })
  }

  public async setTimeChecker() {
    // SocketIo.timer = setInterval(async function () {
    //   RoomController.startGame(await Room.query().where('is_active', true))
    //   // clearInterval(SocketIo.timer)
    // }, 5000)

    const state = {
      i18n: i18nManager.locale(env.get('LOCALE', '')),
    } as HttpContext

    storage.run(state, async () => {
      app.listen('SIGTERM', () => {
        console.log('****sigterm****')
        clearInterval(SocketIo.timer)
      })

      SocketIo.timer = setInterval(async () => {
        for (let room of await Room.query().where('is_active', true)) {
          // console.log(`players ${room.playerCount}`, `time ${room.secondsRemaining}`)
          // console.log(__('transactions'))

          if (await getSettings('robot_is_active')) {
            if ((room.botPercent ?? 0 / 100) >= Math.random() * 100) await Room.addBot(room)
          }
          if (app.isTerminated || app.isTerminating) {
            clearInterval(SocketIo.timer)
            break
          }
          //

          // console.log('**************')
          // console.log('room', room.type)
          // console.log('playerCount', room.playerCount)
          // console.log('secondsRemaining', room.secondsRemaining)

          const startAt = room?.startAt
          // console.log(
          //   room.type,
          //   startAt?.plus({ seconds: room.maxSeconds })?.diff(DateTime.now(), 'seconds')
          // )
          // console.log('startAt', startAt)
          // console.log('startAtPlus', startAt?.plus({ seconds: room.maxSeconds }))
          if (
            room.playerCount > 1 &&
            (room.secondsRemaining == room.maxSeconds ||
              (startAt?.plus({ seconds: room.maxSeconds })?.diff(DateTime.now(), 'seconds')
                .seconds ?? 0) < 0)
          ) {
            const game = await Daberna.makeGame(room)

            // SocketIo.wsIo?.to(`room-${room.type}`).emit('game-start', game)
            await this.emitToRoom(`room-${room.type}`, 'game-start', game)
            SocketIo.wsIo?.in(`room-${room.type}`).socketsLeave(`room-${room.type}`)
          }
        }
        // clearInterval(SocketIo.timer)
      }, 2000)
    })
  }

  private async getTokenUser({ socket, token }: { socket: Socket; token: string }) {
    try {
      const authResolver = await authConfig.resolver(app)
      const request: Request = {
        header: () => `Bearer ${token}`,
      } as unknown as Request
      let ctx: HttpContext = {
        request: request,
      } as unknown as HttpContext

      const auth = authResolver.guards.api(ctx)

      const user = await auth.authenticate()

      return user
    } catch (error) {
      console.log('******error socket auth')
      console.log(error)
      socket.disconnect()
    }
  }

  clearTimer() {
    console.log('********timer stopped********')
    clearInterval(SocketIo.timer)
  }

  async getSessionUser(socket: Socket) {
    const sessionResolver = await sessionConfig.resolver(app)
    const sessionKey = sessionResolver.cookieName
    const SocketRequest = new Request(socket.request, {}, Encryption, {}, qs)

    const sessionId = SocketRequest.cookie(sessionKey)

    if (!sessionId) {
      return null
    }
    const session = SocketRequest.encryptedCookie(sessionId)
    if (!session || !session.auth_admin_web) {
      return null
    }
    const user = (await User.find(session.auth_admin_web)) ?? null
    if (!user) {
      socket.disconnect()
    }
    return user
  }
}
// export default new SocketIo()
