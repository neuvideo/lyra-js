# lyra-js
A Webassembly/Javascript port of [Lyra](https://github.com/google/lyra), a neural audio codec from Google. It enables audio encoding and decoding with Lyra inside web browsers.

## Installation

### NPM

```shell
npm install lyra-codec --save
```

## Usage

```javascript
import {encodeWithLyra, decodeWithLyra, isLyraReady} from 'lyra-codec';

if (isLyraReady()) {
  // Encode with Lyra codec.
  const rawAudio = new Float32Array(...);
  const encodedAudio = encodeWithLyra(audioArray, kSampleRate);

  const decoded = decodeWithLyra(encodedAudio, kSampleRate, rawAudio.length);
} else {
  ...
}
```
