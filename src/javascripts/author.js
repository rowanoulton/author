var $ = require('jquery')
var debounce = require('debounce')
var selection = require('./modules/save-selection')
var checks = [
  { fn: require('adverbs'), name: 'adverb' },
  { fn: require('passive-voice'), name: 'passive-voice' },
  { fn: require('too-wordy'), name: 'long-word' }
]

$(function () {
  var editorNode = $('.js-editor')
  var highlighterNode = $('.js-highlighter')
  var previousValue = editorNode.text()
  var getIssues
  var getSlices
  var getMarkup
  var handleChange
  var updateHighlighter

  getIssues = function (text) {
    var issues = []

    $.each(checks, function (key, checker) {
      var found = checks[key].fn(text)
      if (found.length) {
        $.each(found, function (index, foundItem) {
          issues.push({ type: checks[key].name, start: foundItem.index, end: (foundItem.index + foundItem.offset)})
        })
      }
    })

    return issues
  }

  getSlices = function (issues) {
    var slices = {}

    $.each(issues, function (index, issue) {
      if (issue.start in slices) {
        if (issue.end > slices[issue.start].end) {
          slices[issue.start] = { end: issue.end, type: issue.type }
        }
      } else {
        slices[issue.start] = { end: issue.end, type: issue.type }
      }
    })

    return slices
  }

  getMarkup = function (text, slices) {
    var previousEnd = 0
    var html = ''

    $.each(slices, function (start, slice) {
      var end = slice.end
      var type = slice.type

      html += text.slice(previousEnd, start)
      html += '<span class="highlight highlight--' + type + '">' + text.slice(start, end) + '</span>'

      previousEnd = end
    })

    html += text.slice(previousEnd, text.length)

    return html
  }

  updateHighlighter = function (text) {
    var issues = getIssues(text)
    var slices = getSlices(issues)
    var markup = getMarkup(text, slices)

    highlighterNode.html(markup)
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
