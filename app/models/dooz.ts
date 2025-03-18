import { BaseModel, column } from '@adonisjs/lucid/orm'
import { DateTime } from 'luxon'
import Helper, { shuffle } from '#services/helper_service'
import Room from '#models/room'
import collect from 'collect.js'
import User from '#models/user'
import SocketIo from '#services/socketio_service'
import Telegram from '#services/telegram_service'

export default class Dooz extends BaseModel {
  static table = 'dooz'
  @column({ isPrimary: true })
  declare id: number
  @column({ columnName: 'p1_id' })
  declare p1Id: number
  @column({ columnName: 'p2_id' })
  declare p2Id: number
  @column()
  declare winnerId: number
  @column()
  declare turnId: number
  @column()
  declare turnRole: string
  @column()
  declare action: string
  @column()
  declare step: number
  @column()
  declare type: string

  @column({
    serialize: (value: string) => JSON.parse(value) ?? [],
    // consume: (value: any) => JSON.stringify(value),
  })
  declare state: any

  @column()
  declare prize: number

  @column()
  declare realTotalMoney: number
  @column()
  declare realPrize: number

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  static async makeGame(room) {
    let roomPlayers = collect(JSON.parse(room.players ?? '[]'))

    // console.log('room players', roomPlayers.count())
    // console.log('room user players', roomPlayers.where('user_role', 'us').count())
    //checks users connected to socket

    if (roomPlayers.count() < 2 || roomPlayers.where('user_role', 'us').count() == 0) return
    const roomSockets = await SocketIo.wsIo?.in(`room-${room.type}`).fetchSockets()
    console.log(`room-sockets`, roomSockets.length)

    const userConnectedIds = roomSockets.map(
      (socket) => socket.handshake.headers['user-id'] ?? socket.handshake.query['user-id']
    )
    if (userConnectedIds.length == 0) return

    const player1 = roomPlayers
      .where('user_role', 'us')
      // .whereIn('user_id', userConnectedIds)
      .first()
    if (!player1) return

    const player2 =
      roomPlayers
        .where('user_id', '!=', player1.user_id)
        .where('user_role', 'us')
        .whereIn('user_id', userConnectedIds)
        .first() ?? roomPlayers.where('user_id', '!=', player1.user_id).first()
    if (!player2) return
    room.isActive = false
    await room.save()
    roomPlayers = await room.setUser(player1, 'remove')
    roomPlayers = await room.setUser(player2, 'remove')
    // room.cardCount -= 2
    // room.playerCount -= 2
    const realUserCount = (player1.user_role == 'us' ? 1 : 0) + (player2.user_role == 'us' ? 1 : 0)
    const turn = Math.random() < 0.5 ? player1.user_id : player2.user_id
    const allowedCells = Helper.DOOZ.board
      .map((value: any, index: any) => (value === 0 ? index : -1))
      .filter((index: any) => index !== -1)

    const board = Helper.DOOZ.board.map((item) => {
      return { owner: item == -1 ? -1 : null, allowed: [] }
    })
    const game = await Dooz.create({
      type: room.type,
      step: 1,
      action: 'insert',
      createdAt: DateTime.now(),
      updatedAt: null,
      p1Id: player1.user_id,
      p2Id: player2.user_id,
      turnId: player1.user_id,
      turnRole: player1.user_role,
      prize: Math.round((room.cardPrice * 2 * room.winPercent) / 100),
      realTotalMoney: room.cardPrice * realUserCount,
      state: JSON.stringify({
        row: Helper.DOOZ.row,
        col: Helper.DOOZ.col,
        board: board,
        [player1.user_id]: {
          username: player1.username,
          user_role: player1.user_role,
          start: 9,
          in: 0,
          out: 0,
          allowed: allowedCells,
        },
        [player2.user_id]: {
          username: player2.username,
          user_role: player2.user_role,
          start: 9,
          in: 0,
          out: 0,
          allowed: allowedCells,
        },
      }),
    })
    console.log(`------game ${game.id} created`)
    room.isActive = true
    await room.save()
    return game
  }
  public static checkDooz(board: any, moveIndex: any) {
    const res: any = []
    moveIndex = Number.parseInt(`${moveIndex}`)
    for (let line of Helper.DOOZ.doozes) {
      const [a, b, c] = line
      // console.log('line', line)
      // console.log('board', board)
      // console.log('board', `${board[a].owner} ${board[b].owner} ${board[c].owner}`)

      if (
        line.includes(moveIndex) &&
        board[a].owner !== null &&
        board[a].owner === board[b].owner &&
        board[a].owner === board[c].owner
      ) {
        // console.log('line', line)
        // console.log('board', `${board[a].owner} ${board[b].owner} ${board[c].owner}`)

        res.push(line)
      }
    }
    return res.length > 0 ? res : null
  }

  private startGame(board: any) {}

  static async playBot(game: any): any {
    let state = JSON.parse(game.state)
    const board = state['board']
    const meId = game.turnId
    const opId = game.p1Id == meId ? game.p2Id : game.p1Id
    const meInfo = state[meId]
    const opInfo = state[opId]
    // state['board'][32].owner = null
    // state['board'][40].owner = null
    // game.state = JSON.stringify(state)
    // await game.save()
    let move = null
    switch (game.action) {
      case 'kick':
        if (state[opId].start > 0) {
          console.log('kicked start ')
          state[opId]['start']--
          state[opId]['out']++
          move = [-1, -1]
        } else {
          //kick from inside board

          //check possible moves opponent can dooz
          for (let line of Helper.DOOZ.doozes) {
            const ownedInLine = line.filter((item) => board[item].owner == opId)
            const emptyInLine = line.filter((item) => board[item].owner == null)
            if (ownedInLine.length == 2 && emptyInLine.length == 1) {
              //check opponent can fill empty with moves
              const emptyIndex = emptyInLine[0]
              const nearsOwnedOp = Helper.DOOZ.nears[emptyIndex].filter(
                (item) => board[item].owner == opId
              )
              if (nearsOwnedOp.length > 0) {
                const kickIndex = shuffle(nearsOwnedOp)[0]
                board[kickIndex].owner = null
                move = [kickIndex, -1]
                break
              }
              console.log(emptyIndex, nearsOwnedOp)
            }
          }
          if (move == null) {
            //random kick
            const kickIndex = shuffle(
              board.map((item, idx) => (item.owner == opId ? idx : -1)).filter((i) => i != -1)
            )[0]
            board[kickIndex].owner = null
            move = [kickIndex, -1]
          }
          console.log('kick', move)
          state['board'] = board
          state[opId]['in']--
          state[opId]['out']++
        }

        game.action = state[opId]['start'] > 0 ? 'insert' : 'move'
        game.turnId = opId
        game.turnRole = opInfo.user_role
        if (state[opId]['start'] + state[opId]['in'] < 3) {
          game.winnerId = meId
          game.turnId = null
          game.turnRole = null
        }
        break
      case 'insert':
      case 'move':
        const ownedIndexes = board
          .map((i, idx) => (i.owner == meId ? idx : null))
          .filter((i) => i != null)
        const opOwnedIndexes = board
          .map((i, idx) => (i.owner == opId ? idx : null))
          .filter((i) => i != null)
        //check if can make any dooz ?
        for (let idx in board) {
          if (move != null) break
          idx = Number.parseInt(idx)
          if (board[idx]['owner'] == null) {
            let canMoveFrom =
              state[meId].start > 0
                ? [-1]
                : state[meId].in == 3
                  ? (Helper.DOOZ.doozes
                      .filter(
                        (line) =>
                          line.includes(idx) &&
                          line.filter((i) => board[i].owner == meId).length == 2
                      )
                      ?.map((line) =>
                        board
                          .map((i, idx) => (i.owner == meId ? idx : null))
                          .filter((p) => p != null)
                          .filter((i) => !line.includes(i))
                      )[0] ?? [])
                  : Helper.DOOZ.nears[idx].filter((item: any) => board[item].owner == meId)
            if (canMoveFrom.length > 0) {
              canMoveFrom = shuffle(canMoveFrom)
              board[idx]['owner'] = meId
              for (let from of canMoveFrom) {
                const moveFrom = Number.parseInt(`${from}`)
                if (moveFrom != -1) board[moveFrom]['owner'] = null
                const doozes = Dooz.checkDooz(board, idx)
                if (doozes != null) {
                  move = [moveFrom, Number.parseInt(`${idx}`)]
                  game.action = 'kick'
                  console.log('dooz', move, doozes)
                  break
                }
                //undo temp move
                if (moveFrom != -1) board[moveFrom]['owner'] = meId
              }
            }
            board[idx]['owner'] = null
          }
        }
        // const canMoveFrom = Object.entries(Helper.DOOZ.nears).filter((item: any) => {
        //   console.log(item[1])
        //   return true
        // })
        // console.log(canMoveFrom)

        //else check opponent possible dooz and block that
        // 1- add one piece from opponent in every board cell
        // 2- check if make dooz then fill that cell with my piece

        if (move == null)
          for (let idx in board) {
            if (move != null) break
            idx = Number.parseInt(`${idx}`)

            if (board[idx]['owner'] == null) {
              //check is possible
              const opTwoPiecesLines = Helper.DOOZ.doozes.filter(
                (line) =>
                  line.filter((i) => board[i].owner == opId).length == 2 &&
                  line.filter((i) => board[i].owner == null).length == 1
              )

              if (opTwoPiecesLines.length > 0) {
                console.log('opTwoPiecesLines', opTwoPiecesLines)
                //check what lines op can complete dooz
                for (let line of opTwoPiecesLines) {
                  if (move != null) break
                  const nullIndex = line.filter((i) => board[i].owner == null)[0]
                  const opCanMoveFrom =
                    state[opId].start > 0
                      ? [-1]
                      : state[opId].in == 3
                        ? opOwnedIndexes
                        : Helper.DOOZ.nears[nullIndex].filter(
                            (item: any) => board[item].owner == opId
                          )
                  // console.log('opCanMoveFrom', opCanMoveFrom)

                  if (opCanMoveFrom.length > 0) {
                    //op can fill index we must block that if possible

                    const aloneOwnedIndexes = ownedIndexes.filter(
                      (item) =>
                        //not near of any owned cells
                        Helper.DOOZ.nears[item].filter((i) => board[i].owner == meId).length == 0 &&
                        //not blocked any opponent dooz
                        Helper.DOOZ.doozes.filter(
                          (line) =>
                            line.includes(item) &&
                            line.filter((i) => board[i].owner == opId).length == 2
                        ).length == 0
                    )
                    const opTwoPiecesLinesMeBlocked = Helper.DOOZ.doozes.filter(
                      (line) =>
                        line.filter((i) => board[i].owner == opId).length == 2 &&
                        line.filter((i) => board[i].owner == meId).length == 1
                    )
                    const meNotInOpTwoPieces = ownedIndexes.filter((i) => {
                      return opTwoPiecesLinesMeBlocked.every((line) => !line.includes(i))
                    })
                    // console.log('opTwoPiecesLinesMeBlocked', opTwoPiecesLinesMeBlocked)
                    // console.log('aloneOwnedIndexes', aloneOwnedIndexes)
                    // console.log('meNotInOpTwoPieces', meNotInOpTwoPieces)

                    const meCanMoveFrom =
                      state[meId].start > 0
                        ? [-1]
                        : state[meId].in == 3
                          ? aloneOwnedIndexes.length > 0
                            ? aloneOwnedIndexes
                            : meNotInOpTwoPieces.length > 0
                              ? meNotInOpTwoPieces
                              : ownedIndexes
                          : Helper.DOOZ.nears[nullIndex].filter(
                              (item: any) => board[item].owner == meId
                            )
                    console.log('meCanMoveFrom', meCanMoveFrom)

                    if (meCanMoveFrom.length > 0) {
                      const moveFrom = Number.parseInt(`${meCanMoveFrom[0]}`)
                      if (moveFrom != -1) board[moveFrom]['owner'] = null
                      move = [moveFrom, nullIndex]
                      board[nullIndex]['owner'] = meId
                      game.turnId = opId
                      game.turnRole = opInfo['user_role']
                      console.log('block', move, meCanMoveFrom)
                      break
                    }
                  }
                }
              }
            }
          }
        //if cant find any move then add to nearest self piece
        if (move == null)
          for (let idx in board) {
            if (move != null) break
            idx = Number.parseInt(`${idx}`)
            if (board[idx]['owner'] == null) {
              board[idx]['owner'] = meId

              const canMoveFrom =
                state[meId].start > 0
                  ? [-1]
                  : Helper.DOOZ.nears[idx].filter(
                      (i) =>
                        board[i]['owner'] == meId &&
                        Helper.DOOZ.doozes.filter(
                          (line) =>
                            line.includes(i) &&
                            line.filter((l) => opOwnedIndexes.includes(l)).length == 2
                        ).length == 0
                    )

              if (canMoveFrom.length > 0) {
                for (let from of canMoveFrom) {
                  const moveFrom = Number.parseInt(`${from}`)
                  if (moveFrom != -1) board[moveFrom]['owner'] = null
                  const doozesHasTwoPiece = Helper.DOOZ.doozes.filter(
                    (line) =>
                      line.includes(idx) &&
                      line.filter((i) => board[i]['owner'] == meId).length == 2
                  )
                  if (doozesHasTwoPiece.length > 0) {
                    move = [moveFrom, idx]
                    game.turnId = opId
                    game.turnRole = opInfo['user_role']
                    console.log('near', move, canMoveFrom)
                    break
                  }
                  if (moveFrom != -1) board[moveFrom]['owner'] = meId
                }
              }

              board[idx]['owner'] = null
            }
          }

        //finally random fill
        if (move == null) {
          const freeIndexes = shuffle(
            board.map((item, idx) => (item['owner'] == null ? idx : -1)).filter((it) => it != -1)
          )
          // console.log('freeIndexes', freeIndexes)

          let canMoveFrom = state[meId].start > 0 ? [-1] : []

          for (let index of freeIndexes) {
            if (move != null) {
              game.turnId = opId
              game.turnRole = opInfo['user_role']
              break
            }
            canMoveFrom =
              canMoveFrom.length > 0
                ? canMoveFrom
                : Helper.DOOZ.nears[index].filter((item: any) => board[item].owner == meId)

            console.log('index', index)
            console.log('canMoveFrom', canMoveFrom)
            if (canMoveFrom.length > 0) {
              const moveFrom = Number.parseInt(`${canMoveFrom[0]}`)
              if (moveFrom != -1) board[moveFrom]['owner'] = null
              move = [moveFrom, Number.parseInt(`${index}`)]
              console.log('random', move)
            }
          }
        }

        if (state[meId].start > 0) {
          state[meId].start--
          state[meId].in++
        }

        board[move[1]].owner = meId
        state['board'] = board

        break
    }
    state['move'] = move
    // state['board'] = state['board'].map((i, idx) => {
    //   if (i.owner == -1) i.owner = -1
    //   else if ([0, 17, 18].includes(idx)) i.owner = 12
    //   else if ([8, 16, 22].includes(idx)) i.owner = 2
    //   else i.owner = null
    //   return i
    // })
    state = Dooz.setAllowed(state, meId, opId)
    game.step++
    game.updatedAt = DateTime.now()
    //if opponent cant move not change turn
    if (
      state[opId].start == 0 &&
      state['board'].filter((item) => item.owner == opId && item.allowed.length > 0).length == 0
    ) {
      console.log('remain turn', state[meId])
      game.turnId = meId
      game.turnRole = meInfo['user_role']
    }
    game.state = JSON.stringify(state)
    await game.save()
    Dooz.updateSockets(game)
    return game
  }
  static async updateSockets(game) {
    SocketIo.wsIo?.in(`dooz-${game.id}`).volatile.emit('dooz-update', { game: game })
    if (game.winnerId) {
      SocketIo.wsIo?.socketsLeave(`dooz-${game.id}`)
      Telegram.sendMessage(`${Helper.TELEGRAM_LOGS[0]}`, game)
    }
    const roomSockets = await SocketIo.wsIo?.in(`dooz-${game?.id}`).fetchSockets()
    console.log('socets len', roomSockets.length)
  }
  static async play(game: Dooz, move: any, user: User) {
    move = [Number.parseInt(`${move[0]}`), Number.parseInt(`${move[1]}`)]
    let state = JSON.parse(game.state)
    const board = state['board']
    const meId = user.id
    const opId = game.p1Id == user.id ? game.p2Id : game.p1Id
    if (move.length !== 2) return
    switch (game.action) {
      case 'kick':
        if (state[meId].allowed.includes(move[1])) {
          state['board'][move[1]].owner = null
        }
        game.turnId = opId
        game.turnRole = state[opId].user_role
        game.action = 'move'
        state['move'] = [move[1], -1]
        state[opId].in--
        state[opId].out++
        state = Dooz.setAllowed(state, meId, opId)
        if (state['board'].filter((i) => i.owner == opId).length < 3) {
          game.winnerId = meId
          game.turnId = null
          game.turnRole = null
        }
        break
      case 'insert':
      case 'move':
        // console.log(state['board'][32])
        // state['board'][32].owner = null
        // game.state = JSON.stringify(state)
        // await game.save()
        // return
        if (move[0] == -1 && state[meId].start > 0) {
          if (!state[meId].allowed.includes(move[1])) return game
          //add from out
          state[meId].start--
          state[meId].in++
        }
        if (move[0] != -1 && state[meId].start == 0) {
          if (!state['board'][move[0]].allowed.includes(move[1])) return game
          board[move[0]].owner = null
        }
        // state[meId].allowed = state[user.id].allowed.filter((item: any) => item != move[1])
        // state[opId].allowed = state[meId].allowed
        board[move[1]].owner = meId
        state['board'] = board
        state['move'] = move
        state = Dooz.setAllowed(state, meId, opId)
        game.turnId = opId
        game.turnRole = state[opId].user_role
        const res = Dooz.checkDooz(board, move[1])
        if (res != null) {
          if (state[opId].start == 0) {
            game.action = 'kick'
            state[meId].allowed = state['board']
              .map((item, idx) => (item.owner == opId ? idx : null))
              .filter((item) => item != null)
            game.turnId = meId
            game.turnRole = state[meId].user_role
          } else {
            state[opId].start--
          }
        }
        break
    }
    if (
      state[opId].start == 0 &&
      state['board'].filter((item) => item.owner == opId && item.allowed.length > 0).length == 0
    ) {
      console.log('remain turn (user cant do any moves)', state[meId])
      game.turnId = meId
      game.turnRole = state[meId]['user_role']
    }
    game.step++
    game.updatedAt = DateTime.now()
    game.state = JSON.stringify(state)
    console.log('player', move)
    await game.save()
    Dooz.updateSockets(game)
    return game
  }
  private static setAllowed(state, meId, opId) {
    if (state[meId]['start'] > 0 || state[meId]['in'] == 3) {
      state[meId]['allowed'] = state['board']
        .map((item, idx) => (item.owner == null ? idx : null))
        .filter((item) => item != null)
    }
    if (state[opId]['start'] > 0 || state[opId]['in'] == 3) {
      state[opId]['allowed'] = state['board']
        .map((item, idx) => (item.owner == null ? idx : null))
        .filter((item) => item != null)
    }

    if (state[meId]['start'] == 0) {
      //find available moves for every owned piece
      for (let idx in state['board']) {
        idx = Number.parseInt(`${idx}`)
        if (state['board'][idx].owner == meId) {
          state['board'][idx].allowed =
            state[meId]['in'] == 3
              ? state[meId]['allowed']
              : Helper.DOOZ.nears[idx].filter((item) => state['board'][item].owner == null)
          console.log(`meAllowed from ${idx}`, state['board'][idx].allowed)
        }
      }
      state[meId]['allowed'] = []
    }
    if (state[opId]['start'] == 0) {
      //find available moves for every owned piece
      for (let idx in state['board']) {
        idx = Number.parseInt(`${idx}`)
        if (state['board'][idx].owner == opId) {
          state['board'][idx].allowed =
            state[opId]['in'] == 3
              ? state[opId]['allowed']
              : Helper.DOOZ.nears[idx].filter((item) => state['board'][item].owner == null)
          console.log(`opAllowed from ${idx}`, state['board'][idx].allowed)
        }
      }
      state[opId]['allowed'] = []
    }
    // if (action == 'kick') {
    //   state[meId]['allowed'] = state['board']
    //     .map((item, idx) => (item.owner == opId ? idx : null))
    //     .filter((item) => item != null)
    // }
    return state
  }
}
