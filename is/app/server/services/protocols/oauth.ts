import { IServer } from '../../lib'

export function oauth (server: IServer) {
  return function oauthProtocol (req, _, __, profile, next) {
    let query = {
      identifier: profile.id,
      protocol: 'oauth',
    }

    server.services.passport.login(req, query, profile, next)
  }
}
