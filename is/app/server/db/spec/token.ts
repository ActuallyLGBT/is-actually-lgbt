import { Schema } from 'mongoose'

const TokenSpec = {
  name: 'Token',

  schema: {
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
      max: 128,
    },

    revoked: {
      type: Boolean,
      default: false
    },

    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
  },
}

export { TokenSpec }
