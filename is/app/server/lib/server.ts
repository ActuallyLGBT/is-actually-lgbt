import { IDbManager } from './db'
import { Services } from '../services'

export interface IServer {
  db: IDbManager
  services: Services
  config: any
}
