import { BasicService, IAccount } from '../lib'
import * as Promise from 'bluebird'
import * as jwt from 'jsonwebtoken'

export class TokenService extends BasicService {

  private _opts: any

  public init (): void {
    this._opts = {
      algorithm: this.server.config.jwt.algorithm,
      issuer: this.server.config.jwt.issuer,
      audience: this.server.config.jwt.audience,
      subject: 'Is Actually LGBT account',
      clockTolerance: 120,
      expirey: this.server.config.jwt.expirey,
      maxAge: this.server.config.jwt.maxAge,

      secret: this.server.config.jwt.secret,
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
      function next (err, data): void {
        if (err) { return reject(err) }
        return resolve(data)
      }

      jwt.sign({ id: account._id }, this._opts.secret, opts, next)
    })
  }

  public verify = (token: string): Promise<string> => {
    const opts = {
      algorithms: [ this._opts.algorithm ],
      issuer: this._opts.issuer,
      audience: this._opts.audience,
      subject: this._opts.subject,
      clockTolerance: this._opts.clockTolerance,
      maxAge: this._opts.maxAge,
    }

    return new Promise((resolve, reject) => {
      function next (err, data): void {
        if (err) { return reject(err) }
        return resolve(data.id)
      }

      jwt.verify(token, this._opts.secret , opts, next)
    })
  }
}
