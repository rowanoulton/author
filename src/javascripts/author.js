var $ = require('zepto-browserify').$
var debounce = require('debounce')

$(function () {
  var inputNode = $('textarea')
  var previousValue = inputNode.val()
  var handleChange

  handleChange = debounce(function () {
    var value = inputNode.val()

    if (value !== previousValue) {
      console.log('Value changed')
      previousValue = value
    }
  }, 300)

  $.each(['change', 'onpropertychange', 'input', 'keydown', 'click', 'focus', 'scroll'], function (index, eventName) {
    inputNode.on(eventName, handleChange)
  })
})
