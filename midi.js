// Get all midi data from uploaded file
async function getMidi() {
    const midiFile = document.getElementById('file-selector').files[0];
    const midiURL = window.URL.createObjectURL(midiFile);
    const midi = await Midi.fromUrl(midiURL);

    return midi;
}


// Get every instrument based on their instrument number
function getInstruments(midiData) {
    instruments = {};
    
    for (let track = 0; track < midiData.tracks.length; track++) {
        instNum = midiData.tracks[track].instrument.number;
        if (midiData.tracks[track].precussion) {
            instruments[track] = new Tone.NoiseSynth().toDestination();
        } else {
            instruments[track] = new Tone.PolySynth().toDestination();
        }
    }

    return instruments
}


// Get every note for every track with notes in it
function getNotes(midiData) {
    notes = {}
    
    // Add notes to track if it has, otherwise leave empty
    for (let track = 0; track < midiData.tracks.length; track++) {
        notes[track] = []
        if (midiData.tracks[track].notes.length > 0) {
            midiData.tracks[track].notes.forEach(note => {
                notes[track].push({
                    time: note.time,
                    duration: note.duration,
                    note: note.name,
                    velocity: note.velocity
                })
            })
        }
    }
        
    return notes
}

// Creates Tone.js "Part" for every track that has notes, then schedules for playback
function getParts(notes, instruments) {
    parts = {}

    for (let track = 0; track < Object.keys(notes).length; track++) {
        if (notes[track].length) {
            parts[track] = new Tone.Part(((time, value) => {
                instruments[track].triggerAttackRelease(value.note, value.duration, time, value.velocity);
            }), notes[track]).start(0);
        }
    } 
}
