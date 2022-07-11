class User {
    constructor(uuid, id) {
        this.uuid = uuid;
        this.id = id;
    }

    getUUID() {
        return this.uuid;
    }

    getID() {
        return this.id;
    }
}

module.exports = User;