const MarkdownSpec = {
  name: 'Markdown',

  schema: {
    pageId: {
      type: String,
      unique: true,
      index: true,
    },

    data: {
      type: String
    },
  },

  virtuals: {
    page: {
      ref: 'Page',
      localField: 'pageId',
      foreignField: 'pageId',
      justOne: true,
    }
  }
}

export { MarkdownSpec }
