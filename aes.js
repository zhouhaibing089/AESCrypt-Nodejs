var crypto = require('crypto');

/**
 * 提供基于PKCS7算法的加解密接口
 *
 */
var PKCS7Encoder = {};

/**
 * 删除解密后明文的补位字符
 *
 * @param {String} text 解密后的明文
 */
PKCS7Encoder.decode = function(text) {
    var pad = text[text.length - 1];

    if (pad < 1 || pad > 16) {
        pad = 0;
    }

    return text.slice(0, text.length - pad);
};

/**
 * 对需要加密的明文进行填充补位
 *
 * @param {String} text 需要进行填充补位操作的明文
 */
PKCS7Encoder.encode = function(text) {
    var blockSize = 16;
    var textLength = text.length;
    //计算需要填充的位数
    var amountToPad = blockSize - (textLength % blockSize);

    var result = new Buffer(amountToPad);
    result.fill(amountToPad);

    return Buffer.concat([text, result]);
};

/**
 * 对明文进行加密
 *
 * @param {String} text 待加密的明文
 * @param {String} key 密钥
 */
exports.encrypt = function(text, key) {
    // 对明文进行补位操作
    var encoded = PKCS7Encoder.encode(new Buffer(text));
    // 使用SHA256后的key
    key = crypto.createHash('sha256').update(key).digest();
    // 使用全空的初始向量
    var iv = new Buffer(16);
    iv.fill(0);
    // 创建加密对象，AES采用CBC模式，数据采用PKCS#7填充
    var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    cipher.setAutoPadding(false);
    var cipheredMsg = Buffer.concat([cipher.update(encoded), cipher.final()]);
    // 返回加密数据的base64编码
    return cipheredMsg.toString('base64');
};

/**
 * 对密文进行解密
 *
 * @param {String} text 待解密的密文
 * @param {String} key 密钥
 */
exports.decrypt = function(text, key) {
    // 使用SHA256后的key
    key = crypto.createHash('sha256').update(key).digest();
    // 使用全空的初始向量
    var iv = new Buffer(16);
    iv.fill(0);
    // 创建解密对象，AES采用CBC模式，数据采用PKCS#7填充
    var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    decipher.setAutoPadding(false);
    var deciphered = Buffer.concat([decipher.update(text, 'base64'), decipher.final()]);
    deciphered = PKCS7Encoder.decode(deciphered);
    // 返回结果
    return deciphered.toString();
};
