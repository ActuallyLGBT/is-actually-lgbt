import * as path from 'path'
import * as fs from 'fs'

export class Utils {
  static isDir (fname) {
    return fs.existsSync(fname) ? fs.statSync(fname).isDirectory() : false
  }

  static requireRecursive (dir) {
    return fs.readdirSync(dir).reduce((arr, file) => {
      if (file.startsWith('.')) return arr
      const filepath = path.join(dir, file)
      arr.push(Utils.isDir(filepath) ? Utils.requireRecursive(filepath) : require(filepath))
      return arr
    }, [])
  }

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
