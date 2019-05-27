/**
 * An extended map with utility functions
 * @extends Map
 */
class TypedCollection<K, V> extends Map<K,V> {
  /**
   * Returns all items in the collection as an array
   * @returns {Array} Array of values
   */
  toArray (): V[] {
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
  filter (args): V[] {
    return this.toArray().filter(args)
  }

  /**
   * Find values by function
   * @arg {function} func find function
   * @returns {*} Value that was found
   */
  find (args: (item: V) => boolean): V {
    return this.toArray().find(args)
  }

  /**
   * Map values by function
   * @arg {function} func map function
   * @returns {Array} Array of mapped values
   */
  map (args: (item: V) => V): V[] {
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
  pluck (key: string): V[] {
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
  unique (): V[] {
    return [...new Set(this.toArray())]
  }
}

class Collection extends TypedCollection<any, any> {}

export { TypedCollection, Collection }
