import * as path from 'path'
import * as fs from 'fs'
import * as util from 'util'
import { Collection, Utils } from '../utils'

export class APIPlugin extends Collection {

  _server: any

  constructor (server: any) {
    super()
    this._server = server
  }

  register (apis) {
    switch (typeof apis) {
      case 'string': {
        const filepath = path.join(process.cwd(), apis)
        if (!fs.existsSync(filepath)) {
          throw new Error(`Folder path ${filepath} does not exist`)
        }

        const a =  Utils.isDir(filepath) ? Utils.requireAll(filepath) : require(filepath)
        return this.register(a)
      }

      case 'object': {
        if (Array.isArray(apis)) {
          for (const api of apis) {
            this.attach(api)
          }
          return this
        }

        for (const key in apis) {
          this.attach(apis[key])
        }

        return this
      }

      default: {
        throw new Error('Path supplied is not an object or string')
      }
    }
  }

  attach (API: any): APIPlugin {
    if (API instanceof Array) {
      for (const api of API) {
        this.attach(api)
      }

      return this
    }

    if (!API.name || !API.func) {
      throw new Error(`Invalid api - ${util.inspect(API)}`)
    }

    let name = API.name

    if (this.has(name)) {
      throw new Error(`Duplicate API - ${name}`)
      return this
    }

    let api = typeof API.func === 'function' ? API.func(this._server) : API.func

    this.set(name, api)

    Object.defineProperty(this, name, {
      get: () => this.get(name)
    })

    return this
  }

  unregister (name: string): APIPlugin {
    delete this[name]
    this.delete(name)
    return this
  }
}
