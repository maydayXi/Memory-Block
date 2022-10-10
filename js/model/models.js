/**
 * AudioEffect class
 * 音效 model 類別
 */
class AudioEffect {
    /**
     * Initialize audio effect name and scale array.
     * @param {String} name Effect name
     * @param {Array} scales Effect scale array
     */
    constructor(name, scales) {
        this.name = name;
        this.scales = scales;
    }
}

/**
 * Block class
 * 方塊類別
 */
class Block {
    /**
     * Initialize Block selector, name and scale.
     * @param {String} selector DOM selector
     * @param {String} name Block name
     * @param {Number} scale Block scale
     */
    constructor(selector, name, scale) {
        this.selector = selector;
        this.name = name;
        this.scale = scale;
    }
}

export { Block, AudioEffect };
