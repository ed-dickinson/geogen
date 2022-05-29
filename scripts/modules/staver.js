const findSharpsAndFlats = (key_value, major_bool) => {
  let k = key_value
  let m = major_bool
  let no, sharps_or_flats

  if ((k === 0 && !m) || (k === 3 && m)) { // Cmaj Amin
    no = 0
    sharps_or_flats = 'sharps'
  } else if ((k === 5 && !m) || (k === 8 && m)) {
    no = 1
    sharps_or_flats = 'flats'
  } else if ((k === 7 && !m) || (k === 10 && m)) {
    no = 1
    sharps_or_flats = 'sharps'
  } else if ((k === 10 && !m) || (k === 1 && m)) {
    no = 2
    sharps_or_flats = 'flats'
  } else if ((k === 2 && !m) || (k === 5 && m)) {
    no = 2
    sharps_or_flats = 'sharps'
  } else if ((k === 3 && !m) || (k === 6 && m)) {
    no = 3
    sharps_or_flats = 'flats'
  } else if ((k === 9 && !m) || (k === 0 && m)) {
    no = 3
    sharps_or_flats = 'sharps'
  } else if ((k === 8 && !m) || (k === 11 && m)) {
    no = 4
    sharps_or_flats = 'flats'
  } else if ((k === 4 && !m) || (k === 7 && m)) {
    no = 4
    sharps_or_flats = 'sharps'
  } else if ((k === 1 && !m) || (k === 4 && m)) {
    no = 5
    sharps_or_flats = 'flats'
  } else if ((k === 11 && !m) || (k === 2 && m)) {
    no = 5
    sharps_or_flats = 'sharps'
  } else {
    no = 6
    sharps_or_flats = 'flats'
  }
  return {no, sharps_or_flats}
}
const updateSharpsAndFlats = (dom, {no, sharps_or_flats}) => {
  dom.innerHTML = ''
  if (sharps_or_flats === 'sharps') {
    if (!dom.classList.contains('sharps')) {
      dom.classList.add('sharps')
    }
    dom.classList.remove('flats')
  } else {
    if (!dom.classList.contains('flats')) {
      dom.classList.add('flats')
    }
    dom.classList.remove('sharps')
  }
  for (let i = 0; i < no; i++) {
    let child = document.createElement('div')
    child.innerHTML = sharps_or_flats==='sharps'?'#':'b'
    dom.appendChild(child)
  }
}

const updateStaveNotes = (dom, sequence, key_value) => {
  dom.innerHTML = ''

  sequence.forEach(note => {
    let child = document.createElement('span')
    child.classList.add('note')
    // child.innerHTML = '&#9833;'
    child.innerHTML = '';
    child.style.bottom = `${(key_value-5)+(note*0.58)}em`
    dom.appendChild(child)
  })
}

const dom_note = document.querySelector('.status .note')

const dom_notes_holder = document.querySelector('.status.notes')

const dom_notes_array = []

// E is bottom line on treble clef

// const addLine = (dom, lines, above_or_below, on_line) => {
//
//   for (let i = 0; i < lines; i++) {
//     let line = document.createElement('div')
//     dom.classList.add('extra-note-line')
//     dom.appendChild(line)
//     line.style.top = `0px`
//   }
//
// }

for (let i = 0; i < 24; i++) {
  let row_element = document.createElement('div')
  row_element.classList.add('note-row')
  dom_notes_holder.appendChild(row_element)
  row_element.style.bottom = `${-2-5-20+(i*10*0.5)}px`
  row_element.innerHTML = ''

  let temp_array = []

  for (let j = 0; j < 10; j++) {
    let note_element = document.createElement('span')
    note_element.classList.add('note')
    note_element.innerHTML = ''
    note_element.style.left = `${j * 15}px`
    row_element.appendChild(note_element)
    temp_array.push(note_element)

    note_element.style.backgroundColor = `hsl(${j*20}, 100%, 50%)`
  }

  dom_notes_array.push(temp_array)
  // element.style.left = `${i}em`
}


const flashNote = (note, key_value, timing) => {
  // dom_note.style.display = 'block'
  // dom_note.style.left = `${timing}em`
  // dom_note.style.bottom = `${(note*0.6)-3.6}em`

  dom_notes_array[(note + key_value)][timing].style.display = 'block'
  dom_notes_array[(note + key_value)][timing].classList.add('flash')
  setTimeout(()=>{
    dom_notes_array[(note + key_value)][timing].style.display = 'none'
    dom_notes_array[(note + key_value)][timing].classList.remove('flash')
  }, 500)
}

// const hideNote = () => {
//   dom_note.style.display = 'none'
// }

export default {
  findSharpsAndFlats,
  updateSharpsAndFlats,
  updateStaveNotes,
  flashNote
}
