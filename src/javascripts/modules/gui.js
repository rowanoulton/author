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
  var showLine
  var hideLine
  var transform
  var getWordCount
  var getSentenceCount
  var getReadingTime

  showLine = function (node) {
    if (!node.hasClass('is-animating-to-show')) {
      node.stop()
          .removeClass('is-animating-to-hide')
          .addClass('is-animating-to-show')
          .fadeIn({
            duration: 900,
            easing: 'easeOutQuad',
            complete: function () {
              $(this).removeClass('is-animating-to-show')
            }
          })
    }
  }

  hideLine = function (node) {
    if (!node.hasClass('is-animating-to-hide')) {
      node.stop()
          .removeClass('is-animating-to-show')
          .addClass('is-animating-to-hide')
          .fadeOut({
            duration: 300,
            complete: function () {
              $(this).removeClass('is-animating-to-hide')
            }
          })
    }
  }


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
    var wordsPerMinute = 200

    return Math.floor(wordCount / wordsPerMinute)
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
    if (sentenceCount === 0) hideLine(sentenceCountWrapNode)
    if (sentenceCount !== 0) showLine(sentenceCountWrapNode)
    if (wordCount === 0) hideLine(wordCountWrapNode)
    if (wordCount !== 0) showLine(wordCountWrapNode)
    if (readingTime === 0) hideLine(readingTimeWrapNode)
    if (readingTime !== 0) showLine(readingTimeWrapNode)

    return text
  }

  return pipeline(transform)
}
