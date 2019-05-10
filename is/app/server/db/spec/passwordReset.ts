const PasswordResetSpec = {
  name: 'PasswordReset',

  schema: {
    token: {
      type: String,
      index: true,
      unique: true,
    },

    used: {
      type: Boolean,
      default: false
    }
  },

  virtuals: {
    account: {
      ref: 'Account',
      localField: 'userId',
      foreignField: '_id',
      justOne: true,
    }
  }
}

export { PasswordResetSpec }
