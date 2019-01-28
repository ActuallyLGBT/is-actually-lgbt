export interface IApiSpec {
  getSpecName (): string
}

export interface IApiManager {
  get<T extends IApiSpec> (cls: T): T

}

export abstract class AbstractApiSpec implements IApiSpec {
  abstract getSpecName(): string

}
