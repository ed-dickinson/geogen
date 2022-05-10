import oscilloscoper from './modules/oscilloscope.js'
import domStaver from './modules/staver.js'

console.log('safari? -','webkitAudioContext' in window)
// const audioContext = 'webkitAudioContext' in window ? new webkitAudioContext() : new AudioContext();

// I ii iii IV V vi (Vii) - in C maj is C Dm Em F G Am Bsus

// a scale is made of 7 notes

// for now the melody will be made by the decimals of lat/long

let context = new AudioContext()

function Operator(type, freq, gain) {
  this.oscillator = context.createOscillator();
  this.gain = context.createGain();
  this.oscillator.type = type;
  // this.oscillator.frequency.value = freq;
  // this.gain.gain.value = gain;
  this.ratio = 1
  this.oscillator.connect(this.gain)
  this.oscillator.start(0)
}

/*
   carrier 1 controls direct frq so 0.5 is half midi note frequency, 2 is double
   modulators control the frq of the next by ratio
*/

let op1 = new Operator('sine', 220, 1)

let op2 = new Operator('sine', 2200, 1)

let op3 = new Operator('sine', 2200, 1)

let op4 = new Operator('sine', 2200, 1)

let operators = [op1, op2, op3, op4]

const operatorControls = (operator, i) => {
  let operator_no = i+1
  let wave_type = document.querySelector(`#controls-op${operator_no} .wave-type`)
  wave_type.addEventListener('click', ()=> {

    let current_wave_i = oscillator_wave_types.indexOf(operator.oscillator.type)
    current_wave_i === oscillator_wave_types.length-1 ? current_wave_i = 0 : current_wave_i++
    operator.oscillator.type = oscillator_wave_types[current_wave_i]
    wave_type.innerHTML = oscillator_wave_types[current_wave_i]

  })
  return {}
}

let operator_controls = []

operators.forEach(op => {
  operator_controls.push(operatorControls(op, operators.indexOf(op)))
})



// let osc = context.createOscillator()
// osc.type = "sine"
// // const loaded_wave = context.createPeriodicWave(imported_wavetable.real, imported_wavetable.imag)
// // osc.setPeriodicWave(loaded_wave)
//
// osc.frequency.value = 220
// osc.start(0)

// op1.gain.connect(osc.frequency)


var filter = context.createBiquadFilter();
filter.frequency.value = 2000;
filter.Q.value = 10;
// op2.gain.connect(op1.oscillator.frequency)
// // osc.connect(filter)
// // // op1.gain.connect(op2.oscillator.frequency)
// // // osc.connect(filter);
// op1.gain.connect(filter)
// // op2.gain.connect(filter)

const masterGain = context.createGain();
masterGain.gain.value = 0.2;
filter.connect(masterGain)
masterGain.connect(context.destination);

oscilloscoper(context, masterGain, document.querySelector('canvas#oscilloscope'))

let playing = false;
let played = false;
document.querySelector('#play').addEventListener('click', ()=>{
  // !played && op1.start(0)
  played = true
  // playing ? masterGain.disconnect(context.destination) : masterGain.connect(context.destination)
  playing ? filter.disconnect(masterGain) : filter.connect(masterGain)
  playing = !playing
})

const changeAlgorithm = () => {
  operators.forEach(op => {op.gain.disconnect()})
  switch(algorithm) {

    case 0:
      op4.gain.connect(op3.oscillator.frequency)
      op3.gain.connect(op2.oscillator.frequency)
      op2.gain.connect(op1.oscillator.frequency)
      op1.gain.connect(filter)
      break;
    case 1:
      op4.gain.connect(op2.oscillator.frequency)
      op3.gain.connect(op2.oscillator.frequency)
      op2.gain.connect(op1.oscillator.frequency)
      op1.gain.connect(filter)
      break;
    case 5:
      op4.gain.connect(op3.oscillator.frequency)
      op3.gain.connect(op2.oscillator.frequency)
      op2.gain.connect(filter)
      op1.gain.connect(filter)
      break;
    case 7:
      op4.gain.connect(op3.oscillator.frequency)
      op3.gain.connect(filter)
      op2.gain.connect(op1.oscillator.frequency)
      op1.gain.connect(filter)
      break;
    case 9:
      op4.gain.connect(op3.oscillator.frequency)
      op3.gain.connect(filter)
      op2.gain.connect(filter)
      op1.gain.connect(filter)
      break;
    case 10:
      op4.gain.connect(filter)
      op3.gain.connect(filter)
      op2.gain.connect(filter)
      op1.gain.connect(filter)
      break;
  }
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
  let key_note_sequence = major_bool ? major_sequence : minor_sequence


  // loop reset
  if (sequence_i === 8) {sequence_i = 0}

  let note_index = random_sequence[(sequence_i%key_note_sequence.length)]

  // console.log(note_index + key_value, typeof key_value, typeof note_index)

  let frq = Math.round(note_frqs[note_index + key_value] * (10 ^ 2)) / (10 ^ 2)
  op1.oscillator.frequency.value = frq * op1.ratio
  op2.oscillator.frequency.value = frq * op2.ratio
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
  // console.log(op1)
  op1.gain.gain.value = event.target.value * 5
  // console.log(op1)
})

document.querySelector('#slider-op1').addEventListener('input', ()=>{
  op1.oscillator.frequency.value = event.target.value * 100;
})
document.querySelector('#slider-op2').addEventListener('input', ()=>{
  op2.oscillator.frequency.value = event.target.value * 100;
})
document.querySelector('#slider-op2-gain').addEventListener('input', ()=>{
  // op2.oscillator.frequency.value = event.target.value * 1;
  // op2.gain.gain.value = event.target.value * 5;
   op2.gain.gain.value = event.target.value * 5;
})


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

const trackMouseMove = () => {
  console.log('moved', mouse_movement.mousedown.x - event.y)
}
const endMouseMove = () => {
  window.removeEventListener('mousemove', knob_obj.trackMouseMove)
  window.removeEventListener('mouseup', endMouseMove)
}

let mouse_movement = {
  mousedown : {x : null, y : null},
  // mouseup : {x : null, y : null}
}

function CustomKnob(min, max, value, knob_dom, display_dom) {
  this.min = min
  this.max = max
  this.value = value
  let rotation_limit = 150
  this.rotate = () => {
    let range = this.max - this.min
    let ratio = this.value / range
    let rotation = -150 + (ratio * 300)
    knob_dom.style.transform = `rotate(${this.value}deg)`

  }
  this.trackMouseMove = () => {
    let moved = mouse_movement.mousedown.x - event.y
    console.log('moved', moved)
    // if (this.value > this.min && this.value < this.max) {
      this.value = this.reference_value + moved
      // knob_dom.style.transform = `rotate(${this.value}deg)`
      this.rotate(this.value)
      display_dom.innerHTML = this.value
    // }

  }
  this.endMouseMove = () => {
    window.removeEventListener('mousemove', this.trackMouseMove)
    window.removeEventListener('mouseup', this.endMouseMove)
  }
}

document.querySelectorAll('.custom-knob').forEach(knob => {

  let knob_dom = knob
  let display_dom = document.createElement('span')
  let knob_container = document.createElement('span')
  knob_dom.parentNode.insertBefore(knob_container, knob_dom)
  knob_dom.parentNode.removeChild(knob)
  knob_container.appendChild(knob_dom)
  knob_container.appendChild(display_dom)

  let knob_obj = new CustomKnob(parseInt(knob.attributes.min.value), parseInt(knob.attributes.max.value), parseInt(knob.attributes.value.value), knob_dom, display_dom)
  knob.addEventListener('mousedown', () => {
    console.log(knob.attributes)
    mouse_movement.mousedown = {x : event.x ,y : event.y}
    knob_obj.reference_value = knob_obj.value
    window.addEventListener('mousemove', knob_obj.trackMouseMove)
    window.addEventListener('mouseup', knob_obj.endMouseMove)
  })
  console.log(knob)
})
