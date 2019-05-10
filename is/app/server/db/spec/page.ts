import { Schema } from 'mongoose'

const PageSpec = {
  name: 'Page',

  schema: {
    pageId: {
      type: String,
      unique: true,
      index: true,
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'Account',
    },

    name: {
      type: String,
    },

    email: {
      type: String,
    },

    letters: {
      type: [String],
    },

    socialLinks: [{
      type: Object,
      default: {},
    }],

    pronounSub: {
      type: Schema.Types.ObjectId,
      ref: 'Pronoun',
    },

    pronounObj: {
      type: Schema.Types.ObjectId,
      ref: 'Pronoun',
    },
  },

  virtuals: {
    markdown: {
      ref: 'Markdown',
      localField: 'pageId',
      foreignField: 'pageId',
      justOne: true,
    }
  }
}

export { PageSpec }
