main()

function main () {
  data()
  cookies()
  display()
}

function data() {
  if (!localStorage.users) {
    users = []
    localStorage.users = JSON.stringify(users)
  }
  else {
    users = JSON.parse(localStorage.users)
  }
  if (!localStorage.items) {
    items = []
    localStorage.items = JSON.stringify(items)
  }
  else {
    items = JSON.parse(localStorage.items)
  }
  if (!localStorage.links) {
    links = []
    localStorage.links = JSON.stringify(links)
  }
  else {
    links = JSON.parse(localStorage.links)
  }
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

function getCookie(cname) {
    var name = cname + '='
    var decodedCookie = decodeURIComponent(document.cookie)
    var ca = decodedCookie.split(';')
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i]
        while (c.charAt(0) == ' ') {
            c = c.substring(1)
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length)
        }
    }
    return ''
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date()
  var expiry
  if (!exdays) {
    document.cookie = cname + '=' + cvalue + ';path=/'
  }
  else {
    d.setTime(d.getTime() + (exdays*24*60*60*1000))
    expiry = 'expires='+ d.toUTCString()
    document.cookie = cname + '=' + cvalue + ';' + expiry + ';path=/'
  }
}

function delCookie(cname) {
  var cvalue = getCookie(cname)
  var expiry = 'expires=Thu, 01 Jan 1970 00:00:00 UTC'
  document.cookie = cname + '=' + cvalue + ';' + expiry + ';path=/'
}

function signin(e) {
  console.log(e)
}

function userData() {

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
