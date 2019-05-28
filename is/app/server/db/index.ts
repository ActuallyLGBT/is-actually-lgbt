import * as Mongoose from 'mongoose'
import * as Promise from 'bluebird'
import * as SchemaSpecs from './spec'
import { IDbManager, ISchemaSpec } from '../lib'

Mongoose.Promise = Promise

export class DbManager extends Map<string, Mongoose.Model> implements IDbManager {

  private _config: any

  constructor (options: any = { mongo: { uri: '' } }) {
    super()

    this._config = options.mongo
  }

  public run (): Promise<any> {
    for (const key in SchemaSpecs) {
      this.registerModel(SchemaSpecs[key])
    }

    return this.connect()
  }

  public connect (): Promise<null> {
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

  public registerModel (spec: ISchemaSpec): IDbManager {
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

    if (spec.indexes) {
      for (const index of spec.indexes) {
        schema.index(index.keys, index.options || {})
      }
    }

    schema.static('findOneOrCreate', function findOneOrCreate (condition, doc) {
      const opts = {
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
