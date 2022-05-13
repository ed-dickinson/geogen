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
    this.target.value = this.value
    console.log(this.target, this.value)
  }
  this.endMouseMove = () => {
    window.removeEventListener('mousemove', this.trackMouseMove)
    window.removeEventListener('mouseup', this.endMouseMove)
  }
  this.controls = (target) => {
    this.target = target
  }
  // intial set
  //   knob_dom.style.transform = `rotate(${
  //   ( -150 + ((this.value - this.min) / (this.max - this.min) * 300) )
  // }deg)`
  knob_dom.style.transform = `rotate(${
  ( -150 + ((this.value - this.min) / (this.max - this.min) * 300) )
}deg)`
}

document.querySelectorAll('.custom-knob').forEach(knob => {

  let knob_dom = knob
  let display_dom = document.createElement('span')
  let knob_container = document.createElement('span')
  knob_dom.parentNode.insertBefore(knob_container, knob_dom)
  knob_dom.parentNode.removeChild(knob)
  knob_container.appendChild(knob_dom)
  knob_container.appendChild(display_dom)
  display_dom.innerHTML = knob.attributes.value.value

  let knob_obj = new CustomKnob(parseInt(knob.attributes.min.value), parseInt(knob.attributes.max.value), parseInt(knob.attributes.value.value), knob_dom, display_dom)
  knob.addEventListener('mousedown', () => {
    console.log(knob.attributes)
    mouse_movement.mousedown = {x : event.x ,y : event.y}
    knob_obj.reference_value = knob_obj.value
    window.addEventListener('mousemove', knob_obj.trackMouseMove)
    window.addEventListener('mouseup', knob_obj.endMouseMove)
  })
  console.log(knob)
  knob.object = knob_obj
})

// function CustomKnob(replaced_input, knob_dom, display_dom) {
//   this.min = parseInt(replaced_input.attributes.min.value)
//   this.max = parseInt(replaced_input.attributes.max.value)
//   this.value = parseInt(replaced_input.attributes.value.value)
//   let rotation_limit = 150
//   this.rotate = () => {
//     let range = this.max - this.min
//     let ratio = this.value / range
//     let rotation = -150 + (ratio * 300)
//     knob_dom.style.transform = `rotate(${this.value}deg)`
//
//   }
//   console.log((this.value - this.min) / (this.max - this.min))
//
//   // intial set
//   knob_dom.style.transform = `rotate(${
//   ( -150 + ((this.value - this.min) / (this.max - this.min) * 300) )
// }deg)`
//
//   this.trackMouseMove = () => {
//     let moved = this.mousedown - event.y
//     console.log('moved', moved)
//     // if (this.value > this.min && this.value < this.max) {
//       this.value = this.reference_value + moved
//       let mouse_moved = this.reference_value + moved
//       // knob_dom.style.transform = `rotate(${this.value}deg)`
//       this.rotate(mouse_moved)
//       display_dom.innerHTML = this.value
//     // }
//
//     replaced_input.value = this.value
//
//   }
//   this.endMouseMove = () => {
//     window.removeEventListener('mousemove', this.trackMouseMove)
//     window.removeEventListener('mouseup', this.endMouseMove)
//   }
// }
//
// document.querySelectorAll('input[type=range]').forEach(slider => {
//
//   let slider_dom = slider
//   let container = document.createElement('span')
//   let display_dom = document.createElement('span')
//   let knob_dom = document.createElement('span')
//   slider.parentNode.insertBefore(container, slider)
//   slider.parentNode.removeChild(slider)
//   container.appendChild(slider)
//   container.appendChild(knob_dom)
//   container.appendChild(display_dom)
//   knob_dom.classList.add('custom-knob')
//   display_dom.textContent = slider.attributes.value.value
//
//   let knob_obj = new CustomKnob(
//     // parseInt(slider.attributes.min.value),
//     // parseInt(slider.attributes.max.value),
//     // parseInt(slider.attributes.value.value),
//     slider,
//     knob_dom, display_dom
//   )
//   knob_dom.addEventListener('mousedown', () => {
//     // console.log(knob.attributes)
//     // mouse_movement.mousedown = {x : event.x ,y : event.y}
//     knob_obj.mousedown = event.y
//     knob_obj.reference_value = knob_obj.value
//     window.addEventListener('mousemove', knob_obj.trackMouseMove)
//     window.addEventListener('mouseup', knob_obj.endMouseMove)
//   })
// })
