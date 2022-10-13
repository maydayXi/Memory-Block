import GameData from "../data/data.js";
import { Block, AudioEffect } from "../model/models.js";
import View from "../views/view.js";
import Utility from "../Utils/utility.js";

/**
 * Game class
 */
class Game {
    /**
     * Game constructor：Initialize all game data.
     */
    constructor() {
        this.currentLevel = 0;
        this.status = 'Loading  ...';
        this.difficulty = 0;
        this.life = 5;
        this.userInput = '';
        this.levels = [];

        this.view = new View();
        this.utils = new Utility();

        this.#initBlocksModel();
        this.#createBlocksView();
        this.#bindingEvent();
    }

    /**
     * Set Game status
     * @param {String} status Game status
     */
    #setStatus(status) {
        this.status = status;
        this.view.showMessage(this.status);
    }

    /**
     * 設定生命值
     */
    #reduceLife() {
        this.life -= 1;
        this.view.showLife(this.life);
    }

    /**
     * 設定難易度
     */
    #addDifficulty() {
        this.difficulty += 1;
        this.view.showDifficulty(this.difficulty);
    }

    /**
     * 初始方塊資料
     * 
     * @see GameData
     * @see Array
     */
    #initBlocksModel() {
        // 方塊物件陣列
        this.blocksModels = new Array();
        // loading block object data
        GameData.blockObj.forEach(block => {
            this.blocksModels.push(new Block(block.selector, block.name, block.scale))
        });
        this.#createBlocks();
    }

    /**
     * 轉換資料模型
     */
    #createBlocks() {
        this.blocks = this.blocksModels.map(block => ({
            name: block.name,
            selector: block.selector,
            audio: this.utils.getAudio(block.scale)
        }));
    }

    /**
     * 註冊方塊事件
     */
    #bindingBlocks() {
        let event = 'click';

        this.view.$BlockChild.each((i, block) => {
            $(block).off(event);
        });

        this.view.$BlockChild.each((i ,block) => {
            $(block).on(event, () => {
                this.#userInputHandle(i + 1);
            });
        });
    }

    /**
     * 新增方塊方法
     */
    #createBlocksView() {
        switch(this.difficulty) {
            case 2:
                this.blocksModels.push(new Block('.block-green', '5', 5));
                this.blocksModels.push(new Block('.block-violet', '6', 6));
                break;
            case 3:
                this.blocksModels.push(new Block('.block-chocolate', '7', 7));
                this.blocksModels.push(new Block('.block-pink', '8', 8));
                this.blocksModels.push(new Block('.block-orange', '9', 9));
                break;
        }

        this.#createBlocks();
        this.view.showBlock(this.blocks, GameData.template[this.blocks.length]);
        this.#bindingBlocks();
    }

    /**
     * Loading Game data
     * 載入遊戲資料
     * 
     * @see GameData
     */
    #loadingData() {
        this.status = 'Loading  ...';
        
        // 音效資料
        this.audioEffects = new Array();
        // 載入音效資料
        GameData.audioEffects.forEach(audioEffect => {
            this.audioEffects.push(new AudioEffect(
                audioEffect.name,
                audioEffect.scales
            ));
        });

        // 載入關卡資料
        this.#generateLevel();
        console.log(this.levels);
    }

    /**
     * 產生關卡資料
     */
    #generateLevel() {
        this.difficulty = 1;

        for (let i = 0; i < 15; i++) {
            if(i % 5 == 0 && i > 0) this.difficulty += 1;

            let len = this.difficulty == 1 ? 4 + i : i;
            let max = this.difficulty == 1 ? 5
                : this.difficulty == 2 
                    ? 7
                    : 10;
            this.levels.push(this.utils.getLevel(len, max, 1));
        }
        
        this.difficulty = 0;
    }

    /**
     * 綁定按鈕事件
     */
    #bindingEvent() {
        let event = 'click';
        this.view.$BtnStart.on(event, () => this.#startGame());
        this.view.$BtnExit.on(event, () => this.#exitGame());
        this.view.$BtnHelp.on(event, () => this.#openHelp());
        this.view.$BtnBack.on(event, () => this.#exitHelp());
    }

    /**
     * 開啟說明
     */
    #openHelp() { this.view.showHelp(); }

    /**
     * 關閉說明
     */
    #exitHelp() { this.view.hiddenHelp(); }

    /**
     * 離開遊戲
     */
    #exitGame() {
        this.view.showExitDialog().then(
            result => { 
                if(result.isConfirmed) 
                    window.close();
            }
        );
    }


    /**
     * 倒數計時方法
     */
    async #showCountdown() {
        for (let i = 3; i > 0; i--) {
            this.view.countdonw(i);
            await this.utils.delay(1);
        }

        this.view.countdonw('');
        this.view.hideCountdownPage();
    }

    /**
     * 重設遊戲狀態
     */
    #reset() {
        this.status = 'Loading  ...';
        this.userInput = '';
        this.levels = [];
        this.difficulty = 0;
        this.life = 5;
        this.currentLevel = 0;
    }

    /**
     * 開始遊戲
     */
    async #startGame() {
        this.view.$EntryPage.fadeOut(100);
        this.view.showLoadingMessage(this.status);
        // 重設並載入資料
        this.#reset();
        this.#loadingData();
        this.#addDifficulty();
        this.view.showLife(this.life);
        this.#setStatus(`Level ${this.currentLevel + 1}`);
        await this.utils.delay(1);
        this.view.$LoadingPage.fadeOut(1000);

        // 倒數完後開始遊戲
        this.#showCountdown().then(() => {
            this.round();
        })
    }

    /**
     * 每一回合方法
     */
    async round() {
        this.view.turnAllOff(this.blocks);
        this.view.$InputStatus.remove('correct');
        this.view.showLife(this.life);
        this.#setStatus(`Level ${this.currentLevel + 1}`);

        this.answer = this.levels[this.currentLevel];
        this.userInput = '';
        this.#showInputStatus();
        setTimeout(() => {
            this.#playAnswer().then(() => 
                this.#userRound()
            );
        }, this.utils.duration(0.4));
    }

    /**
     * 使用者回合
     */
    #userRound() {
        this.#setStatus('User input');
    }

    /**
     * 下一回合
     */
    async #nextLevel() {
        this.#setStatus('Correct');
        await this.utils.delay(0.5);
        this.#playAudiosByStatus();
        this.view.$InputStatus.addClass(this.status.toLowerCase());
        this.view.turnAllOn(this.blocks);
        await this.utils.delay(0.5);
        
        this.view.turnAllOff(this.blocks);
        this.view.$InputStatus.removeClass(this.status.toLowerCase());

        this.currentLevel += 1;
        if(this.currentLevel == this.levels.length) {
            this.#win();
        } else {
            if(this.currentLevel > 0 && this.currentLevel % 5 == 0) {
                this.#addDifficulty();
                this.#createBlocksView();
            }
            
            await this.utils.delay(0.5);
            this.round();
        }
    }

    /**
     * 使用者輸入事件
     */
    #userInputHandle(num) {
        if(this.status === 'User input') {
            let _block = this.blocks.find(block => block.name === `${num}`);

            this.userInput += `${num}`;
            this.utils.playAudio(_block.audio);
            this.#showInputStatus();

            this.answer.indexOf(this.userInput) === 0 
                ? this.answer === this.userInput 
                    ? this.#nextLevel()
                    : this.status = 'User input'
                : this.#inputError();
        } else {
            return false;
        }
    }

    /**
     * 輸入錯誤
     */
    async #inputError() {
        this.#setStatus(`Incorrect`);
        await this.utils.delay(0.5);
        this.#reduceLife();
        this.#playAudiosByStatus();
        this.view.turnAllOn(this.blocks);
        this.view.$InputStatus.addClass(this.status.toLowerCase());
        await this.utils.delay(0.5);
        this.view.$InputStatus.removeClass(this.status.toLowerCase());
        this.view.turnAllOff(this.blocks);

        if(this.life) {
            this.#setStatus(`Level ${this.currentLevel}`);
            this.round();
        } else {
            this.#restartOrNot();
        }
    }

    /**
     * 播放對應狀態的音效
     */
    #playAudiosByStatus() {
        let audios = this.audioEffects.find(effect => 
            effect.name === this.status);
        this.utils.playAudioEffect(audios);
    }

    /**
     * 是否重新開始或結束遊戲
     */
    async #restartOrNot() {
        this.view.showRestartDialog()
        .then(result => {
            if(result.isConfirmed) {
                this.#setStatus('Restart');
                
                setTimeout(() => {
                    this.view.$InputStatus.html('');
                    this.#reset();
                    this.levels = this.#generateLevel();
                    this.round();
                }, this.utils.duration(1));
            }
            else {
                let over = 'Game Over'
                Swal.fire(over, '', 'error')
                .then(() => {
                    this.#gameOver(over);
                });
            }
        })
    }

    /**
     * 遊戲結束
     */
    #gameOver(status) {
        this.#setStatus(status);
        this.view.$InputStatus.html('');
        this.view.$EntryPage.show(10);
        this.view.$LoadingPage.show(50);
        this.view.$CountDownPage.show(50);
        this.#reset();
    }

    /**
     * 破關
     */
    #win() {
        Swal.fire('Congratulation', 'You win the game', 'success')
        .then(() => {
            this.#gameOver('Win');
        });
    }

    /**
     * 播放電腦出題
     */
    async #playAnswer() {
        for (let i = 0; i < this.answer.length; i++) {
            let _block = this.blocks.find(block => 
                block.name === this.answer[i]);

            this.view.flash(_block);
            this.utils.playAudio(_block.audio);
            await this.utils.delay(0.4);
        }
    }

    /**
     * 顯示玩家輸入狀態
     */
    #showInputStatus() {
        this.view.$InputStatus.html('');

        this.answer.split('').forEach((char, i) => {
            let $dot = this.view.getStatusDot();

            if (this.userInput && i < this.userInput.length)
                $dot.addClass('input-dot');

            this.view.$InputStatus.append($dot);
        });
    }
}

export default Game;