let analysers = null;
let contexts = null;

// Create analysers for each instrument then connect them
function getAnalysers(instruments) {
    const allAnalysers = {};

    for (let instrument = 0; instrument < Object.keys(instruments).length; instrument ++) {
        allAnalysers[instrument] = new Tone.Analyser("waveform", 1024);
        instruments[instrument].fan(allAnalysers[instrument]);
    }

    analysers = allAnalysers;
}


// Create a context object for each insturment
function allContext(instruments) {
  const allContexts = {};

  for (let instrument = 0; instrument < Object.keys(instruments).length; instrument ++) {
    try {
      allContexts[instrument] = document.querySelector('#wave' + instrument).getContext('2d');
    }
    catch (DOMException) {}
  }

  contexts = allContexts;
}


// Create soundwave of each instrument
function createWave(context, values) {
    const canvasWidth = 182, canvasHeight = 60;

    context.clearRect(0, 0, canvasWidth, canvasHeight);
    context.beginPath();
  
    context.lineJoin = "round";
    context.lineWidth = 1;
  
    context.moveTo(0, (values[0] / 255) * canvasHeight);
    for (let i = 1, len = values.length; i < len; i++){
      let val = values[i];
      let x = canvasWidth * (i / len);
      let y = val * canvasHeight;
      context.lineTo(x, y);
    }
    context.stroke();
  }


// Draw them all to canvas
function drawWave() {
    requestAnimationFrame(drawWave);
    
    for (let i = 0; i < Object.keys(analysers).length; i ++) {
      createWave(contexts[i], analysers[i].getValue());
    }
}
