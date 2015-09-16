var $ = require('jquery')
var wordcount = require('wordcount')
var numeral = require('numeral')
var pipeline = require('./pipeline')

$.extend($.easing, {
  easeOutQuad: function (x, t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b
  }
})

module.exports = function () {
  var sentenceCountWrapNode = $('#sentence-count')
  var sentenceCountNode = sentenceCountWrapNode.find('.gui-counter-value')
  var sentenceCountPluralNode = sentenceCountWrapNode.find('.gui-counter-plural')
  var wordCountWrapNode = $('#word-count')
  var wordCountNode = wordCountWrapNode.find('.gui-counter-value')
  var wordCountPluralNode = wordCountWrapNode.find('.gui-counter-plural')
  var readingTimeWrapNode = $('#reading-time')
  var readingTimeNode = readingTimeWrapNode.find('.gui-counter-value')
  var readingTimePluralNode = readingTimeWrapNode.find('.gui-counter-plural')
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

    // Show/hide plural "s"
    if (sentenceCount === 1) sentenceCountPluralNode.removeClass('is-visible')
    if (sentenceCount !== 1) sentenceCountPluralNode.addClass('is-visible')
    if (wordCount === 1) wordCountPluralNode.removeClass('is-visible')
    if (wordCount !== 1) wordCountPluralNode.addClass('is-visible')
    if (readingTime === 1) readingTimePluralNode.removeClass('is-visible')
    if (readingTime !== 1) readingTimePluralNode.addClass('is-visible')

    // Show/hide gui line
    if (sentenceCount === 0) sentenceCountWrapNode.stop().fadeOut({duration: 300, easing: 'easeOutQuad'})
    if (sentenceCount !== 0) sentenceCountWrapNode.stop().fadeIn({duration: 900, easing: 'easeOutQuad'})
    if (wordCount === 0) wordCountWrapNode.stop().fadeOut({duration: 300, easing: 'easeOutQuad'})
    if (wordCount !== 0) wordCountWrapNode.stop().fadeIn({duration: 900, easing: 'easeOutQuad'})
    if (readingTime === 0) readingTimeWrapNode.stop().fadeOut({duration: 300, easing: 'easeOutQuad'})
    if (readingTime !== 0) readingTimeWrapNode.stop().fadeIn({duration: 900, easing: 'easeOutQuad'})

    return text
  }

  return pipeline(transform)
}
