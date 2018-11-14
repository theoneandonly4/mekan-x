/* Mekan-X page display script
* By Pierre-Etienne ALBINET
* Started 20181111
* Changed 20181111
*/

function cryptGenerateKeyAndIV(id, user, pass, callback) {

  //Salt
  var crypt
  var saltIV = user + id + pass
  var saltKey = pass + id + user

  var userIVgen = new PBKDF2(pass, saltIV, 1000, 12)
  var status_callback = function(percent_done) {
    pageStatus('Computing User IV: ' + percent_done + '%')
  }
  var result_callback = function(key) {
    var userIV = key
    var key256 = new PBKDF2(pass, saltKey, 1000, 32)
    var status_callback = function(percent_done) {
      pageStatus('Computing AES256 Key: ' + percent_done + '%')
    }
    var result_callback = function(key) {
      var aes256key = key
      crypt = {
        iv: userIV,
        key: aes256key
      }
      callback(crypt)
    }
    key256.deriveKey(status_callback, result_callback)
  }
  userIVgen.deriveKey(status_callback, result_callback)
}
