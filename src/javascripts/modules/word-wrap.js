module.exports = function (opts) {
  var className = opts.className || ''
  var openTag = opts.openTag || '<span class="highlight highlight--' + className + '">'
  var closeTag = opts.closeTag || '</span>'
  var offsetIncrement = openTag.length + closeTag.length
  var text = opts.text || ''

  return function (locations) {
    var offset = 0

    // ensure locations are sorted by location - this is required so that we can reliably offset each location
    // from previous inserts of HTML wrappers as we iterate through the list
    locations.sort(function (a, b) {
      if (a.index > b.index) return 1
      if (a.index < b.index) return -1
      return 0
    })

    for (var x in locations) {
      var currentLocation = locations[x]
      var offendingText
      var textBefore
      var textAfter

      currentLocation.index += offset
      offendingText = text.slice(currentLocation.index, currentLocation.index + currentLocation.offset)
      textBefore = text.slice(0, currentLocation.index)
      textAfter = text.slice(currentLocation.index + currentLocation.offset, text.length)
      text = textBefore + openTag + offendingText + closeTag + textAfter
      offset += offsetIncrement
    }

    return text
  }
}
