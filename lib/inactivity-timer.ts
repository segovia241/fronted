type InactivityTimerOptions = {
  timeout: number // in milliseconds
  onTimeout: () => void
  events?: string[]
}

export class InactivityTimer {
  private timer: NodeJS.Timeout | null = null
  private timeout: number
  private onTimeout: () => void
  private events: string[]

  constructor({
    timeout,
    onTimeout,
    events = ["mousedown", "mousemove", "keypress", "scroll", "touchstart", "click"],
  }: InactivityTimerOptions) {
    this.timeout = timeout
    this.onTimeout = onTimeout
    this.events = events
  }

  public start(): void {
    this.resetTimer()
    this.addEventListeners()
  }

  public stop(): void {
    this.removeEventListeners()
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
  }

  private resetTimer(): void {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(() => {
      this.onTimeout()
    }, this.timeout)
  }

  private handleActivity = (): void => {
    this.resetTimer()
  }

  private addEventListeners(): void {
    this.events.forEach((event) => {
      window.addEventListener(event, this.handleActivity)
    })
  }

  private removeEventListeners(): void {
    this.events.forEach((event) => {
      window.removeEventListener(event, this.handleActivity)
    })
  }
}
