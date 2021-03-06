import { Express, Router } from 'express'
import { BasicController } from '../lib'

export class AuthController extends BasicController {

  protected registerRoutes (app: Express, router: Router): void {
    router.get('/whoami', this.whoami)
    router.get('/logout', this.logout)
    router.get('/:provider', this.action)
    router.get('/:provider/callback', this.callback)
    // router.get('/:provider/disconnect', this.disconnect)

    app.use('/auth', router)
    app.get('/logout', this.logout)
  }

  public action = (req, res) => {
    this.server.services.passport.action(req, res, req.next)
  }

  public callback = (req, res) => {
    return this.server.services.passport.callback(req, res)
    .then(account => {
      return this.server.services.token.issue(account)
    })
    .then(token => {
      res.cookie(this.server.config.cookie.name, token, {
        expires: new Date(Date.now() + this.server.config.cookie.expirey)
      })
      res.sendStatus(200)
    })
    .catch(err => {
      res.status(500)
      res.render('error', { error: err })
    })
  }

  // public disconnect = (req, res) => {
  //   this.server.services.passport.disconnect(req, res, req.next)
  // }

  public whoami = (req, res) => {
    res.status(200).json(req.account)
  }

  public logout = (req, res) => {
    req.doLogout && req.doLogout()

    res.sendStatus(200)
  }
}
