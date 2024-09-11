
// import CryptoJS from 'crypto-js';
// const AES_KEY = import.meta.env.VITE_AES_PRIVATE

// // 加密函数

// export function decryptPwd(plaintext) {
//     const key = CryptoJS.enc.Base64.parse(AES_KEY);

//     const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
//         mode: CryptoJS.mode.ECB,
//         padding: CryptoJS.pad.Pkcs7
//     });

//     return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
// }


import CryptoJS from "crypto-js";
import JSEncrypt from "jsencrypt";

// RSA 公钥 (base64 编码,2048 位)
const RSA_PUBLIC_KEY = import.meta.env.VITE_RSA_PUBLIC

// AES 密钥 (256 位)
const AES_KEY = import.meta.env.VITE_AES_PRIVATE

/**
 * @param originalLinker 校园官网登录密码明文
 */
export const encryptLinker = (originalLinker: string): string => {
    const encrypt = new JSEncrypt();
    encrypt.setPublicKey(RSA_PUBLIC_KEY);
    const encrypted = encrypt.encrypt(originalLinker);
    return encrypted || "";
}

/**
 * @param linker 校园官网登录密码密文
 */
export const decryptPwd = (linker: string): string => {
    // 将 Base64 编码的密钥转换为字节数组
    const keyBase64 = CryptoJS.enc.Base64.parse(AES_KEY);
    
    // 使用转换后的密钥进行解密
    const bytes = CryptoJS.AES.decrypt(linker, keyBase64, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    });
    return bytes.toString(CryptoJS.enc.Utf8);
}
