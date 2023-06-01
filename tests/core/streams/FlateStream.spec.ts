import fs from 'fs';
import { describe, expect, it } from 'vitest';

import FlateStream from '../../../src/core/streams/FlateStream.js';
import Stream from '../../../src/core/streams/Stream.js';

const DIR = `tests/core/streams/data/flate`;
const FILES = ['1', '2', '3', '4', '5', '6', '7'];

describe(`FlateStream`, () => {
  FILES.forEach((file) => {
    it(`can decode flate encoded data (${file})`, () => {
      const encoded = new Uint8Array(fs.readFileSync(`${DIR}/${file}.encoded`));
      const decoded = new Uint8Array(fs.readFileSync(`${DIR}/${file}.decoded`));

      const stream = new FlateStream(new Stream(encoded));

      expect(stream.decode()).toEqual(decoded);
    });
  });
});
