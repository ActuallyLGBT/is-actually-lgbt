import * as Mongoose from 'mongoose'

interface ISchemaIndexSpec {
  keys: object,
  options?: object,
}

export interface ISchemaSpec {
  name: string,
  schema: object,
  virtuals?: object,
  indexes?: Array<ISchemaIndexSpec>,
  options?: object,
}

export interface IDbManager {
  registerModel (spec: ISchemaSpec): IDbManager
  get (key: string): Mongoose.Model
  run (): Promise<void>
}
