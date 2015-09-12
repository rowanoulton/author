var tooWordy = require('too-wordy')
var pipeline = require('./pipeline')
var wordWrap = require('./word-wrap')
var className = 'long-word'

module.exports = function () {
  var transform

  transform = function (text) {
    var locations = tooWordy(text)
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
