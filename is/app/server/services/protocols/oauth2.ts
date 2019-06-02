import { IServer } from '../../lib'
// import * as R from 'ramda'

export function oauth2 (server: IServer) {
  // return function oauth2Protocol (req, accessToken, refreshToken, profile, next) {
  return (req, _, __, profile, next): void => {
    let query = {
      identifier: profile.id,
      protocol: 'oauth2',
    }

    server.services.passport.login(req, query, profile, next)
  }
}
