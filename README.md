This project is a simple webpage that utilizes the [Tonejs][0] library to playback midi 
files in the style of old video game music, or "chiptune". It does this by interpreting the existing midi information
then plays the song back using synthesizers with the simple oscillators which were available in the early videogame
consoles: pulse, square, triangle, sawtooth, and noise. The program then interprets the type of oscillator that 
generally corresponds to the instrument in the midi track, and the result is a reasonable facsimile of what the song
would sound like as a "chiptune" song. 


[0]: https://github.com/Tonejs/Tone.js