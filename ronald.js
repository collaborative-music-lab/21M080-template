// import p5 from 'p5';
// import * as Tone from 'tone';
// import ml5 from 'ml5';
// import Canvas from "./Canvas.js";
import gui_sketch from "./gui.js";
import { Oscilloscope, Spectroscope } from './oscilloscope.js';
const gui = new p5(gui_sketch)

const vco = new Tone.PulseOscillator().start()
const vcf = new Tone.Filter()
const vca = new Tone.Multiply()
const output = new Tone.Multiply(0.05).toDestination()
const reverb = new Tone.Reverb()

vco.connect(vcf)
vcf.connect(vca)
vca.connect(reverb)
reverb.connect(output)

let env = new Tone.Envelope()
let filter_env_depth = new Tone.Multiply()
const cutoff = new Tone.Signal()
env.connect(vca.factor)
env.connect(filter_env_depth)
filter_env_depth.connect(vcf.frequency)
cutoff.connect(vcf.frequency)

let lfo = new Tone.Oscillator().start()
const pwm_lfo_depth = new Tone.Multiply()
const vcf_lfo_depth = new Tone.Multiply()
lfo.connect(pwm_lfo_depth)
lfo.connect(vcf_lfo_depth)
pwm_lfo_depth.connect(vco.width)
vcf_lfo_depth.connect(vcf.frequency)

const freq = new Tone.Signal()
freq.connect(vco.frequency)

const vco2 = new Tone.Oscillator().start()
vco2.connect(vcf)
vco2.type = 'square'

const freq2ratio = new Tone.Multiply(1)
freq.connect(freq2ratio), freq2ratio.connect(vco2.frequency)
freq2ratio.factor.value = 1.01

const vco3 = new Tone.Oscillator().start()
vco3.connect(vcf)
vco3.type = 'square'

const freq3ratio = new Tone.Multiply(1)
freq.connect(freq3ratio), freq3ratio.connect(vco3.frequency)
freq3ratio.factor.value = 1.03

// let scope = new Oscilloscope('Canvas2')
// scope.start()
// vco.connect(scope.analyserNode)

// let spectrum = new Spectroscope('Canvas3')
// spectrum.start()
// vcf.connect(spectrum.analyserNode)
// spectrum.maxFrequency = 20000

// Sequencer
const noteFrequencies = {
  "C4": 261.63, 
  "D4": 293.66, 
  "E4": 329.63, 
  "F4": 349.23,
  "G4": 392.00,
  "A4": 440.00, 
  "pause": 0.0,
}

let index = 0

const twinklestar = [
  "C4", "C4", "G4", "G4",
  "A4", "A4", "G4", "pause", "F4",
  "F4", "E4", "E4", "D4",
  "D4", "C4", "pause", "G4", "G4",
  "F4", "F4", "E4", "E4",
  "D4", "pause",
  "G4", "G4", "F4", "F4",
  "E4", "E4", "D4", "pause", "C4", "C4", "G4", "G4",
  "A4", "A4", "G4", "pause", "F4",
  "F4", "E4", "E4", "D4",
  "D4", "C4", "pause", "pause", "pause"
];

const playNote = function() {
  if (twinklestar[index] !== "pause"){
    freq.value = noteFrequencies[twinklestar[index]]
    env.triggerAttackRelease(0.1)
  }
  index = (index + 1) % twinklestar.length
  
}

const interval = 480
setInterval( playNote, interval )

let cutoff_knob = gui.Knob({
  label:'cutoff',
  mapto: cutoff,
  x: 30,
  y: 70,
  size: 0.5,
  min: 50,
  max: 2000,
})

let vcf_env_depth = gui.Knob({
  label:'vcf env',
  mapto: filter_env_depth.factor,
  x: 50,
  y: 70,
  size: 0.5,
  min: 0,
  max: 10000,
})

let pwm_lfo_knob = gui.Knob({
  label:'pwm depth',
  mapto: pwm_lfo_depth.factor,
  x: 50,
  y: 20,
  size: 0.5,
  min: 0,
  max: 1,
})

let lfo_width_knob = gui.Knob({
  label: 'vcf depth',
  mapto: vcf_lfo_depth.factor,
  x: 70,
  y: 20,
  size: 0.5,
  min: 0,
  max: 3000,
})

let lfo_rate_knob = gui.Knob({
  label:'lfo rate',
  mapto: lfo.frequency,
  x: 70,
  y: 70,
  size: 0.5,
  min: 0,
  max: 10,
})

let resonance_knob = gui.Knob({
  label:'Q',
  mapto: vcf.Q,
  x: 10,
  y: 70,
  size: 0.5,
  min: 0,
  max: 20,
})

let reverb_wet_knob = gui.Knob({
  label:'reverb wet',
  mapto: reverb.wet,
  x: 30,
  y: 20,
  size: 0.5,
  min: 0,
  max: 1,
})

let reverb_knob = gui.Knob({
  label:reverb,
  x: 10, 
  y: 20, 
  size: 0.5,
  min: 0, 
  max: 20,
  callback: function(x){reverb.decay = x}
})

let wave_radio = gui.RadioButton({
  label:'waveform',
  radioOptions: ['sine','sawtooth','square','triangle'],
  callback: function(x){ 
    vco2.type = x
    vco3.type = x
  },
  size: 1.5,
  x: 90, 
  y: 50,
})


