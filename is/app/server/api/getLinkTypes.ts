module.exports = {
  name: 'getLinkTypes',
  func: (server) => function getLinkTypes () {
    return server.db.LinkType.find()
      .then(ret => { return !ret.length ? [] : ret })
  }
}
