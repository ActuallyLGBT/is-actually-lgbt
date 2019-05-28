import { BasicService, IAccount } from '../lib'
import * as Promise from 'bluebird'

export class AccountService extends BasicService {

  public create = (email): Promise<IAccount> => {
    return this.model('Account').findOne({ email })
    .then(account => {
      if (!!account) {
        return Promise.reject({ error: 'E_ACCOUNT_EXISTS' })
      }
    })
    .then(_ => this.model('Account').create({ email }))
  }

  private doLogin (req, account: IAccount) {
    req.account = account
    return Promise.resolve(req.account)
  }

  public loginByEmail = (req, email) => {
    return this.model('Account').findOne({ email: email })
    .then(account => {
      if (!account) {
        return Promise.reject({ error: 'E_ACCOUNT_NOT_FOUND' })
      }

      return this.doLogin(req, account)
    })
  }

  public loginById = (req, id) => {
    return this.model('Account').findById(id)
    .then(account => {
      if (!account) {
        return Promise.reject({ error: 'E_ACCOUNT_NOT_FOUND' })
      }

      return this.doLogin(req, account)
    })
  }
}
