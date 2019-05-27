import { IServer } from '../lib'

import { AccountService } from './account'
import { AuthService } from './auth'
import { PassportService } from './passport'
import { TokenService } from './token'

export class Services {

  private _account: AccountService
  private _auth: AuthService
  private _passport: PassportService
  private _token: TokenService

  constructor (server: IServer) {
    this._account = new AccountService(server)
    this._auth = new AuthService(server)
    this._passport = new PassportService(server)
    this._token = new TokenService(server)
  }

  get account (): AccountService {
    return this._account
  }

  get auth (): AuthService {
    return this._auth
  }

  get passport (): PassportService {
    return this._passport
  }

  get token (): TokenService {
    return this._token
  }
}
