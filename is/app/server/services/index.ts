import { IServer } from '../lib'

import { AccountService } from './account'
import { PassportService } from './passport'
import { TokenService } from './token'

export class Services {

  private _account: AccountService
  private _passport: PassportService
  private _token: TokenService

  constructor (server: IServer) {
    this._account = new AccountService(server)
    this._passport = new PassportService(server)
    this._token = new TokenService(server)
  }

  get account (): AccountService {
    return this._account
  }

  get passport (): PassportService {
    return this._passport
  }

  get token (): TokenService {
    return this._token
  }
}
