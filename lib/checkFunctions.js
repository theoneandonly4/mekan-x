/* Mekan-X client side check functions script
* By Pierre-Etienne ALBINET
* Started 20181104
* Changed 20181104
*/

function checkPass(pass, empty, minLength, maxLength, minAlpha, maxAlpha, minNum, maxNum, minSpace, maxSpace, minSymbol, maxSymbol, symbols) {
  var alpha = /[a-z]/gi
  var num = /[0-9]/g
  var space = /\s/g
  var

  if (pass != undefined) { console.log('Password is ' + pass.length + ' long') }
  if (!pass && !empty || pass == '' && !empty) {
    return 'Password is Required'
  }
  var alphaCount = ((pass || '').match(alpha) || []).length
  console.log(alphaCount)
  var numCount = ((pass || '').match(num) || []).length
  console.log(numCount)
  var spaceCount = ((pass || '').match(num) || []).length

  if (pass.length < minLength) {
    return 'Password must be at least ' + minLength + ' characters long'
  }
  if (pass.length > maxLength) {
    return 'Password must be at most ' + maxLength + ' characters long'
  }

}
