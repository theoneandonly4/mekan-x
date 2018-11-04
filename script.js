/* Mekan-X main script
* By Pierre-Etienne ALBINET
* Started 20181026
* Changed 20181104
*
* Acknowledgments:
* > Usage of the pbkdf2 function by Parvez Anandam (BSD License) which uses the sha1 by Paul Johnston
*
*/

main()

function main () {
  cookies()
  display()
}


function cookies() {
  var user = getCookie('user')
  if (user == '') {
    pageLogin()
  }
  else {
    userData()
  }
}

function signin() {
  var user = document.getElementById('user').value
  var pass = document.getElementById('pass').value

  

}

function login() {
  var user = document.getElementById('user').value
  var pass = document.getElementById('pass').value

  getUserID(user)
}



function display() {

}

var userIV = new PBKDF2('mypassword', 'saltines', 1000, 12)
var status_callback = function(percent_done) {
  document.getElementById('userIV').innerHTML = 'Computed ' + percent_done + '%'
  }
  var result_callback = function(key) {
    document.getElementById('userIV').innerHTML = 'User IV: ' + key
  }
userIV.deriveKey(status_callback, result_callback)

var key256 = new PBKDF2('mypassword', 'saltines', 1000, 32)
var status_callback = function(percent_done) {
    document.getElementById('256key').innerHTML = 'Computed ' + percent_done + '%'
  }
var result_callback = function(key) {
    document.getElementById('256key').innerHTML = 'AES 256 key: ' + key
  }
key256.deriveKey(status_callback, result_callback)
