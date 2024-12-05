export default class IdleTimer {
    constructor({ timeout = 60000, onIdle = null, onActive = null, storageKey = 'lastActive' } = {}) {
        this.timeout = timeout;
        this.onIdle = onIdle;
        this.onActive = onActive;
        this.storageKey = storageKey;
        this.isIdle = false;
        this.timer = null;
        this.handleEvent = this.handleEvent.bind(this);
        this.checkTabActivity = this.checkTabActivity.bind(this);

        // Start the timer and event listeners
        this.start();
    }

    start() {
        this.isIdle = false;
        this.addActivityListeners();
        this.addStorageListener();
        this.resetTimer();
    }

    stop() {
        clearTimeout(this.timer);
        this.removeActivityListeners();
        this.removeStorageListener();
    }

    resetTimer() {
        clearTimeout(this.timer);
        this.setLastActiveTime();
        this.timer = setTimeout(() => this.setIdle(), this.timeout);
    }

    setIdle() {
        this.isIdle = true;
        this.setLastActiveTime();
        this.triggerIdleEvent();
    }

    setActive() {
        if (this.isIdle) {
            this.isIdle = false;
            this.triggerActiveEvent();
        }
        this.resetTimer();
    }

    setLastActiveTime() {
        const now = Date.now();
        localStorage.setItem(this.storageKey, now);
    }

    checkTabActivity(event) {
        const lastActive = localStorage.getItem(this.storageKey);
        const lastActiveTime = lastActive ? parseInt(lastActive, 10) : 0;
        const inactiveDuration = Date.now() - lastActiveTime;

        // Only send a keep-alive request if all tabs are inactive
        if (inactiveDuration >= this.timeout) {
            if (typeof this.onIdle === 'function') {
                this.onIdle();
            }
        } else {
            // Reset timeout if any tab becomes active
            this.setActive();
        }
    }

    handleEvent() {
        this.setActive();
    }

    triggerIdleEvent() {
        if (typeof this.onIdle === "function") {
            this.onIdle();
        }
    }

    triggerActiveEvent() {
        if (typeof this.onActive === "function") {
            this.onActive();
        }
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

    addStorageListener() {
        window.addEventListener('storage', this.checkTabActivity);
    }

    removeStorageListener() {
        window.removeEventListener('storage', this.checkTabActivity);
    }
}
