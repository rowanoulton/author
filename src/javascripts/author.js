var $ = require('jquery')
var debounce = require('debounce')
var checks = [{ fn: require('adverb-where'), name: 'adverb' }]

$(function () {
  var inputNode = $('textarea')
  var highlightNode = $('.highlights')
  var previousValue = inputNode.val()
  var handleChange
  var populateHighlighters
  var emptyHighlighters

  handleChange = debounce(function () {
    var value = inputNode.val()

    if (value !== previousValue) {
      previousValue = value
      populateHighlighters(value)
    }
  }, 300)

  populateHighlighters = function (value) {
    var html = ''
    var issues = []
    var slices = {}
    var previousEnd = 0

    $.each(checks, function (key, checker) {
      var found = checks[key].fn(value)
      if (found.length) {
        $.each(found, function (index, foundItem) {
          issues.push({ type: checks[key].name, start: foundItem.index, end: (foundItem.index + foundItem.offset)})
        })
      }
    })

    if (issues.length) {
      $.each(issues, function (index, issue) {
        if (issue.start in slices) {
          if (issue.end > slices[issue.start].end) {
            slices[issue.start] = { end: issue.end, type: issue.type }
          }
        } else {
          slices[issue.start] = { end: issue.end, type: issue.type }
        }
      })
    }


    $.each(slices, function(start, slice) {
      var end = slice.end
      var type = slice.type

      html += value.slice(previousEnd, start)
      html += '<span class="highlight highlight--' + type + '">' + value.slice(start, end) + '</span>'

      previousEnd = end
    })

    html += value.slice(previousEnd, value.length)

    emptyHighlighters()
    highlightNode.html(html)
  }

  emptyHighlighters = function () {
    highlightNode.empty()
  }

  $.each(['change', 'onpropertychange', 'input', 'keydown', 'click', 'focus', 'scroll'], function (index, eventName) {
    inputNode.on(eventName, handleChange)
  })
})
