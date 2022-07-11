const fs = require('fs');
const Utils = require('./Utils');
const Stats = require('../codes/Status');

class Logger {

    //String type
    //Json input
    constructor(type, input) {
        this.type = type;
        this.input = input;
        this.output = null;
        this.time = Utils.getDate();
        this.fileName = this.time + "_" + this.type + ".txt";
        this.errorCode = null;
        this.errorStack = null;
        console.log(`${this.type} is called! | Time : ${this.time}`);
    }

    success = () => {
        const log = {
            "status": Stats.SUCCESS,
            "type": this.type,
            "body": this.input,
            "output": this.output,
            "time": this.time
        };
        fs.writeFile(`./log/${this.fileName}`, JSON.stringify(log, null, "\t"), "utf-8", () => {
            console.log(`Success! | Type : ${this.type} | LogFile : ${this.fileName}`);
        });
        return log;
    }

    //boolean save
    error = (save) => {
        const log = {
            "status": Stats.FAILED,
            "code" : this.errorCode,
            "type": this.type,
            "body": this.input,
            "time": this.time
        }
        if(save) {
            fs.writeFile(`./error/${this.fileName}`, JSON.stringify(log, null, "\t") + (this.errorStack != null ? "\n\n\n" + this.errorStack : ""), "utf-8", (err) => {});
            console.log(`Error! | Type : ${this.type} | LogFile : ${this.fileName}`);
            console.log(this.errorStack);
        }
        else {
            console.log(`Error! | Type : ${this.type} | Code : ${this.errorCode}`);
        }
        
        return log;
    }

    //int code
    setErrorCode = (code) => {
        this.errorCode = code;
    }

    //Json | String output
    setOutput = (output) => {
        this.output = output;
    }

    setErrorStack = (e) => {
        this.errorStack = e.stack;
    }

    //Object err
    static printStackTrace = (err) => {
        if (typeof err === 'object') {
            if (err.message) {
                console.log('\nMessage: ' + err.message);
            }
            if (err.stack) {
                console.log('\nStacktrace:');
                console.log('====================');
                console.log(err.stack);
            }
        }
    }
}

module.exports = Logger;