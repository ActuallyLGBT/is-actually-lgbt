module.exports = {
  name: 'LinkType',

  schema: {
    typeId: {
      type: String,
      unique: true,
      index: true,
    },

    name: {
      type: String,
    },

    icon: {
      type: String,
    },

    attribute: {
      type: String,
    },

    template: {
      type: String,
    },
  }
}
