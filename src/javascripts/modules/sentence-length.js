var $ = require('jquery')
var pipeline = require('./pipeline')
var wordcount = require('wordcount')
var firstOpenDivRegex = /(<div>)/i
var openDivRegex = /(<div>)/gi
var closeDivRegex = /(<\/div>)/gi
var periodRegex = /\.(\)|\"|\”|\'|\”|&#39;|&#34;|&quot;|&rdquo;)?( |&nbsp;)/g
var questionRegex = /\?(\)|\"|\”|\'|\”|&#39;|&#34;|&quot;|&rdquo;)?( |&nbsp;)/g
var exclamationRegex = /\!(\)|\"|\”|\'|\”|&#39;|&#34;|&quot;|&rdquo;)?( |&nbsp;)/g
var sentenceClass = 'sentence'
var worseGradeClass = sentenceClass + '--very-long'
var badGradeClass = sentenceClass + '--long'
var sentenceTagOpen = '<span class="' + sentenceClass + '">'
var sentenceTagClose = '</span>'
var replacement = ['$1', sentenceTagClose, '$2', sentenceTagOpen].join('')
var getGrade

getGrade = function (count) {
  if (count >= 20) return worseGradeClass
  if (count >= 15) return badGradeClass
  return false
}

module.exports = function () {
  var transform

  transform = function (text) {
    var fragment

    // Always insert an opening tag at the beginning
    // and a close tag at the end
    text = sentenceTagOpen.concat(text)
                          .replace(firstOpenDivRegex, sentenceTagClose + '$1') // Close the opening <span>
                          .replace(openDivRegex, '$1' + sentenceTagOpen) // Open all other spans
                          .replace(closeDivRegex, sentenceTagClose + '$1')
                          .replace(periodRegex, '.' + replacement)
                          .replace(questionRegex, '?' + replacement)
                          .replace(exclamationRegex, '!' + replacement)
                          .concat(sentenceTagClose)

    // Parse text into an HTML fragment so we can easily iterate sentences
    fragment = $('<div>' + text + '</div>')

    // Count and grade each sentence
    fragment.find('.' + sentenceClass).each(function () {
      var sentenceNode = $(this)
      var wordCount = wordcount(sentenceNode.text())
      var grade = getGrade(wordCount)

      if (grade && typeof grade !== 'boolean') {
        sentenceNode.addClass(grade)
      }
    })

    return fragment.html()
  }

  return pipeline(transform)
}
