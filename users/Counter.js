class Counter {
    static userList = [];

    static getOnlineUsers() {
        return this.userList.length;
    }

    static addUser(user) {
        this.userList.push(user);
    }

    static removeUser(id) {
        this.userList = this.userList.filter(user => {
            user.getID() != id;
        });
    }

    static findUser(uuid) {
        for(let i = 0; i < this.userList.length; i++) {
            if(this.userList[i].getUUID() == uuid) {
                return true;
            }
        }
        return false;
    }
}

module.exports = Counter;