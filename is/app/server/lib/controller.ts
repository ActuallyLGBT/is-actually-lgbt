import { Express, Router } from 'express'
import { BaseObject, Initializable } from './base'

export abstract class BasicController extends BaseObject implements Initializable {

  public init (app: Express, options?: object): void {
    const router = Router(options || {})
    this.registerRoutes(app, router)
  }

  protected abstract registerRoutes (app: Express, router: Router): void
}
