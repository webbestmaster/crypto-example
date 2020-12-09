function arrayBufferToBase64(arrayBuffer) {
    var byteArray = new Uint8Array(arrayBuffer);
    var byteString = '';

    for (var i = 0; i < byteArray.byteLength; i++) {
        byteString += String.fromCharCode(byteArray[i]);
    }

    var b64 = window.btoa(byteString);

    return b64;
}

// add '\n' after every 64th symbol
function addNewLines(str) {
    var finalString = '';
    while (str.length > 0) {
        finalString += str.substring(0, 64) + '\n';
        str = str.substring(64);
    }

    return finalString;
}

function toPem(privateKey) {
    var b64 = addNewLines(arrayBufferToBase64(privateKey));
    var pem = "-----BEGIN PRIVATE KEY-----\n" + b64 + "-----END PRIVATE KEY-----";

    return pem;
}

(async () => {
    const keyPair = await window.crypto.subtle.generateKey(
        {
            name: "RSA-OAEP",
            modulusLength: 2048, // can be 1024, 2048 or 4096
            publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
            hash: {name: "SHA-256"} // or SHA-512
        },
        true,
        ["encrypt", "decrypt"]
    )

    const {privateKey, publicKey} = keyPair;

    console.log('privateKey', privateKey);
    console.log('publicKey', publicKey);

    const string = 'Hello world!';

    const encrypt = await window.crypto.subtle.encrypt(
        {
            name: "RSA-OAEP"
        },
        publicKey,
        new TextEncoder().encode(string)
    );

    console.log('encrypt:', encrypt);

    let utf8decoder = new TextDecoder();

    const rawDecrypt = utf8decoder.decode(encrypt);

    console.log('rawDecrypt:', rawDecrypt);

    const decrypt = await window.crypto.subtle.decrypt(
        {
            name: "RSA-OAEP"
        },
        privateKey,
        encrypt
    );

    console.log('decrypt:', decrypt);

    const decryptString = utf8decoder.decode(decrypt);

    console.log('decryptString:', decryptString);


})();

/*
window.crypto.subtle.generateKey(
    {
        name: "RSA-OAEP",
        modulusLength: 2048, // can be 1024, 2048 or 4096
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
        hash: {name: "SHA-256"} // or SHA-512
    },
    true,
    ["encrypt", "decrypt"]
).then(function(keyPair) {
    console.log('keyPair', keyPair);



    // now when the key pair is generated we are going
    // to export it from the keypair object in pkcs8
    window.crypto.subtle.exportKey(
        "pkcs8",
        keyPair.privateKey
    ).then(function(exportedPrivateKey) {
        // converting exported private key to PEM format
        var pem = toPem(exportedPrivateKey);
        console.log(pem);
    }).catch(function(err) {
        console.log(err);
    });
});

*/
