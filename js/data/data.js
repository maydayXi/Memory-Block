/**
 * Game data 
 * 遊戲資料
 */
const GameData = {
    /**
     * 關卡資料
     */
    levels: [
        "1234",
        "12324",
        "231234",
        "41233412",
        "41323134132",
        "2342341231231423414232"
    ],
    /**
     * 方塊物件
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
    ]
};

export default GameData;