# lyra-js
A Webassembly/Javascript port of [Lyra](https://github.com/google/lyra), a neural audio codec from Google. It enables audio encoding and decoding with Lyra on web browsers.

## Installation.

### NPM
```shell
npm install lyra-codec --save
```

```javascript
import {encodeWithLyra, decodeWithLyra, isLyraReady} from 'lyra-codec'
```

### UNPKG
```javascript
import {encodeWithLyra, decodeWithLyra, isLyraReady} from 'https://unpkg.com/lyra-codec/dist/lyra_bundle.js'
```

## Usage

```javascript
if (isLyraReady()) {
  // Encode with Lyra codec.
  const rawAudio = new Float32Array(...);
  const encodedAudio = encodeWithLyra(audioArray, kSampleRate);

  const decoded = decodeWithLyra(encodedAudio, kSampleRate, rawAudio.length);
} else {
  ...
}
```
## Example
See [Lyra on webassembly](https://lyra-69165.web.app) for a demo of lyra-js in action, and [Playing with Lyra](https://www.meetecho.com/blog/playing-with-lyra) on how to use it for webrtc.
