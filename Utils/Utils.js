export const getDate = () => {
    const time = Math.floor(Date.now() / 1000);
    return timestampToString(time);
}

export const timestampToString = (t) => {
    const date = new Date(t * 1000);
    const year = date.getFullYear();
    const month = "0" + (date.getMonth() + 1);
    const day = "0" + date.getDate();
    const hour = "0" + date.getHours();
    const minute = "0" + date.getMinutes();
    const second = "0" + date.getSeconds();
    return year + "-"
        + month.substr(-2) + "-"
        + day.substr(-2) + "_"
        + hour.substr(-2) + ":"
        + minute.substr(-2) + ":"
        + second.substr(-2);
}

export const getUnixTime = () => {
    return Math.floor(Date.now() / 1000);
}

export const getInitialElo = (rank) => {
    return 750000 / (Number(rank) + 499) + 1000;
}

export const intToMod = (input) => {
    switch (Number(input)) {
        case 0:
            return "nm";
        case 1:
            return "hd";
        case 2:
            return "hr";
        case 3:
            return "dt";
        case 4:
            return "fm";
        case 5:
            return "tb"
        default:
            return -1;
    }
}

export const checkRegToMapset = (input) => {
    switch (Number(input)) {
        case 0:
            return /none/gi;
        case 1:
            return /hd/gi;
        case 2:
            return /hr/gi;
        case 3:
            return /dt/gi;
        case 4:
            return /none|hr|hd|ez/gi;
        case 5:
            return /none|hr|hd|ez/gi;
        default:
            return -1;
    }
}

export const getNickname = async (uid) => {
    const request = new Request(`http://ops.dgsrz.com/profile.php?uid=${uid}`);
    const username = await request.sendRequest().split("<div class=\"h3 m-t-xs m-b-xs\">")[1].split("<")[0];
    return username;
}
