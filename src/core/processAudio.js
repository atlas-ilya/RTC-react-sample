import { altArrayBuffer } from '../utils/altArrayBuffer'

export function processAudio(blob, tenet) {
    let context = new (window.AudioContext || window.webkitAudioContext)();
    let source = context.createBufferSource();

    Blob.prototype.arrayBuffer = Blob.prototype.arrayBuffer || altArrayBuffer;

    blob.arrayBuffer().then(arrayBuffer => {
        context.decodeAudioData(arrayBuffer, (buffer) => {
            let numChannels = buffer.numberOfChannels;
            let audioToReverse;
            audioToReverse = context.createBuffer(numChannels, buffer.length, buffer.sampleRate);
            for (let n = 0; n < numChannels; n++) {
                audioToReverse.getChannelData(n).set(buffer.getChannelData(n));
                if (tenet)
                    setTimeout(Array.prototype.reverse.call(audioToReverse.getChannelData(n)), 500);
            }
            source.buffer = audioToReverse;
            source.connect(context.destination);
        });
    });

    return source;
}