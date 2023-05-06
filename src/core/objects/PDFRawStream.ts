import PDFDict from '../../core/objects/PDFDict.js';
import PDFStream from '../../core/objects/PDFStream.js';
import PDFContext from '../../core/PDFContext.js';
import { arrayAsString } from '../../utils/index.js';

class PDFRawStream extends PDFStream {
  static of = (dict: PDFDict, contents: Uint8Array) =>
    new PDFRawStream(dict, contents);

  readonly contents: Uint8Array;

  private constructor(dict: PDFDict, contents: Uint8Array) {
    super(dict);
    this.contents = contents;
  }

  asUint8Array(): Uint8Array {
    return this.contents.slice();
  }

  clone(context?: PDFContext): PDFRawStream {
    return PDFRawStream.of(this.dict.clone(context), this.contents.slice());
  }

  getContentsString(): string {
    return arrayAsString(this.contents);
  }

  getContents(): Uint8Array {
    return this.contents;
  }

  getContentsSize(): number {
    return this.contents.length;
  }
}

export default PDFRawStream;
