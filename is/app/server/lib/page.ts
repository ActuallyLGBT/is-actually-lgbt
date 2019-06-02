import { ISocialLink } from './link'
export interface IPage {
  _id: string
  slug: string
  name: string
  email?: string
  socialLinks: [ISocialLink]
}

export enum EPronounType {
  Subjective = 'subjective',
  Objective = 'objective',
}

export interface IPronoun {
  _id: string
  pronounType: EPronounType
  text: string
}
