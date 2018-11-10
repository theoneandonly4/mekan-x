/* Mekan-X main script
* By Pierre-Etienne ALBINET
* Started 20181026
* Changed 20181110
*
* Acknowledgments:
* > Usage of the pbkdf2 function by Parvez Anandam (BSD License) which uses the sha1 by Paul Johnston
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
    pageLogin()
  }
  else {
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
  dbCreateItem('0', 'User', id)
  dbCreateItem(id, 'UserName', user)
  var saltPass = new PBKDF2(pass, 'clientSalt', 1000, 12)
  var status_callback = function(percent_done) {
    pageStatus('Hashing & Salting Password: ' + percent_done + '%')
  }
  var result_callback = function(key) {
    pageStatus('User Created Locally')
    dbCreateItem(id, 'Password', key)
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
    }
    else {
      pageStatus('Access Denied')
    }
  &}
  saltPass.deriveKey(status_callback, result_callback)
}

// var userIV = new PBKDF2('mypassword', 'saltines', 1000, 12)
// var status_callback = function(percent_done) {
//   document.getElementById('userIV').innerHTML = 'Computed ' + percent_done + '%'
//   }
//   var result_callback = function(key) {
//     document.getElementById('userIV').innerHTML = 'User IV: ' + key
//   }
// userIV.deriveKey(status_callback, result_callback)
//
// var key256 = new PBKDF2('mypassword', 'saltines', 1000, 32)
// var status_callback = function(percent_done) {
//     document.getElementById('256key').innerHTML = 'Computed ' + percent_done + '%'
//   }
// var result_callback = function(key) {
//     document.getElementById('256key').innerHTML = 'AES 256 key: ' + key
//   }
// key256.deriveKey(status_callback, result_callback)
