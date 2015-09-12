var pipeline = require('./pipeline')
var periodRegex = /\.(\)|\"|\”|\'|\”|&#39;|&#34;|&quot;|&rdquo;)?( |&nbsp;)/g
var questionRegex = /\?(\)|\"|\”|\'|\”|&#39;|&#34;|&quot;|&rdquo;)?( |&nbsp;)/g
var exclamationRegex = /\!(\)|\"|\”|\'|\”|&#39;|&#34;|&quot;|&rdquo;)?( |&nbsp;)/g
var sentenceTagOpen = '<span class="sentence">'
var sentenceTagClose = '</span>'
var replacement = ['$1', sentenceTagClose, '$2', sentenceTagOpen].join('')

module.exports = function () {
  var transform

  transform = function (text) {
    // Always insert an opening tag at the beginning
    // and a close tag at the end
    return sentenceTagOpen.concat(text)
                          .replace(periodRegex, '.' + replacement)
                          .replace(questionRegex, '?' + replacement)
                          .replace(exclamationRegex, '!' + replacement)
                          .concat(sentenceTagClose)
  }

  return pipeline(transform)
}
