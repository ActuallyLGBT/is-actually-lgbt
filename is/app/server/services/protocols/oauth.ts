import { IServer } from '../../lib'

export function oauth (server: IServer) {
  return function oauthProtocol (req, token, tokenSecret, profile, next) {
    let query = {
      identifier: profile.id,
      protocol: 'oauth',
      tokens: {
        token: token
      }
    }

    if (tokenSecret !== undefined) {
      query.tokens['tokenSecret'] = tokenSecret
    }

    server.services.passport.connect(req, query, profile, next)
  }
}
