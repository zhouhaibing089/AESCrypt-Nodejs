AESCrypt-Nodejs
===============

I struggled for two days to find a cross-platform solution on aes, and now I got it.

## Other platforms

Thanks for these people's work!!!

### Ruby

[https://github.com/Gurpartap/aescrypt](https://github.com/Gurpartap/aescrypt)


### iOS

[https://github.com/Gurpartap/AESCrypt-ObjC](https://github.com/Gurpartap/AESCrypt-ObjC)

### Android

[https://github.com/scottyab/AESCrypt-Android](https://github.com/scottyab/AESCrypt-Android)

## Nodejs

The nodejs version is interoperable with the code above.

### Usage

```javascript
var aes = require("./aes");

var encrypted = aes.encrypt("helloworld", "123456");
console.log(encrypted);
// oJr7/fYMOVfoHulUu8n3rQ==

var decrypted = aes.decrypt(encrypted, "123456");
console.log(decrypted);
// helloworld
```

### Background

1.  `aes-256-cbc` in the `crypto` module defaults use `pkcs5` padding, but on iOS, only `pkcs7` is supported.
2.  The initial vector is set up as blank which may be not secure, please know it.
3.  The key can be any string since we do `sha256` hash on it.

### Thanks

The code on [https://github.com/node-webot/wechat-crypto](https://github.com/node-webot/wechat-crypto) helps a lot.
