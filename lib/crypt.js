/* Mekan-X page display script
* By Pierre-Etienne ALBINET
* Started 20181111
* Changed 20181124
*/

function cryptGen(res) {
  pageStatus('Generating User Encryption Key')
  var salt = window.crypto.getRandomValues(new Uint8Array(16))
  window.crypto.subtle.generateKey(
    {
        name: 'AES-CBC',
        length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  )
  .then(function(key){
    //returns a key object
    res(key, salt)
  })
  .catch(function(err){
    console.error(err)
  })
}

function cryptDerive(obj, res) {
  pageStatus('Deriving Key from Login or Session')
  var saltPBKDF2 = new TextEncoder('utf-8').encode(obj.pass + obj.id + obj.user)
  var saltKey = new TextEncoder('utf-8').encode(obj.user + obj.id + obj.pass)
  var saltCrypt // defined with deriveBits

//1 - Derive PBKDF2 key from saltPBKDF2
  window.crypto.subtle.importKey(
    'raw',
    saltPBKDF2,
    {
        name: 'PBKDF2',
    },
    false,
    ['deriveKey', 'deriveBits']
  )
  .then(function(key){

//2 - Derive encryption Salt from PBKDF2 key
    window.crypto.subtle.deriveBits(
      {
        'name': 'PBKDF2',
        salt: new TextEncoder('utf-8').encode(obj.id + obj.pass + obj.user),
        iterations: 1000,
        hash: {name: 'SHA-1'},
      },
      key,
      128
    )
    .then(function(bits){
      saltCrypt = new Uint8Array(bits)

//3 - Derive the AES256 key from the PBKDF2 key using saltKey
      window.crypto.subtle.deriveKey(
        {
          'name': 'PBKDF2',
          salt: saltKey,
          iterations: 1000,
          hash: {name: 'SHA-1'},
        },
        key,
        {
          name: 'AES-CBC',
          length: 256,
        },
        false,
        ['encrypt', 'decrypt', 'wrapKey', 'unwrapKey']
      )
      .then(function(key){
//4 - encrypt data with AES256 key using derived bits as initialization vector
        res(key, saltCrypt)
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

function cryptWrap(key, wrappingKey, salt, res) {
  pageStatus('Wrapping User Encryption key')
  window.crypto.subtle.wrapKey(
    'jwk',
    key,
    wrappingKey,
    {
        name: 'AES-CBC',
        iv: salt,
    }
  )
  .then(function(wrapped){
    //Usage of Array.from to be able to store the value
    var wrappedKey = Array.from(new Uint8Array(wrapped))
    res(wrappedKey, salt)
  })
  .catch(function(err){
    console.error(err)
  })
}

function cryptEncrypt(data, key, salt, res) {
  pageStatus('Encrypting Data')
  if (Array.isArray(data)) {
    cryptData = new Uint8Array(data)
  }
  else {
    cryptData = new TextEncoder('utf-8').encode(data)
  }
  window.crypto.subtle.encrypt(
    {
      name: 'AES-CBC',
      iv: salt,
    },
    key,
    cryptData
  )
  .then(function(encrypted){
    //Usage of Array.from to be able to store the value
    var crypted = Array.from(new Uint8Array(encrypted))
    res(crypted)
  })
  .catch(function(err){
    console.error(err)
  })
}

function cryptEn(obj, data, callback) {

//0 - Variable declarations
  var saltPBKDF2 = new TextEncoder('utf-8').encode(obj.pass + obj.id + obj.user)
  var saltKey = new TextEncoder('utf-8').encode(obj.user + obj.id + obj.pass)
  var saltCrypt // defined with deriveBits
  var cryptData = new TextEncoder('utf-8').encode(data)

//1 - Derive PBKDF2 key from saltPBKDF2
  window.crypto.subtle.importKey(
      'raw', // Fixed value 'raw'
      saltPBKDF2,
      {
          name: 'PBKDF2',
      },
      false, // can(not) be used in exportKey
      ['deriveKey', 'deriveBits'] //Usage - limited to deriveKey and deriveBits for PBKDF2
  )
  .then(function(key){

//2 - Derive encryption Salt from PBKDF2 key
    window.crypto.subtle.deriveBits(
      {
        'name': 'PBKDF2',
        salt: new TextEncoder('utf-8').encode(obj.id + obj.pass + obj.user),
        iterations: 1000,
        hash: {name: 'SHA-1'}, //'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
      },
      key, //imported or generated above with crypto.subtle
      128 //number of bits
    )
    .then(function(bits){
      //ArrayBuffer result in variable bits converted to Uint8Array for usage
      saltCrypt = new Uint8Array(bits)

//3 - Derive the AES256 key from the PBKDF2 key using saltKey
      window.crypto.subtle.deriveKey(
        {
          'name': 'PBKDF2',
          salt: saltKey,
          iterations: 1000,
          hash: {name: 'SHA-1'}, //'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
        },
        key, //imported or generated above with crypto.subtle
        {
          name: 'AES-CBC', //AES algorithm ('AES-CTR', 'AES-CBC', 'AES-CMAC', 'AES-GCM', 'AES-CFB', 'AES-KW', 'ECDH', 'DH', or 'HMAC')
          length: 256, //128, 192, or 256
        },
        false, // can(not) be used in exportKey
        ['encrypt', 'decrypt'] //usage
      )
      .then(function(key){
//4 - encrypt data with AES256 key using derived bits as initialization vector
        window.crypto.subtle.encrypt(
          {
            name: 'AES-CBC',
            iv: saltCrypt,
          },
          key, //imported or generated above with crypto.subtle
          cryptData //ArrayBuffer to encrypt
        )
        .then(function(encrypted){
          //ArrayBuffer in variable encrypted converted to Uint8Array for readability and to an Array for storage
          var crypted = Array.from(new Uint8Array(encrypted))
          callback(crypted)
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
  })
  .catch(function(err){
      console.error(err)
  })
}

function cryptDe(obj, data, callback) {

//0 - Variable declarations
  var saltPBKDF2 = new TextEncoder('utf-8').encode(obj.pass + obj.id + obj.user)
  var saltKey = new TextEncoder('utf-8').encode(obj.user + obj.id + obj.pass)
  var saltCrypt // defined with deriveBits
  var cryptData = new Uint8Array(data)

//1 - Derive PBKDF2 key from saltPBKDF2
  window.crypto.subtle.importKey(
      'raw', //fixed value 'raw'
      saltPBKDF2,
      {
          name: 'PBKDF2',
      },
      false, // can(not) be used in exportKey
      ['deriveKey', 'deriveBits'] //Usage - limited to deriveKey and deriveBits for PBKDF2
  )
  .then(function(key){

//2 - Derive encryption Salt from PBKDF2 key
    window.crypto.subtle.deriveBits(
      {
        'name': 'PBKDF2',
        salt: new TextEncoder('utf-8').encode(obj.id + obj.pass + obj.user),
        iterations: 1000,
        hash: {name: 'SHA-1'}, //'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
      },
      key, //imported or generated above with crypto.subtle
      128 //number of bits
    )
    .then(function(bits){
      //ArrayBuffer result in variable bits converted to Uint8Array for usage
      saltCrypt = new Uint8Array(bits)

//3 - Derive the AES256 key from the PBKDF2 key using saltKey
      window.crypto.subtle.deriveKey(
        {
          'name': 'PBKDF2',
          salt: saltKey,
          iterations: 1000,
          hash: {name: 'SHA-1'}, //can be 'SHA-1', 'SHA-256', 'SHA-384', or 'SHA-512'
        },
        key, //imported or generated above with crypto.subtle
        {
          name: 'AES-CBC', //AES algorithm ('AES-CTR', 'AES-CBC', 'AES-CMAC', 'AES-GCM', 'AES-CFB', 'AES-KW', 'ECDH', 'DH', or 'HMAC')
          length: 256, //128, 192, or 256
        },
        false, // can(not) be used in exportKey
        ['encrypt', 'decrypt'] //usage
      )
      .then(function(key){
//4 - decrypt data with AES256 key using derived bits as initialization vector
        window.crypto.subtle.decrypt(
          {
            name: 'AES-CBC',
            iv: saltCrypt, //Must be the same as with encryption
          },
          key, //imported or generated above with crypto.subtle
          cryptData //ArrayBuffer to decrypt
        )
        .then(function(decrypted){
          //ArrayBuffer in variable decrypted converted and decoded to plain text
          var decrypt = new TextDecoder('utf-8').decode(new Uint8Array(decrypted))
          callback(decrypt)
        })
        .catch(function(err){
          console.error(err)
        });
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
