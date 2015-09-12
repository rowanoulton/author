var pipeline = require('./pipeline')

module.exports = function (node) {
  return pipeline(function (text) {
    node.html(text)
  })
}
