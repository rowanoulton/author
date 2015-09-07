/**
 * Saves and restores the selection of a contenteditable element, even if markup is inserted inbetween
 * All credit due to http://stackoverflow.com/questions/14636218/jquery-convert-text-url-to-link-as-typing/14637351#14637351
 */

var save
var restore

if (window.getSelection && document.createRange) {
  save = function (containerEl) {
    var range = window.getSelection().getRangeAt(0)
    var preSelectionRange = range.cloneRange()
    preSelectionRange.selectNodeContents(containerEl)
    preSelectionRange.setEnd(range.startContainer, range.startOffset)
    var start = preSelectionRange.toString().length

    return {
      start: start,
        end: start + range.toString().length
    }
  }

  restore = function (containerEl, savedSel) {
    var charIndex = 0
    var range = document.createRange()
    range.setStart(containerEl, 0)
    range.collapse(true)
    var nodeStack = [containerEl]
    var node
    var foundStart = false
    var stop = false

    while (!stop && (node = nodeStack.pop())) {
      if (node.nodeType === 3) {
        var nextCharIndex = charIndex + node.length
        if (!foundStart && savedSel.start >= charIndex && savedSel.start <= nextCharIndex) {
          range.setStart(node, savedSel.start - charIndex)
          foundStart = true
        }
        if (foundStart && savedSel.end >= charIndex && savedSel.end <= nextCharIndex) {
          range.setEnd(node, savedSel.end - charIndex)
          stop = true
        }
        charIndex = nextCharIndex
      } else {
        var i = node.childNodes.length
        while (i--) {
          nodeStack.push(node.childNodes[i])
        }
      }
    }

    var sel = window.getSelection()
    sel.removeAllRanges()
    sel.addRange(range)
  }
} else if (document.selection) {
  save = function (containerEl) {
    var selectedTextRange = document.selection.createRange()
    var preSelectionTextRange = document.body.createTextRange()
    preSelectionTextRange.moveToElementText(containerEl)
    preSelectionTextRange.setEndPoint('EndToStart', selectedTextRange)
    var start = preSelectionTextRange.text.length

    return {
      start: start,
        end: start + selectedTextRange.text.length
    }
  }

  restore = function (containerEl, savedSel) {
    var textRange = document.body.createTextRange()
    textRange.moveToElementText(containerEl)
    textRange.collapse(true)
    textRange.moveEnd('character', savedSel.end)
    textRange.moveStart('character', savedSel.start)
    textRange.select()
  }
}

module.exports = {
  save: save,
  restore: restore
}
