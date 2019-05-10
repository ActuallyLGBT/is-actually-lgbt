import * as express from 'express'
import { IServer, IController } from '../lib'

export default class AuthController implements IController {

  _server: IServer
  _router: express.Router
  _registered: boolean

  constructor (server: IServer) {
    this._server = server
    this._registered = false
  }

  public registerRoutes = (app: any) => {
    if (this._registered) {
      throw new Error('Auth Controller already registered its routes!')
    }

    this._router = express.Router()

    this._router.get('/logout', this.logout)
    this._router.get('/:provider', this._server.services.passport.endpoint)
    this._router.get('/:provider/callback', this.providerCallback)
    this._router.get('/:provider/:action', this.providerCallback)

    app.use('/auth', this._router)

    this._registered = true
  }

  public providerCallback = (req, res) => {
    this._server.services.passport.callback(req, res, (err, user, info, _) => {
      if (err || !user) {
        if (!err && info) {
          return res.status(403).send(info)
        }
        return res.status(403).send(err)
      }

      req.login(user, err => {
        if (err) {
          return res.status(403).send(err)
        }

        req.user = user

        return res.json(200, user)
      })

    })
  }

  public logout = (req, res) => {
    if (req.logout) {
      req.logout()
    }

    if (req.user) {
      delete req.user
    }

    res.sendStatus(200)
  }
}
