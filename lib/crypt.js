/* Mekan-X page display script
* By Pierre-Etienne ALBINET
* Started 20181111
* Changed 20181111
*/

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
