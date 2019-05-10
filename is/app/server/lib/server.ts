import { IDbManager } from './db'
import { IController } from './controller'
import Services from '../services'

export interface IServer {
  db: IDbManager
  controllers: IController[]
  services: Services
  config: any
}
