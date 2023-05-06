import {
  UnexpectedObjectTypeError,
  UnsupportedEncodingError,
} from '../../core/errors.js';
import PDFArray from '../../core/objects/PDFArray.js';
import PDFDict from '../../core/objects/PDFDict.js';
import PDFName from '../../core/objects/PDFName.js';
import PDFNull from '../../core/objects/PDFNull.js';
import PDFNumber from '../../core/objects/PDFNumber.js';
import PDFRawStream from '../../core/objects/PDFRawStream.js';
import Ascii85Stream from '../../core/streams/Ascii85Stream.js';
import AsciiHexStream from '../../core/streams/AsciiHexStream.js';
import FlateStream from '../../core/streams/FlateStream.js';
import LZWStream from '../../core/streams/LZWStream.js';
import RunLengthStream from '../../core/streams/RunLengthStream.js';
import Stream, { StreamType } from '../../core/streams/Stream.js';

const decodeStream = (
  stream: StreamType,
  encoding: PDFName,
  params: undefined | typeof PDFNull | PDFDict,
) => {
  if (encoding === PDFName.of('FlateDecode')) {
    return new FlateStream(stream);
  }
  if (encoding === PDFName.of('LZWDecode')) {
    let earlyChange = 1;
    if (params instanceof PDFDict) {
      const EarlyChange = params.lookup(PDFName.of('EarlyChange'));
      if (EarlyChange instanceof PDFNumber) {
        earlyChange = EarlyChange.asNumber();
      }
    }
    return new LZWStream(stream, undefined, earlyChange as 0 | 1);
  }
  if (encoding === PDFName.of('ASCII85Decode')) {
    return new Ascii85Stream(stream);
  }
  if (encoding === PDFName.of('ASCIIHexDecode')) {
    return new AsciiHexStream(stream);
  }
  if (encoding === PDFName.of('RunLengthDecode')) {
    return new RunLengthStream(stream);
  }
  throw new UnsupportedEncodingError(encoding.asString());
};

export const decodePDFRawStream = ({ dict, contents }: PDFRawStream) => {
  let stream: StreamType = new Stream(contents);

  const Filter = dict.lookup(PDFName.of('Filter'));
  const DecodeParms = dict.lookup(PDFName.of('DecodeParms'));

  if (Filter instanceof PDFName) {
    stream = decodeStream(
      stream,
      Filter,
      DecodeParms as PDFDict | typeof PDFNull | undefined,
    );
  } else if (Filter instanceof PDFArray) {
    for (let idx = 0, len = Filter.size(); idx < len; idx++) {
      stream = decodeStream(
        stream,
        Filter.lookup(idx, PDFName),
        DecodeParms && (DecodeParms as PDFArray).lookupMaybe(idx, PDFDict),
      );
    }
  } else if (!!Filter) {
    throw new UnexpectedObjectTypeError([PDFName, PDFArray], Filter);
  }

  return stream;
};
