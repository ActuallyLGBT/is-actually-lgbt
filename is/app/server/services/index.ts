import { IServer } from '../lib'

import { AccountService } from './account'
import { PageService } from './page'
import { PassportService } from './passport'
import { TokenService } from './token'

export class Services {

  private _account: AccountService
  private _page: PageService
  private _passport: PassportService
  private _token: TokenService

  constructor (server: IServer) {
    this._account = new AccountService(server)
    this._page = new PageService(server)
    this._passport = new PassportService(server)
    this._token = new TokenService(server)
  }

  get account (): AccountService {
    return this._account
  }

  get page (): PageService {
    return this._page
  }

  get passport (): PassportService {
    return this._passport
  }

  get token (): TokenService {
    return this._token
  }
}
