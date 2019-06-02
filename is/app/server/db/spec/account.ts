const AccountSpec = {
  name: 'Account',

  schema: {
    email: {
      type: String,
      unique: true,
      index: true,
    },
  },

  virtuals: {
    page: {
      ref: 'Page',
      localField: '_id',
      foreignField: 'accountId',
      justOne: true,
    }
  }
}

export { AccountSpec }
