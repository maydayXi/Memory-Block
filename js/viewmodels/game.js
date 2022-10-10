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
        this.userInput = '';

        this.view = new View();
        this.utils = new Utility();

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
     * Loading Game data
     * 載入遊戲資料
     * 
     * @see GameData
     */
    #loadingData() {
        this.status = 'Loading  ...';
        // 方塊物件陣列
        this.blocks = new Array();
        // loading block object data
        GameData.blockObj.forEach(block => {
            this.blocks.push(new Block(block.selector, block.name, block.scale))
        });

        this.blocks = this.blocks.map(block => ({
            name: block.name,
            dom: $(block.selector),
            audio: this.utils.getAudio(block.scale)
        }));

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
        this.levels = GameData.levels;
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

        this.view.$Blocks.each((i ,block) => {
            $(block).on(event, () => {
                this.#userInputHandle(i + 1);
            });
        });
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
        this.userInput = '';
        this.currentLevel = 0;
        this.#setStatus(`Level ${this.currentLevel + 1}`);
    }

    /**
     * 開始遊戲
     */
    async #startGame() {
        this.view.$EntryPage.fadeOut(100);
        this.#loadingData();
        this.view.showLoadingMessage(this.status);
        await this.utils.delay(0.5);
        this.view.$LoadingPage.fadeOut(1000);
        this.#reset();

        this.#showCountdown().then(() => {
            this.currentLevel = 0;
            this.round();
        })
    }

    async #restartOrNot() {
        await this.utils.delay(0.5);
        this.#setStatus('Incorrect');
        this.view.turnAllOn(this.blocks);
        this.view.$InputStatus.addClass(this.status.toLowerCase());
        let effect = this.audioEffects.find(item => item.name === this.status);
        this.utils.playAudioEffect(effect);
        await this.utils.delay(0.5);

        this.view.$InputStatus.removeClass(this.status.toLowerCase());
        this.view.turnAllOff(this.blocks);
        this.view.showRestartDialog()
        .then(result => {
            if(result.isConfirmed) {
                this.#setStatus('Restart');
                
                setTimeout(() => {
                    this.view.$InputStatus.html('');
                    this.#reset();
                    this.round();
                }, this.utils.duration(1));
            }
            else {
                Swal.fire('Game Over', '', 'error')
                .then(() => {
                    this.#gameOver();
                });
            }
        })
    }

    /**
     * 遊戲結束
     */
    #gameOver() {
        this.#setStatus('Game Over');
        this.view.$InputStatus.html('');
        this.view.$EntryPage.show(10);
        this.view.$LoadingPage.show(50);
        this.view.$CountDownPage.show(50);
        this.#reset();
    }

    /**
     * 結束遊戲
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
     * 每一回合方法
     */
    async round() {
        this.view.turnAllOff(this.blocks);
        this.view.$InputStatus.remove('correct');
        this.#setStatus(`Level ${this.currentLevel + 1}`);

        this.answer = this.#getAnswer();
        this.userInput = '';
        this.#showInputStatus();
        setTimeout(() => {
            this.#playAnswer().then(() => {
                this.#userRound();
            })
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
        let effect = this.audioEffects.find(item => 
            item.name === this.status);
        this.utils.playAudioEffect(effect);
        this.view.$InputStatus.addClass(this.status.toLowerCase());
        this.view.turnAllOn(this.blocks);
        await this.utils.delay(0.5);
        
        this.view.turnAllOff(this.blocks);
        this.view.$InputStatus.removeClass(this.status.toLowerCase());

        this.currentLevel += 1;
        await this.utils.delay(0.5);
        this.round();
    }

    /**
     * 使用者輸入事件
     */
    #userInputHandle(num) {
        if(this.status === 'User input') {
            let lv = this.currentLevel + 1;

            let _block = this.blocks.find(block => block.name === `${num}`);

            this.userInput += `${num}`;
            this.utils.playAudio(_block.audio);
            this.#showInputStatus();

            this.answer.indexOf(this.userInput) === 0 
                ? this.answer === this.userInput 
                    ? this.#nextLevel()
                    : this.status = 'User input'
                : this.#restartOrNot();
        } else {
            return false;
        }
    }

    /**
     * Get answer.
     * @returns Answer array
     */
    #getAnswer() { return this.levels[this.currentLevel]; }

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
            let $dot = $(`<div class='status-dot'></div>`);

            if (this.userInput && i < this.userInput.length)
                $dot.addClass('input-dot');

            this.view.$InputStatus.append($dot);
        });
    }
}

export default Game;