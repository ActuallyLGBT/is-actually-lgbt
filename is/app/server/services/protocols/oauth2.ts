import { IServer } from '../../lib'
import * as R from 'ramda'

export function oauth2 (server: IServer) {
  return function oauth2Protocol (req, accessToken, refreshToken, profile, next) {
    let query = {
      identifier: profile.id,
      protocol: 'oauth2',
      tokens: {
        accessToken: accessToken
      }
    }

    if (!R.isNil(refreshToken)) {
      query.tokens['refreshToken'] = refreshToken
    }

    server.services.passport.connect(req, query, profile, next)
  }
}
