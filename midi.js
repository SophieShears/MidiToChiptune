// Get all midi data from uploaded file
async function getMidi() {
    const midiFile = document.getElementById('file-selector').files[0];
    const midiURL = window.URL.createObjectURL(midiFile);
    let midi = await Midi.fromUrl(midiURL);

    return midi;
}


// Get every instrument based on their instrument number
function getInstruments(midiData) {
    instruments = {};
    
    for (let track = 0; track < midiData.tracks.length; track++) {
        let instNum = midiData.tracks[track].instrument.number;
        
        // Set drum synths (percussion)
        if (midiData.tracks[track].instrument.percussion) {
            instruments[track] = new Tone.NoiseSynth(options.noiseOptions).toDestination();
        } 
        // Set triangle synths (bass instruments)
        else if (instNum >= 32 && instNum <= 39) {
            instruments[track] = new Tone.PolySynth(Tone.Synth, options.triangleOptions).toDestination();
        } 
        // Set sawtooth synths (stringed instruments)
        else if (instNum >= 40 && instNum <= 55 || instNum === 81) {
            instruments[track] = new Tone.PolySynth(Tone.Synth, options.sawtoothOptions).toDestination();
        }
        // Set square synths (guitars)
        else if (instNum >= 24 && instNum <= 31) {
            instruments[track] = new Tone.PolySynth(Tone.Synth, options.squareOptions).toDestination();
        }
        // Set square synths (wind instruments)
        else if (instNum >= 56 && instNum <= 80) {
            instruments[track] = new Tone.PolySynth(Tone.Synth, options.squareOptions).toDestination();
        } 
        // Set pulse synths for  all else
        else {
            instruments[track] = new Tone.PolySynth(Tone.Synth, options.pulseOptions).toDestination();
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
        prevNoteTime = null

        if (midiData.tracks[track].notes.length > 0) {
            midiData.tracks[track].notes.forEach(note => {
                // If percussion track has two simultaneous notes only keep one
                if (midiData.tracks[track].instrument.percussion) {
                    if (prevNoteTime != note.time) {
                        notes[track].push({
                            time: note.time,
                            duration: note.duration,
                            note: note.name,
                            velocity: note.velocity
                        })
                    }
                    prevNoteTime = note.time
                }
                // Otherwise add notes as normal
                else {
                    notes[track].push({
                        time: note.time,
                        duration: note.duration,
                        note: note.name,
                        velocity: note.velocity
                    })
                }
                
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
            // Introduce END marker https://github.com/Tonejs/Tone.js/issues/802
            const lastNote = notes[track][notes[track].length - 1];
            const endMarker = { time: lastNote.time + lastNote.duration, duration: 0, note: 'END' };
            notes[track].push(endMarker);
            console.log('Notes: ', notes[track]);

            parts[track] = new Tone.Part(((time, value) => {

                console.log('Note: ', value.note)
                
                if (value.note === 'END') {
                    console.log('Sequence ended for track', track);
                    callbackTrackEnd();
                } else {
                    // Check if the track is drums/noise and leave out note names if so
                    if (instruments[track].name === 'NoiseSynth') {
                        instruments[track].triggerAttackRelease(value.duration, time, value.velocity);
                    } else {
                        instruments[track].triggerAttackRelease(value.note, value.duration, time, value.velocity);
                    }
                }
            }), notes[track]).start(0);
        
        }
    } 
}
