import * as Mongoose from 'mongoose'
import * as Promise from 'bluebird'
import * as SchemaSpecs from './spec'
import { TypedCollection } from '../utils'
import { IServer, IDbManager, ISchemaSpec } from '../lib'

Mongoose.Promise = Promise

export default class DbManager extends TypedCollection<string, Mongoose.Model> implements IDbManager {

  _server: IServer
  _config: any

  constructor (server: IServer, options = { mongo: { uri: '' } }) {
    super()

    this._server = server
    this._config = options.mongo
  }

  run (): Promise<any> {
    for (const key in SchemaSpecs) {
      this.registerModel(SchemaSpecs[key])
    }

    return this.connect()
  }

  connect (): Promise<null> {
    return new Promise((resolve, _) => {
      Mongoose.connection.once('open', () => {
        console.log('Mongoose Connected')
        resolve()
      })

      Mongoose.connect(this._config.uri, { useNewUrlParser: true }, err => {
        if (err) {
          console.error(err)
          throw err
        }
      })
    })
  }

  registerModel (spec: ISchemaSpec): IDbManager {
    let name = spec.name

    if (this.has(name)) {
      throw new Error(`Duplicate schema/spec - ${name}`)
      return this
    }

    let schema = Mongoose.Schema(spec.schema, spec.options || {})

    if (spec.virtuals) {
      for (const key in spec.virtuals) {
        schema.virtual(key, spec.virtuals[key])
      }
    }

    schema.static('findOneOrCreate', function findOneOrCreate (condition, doc) {
      let opts = {
        new: true,
        upsert: true
      }
      return this.findOneAndUpdate(condition, doc, opts)
    })

    let model = Mongoose.model(name, schema)

    this.set(name, model)
    console.log(`Registered Model: ${name}`)
    return this
  }
}
