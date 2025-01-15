import Component from "./component.js";

export default class AudioManager extends Component {
  volume = 0.5;
  audioBank = {
    music: {},
    sfx: {
      vacuumIn: new Audio("audio/vacuum_in.wav"),
      vacuumOut: new Audio("audio/vacuum_out.wav"),
      metalPlace: new Audio("audio/metal_place.mp3"),
      sizzle: new Audio("audio/sizzle.wav"),
      won: new Audio("audio/won.mp3"),
    },
  };

  constructor() {
    super();
  }

  start() {
    console.log("Audio manager started");

    for (let key in this.audioBank.sfx) {
      this.audioBank.sfx[key].volume = this.volume;
    }

    this.audioBank.music.volume = this.volume;
  }

  playSFX(audio) {
    this.audioBank.sfx[audio].play();
  }
}
