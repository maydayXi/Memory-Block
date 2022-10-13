import Utility from "../Utils/utility.js";

/**
 * View class 
 * Interacte with user & DOM
 */
class View {
    /**
     * View constructor => initialize all view component
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
        this.$Life          = $('h3.life');
        this.$Stars         = $('h3.stars');
        this.$InputStatus   = $('.input-status');
        this.$Blocks        = $('.blocks');
    }

    /**
     * Show Blocks template
     * @param {Object} blocks Block object array
     * @param {String} template Block template
     * 
     * @see Block
     */
    showBlock(blocks, template) {
        let inputStatusHTML = `
            <div class="row">
                <div class="input-status"></div>
            </div>`;

        this.$Blocks.html('');
        blocks.forEach(block => template = 
            template.replace('{SELECTOR}', block.selector.replace('.', '')));
        this.$Blocks.append(template);
        this.$Blocks.append(inputStatusHTML);
        
        this.$InputStatus   = $('.input-status');
        this.$BlockChild = this.$Blocks.find('.block');
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

    /**
     * 閃爍指定方塊
     * 
     * @param {Object} block block object
     * @see Block
     */
    async flash(block) {
        $(block.selector).addClass('active');
        await new Utility().delay(0.05);
        $(block.selector).removeClass('active');
    }

    /**
     * 開啟所有方塊閃爍
     * 
     * @param {Object} blocks block object
     * @see Block
     */
    turnAllOn(blocks) {
        blocks.forEach(block => $(block.selector).addClass('active'));
    }

    /**
     * 關閉所有方塊閃爍
     * 
     * @param {Object} blocks block object
     * @see Block
     */
    turnAllOff(blocks) {
        blocks.forEach(block => $(block.selector).removeClass('active'));
    }

    getStatusDot() {
        return $(`<div class='status-dot'></div>`);
    }

    /**
     * Show life value
     * @param {Number} life Life value
     */
    showLife(life) {
        let $LifeIcon = this.$Life.find('.fa-heart');
        $LifeIcon.each((i, heart) => {
            let $heart = $(heart);
            if (i + 1 > life) {
                $heart.removeClass('fa-solid');
                $heart.addClass('fa-regular');
            } else {
                $heart.removeClass('fa-regular');
                $heart.addClass('fa-solid');
            }
        });
    }

    /**
     * 顯示難易度
     * @param {Number} difficulty 
     */
    showDifficulty(difficulty) {
        let $StarIcon = this.$Stars.find('.fa-star');
        $StarIcon.each((i, star) => {
            let $star = $(star);
            if(i < difficulty) {
                $star.removeClass('fa-regular');
                $star.addClass('fa-solid');
            } else {
                $star.removeClass('fa-solid');
                $star.addClass('fa-regular');
            }
        });
    }
};

export default View;