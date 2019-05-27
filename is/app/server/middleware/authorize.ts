import { IServer } from '../lib'
import * as R from 'ramda'

export function authorization (server: IServer) {
  return function authorizationMiddleware (req, res, next) {
    const cookies = req.cookies
    if (!R.has(server.config.auth.cookieName, cookies)) {
      return next()
    }

    const token = cookies[server.config.auth.cookieName]

    return server.services.token.verify(token)
    .then(tokenAccount => {
      return server.services.account.loginById(req, tokenAccount._id)
    })
    .then(data => next(null, data))
    .catch(err => {
      res.status(500).send(err)
    })
  }
}
