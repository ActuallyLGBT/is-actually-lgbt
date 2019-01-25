module.exports = {
  name: 'validateName',
  func: (server) => function validateName (args) {
    return server.db.Page.findOne({pageId: args.name})
      .then(dbItem => dbItem ? false : true)
  }
}
