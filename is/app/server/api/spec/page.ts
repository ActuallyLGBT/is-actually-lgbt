import { IApiSpec } from '../../lib'
export interface PageApiSpec extends IApiSpec {
  validateName (name: string): Promise<Boolean>
}
