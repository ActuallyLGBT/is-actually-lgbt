import { IApiManager } from './api'
import { IDbManager } from './db'
export interface IServer {
  api: IApiManager
  db: IDbManager
}
