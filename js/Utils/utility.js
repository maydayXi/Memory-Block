/**
 * Utility class 
 * 共用函式庫
 */
class Utility {
    /**
     * Utitity constructor
     */
    constructor() {}

    /**
     * Delay function
     * 延遲方法
     * 
     * @param {Float} second delay seconds
     * @returns Promise object
     * 
     * @see Promise
     */
    delay(second) {
        return new Promise(reslove => 
            setTimeout(reslove, this.duration(second)));
    }

    /**
     * Get second duration
     * @param {Float} second duration second
     * @returns second
     */
    duration(second) {
        return second * 1000;
    }

    /**
     * Get Audio Object by scale
     * @param {Number} scale audio scale
     * @returns Audio Object
     * 
     * @see Audio
     */
    getAudio(scale) {
        return new Audio(`https://awiclass.monoame.com/pianosound/set/${scale}.wav`);
    }

    /**
     * Play Audio
     * @param {Object} audio Audio Object
     * 
     * @see Audio
     */
    playAudio(audio) {
        audio.currentTime = 0;
        audio.play();
    }

    /**
     * Play audio effect by type
     * @param {String} effect Audio effect type
     */
    playAudioEffect(effect) {
        effect.scales.forEach(scale => {
            let audio = this.getAudio(scale);
            audio.currentTime = 0;
            audio.play();
        });
    }
}

export default Utility;