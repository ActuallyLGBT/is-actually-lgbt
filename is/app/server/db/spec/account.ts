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
      foreignField: 'ownerId',
      justOne: true,
    }
  }
}

export { AccountSpec }
