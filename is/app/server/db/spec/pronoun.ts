const PronounSpec = {
  name: 'Pronoun',

  schema: {
    pronounType: {
      type: String,
      enum: [ 'subjective', 'objective' ]
    },

    text: {
      type: String,
    }
  },

  indexes: [
    { keys: { pronounType: 1, text: 1 }, options: { unique: true } }
  ]
}

export { PronounSpec }
