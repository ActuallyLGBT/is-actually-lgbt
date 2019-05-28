import { BasicService } from '../lib'
import * as protocols from './protocols'
import * as Promise from 'bluebird'
import * as PassportLib from 'passport'
import * as R from 'ramda'
import * as ld from 'lodash'
import * as path from 'path'
import * as url from 'url'

export class PassportService extends BasicService {

  private _passportLib: PassportLib
  private _strats: any

  public init (): void {
    this._passportLib = PassportLib

    let baseUrl = this.server.config.baseUrl

    this._strats = this.server.config.passport.strategies

    R.forEach(key => {
      let options = { passReqToCallback: true }
      let Strategy

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

      let wrappedProtocol = protocols[protocol](this.server)

      this._passportLib.use(new Strategy(options, wrappedProtocol))
    }, R.keys(this._strats))
  }

  // Do a login flow initiated by a passport (social login) connection
  public login = (req, query, profile, next) => {
    const provider = profile.provider || req.params.provider || null

    query['provider'] = provider

    if (!provider) {
      return next(new Error('No authentication provider was identified.'))
    }

    // Look for a passport entry with the provided identifier in the query, and
    // the provider specified.
    return this.model('Passport').findOne({
      provider: provider,
      identifier: query.identifier
    })
    .then(pp => {

      let email
      if (profile.email) {
        email = profile.email
      } else if (profile.emails && profile.emails[0]) {
        email = profile.emails[0]
      }

      if (email.value) {
        email = email.value
      }

      // If we didn't find a passport, then we need to check for an account via email and link them.
      if (!pp) {
        return this.server.services.account.loginByEmail(req, email)
        .catch({ error: 'E_ACCOUNT_NOT_FOUND' }, _ => {
          // Create the account
          return this.server.services.account.create(email)
        })
        .then(account => {
          return this.model('Passport').create(ld.extend({ accountId: account['_id'] }, query))
          .return(account)
        })
      } else {
        // If we did find a passport, just log us in via the id.
        return this.server.services.account.loginById(req, pp.accountId)
        .catch({ error: 'E_ACCOUNT_NOT_FOUND' }, _ => {
          // If we don't get an account from login, try to create it.
          if (!email) {
            return Promise.reject(new Error('No email was available'))
          }

          // Create the account
          return this.server.services.account.create(email)
          .then(account => {
            pp.accountId = account._id
            return pp.save()
            .return(account)
          })
        })
      }
    })
    .then(account => {
      if (!req.account) {
        return this.server.services.account.loginById(req, account['_id'])
      }
      return account
    })
    .then(account => next(null, account), next)
  }

  public action = (req, res, next) => {
    let strategies = this._strats
    const provider = req.params.provider || null
    let options = {}

    if (!R.has(provider, strategies)) {
      return res.redirect('/login')
    }

    if (R.has('scope', strategies[provider])) {
      options['scope'] = strategies[provider].scope
    }

    this._passportLib.authenticate(provider, options)(req, res, next)
  }

  public callback = (req, res): Promise<any> => {
    const provider = req.params.provider || null

    if (!R.has(provider, this._strats)) {
      return Promise.reject(new Error('provider not available'))
    }

    return new Promise((resolve, reject) => {
      function next (err, data) {
        if (err) { return reject(err) }
        return resolve(data)
      }

      this._passportLib.authenticate(provider, next)(req, res, next)
    })
  }
}
