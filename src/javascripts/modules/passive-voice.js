var passive = require('passive-voice')
var pipeline = require('./pipeline')
var wordWrap = require('./word-wrap')
var className = 'passive-voice'

module.exports = function () {
  var transform

  transform = function (text) {
    var locations = passive(text)
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
