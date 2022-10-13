/**
 * Game data 
 * 遊戲資料
 */
const GameData = {
    /**
     * 關卡資料（測試）
     */
    levels: [
        "1234",
        "12324",
        "231234",
        "41233412",
        "41323134132"
    ],
    /**
     * 方塊物件初始（四個）
     */
    blockObj: [
        { selector: '.block-red',    name: '1', scale: 1 },
        { selector: '.block-yellow', name: '2', scale: 2 },
        { selector: '.block-blue',   name: '3', scale: 3 },
        { selector: '.block-white',  name: '4', scale: 4 }
    ],
    /**
     * 遊戲音效
     */
    audioEffects: [
        { name: 'Correct' , scales: [1, 3, 5, 8] },
        { name: 'Incorrect', scales: [2, 4, 5.5, 7] }
    ], 
    // 方塊版面
    template: {
        4:  `<div class='row'>
                <div class="block flex-center {SELECTOR}"></div>
                <div class="block flex-center {SELECTOR}"></div>
            </div>
            <div class='row'>
                <div class="block flex-center {SELECTOR}"></div>
                <div class="block flex-center {SELECTOR}"></div>
            </div>`,
        6: `<div class='row'>
                <div class="block flex-center {SELECTOR}"></div>
                <div class="block flex-center {SELECTOR}"></div>
                <div class="block flex-center {SELECTOR}"></div>
            </div>
            <div class='row'>
                <div class="block flex-center {SELECTOR}"></div>
                <div class="block flex-center {SELECTOR}"></div>
                <div class="block flex-center {SELECTOR}"></div>
            </div>`,
        9: `<div class='row'>
                <div class="block flex-center {SELECTOR}"></div>
                <div class="block flex-center {SELECTOR}"></div>
                <div class="block flex-center {SELECTOR}"></div>
            </div>
            <div class='row'>
                <div class="block flex-center {SELECTOR}"></div>
                <div class="block flex-center {SELECTOR}"></div>
                <div class="block flex-center {SELECTOR}"></div>
            </div>
            <div class='row'>
                <div class="block flex-center {SELECTOR}"></div>
                <div class="block flex-center {SELECTOR}"></div>
                <div class="block flex-center {SELECTOR}"></div>
            </div>`
    }
};

export default GameData;