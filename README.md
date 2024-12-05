# idletimer
A modern implementation of my old [jquery-idletimer library](https://github.com/thorst/jquery-idletimer)

Add reference in your html:
```html
<script type="module" src="./idletimer.js"></script>
```

Here is what your js code will look like:
```javascript
import IdleTimer from "./idletimer.js";

// Initialize the idle timer
const idleTimer = new IdleTimer({
    timeout: 300000, // 5 minutes
    onIdle: () => {
        console.log('User is idle');
        // Send keep-alive or log out the user, etc.
        // fetch('/keep-alive');
    },
    onActive: () => {
        console.log('User is active again');
        // Send any other requests as needed
    }
});

// To stop the idle timer (if needed)
setTimeout(() => {
    idleTimer.stop();
    console.log("Idle timer stopped.");
}, 3600000); // Stop after 1 hour

```