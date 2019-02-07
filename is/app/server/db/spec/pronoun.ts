const PronounSpec = {
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

export { PronounSpec }
