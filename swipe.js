(function swipe() {
    this.x = null;
    this.y = null;
    this.startEl = null;

    const swipeLeft = new CustomEvent('swipe-left', { bubbles: true, cancelable: true});
    const swipeRight = new CustomEvent('swipe-right', { bubbles: true, cancelable: true});
    const swipeTop = new CustomEvent('swipe-top', { bubbles: true, cancelable: true});
    const swipeBottom = new CustomEvent('swipe-bottom', { bubbles: true, cancelable: true});

    document.addEventListener('touchstart', (e) => {
        const {clientX, clientY} = e.touches[0];
        this.x = clientX;
        this.y = clientY;
        this.startEl = e.target;
    })

    document.addEventListener("touchmove", (e) => {
        if (!this.x || !this.y) {
            return;
        }

        const x1 = e.touches[0].clientX;
        const y1 = e.touches[0].clientY;

        const xDiff = this.x - x1;
        const yDiff = this.y - y1;

        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {
            if ( xDiff > 0 ) {
                this.startEl.dispatchEvent(swipeRight)
            } else {
                this.startEl.dispatchEvent(swipeLeft)
            }
        } else {
            if ( yDiff > 0 ) {
                this.startEl.dispatchEvent(swipeBottom)
            } else {
                this.startEl.dispatchEvent(swipeTop)
            }
        }
        this.x = null;
        this.y = null;
        this.startEl = null;
    })
})()
