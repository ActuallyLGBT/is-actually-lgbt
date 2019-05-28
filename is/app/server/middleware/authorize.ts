import { IServer } from '../lib'
import * as R from 'ramda'

export function authorization (server: IServer) {
  return (req, res, next) => {
    if (!R.has(server.config.cookie.name, req.cookies)) {
      return next()
    }

    const token = req.cookies[server.config.cookie.name]

    return server.services.token.verify(token)
    .then(tokenId => {
      return server.services.account.loginById(req, tokenId)
      .then(data => next(null, data))
    })
    .catch({ name: 'JsonWebTokenError' }, _ => {
      res.clearCookie(server.config.cookie.name)
      next()
    })
    .catch(err => {
      res.status(500)
      res.render('error', { error: err })
    })
  }
}
