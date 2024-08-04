
let recorder;
let downloadReadyPromise = Promise.resolve(); // Init with resolved promise

//todo: loadFile() results in inconsistent recorder state
// todo: check if tail end necessary

function loadFile() {
    console.log('Tone.js custom version:', Tone.version);

    // Stop any playback and clear current song
    stop();
    Tone.Transport.cancel();
        
    // Init recorder
    initRecorder(); 

    // Init track ended event
    document.addEventListener('seqEnd', onSequenceEnd);

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
        if(recorder.state !== 'started') {
            recorder.start();
            console.log('Start event, new recorder state: ', recorder.state);
        } else {
            console.log('Start event, but recorder already started!');
        }
    });

    // Promise is immediately initialized and waits for the event to finish
    downloadReadyPromise = new Promise(async (resolve) => {
        Tone.Transport.on('stop', () => {
            console.log('Stop event, awaiting recorder end.');

                if(recorder.state !== 'stopped') {
                    setTimeout(async () => {
                            // Recording is returned as a blob
                            const recording = await recorder.stop(); 
                            console.log('Recorder stopped, new recorder state: ', recorder.state);
                            // Download by creating an anchor element and blob url
                            const url = URL.createObjectURL(recording);
                            const anchor = document.createElement("a");
                            anchor.download = "recording.webm";
                            anchor.href = url;
                            let download = anchor;
                            resolve(download);
                    }, 0); // tail end necessary?
                } else {
                    console.log('Stop event, but recorder already stopped!');
                }
            });
        });

    Tone.Transport.on('pause', () => {
        if(recorder.state !== 'paused') {
            recorder.pause();
            console.log('Pause event, new recorder state: ', recorder.state);
        } else {
            console.log('Pause event, but recorder already paused!');
        }
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
        console.log('Play/Resume tone');
        Tone.Transport.start()
    }  

}

function onSequenceEnd(event) {
    console.log('Track reached end event: ', event.detail.message);
    stop();
}
  
function stop() {
    if (Tone.Transport.state !== 'stopped') {
        console.log('Stop tone');
        Tone.Transport.stop();
    }
}

async function save() {
    console.log('Save clicked, stopping playback and attempting to download!');
    // Stop playback which fires event and stops recording
    stop();
    // Await for event to complete and to assign the download
    const downloadAnchor = await downloadReadyPromise;
    const errorMessage = document.getElementById('error-message');
    if (downloadAnchor) {
        console.log('Download ready, clicking.')
        downloadAnchor.click();
    } else {
        errorMessage.textContent = 'No recording available. Load and play first.';
        errorMessage.style.display = 'block'; // Show error message
        setTimeout(() => { errorMessage.style.display = 'none'; }, 5000);
    }
}

