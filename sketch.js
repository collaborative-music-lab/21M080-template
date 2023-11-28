import gui_sketch from "./gui.js";
import { Oscilloscope, Spectroscope } from './oscilloscope.js';
import { MarkovChain } from './markov.js';

const gui = new p5(gui_sketch)

//Drums audio
let output = new Tone.Multiply(0.1).toDestination()
const vca = new Tone.Multiply(1)
vca.connect( output )

//finally, let's look at audio files
const snare = new Tone.Player("audio/drums-002.mp3")
//snare.start()
snare.connect( vca)

const hat = new Tone.Player("audio/drums-001.mp3")
// hat.start()
hat.connect( vca)

const kick = new Tone.Player("audio/drums-003.mp3")
// kick.start()
kick.connect( vca)

// Example usage
let myMelody = [60, 62, 60, 64, 60, 65, 64, 65, 62, 64, 65, 67, 60, 67, 65, 67, 64, 67, 62, 67, 60, 67, 64, 62, 60, 64, 62, 64, 60, 65, 60, 62, 62, 64, 65, 62, 65, 62, 64, 60, 62, 64, 65, 67, 65, 64, 62, 60, 67, 65, 64, 62, 60, 69, 67, 65, 64, 62, 71, 69, 67, 65, 64, 72, 71, 69, 67, 65, 74, 72, 71, 69, 67, 72, 74, 71, 72, 69, 71, 67, 69, 65, 67, 64, 65, 62, 64, 60, 74, 60, 72, 60, 71, 60, 69, 60, 67, 60, 65, 60]
let markovChain = new MarkovChain(1); // Order of 3
markovChain.createMarkovTable(myMelody)
console.log( markovChain.currentState)

// // Generate a new sequence
let newSequence = markovChain.generateSequence([0,1,2], 10);
console.log(newSequence);

let numBeats = 8
let mode = 'sequence'
let drumBeats = []
let hatMarkov = new MarkovChain(1); // Order of 3
let snareMarkov = new MarkovChain(1); // Order of 3
let kickMarkov = new MarkovChain(1); // Order of 3

function generateDrumMarkov(){
  for(let i=0;i<drumBeats.length;i++){
    hatMarkov.createMarkovTable(makeDrumGrams(drumBeats[i][0]))
    snareMarkov.createMarkovTable(makeDrumGrams(drumBeats[i][1]))
    kickMarkov.createMarkovTable(makeDrumGrams(drumBeats[i][2]))
  }
}

function makeDrumGrams(arr){
  let output = []
  for(let i=0;i<arr.length;i++){
    let prev_note = i>0 ? arr[i-1] : arr[arr.length-1]
    output.push([i, prev_note] )
  }
  console.log(arr,output)
  return output
}

let index = 0
let tempo = 100
const playNote = function() {
  if (mode == 'sequence'){
    if(hh_seq[index] == 1) hat.start()
    if(sd_seq[index] == 1) snare.start()
    if(bd_seq[index] == 1) kick.start()
  }
  else{
    let foo = hatMarkov.getNextState()
    console.log(foo)
    if(foo[1] > 0) hat.start()
    if(snareMarkov.getNextState()[1] > 0) snare.start()
    if(kickMarkov.getNextState()[1] > 0) kick.start()

  }
  index = (index + 1) % numBeats
}

let mySeq = setInterval( playNote, 15000/tempo * 2 )

let hh_seq = new Array(numBeats)
for( let i=0;i<numBeats;i++){
  gui.Toggle({
    label:'',
    x: 5+i*10,
    y: 10,
    callback: function(x){
      hh_seq[i]=x
    }
  })
}

let sd_seq = new Array(numBeats)
for( let i=0;i<numBeats;i++){
  gui.Toggle({
    label:'',
    x: 5+i*10,
    y: 25,
    callback: function(x){
      sd_seq[i]=x
    }
  })
}

let enable_button = gui.Toggle({
    label:'enable',
    x: 50,
    y: 80,
    mapto:vca.factor,
    max: .5
})

let bd_seq = new Array(numBeats)
for( let i=0;i<numBeats;i++){
  gui.Toggle({
    label:'',
    x: 5+i*10,
    y: 40,
    callback: function(x){
      bd_seq[i]=x
    }
  })
}

gui.Momentary({
    label: 'store',
    x: 5,
    y: 60,
    callback: function(x){
      drumBeats.push([hh_seq,sd_seq,bd_seq])
    }
})

gui.RadioButton({
  label:'',
  x: 20,
  y: 60,
  radioOptions: ['sequence', 'markov'],
  callback: function(x){
    mode = x
    if(mode == 'markov') generateDrumMarkov()
  }
})


gui.Knob({
  label:'tempo',
  x:60, y: 60,
  callback: function(x){
    clearInterval( mySeq )
    tempo = x
    mySeq =  setInterval( playNote, 15000/tempo * 2 )
    console.log(tempo, 15000/tempo  )
  },
  min: 30, max: 200, curve: 1.5
})