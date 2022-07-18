const axios = require('axios');
const { Logger } = require('../logger');

class Request {

  constructor(url, body) {
    this.url = url;
    if(body != undefined) {
      this.body = body;
    }
  }

  sendRequest = async () => {
    try {
      const res = await axios.get(this.url);
      return res["data"];
  
    } catch (error) {
      Logger.printStackTrace(error);
    }
  }

  sendPost = async (body) => {
    try {
      const res = await axios.post(this.url, body);
      return res["data"];
  
    } catch (error) {
      Logger.printStackTrace(error);
      throw new Error("Could you check if the body is defined?");
    }
  }
  
}

module.exports = Request;