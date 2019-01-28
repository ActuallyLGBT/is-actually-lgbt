import { Schema } from "mongoose"

module.exports = {
  name: 'Page',

  schema: {
    pageId: {
      type: String,
      unique: true,
      index: true,
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
