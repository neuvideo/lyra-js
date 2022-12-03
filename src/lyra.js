'use strict';

import Module from './wasm/webassembly_codec_wrapper.js';

let lyraModule;
Module().then((module) => {
    console.log("Initialized Lyra's wasmModule.");
    lyraModule = module;
}).catch(e => {
    console.log(`Module() error: ${e.name} message: ${e.message}`);
});

// Inputs:
//   inputArray: Float32Array containing input audio data.
//   sample_rate_hz: sample rate of the input audio data.
//   Requires at least 0.02 * sample_rate_hz samples in inputArray, which is
//   20ms of audio. This is the internal frame rate of Lyra (v1.3).
// Returns:
//   A Uint8Array containing the encoded audio data.
function encodeWithLyra(inputArray, sample_rate_hz) {
    if (inputArray.length < sample_rate_hz * 0.02) {
        console.log("Not enough audio data to encode. Need at least " + sample_rate_hz * 0.02 + " samples.");
        return new Uint8Array();
    }

    // Allocate memory for the input and output buffers.
    const num_samples = inputArray.length;
    const input_ptr = lyraModule._malloc(num_samples * Float32Array.BYTES_PER_ELEMENT);
    const output_ptr = lyraModule._malloc(num_samples * Uint8Array.BYTES_PER_ELEMENT);
    let outputArray = new Uint8Array(lyraModule.HEAPU8.buffer, output_ptr, num_samples);

    // Copy the input data to the input buffer.
    const start_offset = input_ptr / Float32Array.BYTES_PER_ELEMENT;
    lyraModule.HEAPF32.subarray(start_offset, start_offset + num_samples).set(inputArray);

    // Encode the audio data.
    const num_encoded_samples = lyraModule.encodeWithLyra(input_ptr, num_samples, sample_rate_hz, output_ptr);

    // Copy the encoded audio data to the output buffer.
    outputArray = outputArray.slice(0, num_encoded_samples);

    // Free the memory allocated for the input and output buffers.
    lyraModule._free(input_ptr);
    lyraModule._free(output_ptr);

    return outputArray;
}

// Inputs:
//   inputArray: Uint8Array containing encoded audio. This is audio data that has been encoded with Lyra.
//   sample_rate_hz: sample rate of the input audio data.
//   expected_num_decoded_samples: the expected number of samples in the decoded audio data.
// Returns:
//   A Float32Array containing the decoded audio data.
function decodeWithLyra(inputArray, sample_rate_hz, expected_num_decoded_samples) {
    // Allocate memory for the input and output buffers.
    const num_samples = inputArray.length;
    const input_ptr = lyraModule._malloc(num_samples * Uint8Array.BYTES_PER_ELEMENT);
    const output_ptr = lyraModule._malloc(expected_num_decoded_samples * Float32Array.BYTES_PER_ELEMENT);
    let outputArray = new Float32Array(lyraModule.HEAPF32.buffer, output_ptr, expected_num_decoded_samples);

    // Copy the input data to the input buffer.
    const start_offset = input_ptr / Uint8Array.BYTES_PER_ELEMENT;
    lyraModule.HEAPU8.subarray(start_offset, start_offset + num_samples).set(inputArray)

    // Decode the audio data.
    const num_decoded_samples = lyraModule.decodeWithLyra(input_ptr, num_samples, sample_rate_hz, output_ptr);

    // Copy the decoded audio data to the output buffer.
    outputArray = outputArray.slice(0, num_decoded_samples);

    // Free the memory allocated for the input and output buffers.
    lyraModule._free(input_ptr);
    lyraModule._free(output_ptr);

    return outputArray;
}

function isLyraReady() {
    return lyraModule !== undefined && lyraModule.isCodecReady();
}

export {isLyraReady, encodeWithLyra, decodeWithLyra};