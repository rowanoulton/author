var adverbs = require('adverbs')
var pipeline = require('./pipeline')
var wordWrap = require('./word-wrap')
var className = 'adverb'

module.exports = function () {
  var transform

  transform = function (text) {
    var locations = adverbs(text)
    if (locations.length) {
      var wrapWords = wordWrap({
        className: className,
        text: text
      })

      text = wrapWords(locations)
    }

    return text
  }

  return pipeline(transform)
}
