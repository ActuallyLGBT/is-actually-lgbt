import { IServer } from '../lib'
export default class DbManager {

  _server: IServer

  constructor (server: IServer) {
    this._server = server
  }
}
