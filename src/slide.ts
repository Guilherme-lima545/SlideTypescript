import Timeout from "./Timeout.js"

export default class Slide {
    container: Element
    slides: Element[]
    controls: Element
    time: number
    index: number
    slide: Element
    timeout: Timeout | null
    pausedTimeout: Timeout | null
    paused: boolean
    thumbitems: HTMLElement[] | null
    thumb: HTMLElement | null

    constructor(container: Element, slides: Element[], controls: Element, time: number = 7000) {
    this.container = container
    this.slides = slides
    this.controls = controls
    this.time = time
    this.timeout = null
    this.pausedTimeout = null
    this.index = localStorage.getItem("activeSlide")? Number(localStorage.getItem("activeSlide")): 0;
    this.slide = this.slides[this.index]
    this.paused = false

    this.thumbitems = null;
    this.thumb = null

    this.init()
    }


    hide(el: Element) {
        el.classList.remove("active")
        if(el instanceof HTMLVideoElement) {
            el.currentTime = 0
            el.pause()
        }
    }

    show(index: number) {
        this.index = index;
        this.slide = this.slides[this.index]
        localStorage.setItem("activeSlide", String(this.index))

        if(this.thumbitems) {
            this.thumb = this.thumbitems[this.index]
            this.thumbitems.forEach(el => el.classList.remove("active"))
            this.thumb.classList.add("active")
        }
        this.slides.forEach((el) => this.hide(el))
        this.slide.classList.add("active")
        if(this.slide instanceof HTMLVideoElement) {
            this.autoVideo(this.slide)

        } else {
         this.auto(this.time)
        }
        
    }

    autoVideo(video: HTMLVideoElement) {
        video.muted = true;
        video.play();
        let firstplay = true
        video.addEventListener("playing", () => {
            if(firstplay) this.auto(video.duration * 1000)
                firstplay = false
        })
        
    }

    auto(time: number) {
        this.timeout?.clear()
        this.timeout = new Timeout(() => this.next(), time)
    }

    prev() {
        if(this.paused) return;
        const prev = this.index > 0 ? this.index - 1 : this.slides.length - 1
        this.show(prev)
    }
    next() {
        if(this.paused) return;
        const next = (this.index + 1) < this.slides.length ? this.index + 1 : 0
        this.show(next)
    }

    pause() {
        this.paused = true
        this.pausedTimeout = new Timeout(() => {
            this.timeout?.pause()
            this.paused = true
            if(this.slide instanceof HTMLVideoElement) this.slide.pause()
        }, 500)
    }

    continue() {
        this.paused = false
        this.pausedTimeout?.clear()
        if(this.paused) {
            this.paused = false
            this.timeout?.continue();
            if(this.slide instanceof HTMLVideoElement) this.slide.play()
        }
    
    }

    private addControls() {
        const prevButton = document.createElement("button");
        const nextButton = document.createElement("button");
        prevButton.innerText = "Slide Anterior"
        nextButton.innerText = "Proximo Slide"
        this.controls.appendChild(prevButton);
        this.controls.appendChild(nextButton)

        nextButton.addEventListener("pointerup", () => this.next());
        prevButton.addEventListener("pointerup", () => this.prev());

        this.controls.addEventListener("pointerdown", () => this.pause())
        this.controls.addEventListener("pointerup", () => this.continue())

    }

    private addThumbItems() {
        const thumbContainer = document.createElement("div")
        thumbContainer.id = "slide=tumb"
        for (let i = 0; i < this.slides.length, i++;) {
           thumbContainer.innerHTML = `<span><span class="thumb-item></span></span>`
        }
        this.controls.appendChild(thumbContainer)
        this.thumbitems = Array.from(document.querySelectorAll("thumb-item"))
    }

    private init() {
        this.addControls()
        this.show(this.index)
        this.addThumbItems();
    }
}