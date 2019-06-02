import { BasicService, IPage } from '../lib'
import * as Promise from 'bluebird'
import * as slug from 'slug'

export class PageService extends BasicService {

  public init (): void {

  }

  public slugify = (str: string): string => {
    return slug(str.toLowerCase())
  }

  public create = (): Promise<IPage> => {
    return this.model('Page').create()
  }
}
