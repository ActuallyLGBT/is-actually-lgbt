import * as path from 'path'
import * as fs from 'fs'

class Utils {
  static isDir (fname) {
    return fs.existsSync(fname) ? fs.statSync(fname).isDirectory() : false
  }

  /**
   * Reads a directory recursively and returns an object mapping the required files to the folder
   * @arg {String} dir Directory path
   * @returns {Object}
   */
  static requireAll (dir) {
    return fs.readdirSync(dir).reduce((obj, file) => {
      if (file.startsWith('.')) return obj
      const filepath = path.join(dir, file)
      obj[file.substring(0, path.basename(filepath, path.extname(filepath)).length)] = Utils.isDir(filepath)
      ? Utils.requireAll(filepath) : require(filepath)
      return obj
    }, {})
  }
}

/**
 * An extended map with utility functions
 * @extends Map
 */
class Collection extends Map {
  /**
   * Returns all items in the collection as an array
   * @returns {Array} Array of values
   */
  toArray () {
    return [...this.values()]
  }

  /**
   * Executes a function on all values
   * @arg {function} func forEach function
   */
  forEach (args) {
    return this.toArray().forEach(args)
  }

  /**
   * Filter values by function
   * @arg {function} func filter function
   * @returns {Array} Array of filtered values
   */
  filter (args) {
    return this.toArray().filter(args)
  }

  /**
   * Find values by function
   * @arg {function} func find function
   * @returns {*} Value that was found
   */
  find (args) {
    return this.toArray().find(args)
  }

  /**
   * Map values by function
   * @arg {function} func map function
   * @returns {Array} Array of mapped values
   */
  map (args) {
    return this.toArray().map(args)
  }

  /**
   * Reduce values by function
   * @arg {function} func reduce function
   * @returns {Array} Array of reduced values
   */
  reduce (args) {
    return this.toArray().reduce(args)
  }

  /**
   * Pluck values with key by function
   * @arg {String} key The matching key
   * @returns {Array} Array of keyed values
   */
  pluck (key) {
    return this.toArray().reduce((i, o) => {
      if (!o[key]) return i
      i.push(o[key])
      return i
    }, [])
  }

  /**
   * Group values by key
   * @arg {String} key The matching key
   * @returns {Object} Object containing grouped values
   */
  groupBy (key) {
    return this.toArray().reduce((i, o) => {
      let val = o[key]
      i[val] = i[val] || []
      i[val].push(o)
      return i
    }, {})
  }

  /**
   * Get unique values
   * @returns {Array} unique Array of unique values
   */
  unique () {
    return [...new Set(this.toArray())]
  }
}

export { Utils }
export { Collection }
