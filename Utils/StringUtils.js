import * as Base64 from 'js-base64';
import * as uuid from 'uuidv4';
import * as Md5 from 'md5';

export default class StringUtils {

    static getAlphaNumericString = (n) => {
        const AlphaNumericString = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvxyz";
        let StringBuild = "";
        for(let i = 0; i < n; i++) {
            let index = Math.floor(AlphaNumericString.length * Math.random());
            StringBuild += AlphaNumericString[index];
        }
        return StringBuild;
    }

    static getSecureString = (...strings) => {
        let StringBuilder = "";
        for(let i = 0; i < strings.length; i++) {
            StringBuilder += strings[i];
        }
        const string = Base64.decode(process.env.SECURE_KEY[0]) + StringBuilder + Base64.decode(process.env.SECURE_KEY[1]);
        return Md5(string);
    }

    static getRandomUuid = () => {
        return uuid.uuid();
    }
}