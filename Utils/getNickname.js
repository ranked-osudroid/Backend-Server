const Request = require('./Request');

exports.getNickname = async (uid) => {
    const request = new Request(`http://ops.dgsrz.com/profile.php?uid=${uid}`);
    const username = await request.sendRequest().split("<div class=\"h3 m-t-xs m-b-xs\">")[1].split("<")[0];
    return username;
}

