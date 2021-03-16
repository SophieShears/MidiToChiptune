function playSound() {
    // Get all the note values of a track
    midiNotes = getMidi();    
    // Create a synth to play them
    const synth = new Tone.Synth().toDestination();

    // Track the time since button press. SHOULD BE Tone.Transport instead to be more accurate
    const now = Tone.now();
    // If a midi file has been loaded play it
    midiNotes.then((midiNotes) => {
        midiNotes.forEach(note => {
            synth.triggerAttackRelease(note.name, note.duration, now + note.time, note.velocity);
        });
    })
}
