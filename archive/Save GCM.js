var text = 'Secret Data'
var data = new TextEncoder("utf-8").encode(text)
console.log(data)
var iv = window.crypto.getRandomValues(new Uint8Array(96))
var string = new TextDecoder('utf-8').decode(data);
console.log(string)

window.crypto.subtle.generateKey(
    {
        name: "AES-GCM",
        length: 256, //can be  128, 192, or 256
    },
    true, //whether the key is extractable (i.e. can be used in exportKey)
    ["encrypt", "decrypt"] //can "encrypt", "decrypt", "wrapKey", or "unwrapKey"
)
.then(function(key){
    //returns a key object
    console.log(key)
    window.crypto.subtle.encrypt(
        {
            name: "AES-GCM",

            //Don't re-use initialization vectors!
            //Always generate a new iv every time your encrypt!
            //Recommended to use 12 bytes length
            iv: iv,

            //Additional authentication data (optional)
            // additionalData: ArrayBuffer,

            //Tag length (optional)
            tagLength: 128, //can be 32, 64, 96, 104, 112, 120 or 128 (default)
        },
        key, //from generateKey or importKey above
        data //ArrayBuffer of data you want to encrypt
    )
    .then(function(encrypted){
        //returns an ArrayBuffer containing the encrypted data
        var crypt = new Uint8Array(encrypted)
        console.log(crypt)
        var cryptString = new TextDecoder('utf-8').decode(crypt)
        console.log(cryptString)

        window.crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv: iv, //The initialization vector you used to encrypt
                // additionalData: ArrayBuffer, //The addtionalData you used to encrypt (if any)
                tagLength: 128, //The tagLength you used to encrypt (if any)
            },
            key, //from generateKey or importKey above
            crypt //ArrayBuffer of the data
        )
        .then(function(decrypted){
            //returns an ArrayBuffer containing the decrypted data
            var decrypt = new Uint8Array(decrypted)
            console.log(decrypt)
            var finalData = new TextDecoder('utf-8').decode(decrypt)
            console.log(finalData)
        })
        .catch(function(err){
            console.error(err);
        });


    })
    .catch(function(err){
        console.error(err)
    });
})
.catch(function(err){
    console.error(err)
});
