import * as axios from 'axios';
import Logger from '#logger';

export default class Request {

    constructor(url, body) {
        this.url = url;
        if (body != undefined) {
            this.body = body;
        }
    }

    sendRequest = async () => {
        try {
            const res = await axios.get(this.url);
            return res["data"];
        }
        catch (e) {
            Logger.printStackTrace(e);
        }
    }

    sendPost = async (body) => {
        try {
            const res = await axios.post(this.url, body);
            return res["data"];

        }
        catch (e) {
            Logger.printStackTrace(e);
            throw new Error("Could you check if the body is defined?");
        }
    }

}