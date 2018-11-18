/* Mekan-X main script
* By Pierre-Etienne ALBINET
* Started 20181026
* Changed 20181117
*
* Acknowledgments:
*
*/

main()

function main () {
  cookies()
  dbDataInit()
}


function cookies() {
  var user = getCookie('user')
  if (user == '') {
    pageShow('login', true)
  }
  else {
    pageShow('logout', true)
    dbUserData()
  }
}

function signin() {
  var user = document.getElementById('user').value
  var pass = document.getElementById('pass').value

  //checkString(value, description, empty allowed(true|false), minLength, maxLength, minAlpha, maxAlpha, minLower, maxLower, minUpper, maxUpper, minNum, maxNum, minSpace, maxSpace, minSymbol, maxSymbol)
  var checkUser = checkString(user, 'User Name', false, 1, 16, 0, 16, 0, 16, 0, 16, 0, 16, 0, 1, 0, 16)
  if (checkUser != true) {
    pageStatus(checkUser)
    return false
  }

  var checkPass = checkString(pass, 'Password', false, 8, 64, 2, 64, 1, 64, 1, 64, 1, 64, 0, 64, 1, 64)
  if (checkPass != true) {
    pageStatus(checkPass)
    return false
  }

  //add server check - central Mekan-X or Company server to get User ID

  var id = dbGenUserID()
  var userObj = {
    id: id,
    user: user,
    pass: pass
  }

  cryptEn(userObj, userObj.pass ,cryptedPass)
  function cryptedPass(result) {
    dbCreateItem('0', 'User', id, false)
    dbCreateItem(id, 'UserName', user, false)
    dbCreateItem(id, 'Password', result, true)
    pageStatus('User Created Locally')
  }

}

function login() {
  var user = document.getElementById('user').value
  var pass = document.getElementById('pass').value

  var id = dbGetID('UserName', user)
  var dbPass = dbGetValue(id, 'Password')

  var userObj = {
    id: id,
    user: user,
    pass: pass
  }

  cryptDe(userObj, dbPass ,cryptedPass)
  function cryptedPass(result) {
    if (result == pass) {
      pageStatus('Access Granted')
      setCookie('user', user)
      setCookie('pass', pass)
      pageShow('logout', true)
    }
    else {
      pageStatus('Access Denied')
    }
  }
}

function logout() {
  delCookie('user')
  delCookie('pass')
  pageHide('logout')
  pageShow('login', true)
}
