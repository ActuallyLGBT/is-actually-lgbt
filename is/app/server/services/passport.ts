import { IServer } from '../lib'
import * as PassportLib from 'passport'
import * as protocols from './protocols'
import * as R from 'ramda'
import * as ld from 'lodash'
import * as path from 'path'
import * as url from 'url'

export default class PassportService {

  _server: IServer
  _passportLib: PassportLib
  _strats: any

  constructor (server: IServer) {
    this._server = server
    this._passportLib = PassportLib

    this._passportLib.serializeUser((user, next) => {
      return next(null, user['_id'])
    })

    this._passportLib.deserializeUser((id, next) =>  {
      return this._server.db.get('Account').findById(id)
      .then(user => {
        next(null, user || null)
        return user
      })
      .catch(next)
    })

    let baseUrl = this._server.config.baseUrl
    this._strats = this._server.config.passport.strategies

    R.forEach(key => {
      let options = { passReqToCallback: true }
      let Strategy

      if (key === 'local') {

      } else {
        let protocol = this._strats[key].protocol
        let callback = this._strats[key].callback

        if (!callback) {
          callback = path.join('auth', key, 'callback')
        }

        Strategy = this._strats[key].strategy

        switch (protocol) {
          case 'oauth':
          case 'oauth2':
            options['callbackURL'] = url.resolve(baseUrl, callback)
            break

          case 'openid':
            options['returnURL'] = url.resolve(baseUrl, callback)
            options['realm'] = baseUrl
            options['profile'] = true
            break
        }

        ld.extend(options, this._strats[key].options)

        let wrappedProtocol = protocols[protocol](this._server)

        this._passportLib.use(new Strategy(options, wrappedProtocol))
      }
    }, R.keys(this._strats))
  }

  public connect = (req, query, profile, next, isSub = false) => {
    let provider = profile.provider || req.param('provider')

    query['provider'] = provider

    if (!provider) {
      return next(new Error('No authentication provider was identified.'))
    }

    this._server.db.get('Passport').findOne({
      provider,
      identifier: query.identifier
    }).then(pp => {
      if (!req.user) {
        if (!pp) {
          let user = {}

          if (profile.email) {
            user['email'] = profile.email
          } else if (profile.emails && profile.emails[0]) {
            user['email'] = profile.emails[0]
          }

          if (!user['email']) {
            return Promise.reject(new Error('No email was available'))
          }

          return this._server.db.get('Account').create(user)
          .then(user2 => {
            user = user2
            return this._server.db.get('Passport').create(ld.extend({ account: user['_id'] }, query))
          })
          .then(_ => {
            return next(null, user)
          })
        } else {
          if (R.has('tokens', query) && query['tokens'] !== pp['tokens']) {
            pp['tokens'] = query['tokens']
          }

          return pp.save().then(_ => {
            return this._server.db.get('Account').findById(pp['account'])
            .then(user2 => {
              if (!user2) {
                if (isSub) {
                  return Promise.reject(new Error('Passport exists but user does not. Could not solve'))
                }
                return this._server.db.get('Passport').deleteOne({_id: pp['_id']})
                .then(_ => {
                  return this.connect(req, query, profile, next, true)
                })
              }

              return user2
            })
          })
          .then(user2 => {
            return next(null, user2)
          })
        }
      } else {
        if (!pp) {
          return this._server.db.get('Passport').create(ld.extend({ account: req.user._id }, query))
          .then(_ => {
            return next(null, req.user)
          })
        } else {
          return next(null, req.user)
        }
      }
    })
    .catch(next)
  }

  public endpoint = (req, res) => {
    let strategies = this._strats
    let provider = req.param('provider')
    let options = {}

    if (!R.has(provider, strategies)) {
      return res.redirect('/login')
    }

    if (R.has('scope', strategies[provider])) {
      options['scope'] = strategies[provider].scope
    }

    this._passportLib.authenticate(provider, options)(req, res, req.next)
  }

  public callback = (req, res, next) => {
    let provider = req.param('provider')
    // let action = req.param('action')

    // if (provider === 'local' && action !== undefined) {
    //   if (action === 'register' && !req.user) {
    //     this._protocols.local.register(req, res, next)
    //   } else if (action === 'connect' && req.user) {
    //     this._protocols.local.connect(req, res, next)
    //   } else if (action === 'disconnect' && req.user) {
    //     this._.protocols.local.disconnect(req, res, next)
    //   } else {
    //     return next(new Error('Invalid action'))
    //   }
    // } else {
    //   if (action === 'disconnect' && req.user) {
    //     this.disconnect(req, res, next)
    //   } else {
    //     // The provider will redirect the user to this URL after approval. Finish
    //     // the authentication process by attempting to obtain an access token. If
    //     // access was granted, the user will be logged in. Otherwise, authentication
    //     // has failed.
    this._passportLib.authenticate(provider, next)(req, res, req.next)
    //  }
    // }
  }
}
