import oscilloscoper from './modules/oscilloscope.js'
import domStaver from './modules/staver.js'

import FMSynth from './libs/mohayonao/fm-synth/index.js'
import FMSynthAlgorithms from './libs/mohayonao/fm-synth/algorithms.js'
import Operator from './libs/mohayonao/operator/index.js'


console.log('safari? -','webkitAudioContext' in window)
// const audioContext = 'webkitAudioContext' in window ? new webkitAudioContext() : new AudioContext();

// I ii iii IV V vi (Vii) - in C maj is C Dm Em F G Am Bsus

// a scale is made of 7 notes

// for now the melody will be made by the decimals of lat/long

let audioContext = new AudioContext()

// function Operator(type, freq, gain) {
//   this.oscillator = .createOscillator();
//   this.gain = .createGain();
//   this.oscillator.type = type;
//   // this.oscillator.frequency.value = freq;
//   // this.gain.gain.value = gain;
//   this.ratio = {value : 1}
//   this.oscillator.connect(this.gain)
//   this.oscillator.start(0)
// }

/*
   carrier 1 controls direct frq so 0.5 is half midi note frequency, 2 is double
   modulators control the frq of the next by ratio
*/

// let A = audioContext.createDelay();
let A = new Operator(audioContext);
let B = new Operator(audioContext);
let C = new Operator(audioContext);
let D = new Operator(audioContext);
// let fm = new FMSynth("E-D-C->; B-A->", [ A, B, C, D, 0 ]);
// let fm = new FMSynth("D-C->; B-A->", [ A, B, C, D, 0 ]);
let fm = new FMSynth("D-C-B-A->", [ A, B, C, D, 0 ]);



// let op1 = new Operator('sine', 220, 1)
//
// let op2 = new Operator('sine', 2200, 1)
//
// let op3 = new Operator('sine', 2200, 1)
//
// let op4 = new Operator('sine', 2200, 1)
//
let operators = [A, B, C, D]




const operatorControls = (operator, i) => {
  let operator_no = i+1
  let wave_type = document.querySelector(`#controls-op${operator_no} .wave-type`)
  wave_type.addEventListener('click', ()=> {

    // get index of current wave in array and set next
    let current_wave_i = oscillator_wave_types.indexOf(operator.type)
    current_wave_i === oscillator_wave_types.length-1 ? current_wave_i = 0 : current_wave_i++
    operator.type = oscillator_wave_types[current_wave_i]

    //remove add add wavetypes classes
    oscillator_wave_types.forEach(osw => {wave_type.classList.remove(osw)})
    wave_type.classList.add(oscillator_wave_types[current_wave_i])
  })
  document.querySelector(`#controls-op${operator_no} .gain`).object.attachTo(operators[i].gain)
  // console.log(operators[i].gain)
  operators[i].ratio = {value : 1}
  document.querySelector(`#controls-op${operator_no} .coarse`).object.attachTo(operators[i].ratio)



  return {}
}

console.log(A)

let operator_controls = []

operators.forEach(op => {
  operator_controls.push(operatorControls(op, operators.indexOf(op)))

})



// let osc = .createOscillator()
// osc.type = "sine"
// // const loaded_wave = .createPeriodicWave(imported_wavetable.real, imported_wavetable.imag)
// // osc.setPeriodicWave(loaded_wave)
//
// osc.frequency.value = 220
// osc.start(0)

// op1.gain.connect(osc.frequency)


var filter = audioContext.createBiquadFilter();
filter.frequency.value = 2000;
filter.Q.value = 10;
// op2.gain.connect(op1.oscillator.frequency)
// // osc.connect(filter)
// // // op1.gain.connect(op2.oscillator.frequency)
// // // osc.connect(filter);
// op1.gain.connect(filter)
// // op2.gain.connect(filter)

const masterGain = audioContext.createGain();
masterGain.gain.value = 0.2;
filter.connect(masterGain)
masterGain.connect(audioContext.destination);

fm.connect(filter)
fm.start(0)

oscilloscoper(audioContext, masterGain, document.querySelector('canvas#oscilloscope'))

let playing = false;
let played = false;
document.querySelector('#play').addEventListener('click', ()=>{
  // !played && op1.start(0)
  played = true
  // playing ? masterGain.disconnect(audioContext.destination) : masterGain.connect(audioContext.destination)
  playing ? filter.disconnect(masterGain) : filter.connect(masterGain)
  playing = !playing
})

const changeAlgorithm = () => {

  fm = new FMSynth(FMSynthAlgorithms[4][algorithm], [ A, B, C, D, 0 ]);

  console.log(FMSynthAlgorithms[4][algorithm])
}





//operators can be either carriers (hear) or Modulators (don't hear)
let oscillator_wave_types = ['sine', 'square', 'sawtooth', 'triangle']


let note_frqs = [220.00]
// this method calculates them from the base frq (A)
for (let i = 1; i < 25; i++) {
  note_frqs[i] = note_frqs[0] * Math.pow(2, (i)/12)
  // note_frqs.push(note_frqs[note_frqs.length-1] * Math.pow(2, 1/12)) // this does it sequential
}
console.log(note_frqs)

let random_sequence = new Array()
for (let i = 0; i < 8; i++) {
  let entry = Math.floor(Math.random() * 7)
  random_sequence.push(entry)
}
// random_sequence = [0,1,2,3,4,5,6,7]



// document.querySelectorAll('button.wave-type').forEach(button => {
//
//   button.addEventListener('click',()=>{
//     console.log(button.parentNode)
//     let new_oscillator
//     // button.innerHTML =
//   })
// })


let sequence_i = 0

let major_sequence = [0,2,4,5,7,9,11]
let minor_sequence = [0,2,3,5,7,8,10]
let major_bool = true

let note_names = ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#']
//                 0   1    2   3   4    5   6    7   8   9    10  11
let key_note = 'A'
let key_value = 0


// domStaver.updateStaveNotes(dom.status.notes, random_sequence, key_value)

let maj_button = document.querySelector('button#majmin')
maj_button.addEventListener('click', () => {
  major_bool = !major_bool
  maj_button.innerHTML = major_bool ? 'major' : 'minor'
  dom.status.key.innerHTML = `${key_note}${key_note.length===1?'&nbsp;':''}${major_bool?'maj':'min'}`
  domStaver.updateSharpsAndFlats(dom.status.sharpsandflats, domStaver.findSharpsAndFlats(key_value, major_bool))
})
document.querySelector('input#slider-key').addEventListener('input', () => {
  key_note = note_names[event.target.value]
  key_value = parseInt(event.target.value)
  dom.status.key.innerHTML = `${key_note}${key_note.length===1?'&nbsp;':''}${major_bool?'maj':'min'}`
  domStaver.updateSharpsAndFlats(dom.status.sharpsandflats, domStaver.findSharpsAndFlats(key_value, major_bool))
  // domStaver.updateStaveNotes(dom.status.notes, random_sequence, key_value)
})

const testSequencer = () => {
  // assings sequence to minor or major tones
  let key_note_sequence = major_bool ? major_sequence : minor_sequence

  // loop reset
  if (sequence_i === 8) {sequence_i = 0}

  let note_index = random_sequence[(sequence_i%key_note_sequence.length)]

  let frq = Math.round(note_frqs[key_note_sequence[note_index] + key_value] * Math.pow(10,2)) / Math.pow(10,2)
  operators.forEach(op => {
    op.frequency.value = frq * op.ratio.value
  })

  sequence_i++
}
setInterval(testSequencer, 200)

// let domControls = [{dom:'#slider-op1', action: ()=>{
//   op2.gain.gain.value = event.target.value * 5
//   console.log(event)
// }}]
// domControls.forEach(one => {
//   console.log(one)
//   document.querySelector(one.dom).addEventListener('input', ()=>{console.log(1)})
// })

document.querySelector('input#slider-note').addEventListener('input', () => {
  // osc.frequency.value = note_frqs[event.target.value]
  op1.oscillator.frequency.value = note_frqs[event.target.value]
})

document.querySelector('input#slider-volume').addEventListener('input', () => {
  op1.gain.gain.value = event.target.value * 5
})

// document.querySelector('#slider-op1').addEventListener('input', ()=>{
//   op1.oscillator.frequency.value = event.target.value * 100;
// })
// document.querySelector('#slider-op2').addEventListener('input', ()=>{
//   op2.oscillator.frequency.value = event.target.value * 100;
// })
// document.querySelector('#slider-op2-gain').addEventListener('input', ()=>{
//   // op2.oscillator.frequency.value = event.target.value * 1;
//   // op2.gain.gain.value = event.target.value * 5;
//    op2.gain.gain.value = event.target.value * 5;
// })


// document.querySelector('#volume-knob').object.attachTo(op1.gain.gain)
document.querySelector('#volume-knob').object.attachTo(masterGain.gain)


// Major Key is C D E  F G A B - or 0 2 4 5 7 9 11
// Minor key is C D Eb F G Ab Bb - or 0 2 3 5 7 8 10

let algorithm = 0;
let total_algorithms = 11
let image_widths = [10,14,14,14,14,14,20,14,20,20,26]
console.log(image_widths.reduce((total, num)=>{return total + num}))
for (let i = 0; i < total_algorithms; i++) {

  let total_width = dom.controls.algorithm_cont.clientWidth
  let child = document.createElement('span')
  if (i === algorithm) {child.classList.add('selected')}
  child.style.display = 'inline-block'
  child.style.height = '100%';
  child.style.width = image_widths[i] / 180 * (total_width) + 'px'
  // let widths_so_far = image_widths.slice(0,i)
  // let width_so_far = i===0 ? 0 : widths_so_far.reduce((total, num)=>{return total + num})
  // child.style.backgroundPosition = 0 + (width_so_far / 1.80) + '%'

  dom.controls.algorithm_cont.appendChild(child)
  child.style.backgroundPosition = 0 - child.offsetLeft + 'px'
  child.addEventListener('click', ()=>{
    // console.log(total_width)
    console.log(i)
    algorithm = i

    Array.from(child.parentNode.children).forEach(child => {
      child.classList.remove('selected')
    })
    child.classList.add('selected')
    // console.log(child.offsetLeft)
    changeAlgorithm(i)
  })
}
// let algorithms = ['¥>$>£>€-', '€$£¥<br />||||', '€>$-<br />£>¥-']
// dom.controls.algorithm_button = document.querySelector('#algo-button')
// dom.controls.algorithm_button.innerHTML = algorithms[algorithm]
// dom.controls.algorithm_button.addEventListener('click', () => {
//   algorithm+1 === algorithms.length ? algorithm = 0 : algorithm++
//   dom.controls.algorithm_button.innerHTML = algorithms[algorithm]
// })
