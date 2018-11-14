/* Mekan-X main script
* By Pierre-Etienne ALBINET
* Started 20181026
* Changed 20181111
*
* Acknowledgments:
* > Usage of the pbkdf2 function by Parvez Anandam (BSD License) which uses  sha1 by Paul Johnston
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
  var saltPass = new PBKDF2(pass, 'clientSalt', 1000, 12)
  var status_callback = function(percent_done) {
    pageStatus('Hashing & Salting Password: ' + percent_done + '%')
  }
  var result_callback = function(key) {
    cryptGenerateKeyAndIV(id, user, pass, genDone) // TODO: include all data in a 'main' object for passing through functions
    function genDone(crypt) {
      console.log(crypt)
      // dbCreateItem('0', 'User', id)
      // dbCreateItem(id, 'UserName', user)
      // dbCreateItem(id, 'Password', key)
      // pageStatus('User Created Locally')
    }

  }
  saltPass.deriveKey(status_callback, result_callback)
}

function login() {
  var user = document.getElementById('user').value
  var pass = document.getElementById('pass').value

  var userID = dbGetID('UserName', user)
  var dbPass = dbGetValue(userID, 'Password')
  pageStatus(userID)
  var saltPass = new PBKDF2(pass, 'clientSalt', 1000, 12)
  var status_callback = function(percent_done) {
    pageStatus('Hashing & Salting Password: ' + percent_done + '%')
    }
    var result_callback = function(key) {
      if (key == dbPass) {
        pageStatus('Access Granted')
        setCookie('user', user)
        setCookie('pass', pass)
        pageShow('logout', true)
    }
    else {
      pageStatus('Access Denied')
    }
  }
  saltPass.deriveKey(status_callback, result_callback)
}

function logout() {
  delCookie('user')
  delCookie('pass')
  pageHide('logout')
  pageShow('login', true)
}
