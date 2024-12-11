declare module '@ioc:MyScoket' {
    import SocketIo from '#services/socketio_service'
    const MySocket: SocketIo
    export default MySocket
}