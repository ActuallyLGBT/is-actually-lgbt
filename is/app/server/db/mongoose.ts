import * as path from 'path'
import * as fs from 'fs'
import * as util from 'util'
import * as Mongoose from 'mongoose'
import * as Promise from 'bluebird'
import { Utils, Collection } from '../utils'

Mongoose.Promise = Promise

class MongooseConnector extends Collection {

  config: object

  constructor (options = { mongo: {} }) {
    super()

    this.config = options.mongo
  }

  get mongoose(): Object {
    return Mongoose
  }

  register (schemas) {
    switch (typeof schemas) {
      case 'string': {
        const filepath = path.join(process.cwd(), schemas)
        if (!fs.existsSync(filepath)) {
          throw new Error(`Folder path ${filepath} does not exist`)
        }

        const schms =  Utils.isDir(filepath) ? Utils.requireAll(filepath) : require(filepath)
        return this.register(schms)
      }

      case 'object': {
        if (Array.isArray(schemas)) {
          for (const schema of schemas) {
            this.attach(schema)
          }
          return this
        }

        for (const key in schemas) {
          this.attach(schemas[key])
        }

        return this
      }

      default: {
        throw new Error('Path supplied is not an object or string')
      }
    }
  }

  attach (Schema) {
    if (Schema instanceof Array) {
      for (const schema of Schema) {
        this.attach(schema)
      }

      return this
    }

    if (!Schema.name || !Schema.schema) {
      throw new Error(`Invalid model/schema - ${util.inspect(Schema)}`)
    }

    let name = Schema.name

    if (this.has(name)) {
      throw new Error(`Duplicate model/schema - ${name}`)
      return this
    }

    let schema = Mongoose.Schema(Schema.schema, Schema.options || {})

    if (Schema.virtuals) {
      for (const key in Schema.virtuals) {
        schema.virtual(key, Schema.virtuals[key])
      }
    }

    // schema.plugin(findOrCreatePlugin)

    schema.static('findOneOrCreate', function findOneOrCreate (condition, doc) {
      let opts = {
        new: true,
        upsert: true
      }
      return this.findOneAndUpdate(condition, doc, opts)
    })

    let model = Mongoose.model(name, schema)

    this.set(name, model)

    this[name] = model

    /**
     * Fires when a schema is registered
     *
     * @event Navi#mongoose:registered
     * @type {Object}
     * @prop {String} name Schema name
     * @prop {Number} count Number of loaded schemas
     */
    // this._client.emit('mongoose:registered', {
    //   name,
    //   count: this.size
    // })
    return this
  }

  run () {}
}

export default MongooseConnector
