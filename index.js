function loadFile() {
    // Stop any playback and clear current song
    stop();
    Tone.Transport.cancel();

    // Set initial volume
    Tone.getDestination().volume.value = document.getElementById('volSlider').value;
    
    // Get all the midi data
    midiData = getMidi();    
    
    // If a midi file has been loaded play it
    midiData.then((midiData) => {

        // Establish an intrument for each track
        const instruments = getInstruments(midiData);
        const notes = getNotes(midiData);

        // Load and schedule each part for tracks that have notes
        getParts(notes, instruments);
    })
}


// Sets volume via slider
function setVolume(sliderVal) {
    Tone.getDestination().volume.value = sliderVal;
}


// Start playback
function playPause() {
    if (Tone.Transport.state === 'started') {
        Tone.Transport.pause();
    }
    else {
        Tone.Transport.start()
    }  
}
  

// Stop playback
function stop() {
    Tone.Transport.stop();
}
