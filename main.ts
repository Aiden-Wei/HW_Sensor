/*
 Hiwonder Sensor package
*/
//% weight=10 icon="\uf013" color=#2896ff
namespace Sensor {
    const ASR_I2C_ADDR = 0x79;
    const ASR_RESULT_ADDR = 100;
    const ASR_WORDS_ERASE_ADDR = 101;
    const ASR_MODE_ADDR = 102;
    const ASR_ADD_WORDS_ADDR = 160;

    export enum ASRMode {
        //% block="1"
        mode1 = 0x01,
        //% block="2"
        mode2 = 0x02,
        //% block="3"
        mode3 = 0x03
    }

    function II2Cread(reg: number): Buffer {
        let val = pins.i2cReadBuffer(reg, 1);
        return val;
    }

    function WireWriteByte(addr: number, val: number): boolean {
        let buf = pins.createBuffer(1);
        buf[0] = val;
        let rvalue = pins.i2cWriteBuffer(addr, buf);
        if (rvalue != 0) {
            return false;
        }
        return true;
    }

    function WireWriteDataArray(addr: number, reg: number, val: number): boolean {
        let buf = pins.createBuffer(3);
        buf[0] = reg;
        buf[1] = val & 0xff;
        buf[2] = (val >> 8) & 0xff;
        let rvalue = pins.i2cWriteBuffer(addr, buf);
        if (rvalue != 0) {
            return false;
        }
        return true;
    }

    function WireReadDataArray(addr: number, reg: number, len: number): number {
        if (!WireWriteByte(addr, reg)) {
            return -1;
        }

        let buf = II2Cread(addr);
        if (buf.length != 1) {
            return 0;
        }
        return buf[0];
    }

    //% weight=100 blockId=ASRSETMODE block="Set to |%mode mode"
    //% subcategory=ASR
    export function ASRSETMODE(mode: ASRMode) {
        WireWriteDataArray(ASR_I2C_ADDR, ASR_MODE_ADDR, mode);
    }

    //% weight=98 blockId=ASRREAD block="Read Data"
    //% subcategory=ASR
    export function ASRREAD(): number {
        let val = WireReadDataArray(ASR_I2C_ADDR, ASR_RESULT_ADDR, 1);
        return val;
    }

    /**
     * @param idNum is a number, eg: 1
     * @param words is text, eg: "ni hao"
     */
    //% weight=99 blockId=ASRAddWords block="Add idNum|%idNum words|%words"
    //% subcategory=ASR
    export function ASRAddWords(idNum: number, words: string) {
        let buf = pins.createBuffer(words.length + 2);
        buf[0] = ASR_ADD_WORDS_ADDR;
        buf[1] = idNum;
        for (let i = 0; i < words.length; i++) {
            buf[2 + i] = words.charCodeAt(i);
        }
        pins.i2cWriteBuffer(ASR_I2C_ADDR, buf);
        basic.pause(50);
    }

    //% weight=97 blockId=ASRWORDSERASE block="Erase Data"
    //% subcategory=ASR
    export function ASRWORDSERASE() {
        WireWriteDataArray(ASR_I2C_ADDR, ASR_WORDS_ERASE_ADDR, null);
        basic.pause(60);
    }
}
