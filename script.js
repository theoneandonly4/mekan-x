/* Mekan-X main script
* By Pierre-Etienne ALBINET
* Started 20181026
* Changed 20181124
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

  // cryptEn(userObj, userObj.pass ,cryptedPass)

  var uek = {}
  var pek = {}
  var wuek = {}

  cryptGen(fuek) // Generate User Encryption Key
  function fuek(key, salt) {
    uek.key = key
    uek.salt = salt
    cryptDerive(userObj, fpek) // Derive Password Encryption Key
  }
  function fpek(key, salt) {
    pek.key = key
    pek.salt = salt
    cryptWrap(uek.key, pek.key, pek.salt, fwuek) // Wrap User Encryption Key with Password Encryption Key
  }
  function fwuek(wKey) {
    wuek.key = wKey
    cryptEncrypt(uek.salt, pek.key, pek.salt, fueks) // Crypt User Encryption Salt with Password Encryption Key
  }
  function fueks(cData) {
    wuek.salt = cData
    cryptEncrypt(userObj.pass, uek.key, uek.salt, cryptedPass) // Crypt User Password with User Encryption Key
  }
  function cryptedPass(result) {
    //Create User in LocalStorage
    dbCreateItem('0', 'User', userObj.id, false)
    dbCreateItem(id, 'UserName', userObj.user, false)
    dbCreateItem(id, 'Password', result, true)
    dbCreateItem(id, 'UEK', uek, true)
    pageStatus('User Created Locally')
    console.log(uek)
    console.log(pek)
    console.log(wuek)
  }
}

// TODO: fix issue that uek.key is not stored properly

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
