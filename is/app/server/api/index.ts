import { IServer, IApiManager, IApiSpec, AbstractApiSpec } from '../lib'

export class ApiManager implements IApiManager {

  _server: IServer
  _classes: Map<string, AbstractApiSpec>

  constructor (server: IServer) {
    this._server = server
  }

  get<T extends IApiSpec> (): T {
    return <T>this._classes.get(keyof T)
  }
}

export * from './spec'
