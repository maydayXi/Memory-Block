import Utility from "../Utils/utility.js";

/**
 * View class 
 * Interacte with user & DOM
 */
class View {
    /**
     * View constructor
     */
    constructor() {
        // Buttons
        this.$BtnStart      = $('#BtnStart');
        this.$BtnHelp       = $('#BtnHelp');
        this.$BtnExit       = $('#BtnExit');
        this.$BtnBack       = $('#BtnBack');

        // Pages
        this.$EntryPage     = $('#EntryPage');
        this.$HelpPage      = $('#HelpPage');
        this.$LoadingPage   = $('#LoadingPage');
        this.$CountDownPage = $('#CountdownPage');
        this.$countdown     = $('#countdown');

        this.$LoadingStatus = this.$LoadingPage.find('.status');
        
        // Game Page
        this.$Status        = $('h3.status');
        this.$InputStatus   = $('.input-status');
        this.$Blocks        = $('.blocks .block');
    }

    /**
     * 顯示離遊戲對話方塊
     * @returns Dialog Object
     */
    showExitDialog() {
        return Swal.fire({
            title:  "Are you sure？",
            text:   'Exit Game',
            icon:   'question',
            showDenyButton: true,
            denyButtonText: 'No',
            confirmButtonText: 'Yes'
        });
    }

    /**
     * 顯示重新開始對話框
     * @returns Dialog object
     */
    showRestartDialog() {
        return Swal.fire({
            title:  "Restart Game？",
            text:   '',
            icon:   'question',
            showDenyButton: true,
            denyButtonText: 'No',
            confirmButtonText: 'Yes'
        })
    }

    /**
     * 顯示說明視窗
     */
    showHelp() { this.$HelpPage.fadeIn(500); }

    /**
     * 關閉說明視窗
     */
    hiddenHelp() { this.$HelpPage.fadeOut(500); }

    /**
     * 顯示遊戲訊息
     * @param {String} messgae Game message
     */
    showMessage(messgae) { this.$Status.text(messgae); }

    /**
     * 顯示倒數頁
     */
    showCountdownPage() { this.$CountDownPage.show(); }

    /**
     * 隱藏倒數頁
     */
    hideCountdownPage() { this.$CountDownPage.hide(); }

    /**
     * 顯示載入訊息
     * @param {String} messgae Loading message
     */
    showLoadingMessage(messgae) { this.$LoadingStatus.text(messgae); }

    /**
     * Show countdown second
     * @param {Number} second Countdown second
     */
    countdonw(second) { this.$countdown.text(second); }

    async flash(block) {
        block.dom.addClass('active');
        await new Utility().delay(0.05);
        block.dom.removeClass('active');
    }

    turnAllOn(blocks) {
        blocks.forEach(block => block.dom.addClass('active'));
    }

    /**
     * 關閉所有方塊閃爍
     * 
     * @param {Object} blocks block object
     */
    turnAllOff(blocks) {
        blocks.forEach(block => block.dom.removeClass('active'));
    }
};

export default View;