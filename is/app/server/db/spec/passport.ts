import { Schema } from 'mongoose'

const PassportSpec = {
  name: 'Passport',

  schema: {
    protocol: {
      type: String,
      required: true,
    },

    provider: {
      type: String,
    },

    identifier: {
      type: String,
    },

    tokens: {
      type: Object,
      default: {},
    },

    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
  },

  indexes: [
    { keys: { account: 1, provider: 1 }, options: { unique: true } }
  ]
}

export { PassportSpec }
