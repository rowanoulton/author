var $ = require('jquery')
var wordcount = require('wordcount')
var numeral = require('numeral')
var pipeline = require('./pipeline')

module.exports = function () {
  var sentenceCountNode = $('#sentence-count')
  var wordCountNode = $('#word-count')
  var transform
  var getWordCount
  var getSentenceCount

  getSentenceCount = function (text) {
    var fragment = $('<div>' + text + '</div>')
    var nodes = fragment.find('.sentence') // @todo sentence class belongs in central config for reuse
    var count = 0

    if (nodes.length) {
      nodes.each(function () {
        if ($(this).text() !== '') count++
      })
    }

    return count
  }

  getWordCount = function (text) {
    var countableText = text.replace(/<\/div>/gi, '.') // Replace newlines with fullstops to correctly word count across them
                            .replace(/'/gi, '')        // Remove apostrophes
    var parsedText = $('<div>' + countableText + '</div>').text()

    return wordcount(parsedText)
  }

  transform = function (text) {
    var sentenceCount = numeral(getSentenceCount(text))
    var wordCount = numeral(getWordCount(text))

    sentenceCountNode.html(sentenceCount.format('0,0'))
    wordCountNode.html(wordCount.format('0,0'))

    return text
  }

  return pipeline(transform)
}
