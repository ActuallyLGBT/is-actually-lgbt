import { IServer } from '../../lib'

export function openid (server: IServer) {
  return function openidProtocol (req, identifier, profile, next) {
    let query = {
      identifier: identifier,
      protocol: 'openid'
    }

    server.services.passport.login(req, query, profile, next)
  }
}
