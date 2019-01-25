import * as R from 'ramda'
module.exports = {
  name: 'getPronounList',
  func: (server) => function getPronounList () {
    return server.db.Pronoun.find()
      .then(ret => {
        if (!ret.length) {
          return {
            objective: [],
            subjective: []
          }
        }
        let items = R.groupBy(R.prop('pronounType'), ret)

        if (!items['objective']) {
          items['objective'] = []
        }

        if (!items['subjective']) {
          items['subjective'] = []
        }

        return items
      })
  }
}
