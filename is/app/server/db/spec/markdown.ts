import { Schema } from 'mongoose'

const MarkdownSpec = {
  name: 'Markdown',

  schema: {
    pageId: {
      type: Schema.Types.ObjectId,
      ref: 'Page',
      index: true,
    },

    data: {
      type: Buffer
    },
  },

  virtuals: {
    page: {
      ref: 'Page',
      localField: 'pageId',
      foreignField: '_id',
      justOne: true,
    }
  }
}

export { MarkdownSpec }
