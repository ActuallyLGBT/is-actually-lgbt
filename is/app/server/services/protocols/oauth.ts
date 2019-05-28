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

    console.log(profile)

    server.services.passport.login(req, query, profile, next)
  }
}
