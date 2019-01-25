module.exports = {
  name: 'Pronoun',

  schema: {
    pronounType: {
      type: String,
      enum: [ 'subjective', 'objective' ]
    },

    text: {
      type: String,
      unique: true
    }
  }
}
