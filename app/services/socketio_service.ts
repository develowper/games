import server from '@adonisjs/core/services/server'
import { Server, Socket } from 'socket.io'
import { ApplicationService } from '@adonisjs/core/types'
import { HttpContext } from '@adonisjs/core/http'
import authConfig from '#config/auth'
import User from '../models/user.js'
import logger from '@adonisjs/core/services/logger'
import Helper from './helper_service.js'
import emitter from '@adonisjs/core/services/emitter'
// import { emitter } from '#start/globals'
import app from '@adonisjs/core/services/app'
const RoomController = (await import('#controllers/api/room_controller')).default
import Room from '#models/room'
import Daberna from '#models/daberna'

export default class SocketIo {
  private user: any
  private socket
  public wsIo
  public static timer
  constructor(/*protected app: ApplicationService*/) {
    console.log('*********   socket service created ')

    // console.log(Daberna.makeCard())
  }

  public async init() {
    // console.log('*********   socket service inited ')
    this.wsIo = new Server(server.getNodeServer(), {
      cors: {
        origin: ['*'],
      },
    })

    //TODO: remove this new server to use adonis server

    this.wsIo.on('connection', async (socket) => {
      this.socket = socket
      console.log('onConnection****')
      console.log('  ws server service connected')
      const token = socket.handshake.auth.token ?? socket.handshake.headers.token
      const roomType = socket.handshake.headers['request-room']
      this.user = await this.authenticateUser({ socket, token })

      if (roomType) {
        socket.join(`room-${roomType}`)
        const room = await Room.findBy('type', roomType)
        if (room)
          emitter.emit('room-update', {
            type: roomType,
            cmnd: 'card-added',
            players: room.players,
            start_with_me: room.startWithMe,
            seconds_remaining: room.playerCount > 1 ? room.secondsRemaining : room.maxSeconds,
            player_count: room.playerCount,
            card_count: room.cardCount,
          })
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
        socket.to(`room-${data.type}`).emit(`room-update`, data)
        // logger.info(data)
      })

      emitter.on('game-start', (data: any) => {
        console.log('----------inner game start')
        socket.to(`room-${data.room_type}`).emit(`game-start`, data)
        // logger.info(socket.id)
      })
    })

    // emitter.on('game-start', (data: any) => {
    //   console.log('*********outer game start')
    //   console.log(this.wsIo)

    //   this.wsIo.emit(`game-start`, data)
    //   this.wsIo.to(`room-${data.room_type}`).emit(`game-start`, data)
    //   // logger.info(socket.id)
    // })

    emitter.on('custom', (data: any) => {
      console.log('*********custom emit')
      this.wsIo?.emit(data.event, data)
    })

    // SocketIo.setTimeChecker()
  }
  public async emitToRoom(room: string, event: string, data: any) {
    // var room = this.wsIo.sockets.adapter.rooms[room]

    this.wsIo?.to(`${room}`).emit(event, data)
  }
  public async emit(event: string, data: any) {
    emitter.emit('custom', { ...data, event: event })
  }

  public static setTimeChecker() {
    SocketIo.timer = setInterval(async function () {
      RoomController.startGame(await Room.query().where('is_active', true))
      // clearInterval(SocketIo.timer)
    }, 5000)
  }

  private async authenticateUser({ socket, token }: { socket: Socket; token: string }) {
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
      console.log(error)
      socket.disconnect()
    }
  }
}

// export default new SocketIo()
