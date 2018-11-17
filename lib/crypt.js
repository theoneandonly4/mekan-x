/* Mekan-X page display script
* By Pierre-Etienne ALBINET
* Started 20181111
* Changed 20181111
*/

function cryptPass(obj, callback) {

//0 - Variable declarations
  var saltPBKDF2 = new TextEncoder("utf-8").encode(obj.pass + obj.id + obj.user)
  var saltKey = new TextEncoder("utf-8").encode(obj.user + obj.id + obj.pass)
  // Must be 16 long
  var saltCrypt  = obj.id + obj.pass + obj.user
  while (saltCrypt.length < 16) {
    saltCrypt = saltCrypt + 4
  }
  saltCrypt = saltCrypt.substring(0, 16)
  console.log(saltCrypt)
  saltCrypt = new TextEncoder("utf-8").encode(saltCrypt)
  console.log(saltCrypt)

//1 - Derive PBKDF2 key from saltPBKDF2
  window.crypto.subtle.importKey(
      "raw", //only "raw" is allowed
      saltPBKDF2,
      {
          name: "PBKDF2",
      },
      false, //whether the key is extractable (i.e. can be used in exportKey)
      ["deriveKey", "deriveBits"] //can be any combination of "deriveKey" and "deriveBits"
  )
  .then(function(key){
//2 - Derive the AES256 key from the PBKDF2 key using saltKey
      window.crypto.subtle.deriveKey(
        {
          "name": "PBKDF2",
          salt: saltKey,
          iterations: 1000,
          hash: {name: "SHA-1"}, //can be "SHA-1", "SHA-256", "SHA-384", or "SHA-512"
        },
        key, //your key from generateKey or importKey
        { //the key type you want to create based on the derived bits
          name: "AES-CBC", //can be any AES algorithm ("AES-CTR", "AES-CBC", "AES-CMAC", "AES-GCM", "AES-CFB", "AES-KW", "ECDH", "DH", or "HMAC")
          //the generateKey parameters for that type of algorithm
          length: 256, //can be  128, 192, or 256
        },
        false, //whether the derived key is extractable (i.e. can be used in exportKey)
        ["encrypt", "decrypt"] //limited to the options in that algorithm's importKey
      )
      .then(function(key){
//3 - encrypt Password with AES256 key using
        console.log(key)
        window.crypto.subtle.encrypt(
          {
            name: "AES-CBC",
            //Don't re-use initialization vectors!
            //Always generate a new iv every time your encrypt!
            iv: saltCrypt,
          },
          key, //from generateKey or importKey above
          new TextEncoder("utf-8").encode(pass) //ArrayBuffer of data you want to encrypt
        )
        .then(function(encrypted){
          //returns an ArrayBuffer containing the encrypted data
          obj.cryptPass = new TextDecoder().decode(new Uint8Array(encrypted))
          callback(obj)
        })
        .catch(function(err){
          console.error(err)
        })
      })
      .catch(function(err){
        console.error(err)
      })
  })
  .catch(function(err){
      console.error(err)
  })

}

//function cryptGenerateKeyAndIV(id, user, pass, callback) {
//   //Salt
//   var crypt
//   var saltIV = user + id + pass
//   var saltKey = pass + id + user
//
//   var userIVgen = new PBKDF2(pass, saltIV, 1000, 12)
//   var status_callback = function(percent_done) {
//     pageStatus('Computing User IV: ' + percent_done + '%')
//   }
//   var result_callback = function(key) {
//     var userIV = key
//     var key256 = new PBKDF2(pass, saltKey, 1000, 32)
//     var status_callback = function(percent_done) {
//       pageStatus('Computing AES256 Key: ' + percent_done + '%')
//     }
//     var result_callback = function(key) {
//       var aes256key = key
//       crypt = {
//         iv: userIV,
//         key: aes256key
//       }
//       callback(crypt)
//     }
//     key256.deriveKey(status_callback, result_callback)
//   }
//   userIVgen.deriveKey(status_callback, result_callback)
// }

function cryptImportKey(crypter) {
  window.crypto.subtle.importKey(
    "jwk", //can be "jwk" or "raw"
    {   //this is an example jwk key, "raw" would be an ArrayBuffer
      kty: "oct",
      k: "Y0zt37HgOx-BY7SQjYVmrqhPkO44Ii2Jcb9yydUDPfE",
      alg: "A256CBC",
      ext: true,
    },
    {   //this is the algorithm options
      name: "AES-CBC",
    },
      false, //whether the key is extractable (i.e. can be used in exportKey)
      ["encrypt", "decrypt"] //can be "encrypt", "decrypt", "wrapKey", or "unwrapKey"
  )
  .then(function(key){
    //returns the symmetric key
    console.log(key)
  })
  .catch(function(err){
    console.error(err)
  })
}
