export default class Position {

    /**
     * 포지션 생성자
     * @param {String} type 포지션 타입
     * @param {Number} time 시간
     * @param {Number} i 커서 i 값
     * @param {Number} x x좌표
     * @param {Number} y y좌표
     */
    constructor(type, time, i, x, y) {
        this.type = type;
        this.time = time;
        this.i = i;
        this.x = x;
        this.y = y;
    }

    getType() {
        return this.type;
    }

    getTime() {
        return this.time;
    }

    getI() {
        return this.i;
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    asJson() {
        return {
            type: this.type,
            time: this.time,
            i: this.i,
            x: this.x,
            y: this.y
        };
    }
}