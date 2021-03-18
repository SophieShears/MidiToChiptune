const options = {
    
    // General instrument waveform
    pulseOptions: {
        oscillator:{
            type: 'pulse'
        },
        envelope:{
            attack: 0.001,
            decay: 0.1,
            sustain: 0.3,
            release: 0.7
        }
    },
    

    // Wind and electric guitar distortion
    squareOptions: {
        oscillator:{
            type: 'square'
        },
        envelope:{
            attack: 0.001,
            decay: 0.3,
            sustain: 0.3,
            release: 0.7
        }
    },

    // Bass and woodwind instruments
    triangleOptions: {
        oscillator:{
            type: 'triangle'
        },
        envelope:{
            attack: 0.01,
            decay: 0.5,
            sustain: 0.5,
            release: 0.7
        }
    },
    
    // Stringed instruments (bow)
    sawtoothOptions: {
        oscillator:{
            type: 'sawtooth'
        },
            envelope:{
            attack: 0.05,
            decay: 0.5,
            sustain: 0.5,
            release: 0.7
        }
    },
    
    // Percussion instruments
    noiseOptions: {
        noise:{
            type: 'white'
        },
        envelope:{
            attack: 0.001,
            decay: 0.2,
            sustain: 0.1,
            release: 0.03
        }
    }
};