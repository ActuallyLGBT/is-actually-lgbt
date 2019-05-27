import * as Mongoose from 'mongoose'
import { IServer } from './server'
import { BaseObject, Initializable } from './base'

export abstract class BasicService extends BaseObject implements Initializable {

  constructor (server: IServer) {
    super(server)
    this.init()
  }

  /**
   * Shortcut function to get Mongoose Model from db object in server
   * @param  {string}         key The name of the model
   * @return {Mongoose.Model}     The model object
   */
  protected model (key: string): Mongoose.Model {
    return this.server.db.get(key)
  }

  /**
   * Run one time code for the service. Overload this.
   */
  public init (): void {}
}
