export default class IdleTimer {
    constructor({ timeout = 60000, onIdle = null, onActive = null } = {}) {
        this.timeout = timeout;
        this.onIdle = onIdle;
        this.onActive = onActive;
        this.isIdle = false;
        this.timer = null;
        this.handleEvent = this.handleEvent.bind(this);
        this.start();
    }

    start() {
        this.isIdle = false;
        this.addActivityListeners();
        this.resetTimer();
    }

    stop() {
        clearTimeout(this.timer);
        this.removeActivityListeners();
    }

    resetTimer() {
        clearTimeout(this.timer);
        this.timer = setTimeout(() => this.setIdle(), this.timeout);
    }

    setIdle() {
        this.isIdle = true;
        if (typeof this.onIdle === "function") {
            this.onIdle();
        }
    }

    setActive() {
        if (this.isIdle) {
            this.isIdle = false;
            if (typeof this.onActive === "function") {
                this.onActive();
            }
        }
        this.resetTimer();
    }

    handleEvent() {
        this.setActive();
    }

    addActivityListeners() {
        ["mousemove", "keydown", "scroll", "click", "touchstart"].forEach(event =>
            window.addEventListener(event, this.handleEvent)
        );
    }

    removeActivityListeners() {
        ["mousemove", "keydown", "scroll", "click", "touchstart"].forEach(event =>
            window.removeEventListener(event, this.handleEvent)
        );
    }
}
