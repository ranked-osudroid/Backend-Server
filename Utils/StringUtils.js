import * as Base64 from 'js-base64';
import { v5 } from 'uuid';
import md5 from 'md5';


export const getAlphaNumericString = (n) => {
    const AlphaNumericString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvxyz";
    let StringBuild = "";
    for (let i = 0; i < n; i++) {
        let index = Math.floor(AlphaNumericString.length * Math.random());
        StringBuild += AlphaNumericString[index];
    }
    return StringBuild;
}

export const getSecureString = (...strings) => {
    const secureKeys = JSON.parse(process.env.SECURE_KEY);
    let StringBuilder = "";
    for (let i = 0; i < strings.length; i++) {
        StringBuilder += strings[i];
    }
    const string = Base64.decode(secureKeys[0]) + StringBuilder + Base64.decode(secureKeys[1]);
    return md5(string);
}

export const getRandomUuid = () => {
    return v5();
}
