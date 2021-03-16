async function getMidi() {
    const midiFile = document.getElementById('file-selector').files[0];
    const midiURL = window.URL.createObjectURL(midiFile);
    const midi = await Midi.fromUrl(midiURL);
    
    //get the tracks
    const allNotes = [];
    const track = midi.tracks[1].notes;
    for (var i=0; i < track.length; i++) {
        allNotes[i] = {
            name: track[i].name,
            duration: track[i].duration,
            time: track[i].time,
            velocity: track[i].velocity
        };
    }

    return allNotes;
}
