"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Slide {
    constructor(container, slides, controls, time = 7000) {
        this.container = container;
        this.slides = slides;
        this.controls = controls;
        this.time = time;
        this.index = 0;
        this.slide = this.slides[this.index];
        this.show(this.index);
        this.init();
    }
    hide(el) {
        el.classList.remove("active");
    }
    show(index) {
        this.index = index;
        this.slide = this.slides[this.index];
        this.slides.forEach((el) => this.hide(el));
        this.slide.classList.add("active");
    }
    prev() {
        this.show(this.index - 1);
    }
    next() {
        this.show(this.index + 1);
    }
    addControls() {
        const prevButton = document.createElement("button");
        const nextButton = document.createElement("button");
        prevButton.innerText = "Slide Anterior";
        nextButton.innerText = "Proximo Slide";
        this.controls.appendChild(prevButton);
        this.controls.appendChild(nextButton);
        nextButton.addEventListener("pointerup", () => this.next());
        prevButton.addEventListener("pointerup", () => this.prev());
    }
    init() {
        this.addControls();
        this.show(this.index);
    }
}
exports.default = Slide;
