class Timer {
  // constructor --> arguments : DOM elements
  constructor(durationInput, startButton, pauseButton, callback) {
    if (callback) {
      this.onTick = callback.onTick;
    }

    this.durationInput = durationInput;
    this.startButton = startButton;
    this.pauseButton = pauseButton;

    this.startButton.addEventListener("click", this.start);
    this.pauseButton.addEventListener("click", this.pause);
  }
  // getters & setters
  get timeRemaining() {
    return parseFloat(this.durationInput.value);
  }

  set timeRemaining(time) {
    this.durationInput.value = time;
  }

  // methods utils
  start = () => {
    this.tick();

    this.interval = setInterval(this.tick, 1000); // 1 sec
  };
  pause = () => {
    clearInterval(this.interval);
  };

  tick = () => {
    this.onTick(this.timeRemaining);
    const timeRemaining = this.timeRemaining;
    this.timeRemaining -= 1;

    if (this.timeRemaining == 0) {
      this.pause();
      circle.setAttribute("stroke-dashoffset", perimeter); // so we fill all the circle at the end (to much math:)
    }
  };
}
// HTML elements
const durationInput = document.querySelector("#duration");
const startButton = document.querySelector("#start");
const pauseButton = document.querySelector("#pause");

// animation variables
const circle = document.querySelector("circle");
const perimeter = circle.getAttribute("r") * 2 * Math.PI;
circle.setAttribute("stroke-dasharray", perimeter);

const duration = parseFloat(durationInput.value); // MUST HAVE in order for the animation not to refill after pausing

// instantiation
const timer = new Timer(durationInput, startButton, pauseButton, {
  onTick(timeRemaining) {
    circle.setAttribute(
      "stroke-dashoffset",
      (perimeter * timeRemaining) / duration - perimeter
    );
  },
});
