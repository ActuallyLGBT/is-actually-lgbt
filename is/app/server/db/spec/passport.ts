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

    account: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },
  },
}

export { PassportSpec }
