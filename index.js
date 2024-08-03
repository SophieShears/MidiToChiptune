
let recorder;
let download;
const errorMessage = document.getElementById('error-message');

function loadFile() {
    console.log('Tone.js custom version:', Tone.version);
    
    // Init recorder
    initRecorder(); 
    // Stop any playback and clear current song
    stop();
    Tone.Transport.cancel();

    // Set initial volume
    Tone.getDestination().volume.value = document.getElementById('volSlider').value;
    
    // Get all the midi data
    const midiData = getMidi();   

    // If a midi file has been  it for playback
    midiData.then((midiData) => {
        // Establish an intrument/analyers/notes for each track
        const instruments = getInstruments(midiData);
        getAnalysers(instruments);
        allContext(instruments);
        const notes = getNotes(midiData);

        // Load and schedule each part for tracks that have notes
        getParts(notes, instruments);

        // Schedule drawing to take place as soon as playback starts
        Tone.Transport.schedule((time) => {
            Tone.Draw.schedule(() => { 
                drawWave();
            }, time);
        });
    })

}

function initRecorder() {
    recorder = new Tone.Recorder();
    console.log('Init recorder: ', recorder);
    Tone.getDestination().connect(recorder);

    Tone.Transport.on('start', () => {
        console.log('Start event, current recorder state: ', recorder.state);
        recorder.start();
        console.log('After starting: ', recorder.state);
    });

    Tone.Transport.on('stop', () => {
        console.log('Stop event, current recorder state: ', recorder.state);
        
        setTimeout(async () => {
            // recording is returned as a blob
            const recording = await recorder.stop();
            // download by creating an anchor element and blob url
            const url = URL.createObjectURL(recording);
            const anchor = document.createElement("a");
            anchor.download = "recording.webm";
            anchor.href = url;
            // anchor.click();
            download = anchor;
        }, 500); // tail end necessar?
        console.log('After stopping: ', recorder.state);
    });

    Tone.Transport.on('pause', () => {
        console.log('Pause event, current recorder state: ', recorder.state);
        recorder.pause();
        console.log('After pausing: ', recorder.state);
    });

    Tone.Transport.on('ended', () => {
        console.log('Song FINISHED!!!!!!!!!!!!!!!!!!!!!!!');
        // stop, ...
    });
}


// Sets volume via slider
function setVolume(sliderVal) {
    Tone.getDestination().volume.value = sliderVal;
}

function playPause() {
    if (Tone.Transport.state === 'started') {
        console.log('Pause tone');
        Tone.Transport.pause();
    }
    else if(Tone.Transport.state === 'paused' || Tone.Transport.state === 'stopped') {
        console.log('Resume tone');
        Tone.Transport.start()
    }  

}

function callbackTrackEnd() {
    console.log('HEY, THE TRACK IS OVEr AND tHATs GOOD!');
}
  
function stop() {
    if (Tone.Transport.state !== 'stopped') {
        console.log('Stop tone');
        Tone.Transport.stop();
    }
}

function save() {
    console.log('Download clicked!');
    if (download) {
        download.click();
    } else {
        errorMessage.textContent = 'No recording available. Load and play first.';
        errorMessage.style.display = 'block'; // Show error message
        setTimeout(() => { errorMessage.style.display = 'none'; }, 5000);
    }

    console.log('check it: ', Tone.Transport.loopEnd);
    console.log('check to: ', Tone.Transport.position);
}

