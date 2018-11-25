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
    dbCreateItem(id, 'UEK', wuek, true)
    pageStatus('User Created Locally')
  }
}

function login() {
  var user = document.getElementById('user').value
  var pass = document.getElementById('pass').value

  var id = dbGetID('UserName', user)
  var dbPass = dbGetValue(id, 'Password')
  var wuek = dbGetValue(id, 'UEK')
  var uek = {}
  var pek = {}
  var sek = {}

  var userObj = {
    id: id,
    user: user,
    pass: pass
  }

  cryptDerive(userObj, fpek) // Derive Password Encryption Key
  function fpek(key, salt) {
    pek.key = key
    pek.salt = salt
    cryptUnwrap(wuek.key, pek.key, pek.salt, fwuek)
  }
  function fwuek(key) {
    uek.key = key
    cryptDecrypt(wuek.salt, pek.key, pek.salt, false, fuek)
  }
  function fuek(dData) {
    uek.salt = dData
    cryptDecrypt(dbPass, uek.key, uek.salt, true, decryptedPass)
  }
  function decryptedPass(result) {
    if (result == pass) {
      pageStatus('Access Granted')
      var cookieObj = {
        id: + new Date(),
        user: navigator.userAgent.substring(navigator.userAgent.lastIndexOf(' '),navigator.userAgent.length),
        pass: Math.random().toString(36).substring(7) //TODO: fix random generation
      }
      console.log(cookieObj)

      //TODO: Derivekey from cookieObj / crypt pass and pek.salt with derived key - store in LS.crypt (replace)
      //TODO; create session cookies with 5/10 mins expiry containing cookieObj

      // setCookie('user', user)
      // setCookie('pass', pass)
      // pageShow('logout', true)
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
