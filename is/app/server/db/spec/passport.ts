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

    accountId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
  },

  indexes: [
    { keys: { accountId: 1, provider: 1 }, options: { unique: true } }
  ]
}

export { PassportSpec }
