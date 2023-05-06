import { ReparseError } from '../../core/errors.js';
import PDFName from '../../core/objects/PDFName.js';
import PDFNumber from '../../core/objects/PDFNumber.js';
import PDFRawStream from '../../core/objects/PDFRawStream.js';
import PDFRef from '../../core/objects/PDFRef.js';
import ByteStream from '../../core/parser/ByteStream.js';
import PDFObjectParser from '../../core/parser/PDFObjectParser.js';
import { waitForTick } from '../../utils/index.js';

class PDFObjectStreamParser extends PDFObjectParser {
  static forStream = (
    rawStream: PDFRawStream,
    shouldWaitForTick?: () => boolean,
  ) => new PDFObjectStreamParser(rawStream, shouldWaitForTick);

  private alreadyParsed: boolean;
  private readonly shouldWaitForTick: () => boolean;
  private readonly firstOffset: number;
  private readonly objectCount: number;

  constructor(rawStream: PDFRawStream, shouldWaitForTick?: () => boolean) {
    super(ByteStream.fromPDFRawStream(rawStream), rawStream.dict.context);

    const { dict } = rawStream;

    this.alreadyParsed = false;
    this.shouldWaitForTick = shouldWaitForTick || (() => false);
    this.firstOffset = dict.lookup(PDFName.of('First'), PDFNumber).asNumber();
    this.objectCount = dict.lookup(PDFName.of('N'), PDFNumber).asNumber();
  }

  async parseIntoContext(): Promise<void> {
    if (this.alreadyParsed) {
      throw new ReparseError('PDFObjectStreamParser', 'parseIntoContext');
    }
    this.alreadyParsed = true;

    const offsetsAndObjectNumbers = this.parseOffsetsAndObjectNumbers();
    for (let idx = 0, len = offsetsAndObjectNumbers.length; idx < len; idx++) {
      const { objectNumber, offset } = offsetsAndObjectNumbers[idx];
      this.bytes.moveTo(this.firstOffset + offset);
      const object = this.parseObject();
      const ref = PDFRef.of(objectNumber, 0);
      this.context.assign(ref, object);
      if (this.shouldWaitForTick()) await waitForTick();
    }
  }

  private parseOffsetsAndObjectNumbers(): {
    objectNumber: number;
    offset: number;
  }[] {
    const offsetsAndObjectNumbers = [];
    for (let idx = 0, len = this.objectCount; idx < len; idx++) {
      this.skipWhitespaceAndComments();
      const objectNumber = this.parseRawInt();

      this.skipWhitespaceAndComments();
      const offset = this.parseRawInt();

      offsetsAndObjectNumbers.push({ objectNumber, offset });
    }
    return offsetsAndObjectNumbers;
  }
}

export default PDFObjectStreamParser;
