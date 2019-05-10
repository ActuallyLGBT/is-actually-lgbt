import { IServer } from '../lib'

import AuthService from './auth'
import PassportService from './passport'

export default class Services {

  _auth: AuthService
  _passport: PassportService

  constructor (server: IServer) {
    this._auth = new AuthService(server)
    this._passport = new PassportService(server)
  }

  get auth (): AuthService {
    return this._auth
  }

  get passport (): PassportService {
    return this._passport
  }
}
