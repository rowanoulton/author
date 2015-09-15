var $ = require('jquery')
var wordcount = require('wordcount')
var numeral = require('numeral')
var pipeline = require('./pipeline')

module.exports = function () {
  var sentenceCountNode = $('#sentence-count')
  var sentenceCountPluralNode = $('#sentence-count-plural')
  var wordCountNode = $('#word-count')
  var wordCountPluralNode = $('#word-count-plural')
  var readingTimeNode = $('#reading-time')
  var readingTimePluralNode = $('#reading-time-plural')
  var transform
  var getWordCount
  var getSentenceCount
  var getReadingTime

  getSentenceCount = function (text) {
    var fragment = $('<div>' + text + '</div>')
    var nodes = fragment.find('.sentence') // @todo sentence class belongs in central config for reuse
    var count = 0

    if (nodes.length) {
      nodes.each(function () {
        if ($(this).text().trim() !== '') count++
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

  getReadingTime = function (wordCount) {
    var wordsPerMinute = 300

    return Math.ceil(wordCount / wordsPerMinute)
  }

  transform = function (text) {
    var sentenceCount = getSentenceCount(text)
    var wordCount = getWordCount(text)
    var readingTime = getReadingTime(wordCount)

    sentenceCountNode.html(numeral(sentenceCount).format('0,0'))
    wordCountNode.html(numeral(wordCount).format('0,0'))
    readingTimeNode.html(numeral(readingTime).format('0,0'))

    if (sentenceCount === 1) sentenceCountPluralNode.removeClass('is-visible')
    if (sentenceCount !== 1) sentenceCountPluralNode.addClass('is-visible')
    if (wordCount === 1) wordCountPluralNode.removeClass('is-visible')
    if (wordCount !== 1) wordCountPluralNode.addClass('is-visible')
    if (readingTime === 1) readingTimePluralNode.removeClass('is-visible')
    if (readingTime !== 1) readingTimePluralNode.addClass('is-visible')

    return text
  }

  return pipeline(transform)
}
