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

        let wrappedProtocol = protocols[protocol](this.server)

        this._passportLib.use(new Strategy(options, wrappedProtocol))
      }
    }, R.keys(this._strats))
  }

  // Do a login flow initiated by a passport (social login) connection
  public login = (req, query, profile, next) => {
    let provider = profile.provider || req.param('provider')

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

      // let promise: Promise<any>
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
        if (!email) {
          return Promise.reject(new Error('No email was available'))
        }

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

  // Connect a passport entry (social login) to an existing account.
  public connect = (req, query, profile, next): Promise<any> => {

    // If we don't have an account in the request, throw an error. We don't want to
    // worry about that logic in this flow.
    if (!req.account) {
      return next(new Error('No account found in request. Is the user logged in?'))
    }

    let provider = profile.provider || req.param('provider')

    // If we don't find a provider somewhere in the request, something went wrong and
    // we must throw an error.
    if (!provider) {
      return next(new Error('No authentication provider was identified.'))
    }

    // Check to see if we already have a passport entry for this connection. If we do,
    // Throw an error because we don't want to handle that in this flow.
    return this.model('Passport').findOne({
      provider: provider,
      identifier: query.identifier
    })
    .then(pp => {
      if (!!pp) {
        return next(new Error('Passport is already connected to an account?'))
      }

      // If we got this far, that means we have an account and a social login to connect
      // Lets do it.

      // Add the provider to our query so we can match it later during lookups.
      query['provider'] = provider

      // Create the passport in the database,
      return this.model('Passport').create(ld.extend({ accountId: req.account['_id'] }, query))
    })
  }

  public disconnect = (req, _, next) => {
    let provider = req.param('provider')
    let account = req.account

    return this.model('Passport').findOneAndDelete({
      provider: provider,
      accountId: account._id,
    })
    .then(ppDeleted => next(null, ppDeleted), next)
  }

  public action = (req, res, next) => {
    let strategies = this._strats
    let provider = req.param('provider')
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
    let provider = req.param('provider')

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
