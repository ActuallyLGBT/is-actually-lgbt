import { IServer } from '../../lib'

export function oauth (server: IServer) {
  return (req, _, __, profile, next): void => {
    let query = {
      identifier: profile.id,
      protocol: 'oauth',
    }

    server.services.passport.login(req, query, profile, next)
  }
}
