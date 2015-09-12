var $ = require('jquery')
var debounce = require('debounce')
var adverbs = require('./modules/adverbs')
var longWords = require('./modules/long-words')
var passiveVoice = require('./modules/passive-voice')
var destination = require('./modules/destination')
var Readable = require('stream').Readable

$(function () {
  var editorNode = $('.js-editor')
  var highlighterNode = $('.js-highlighter')
  var previousValue = editorNode.text()
  var handleChange
  var updateHighlighter

  updateHighlighter = function (text) {
    var stream = new Readable()

    // Set up plumbing
    stream.pipe(adverbs())
          .pipe(longWords())
          .pipe(passiveVoice())
          .pipe(destination(highlighterNode))

    // Push input through
    stream.push(text)
    stream.push(null)
  }

  handleChange = debounce(function () {
    var value = editorNode.html()

    if (value !== previousValue) {
      previousValue = value
      updateHighlighter(value)
    }
  }, 50)

  $.each(['change', 'onpropertychange', 'input', 'keydown', 'click', 'focus', 'scroll'], function (index, eventName) {
    editorNode.on(eventName, handleChange)
  })
})
