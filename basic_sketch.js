// import p5 from 'p5';
// import * as Tone from 'tone';
// import ml5 from 'ml5';
// import Canvas from "./Canvas.js";
import gui_sketch from "./gui.js";
import { Oscilloscope, Spectroscope } from './oscilloscope.js';


let output = new Tone.Multiply(0.1).toDestination()

const vco = new Tone.Oscillator(400).start()
const env = new Tone.Envelope()
const vca = new Tone.Multiply()
vco.connect( vca ), vca.connect( output )
env.connect( vca.factor )

let trigNote = function(){
  env.triggerAttackRelease(0.1)
}

const gui = new p5(gui_sketch)
let freq_knob = gui.Knob({
  label: 'freq', 
  mapto: vco.frequency,
  //callback: function(x){vco.frequency.rampTo(x,10)},
  min:100, max: 1000, curve:2
})


let startEnable = 0
let seq

startButton.addEventListener('click', () => {
  if (startEnable == 0) {
    // Start the hihat if it's not already playing
    Tone.start()
    seq = setInterval( trigNote, 1000)
    console.log('start');
    startEnable = 1
  } else {
    clearInterval( seq )
    console.log('stop');
    startEnable = 0
  }
});

