export class DarkModeObserver {
    darkOn: Function;
    darkOff: Function;
    observer: MutationObserver | null;
    lastClassState: boolean


    constructor(darkOn: Function, darkOff: Function) {
        this.darkOn = darkOn
        this.darkOff = darkOff
        this.observer = null
        this.lastClassState = document.documentElement.classList.contains('dark')

        this.init()
    }

    init() {
        this.observer = new MutationObserver(this.mutationCallback)
        this.observe()
    }

    observe() {
        this.observer!.observe(document.documentElement, { attributes: true })
    }

    disconnect() {
        this.observer!.disconnect()
    }

    mutationCallback = (mutationsList: MutationRecord[]) => {
        for(let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                let currentClassState = (mutation.target as HTMLElement).classList.contains("dark")
                if(this.lastClassState !== currentClassState) {
                    this.lastClassState = currentClassState
                    if(currentClassState) {
                        this.darkOn()
                    }
                    else {
                        this.darkOff()
                    }
                }
            }
        }
    }
}