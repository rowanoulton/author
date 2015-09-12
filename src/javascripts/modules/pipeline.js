var through2 = require('through2')

module.exports = function (transformer) {
  return through2(function (chunk, enc, callback) {
    var text = chunk.toString('utf8')
    var transformedText = transformer(text)

    if (typeof transformedText !== 'undefined') {
      this.push(new Buffer(transformedText.toString('binary')))
    }

    callback()
  })
}
