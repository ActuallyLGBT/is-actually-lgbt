import { IServer } from '../../lib'

export function openid (server: IServer) {
  return (req, identifier, profile, next): void => {
    let query = {
      identifier: identifier,
      protocol: 'openid'
    }

    server.services.passport.login(req, query, profile, next)
  }
}
