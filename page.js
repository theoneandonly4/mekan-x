/* Mekan-X page display script
* By Pierre-Etienne ALBINET
* Started 20181026
* Changed 20181203
*/

function pageClear(except) {
  var main = document.getElementById('main')
  var divs = main.getElementsByTagName('div')
  var i
  for (i = 0; i < divs.length; i++) {
    if (divs[i].id != except) {
      divs[i].style.display = 'none'
    }
  }
}

function pageStatus(status) {
  document.getElementById('status').innerHTML = ' - ' + status
}

function pageUser(userName) {
  item = document.getElementById('userName')
  item.innerHTML = ' - Logged in as ' + userName + ' '
  item.style.display = 'inline-block'
}

function pageSessionTime(s) {
  item = document.getElementById('sessionTime')
  item.innerHTML = '(' + s + ') '
  item.style.display = 'inline-block'
}

function pageShow(id, clear) {
  if (clear) {
    pageClear(id)
  }
  item = document.getElementById(id)
  item.style.display = 'inline-block'
}

function pageHide(id) {
  item = document.getElementById(id)
  item.style.display = 'none'
}
