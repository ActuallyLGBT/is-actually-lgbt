import MongooseConnector from './mongoose'

function register (schemas) {
  var a = new MongooseConnector()
  a.register(schemas)
}

export default {}

export { register }
