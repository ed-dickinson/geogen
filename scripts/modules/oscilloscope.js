const oscilloscoper = (context, input, canvas) => {
  let analyser = context.createAnalyser()
  analyser.fftSize = 2048
  var bufferLength = analyser.frequencyBinCount;
  var dataArray = new Uint8Array(bufferLength);

  input.connect(analyser)

  let canvas_context = canvas.getContext('2d')

  const draw = () => {
    let WIDTH = canvas.clientWidth
    let HEIGHT = canvas.clientHeight

    var drawVisual = requestAnimationFrame(draw);
    if (drawVisual % 5 !== 0) { // fps changer
      return
    }
    analyser.getByteTimeDomainData(dataArray);
    canvas_context.fillStyle = 'pink';
    canvas_context.fillRect(0, 0, WIDTH, HEIGHT);
    canvas_context.lineWidth = 1;
    canvas_context.strokeStyle = 'white';
    canvas_context.beginPath();
    var sliceWidth = WIDTH * 1.0 / bufferLength;
    var x = 0;
    for(var i = 0; i < bufferLength; i++) {

      var v = dataArray[i] / 128.0;
      var y = v * HEIGHT/2;

      if(i === 0) {
        canvas_context.moveTo(x, y);
      } else {
        canvas_context.lineTo(x, y);
      }

      x += sliceWidth;
    }
    canvas_context.lineTo(canvas.width, canvas.height/2);
    canvas_context.stroke();

  }

  draw()

}

export default oscilloscoper
