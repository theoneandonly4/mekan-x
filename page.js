/* Mekan-X page display script
* By Pierre-Etienne ALBINET
* Started 20181026
* Changed 20181110
*/

function pageLogin() {
  pageClear('login')
  var login = document.getElementById('login')
  var user = document.getElementById('user')
  var pass = document.getElementById('pass')
  login.style.display = 'block'
}

function pageClear(except) {
  var main = document.getElementById('main')
  var divs = main.getElementsByTagName('div')
  var i
  for (i = 0; i < divs.length; i++) {
    if (divs[i].id != except) {
      console.log(divs[i])
      divs[i].style.display = 'none'
    }
  }
}

function pageStatus(status) {
  document.getElementById('status').innerHTML = status
}
