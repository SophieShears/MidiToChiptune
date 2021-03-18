function playSound() {
    // Get all the midi data
    midiData = getMidi();    
   
    // If a midi file has been loaded play it
    midiData.then((midiData) => {
        
        // Establish an intrument for each track
        const instruments = getInstruments(midiData);
        const notes = getNotes(midiData);
        console.log(instruments);
        // Load and schedule each part for tracks that have notes
        getParts(notes, instruments);

        // Playback
        Tone.Transport.start()
  
    })
}
