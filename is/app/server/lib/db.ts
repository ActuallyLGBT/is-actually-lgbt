import * as Mongoose from 'mongoose'

export interface ISchemaSpec {
  name: string,
  schema: object,
  virtuals?: object,
  options?: object,
}

export interface IDbManager {
  registerModel (ISchemaSpec): IDbManager
  get (string): Mongoose.Model
  run (): Promise<void>
}
