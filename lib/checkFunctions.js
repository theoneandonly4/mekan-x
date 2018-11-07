/* Mekan-X client side check functions script
* By Pierre-Etienne ALBINET
* Started 20181104
* Changed 20181104
*/

function checkPass(pass, empty, minLength, maxLength, minAlpha, maxAlpha, minLower, maxLower, minUpper, maxUpper, minNum, maxNum, minSpace, maxSpace, minSymbol, maxSymbol) {
  var lower = /[a-z]/g
  var upper = /[A-Z]/g
  var num = /[0-9]/g
  var space = /\s/g
  var symbol = /&#|@_-$!%*?&€£/g
  console.log(symbol)

  if (pass != undefined) { console.log('Password is ' + pass.length + ' long') }
  if (!pass && !empty || pass == '' && !empty) {
    return 'Password is Required'
  }
  var lowerCount = ((pass || '').match(lower) || []).length
  console.log(lowerCount)
  var numCount = ((pass || '').match(num) || []).length
  console.log(numCount)
  var spaceCount = ((pass || '').match(num) || []).length
  console.log(spaceCount)
  var symbolCount = ((pass || '').match(symbol) || []).length
  console.log(symbolCount)

  if (pass.length < minLength) {
    return 'Password must be at least ' + minLength + ' characters long'
  }
  if (pass.length > maxLength) {
    return 'Password must be at most ' + maxLength + ' characters long'
  }

}
