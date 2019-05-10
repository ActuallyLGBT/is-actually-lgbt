import { IServer } from '../lib'

export default class AuthService {

  _server: IServer

  constructor (server: IServer) {
    this._server = server
  }

}
