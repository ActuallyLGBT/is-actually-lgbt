import { IServer } from './server'

export abstract class BaseObject {

  private _server: IServer

  constructor (server: IServer) {
    this._server = server
  }

  protected get server (): IServer {
    return this._server
  }
}

export interface Initializable {
  init (...args): void
}

export interface IAccount {
  _id: string
  email: string
}
