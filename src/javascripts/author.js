var $ = require('jquery')
var debounce = require('debounce')
var selection = require('./modules/save-selection')
var checks = [
  { fn: require('./modules/adverbs'), name: 'adverb' },
  { fn: require('passive-voice'), name: 'passive-voice' }
]

$(function () {
  var editorNode = $('.js-editor')
  var previousValue = editorNode.text()
  var getIssues
  var getSlices
  var getMarkup
  var handleChange
  var updateEditor

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

  updateEditor = function (text) {
    var issues = getIssues(text)
    var slices = getSlices(issues)
    var markup = getMarkup(text, slices)
    var cursorPosition = selection.save(editorNode.get(0))

    editorNode.html(markup)
    selection.restore(editorNode.get(0), cursorPosition)
  }

  handleChange = debounce(function () {
    var value = editorNode.text()

    if (value !== previousValue) {
      previousValue = value
      updateEditor(value)
    }
  }, 100)

  $.each(['change', 'onpropertychange', 'input', 'keydown', 'click', 'focus', 'scroll'], function (index, eventName) {
    editorNode.on(eventName, handleChange)
  })
})
