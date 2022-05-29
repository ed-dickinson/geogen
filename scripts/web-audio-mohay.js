// add a big ranom chordal pad in like a beat long maybe


import oscilloscoper from './modules/oscilloscope.js'
import domStaver from './modules/staver.js'

import FMSynth from './libs/mohayonao/fm-synth/index.js'
import FMSynthAlgorithms from './libs/mohayonao/fm-synth/algorithms.js'
import Operator from './libs/mohayonao/operator/index.js'


// lat/ long will be like : 55.8347224 -4.2618284, so a whole value of 1 or 2 or 3 digits
// long can be up to 360 (or 180 and -180)
// lat can be between 90 and -90
// - then 7 decimal places

console.log('safari? -','webkitAudioContext' in window)
// const audioContext = 'webkitAudioContext' in window ? new webkitAudioContext() : new AudioContext();

// I ii iii IV V vi (Vii) - in C maj is C Dm Em F G Am Bsus

// a scale is made of 7 notes

// for now the melody will be made by the decimals of lat/long

let lat = 55.8347224
let long = -4.2618284

const createFakeLatLong = () => {
  lat = parseFloat((Math.random()*360 - 180).toFixed(7))
  long = parseFloat((Math.random()*180 - 90).toFixed(7))
}
createFakeLatLong()
console.log(lat, long)


let audioContext = new AudioContext()

/*
   carrier 1 controls direct frq so 0.5 is half midi note frequency, 2 is double
   modulators control the frq of the next by ratio
*/

/*
Operator
    constructor(audioContext: AudioContext)
  Instance attribute
    context: AudioContext
    type: string
    frequency: AudioParam
    detune: AudioParam
    gain: AudioParam
    onended: function
  Instance methods
    connect(destination: AudioNode): void
    disconnect(): void
    start(when: number): void
    stop(when: number): void
    setPeriodicWave(periodicWave: PeriodicWave): void
    setEnvelope(envelope: any, target: string = 'gain'): void
    getEnvelope(target: string = 'gain'): void
*/
/*
FMSynth = Operator
    constructor(algorithm: number|string, operators: any[])
  Instance attribute
    context: AudioContext
    operators: any[]
    algorithm: string
    onended: function
  Instance methods
    connect(destination: AudioNode): void
    disconnect(): void
    start(when: number): void
    stop(when: number): void
*/

// let A = audioContext.createDelay();
let A = new Operator(audioContext);
let B = new Operator(audioContext);
let C = new Operator(audioContext);
let D = new Operator(audioContext);

let fm = new FMSynth("D-C-B-A->", [ A, B, C, D, 0 ]);

let operators = [A, B, C, D]

let E = new Operator(audioContext);
let F = new Operator(audioContext);
let G = new Operator(audioContext);
let H = new Operator(audioContext);

let fm2 = new FMSynth("D-C-B-A->", [ E, F, G, H, 0 ]);

let fm2operators = [E, F, G, H]

let I = new Operator(audioContext);
let J = new Operator(audioContext);
let K = new Operator(audioContext);
let L = new Operator(audioContext);

let fm3 = new FMSynth("D-C-B-A->", [ I, J, K, L, 0 ]);

let fm3operators = [I, J, K, L]


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
  document.querySelector(`#controls-op${operator_no} .gain`).object.attachTo(operator.gain)
  // console.log(operators[i].gain)
  operator.ratio = {value : 1}
  document.querySelector(`#controls-op${operator_no} .coarse`).object.attachTo(operator.ratio)

  return {}
}


let operator_controls = []

operators.forEach(op => {
  // operator_controls.push(operatorControls(op, operators.indexOf(op)))
  operatorControls(op, operators.indexOf(op))

})
fm2operators.forEach(op => {
  operatorControls(op, fm2operators.indexOf(op) + 4)
})
// console.log(A)
A.ratio.value = 0.5
B.ratio.value = 2
E.ratio.value = 2
E.gain.value = 0.5
F.ratio.value = 4

I.ratio = {value : 1}
J.ratio = {value : 4}
K.ratio = {value : 4}
L.ratio = {value : 1}

// let osc = .createOscillator()
// osc.type = "sine"
// // const loaded_wave = .createPeriodicWave(imported_wavetable.real, imported_wavetable.imag)
// // osc.setPeriodicWave(loaded_wave)
//
// osc.frequency.value = 220
// osc.start(0)

// op1.gain.connect(osc.frequency)


var filter = audioContext.createBiquadFilter();
filter.frequency.value = 1000;
filter.Q.value = 10;
// op2.gain.connect(op1.oscillator.frequency)
// // osc.connect(filter)
// // // op1.gain.connect(op2.oscillator.frequency)
// // // osc.connect(filter);
// op1.gain.connect(filter)
// // op2.gain.connect(filter)

async function createReverb(path) {
  let convolver = audioContext.createConvolver()
  let response = await fetch(path)
  let arraybuffer = await response.arrayBuffer()
  convolver.buffer = await audioContext.decodeAudioData(arraybuffer)

  return convolver
}

let reverb = await createReverb('./assets/impulse_responses/Musikvereinsaal.wav')
let reverb2 = await createReverb('./assets/impulse_responses/Rays.wav')
let reverb3 = await createReverb('./assets/impulse_responses/Going Home.wav')

// reverb.connect(fm1Gain)

let mix = {fm : 1 , fm2 : 1, fm3 : 0.5}

const masterGain = audioContext.createGain();
masterGain.gain.value = 0.2;
// filter.connect(masterGain)
masterGain.connect(audioContext.destination);

fm.connect(filter)
fm.start(0)

var fm2filter = audioContext.createBiquadFilter();
fm2filter.frequency.value = 2000;
fm2filter.Q.value = 10;

// fm2filter.connect(masterGain)

fm2.connect(fm2filter)
fm2.start(0)

const fm1Gain = audioContext.createGain()
fm1Gain.gain.value = 1
// filter.connect(fm1Gain)
filter.connect(reverb)
reverb.connect(fm1Gain)
fm1Gain.connect(masterGain)

const fm2Gain = audioContext.createGain()
fm2Gain.gain.value = 1
// fm2filter.connect(fm2Gain)
fm2filter.connect(reverb2)
reverb2.connect(fm2Gain)
fm2Gain.connect(masterGain)

var fm3filter = audioContext.createBiquadFilter();
fm3filter.frequency.value = 2000;
fm3filter.Q.value = 10;

fm3.connect(fm3filter)
fm3.start(0)

const fm3gain = audioContext.createGain()
fm3gain.gain.value = mix.fm3
fm3filter.connect(reverb3)
reverb3.connect(fm3gain)
fm3gain.connect(masterGain)



oscilloscoper(audioContext, masterGain, document.querySelector('canvas#oscilloscope'))

let playing = false;
let played = false;
let unplayed = true;
document.querySelector('#play').addEventListener('click', ()=>{
  let unplayed_check = unplayed
  unplayed ? unplayed = false : ''
  if (unplayed_check) {
    fm.start(0)
    fm2.start(0)
    fm3.start(0)
  }
  // unplayed = false
  // !played && op1.start(0)
  played = true
  // playing ? masterGain.disconnect(audioContext.destination) : masterGain.connect(audioContext.destination)
  playing ? filter.disconnect(masterGain) : filter.connect(masterGain)
  playing = !playing
})

const changeAlgorithm = () => {

  fm = new FMSynth(FMSynthAlgorithms[4][algorithm], [ A, B, C, D, 0 ]);
  // fm2 = new FMSynth(FMSynthAlgorithms[4][algorithm], [ E, F, G, H, 0 ]);

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

let random_sequence = new Array()
for (let i = 0; i < 8; i++) {
  let entry = Math.floor(Math.random() * 7)
  random_sequence.push(entry)
}
// console.log(random_sequence)

let lat_sequence = new Array()
let lat_decimals = lat.toString().split('.')[1]
lat_decimals += lat_decimals[6]
for (let i = 0; i < 8; i++) {
  lat_sequence.push(parseInt(lat_decimals[i]))
}

let long_sequence = new Array()
let long_decimals = long.toString().split('.')[1]
for (let i = 0; i < 8; i++) {
  long_sequence.push(parseInt(long_decimals[i]))
}
// console.log(long_sequence)

// lat_sequence = [8, 3, 4, 7, 2, 2, 4, 4]
// console.log(lat_sequence)
// for (let)
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

let major_sequence = [0,2,4,5,7,9,11, 12,14,16]
let minor_sequence = [0,2,3,5,7,8,10, 12,14,15]
let major_bool = true

let note_names = ['A','A#','B','C','C#','D','D#','E','F','F#','G','G#']
//                 0   1    2   3   4    5   6    7   8   9    10  11
let key_note = 'A'
let key_value = 0


// domStaver.updateStaveNotes(dom.status.notes, random_sequence, key_value)

const updateKey = (key_value) => {
  dom.status.key.innerHTML = `${key_note}${key_note.length===1?'&nbsp;':''}${major_bool?'maj':'min'}`
  domStaver.updateSharpsAndFlats(dom.status.sharpsandflats, domStaver.findSharpsAndFlats(key_value, major_bool))
}

let maj_button = document.querySelector('button#majmin')
maj_button.addEventListener('click', () => {
  major_bool = !major_bool
  maj_button.innerHTML = major_bool ? 'major' : 'minor'
  updateKey(key_value)
})
let key_slider = document.querySelector('input#slider-key')
key_slider.addEventListener('input', () => {
  key_note = note_names[event.target.value]
  key_value = parseInt(event.target.value)
  updateKey(key_value)
  // domStaver.updateStaveNotes(dom.status.notes, random_sequence, key_value)
})
key_value = key_slider.value
updateKey(key_value)

//something very annoying is happening with the sequencer and NaN -ing

let sequence_inf = 0

const latSequencer = () => {

  let now = audioContext.currentTime
  // assings sequence to minor or major tones
  let key_note_sequence = major_bool ? major_sequence : minor_sequence

  // loop reset
  if (sequence_i === 8) {sequence_i = 0}

  let note_index = lat_sequence[(sequence_i%key_note_sequence.length)]

  let frq = Math.round(note_frqs[key_note_sequence[note_index] + key_value] * Math.pow(10,2)) / Math.pow(10,2)
  if (isNaN(frq)) {sequence_i++; return}

  operators.forEach(op => {
    // op.frequency.value = frq * op.ratio.value
    op.frequency.exponentialRampToValueAtTime(frq * op.ratio.value, now + 0.2)
  })
  operators[0].gain.exponentialRampToValueAtTime((long_sequence[sequence_inf%7]/20)+0.7, now + 2 )

  operators[1].gain.exponentialRampToValueAtTime((long_sequence[sequence_i===7?4:sequence_i] * 10)+0.001, now + 2 )


  sequence_i++
  sequence_inf++
}
latSequencer()
setInterval(latSequencer, 2000)

let sequence2waiter = 0
let sequence2i = 0
let sequence2stage = 0
let sequence2notes2play = 0

let rhythm_i = 0

const longSequencer = () => {
  // 0 1 2 3   4 5 6 7   8 9
  if (rhythm_i === 9) {rhythm_i = 0;} else {rhythm_i++;}
  if (rhythm_i === 2 || rhythm_i === 5 || rhythm_i === 7 || rhythm_i === 9) {return}
  // need to set envelope
  if (sequence2i === 7) { sequence2i = 0 }

  let key_note_sequence = major_bool ? major_sequence : minor_sequence
  if (sequence2waiter > 0) {
    sequence2waiter--
    return
  }
  if (sequence2stage === 0) { // time to wait til next notes
    sequence2waiter = Math.floor(long_sequence[sequence2i] * 1.5)
    sequence2stage = 1
  } else if (sequence2stage === 1) { // amount of notes to play next
    sequence2notes2play = long_sequence[sequence2i]
    sequence2stage = 2
  } else { //
    if (sequence2notes2play > 0) {
      let now = audioContext.currentTime

      let note_index = long_sequence[(sequence2i%key_note_sequence.length)]
      let frq = Math.round(note_frqs[key_note_sequence[note_index] + key_value] * Math.pow(10,2)) / Math.pow(10,2)

      if (isNaN(frq)) {sequence2i++; return}
      fm2operators.forEach(op => {
        // op.ratio = {value : 2}
        op.frequency.value = frq * op.ratio.value
      })
      fm2Gain.gain.setValueAtTime(0.001, now);
      fm2Gain.gain.linearRampToValueAtTime(1, now + 0.005);
      fm2Gain.gain.linearRampToValueAtTime(1, now + 0.050);
      fm2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.195);
      sequence2notes2play--

      domStaver.flashNote(note_index, key_value, rhythm_i)

    } else {
      sequence2stage = 0
    }



  }

  sequence2i++
  if (Math.random() > 0.5) { // this stops the sequencer getting stuck if values lock symmetric
    sequence2i--
  }
}
longSequencer()
setInterval(longSequencer, 100) // change to 200 or 100 to make sound less weird, 150 to be weird


let sequence3_i = {inf: 0, successful: 0}

fm3gain.gain.setValueAtTime(0.0001, audioContext.currentTime)

const thirdSequencer = () => {

  let now = audioContext.currentTime
  // assings sequence to minor or major tones
  if (sequence3_i.inf % 8 === 7 || sequence3_i.inf % 8 === 6) {
    let key_note_sequence = major_bool ? major_sequence : minor_sequence

    let note_index = lat_sequence[(sequence3_i.inf%key_note_sequence.length)]

    let frq = Math.round(note_frqs[key_note_sequence[note_index] + key_value] * Math.pow(10,2)) / Math.pow(10,2)
    if (isNaN(frq)) {sequence3_i.inf++; return}
    let powerer = 1
    fm3operators.forEach(op => {
      // op.frequency.value = frq * op.ratio.value
      fm3gain.gain.setValueAtTime(0.0001, now)
      fm3gain.gain.linearRampToValueAtTime(mix.fm3, now + 0.050);
      fm3gain.gain.linearRampToValueAtTime(mix.fm3, now + 0.450);
      fm3gain.gain.exponentialRampToValueAtTime(0.001, now + 0.495);
      // op.frequency.exponentialRampToValueAtTime(frq * op.ratio.value, now + 0.02)
      op.frequency.exponentialRampToValueAtTime(frq * powerer, now + 0.02)
      powerer = powerer * 2
      // console.log(powerer)

    })
  }

  // operators[0].gain.exponentialRampToValueAtTime((long_sequence[sequence_inf%7]/20)+0.7, now + 2 )

  // operators[1].gain.exponentialRampToValueAtTime((long_sequence[sequence_i===7?4:sequence_i] * 10)+0.001, now + 2 )
  sequence3_i.inf++
}
thirdSequencer()
setInterval(thirdSequencer, 500)

// document.querySelector('#volume-knob').object.attachTo(op1.gain.gain)
document.querySelector('#volume-knob').object.attachTo(masterGain.gain)


// Major Key is C D E  F G A B - or 0 2 4 5 7 9 11
// Minor key is C D Eb F G Ab Bb - or 0 2 3 5 7 8 10

let algorithm = 0;
let total_algorithms = 11
let image_widths = [10,14,14,14,14,14,20,14,20,20,26]
for (let i = 0; i < total_algorithms; i++) {

  let total_width = dom.controls.algorithm_cont.clientWidth
  let child = document.createElement('span')
  if (i === algorithm) {child.classList.add('selected')}
  child.style.display = 'inline-block'
  child.style.height = '100%';
  child.style.width = image_widths[i] / 180 * (total_width) + 'px'

  dom.controls.algorithm_cont.appendChild(child)
  child.style.backgroundPosition = 0 - child.offsetLeft + 'px'
  child.addEventListener('click', ()=>{
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



const birdSequencer = () => {
  // console.log('birdSequencer', bird)
  if (bird !== undefined) {}
}
setInterval(birdSequencer, 1000)
