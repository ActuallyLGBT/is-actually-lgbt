import { BasicService, IAccount } from '../lib'
import * as Promise from 'bluebird'
import * as jwt from 'jsonwebtoken'

export class TokenService extends BasicService {

  private _opts: any

  public init (): void {
    this._opts = {
      algorithm: 'HS256',
      issuer: 'is.actually.lgbt',
      audience: 'is.actually.lgbt',
      subject: 'Is Actually LGBT account',
      clockTolerance: 120,
      expirey: '7d',
      maxAge: '8d',

      secret: 'supersecret',
    }
  }

  public issue = (account: IAccount): Promise<string> => {
    const opts = {
      algorithm: this._opts.algorithm,
      expiresIn: this._opts.expirey,
      issuer: this._opts.issuer,
      audience: this._opts.audience,
      subject: this._opts.subject,
    }

    return new Promise((resolve, reject) => {
      function next (err, data) {
        if (err) { return reject(err) }
        return resolve(data)
      }

      jwt.sign({ data: account }, this._opts.secret, opts, next)
    })
  }

  public verify = (token: string): Promise<IAccount> => {
    const opts = {
      algorithms: [ this._opts.algorithm ],
      issuer: this._opts.issuer,
      audience: this._opts.audience,
      subject: this._opts.subject,
      clockTolerance: this._opts.clockTolerance,
      maxAge: this._opts.maxAge,
    }

    return new Promise((resolve, reject) => {
      function next (err, data) {
        if (err) { return reject(err) }
        return resolve(data.data)
      }

      jwt.verify(token, this._opts.secret , opts, next)
    })
  }
}
