import PDFArray from '../../core/objects/PDFArray.js';
import PDFHexString from '../../core/objects/PDFHexString.js';
import PDFName from '../../core/objects/PDFName.js';
import PDFNumber from '../../core/objects/PDFNumber.js';
import PDFObject from '../../core/objects/PDFObject.js';
import PDFString from '../../core/objects/PDFString.js';
import PDFOperatorNames from '../../core/operators/PDFOperatorNames.js';
import PDFContext from '../../core/PDFContext.js';
import CharCodes from '../../core/syntax/CharCodes.js';
import { copyStringIntoBuffer } from '../../utils/index.js';

export type PDFOperatorArg =
  | string
  | PDFName
  | PDFArray
  | PDFNumber
  | PDFString
  | PDFHexString;

class PDFOperator {
  static of = (name: PDFOperatorNames, args?: PDFOperatorArg[]) =>
    new PDFOperator(name, args);

  private readonly name: PDFOperatorNames;
  private readonly args: PDFOperatorArg[];

  private constructor(name: PDFOperatorNames, args?: PDFOperatorArg[]) {
    this.name = name;
    this.args = args || [];
  }

  clone(context?: PDFContext): PDFOperator {
    const args = new Array(this.args.length);
    for (let idx = 0, len = args.length; idx < len; idx++) {
      const arg = this.args[idx];
      args[idx] = arg instanceof PDFObject ? arg.clone(context) : arg;
    }
    return PDFOperator.of(this.name, args);
  }

  toString(): string {
    let value = '';
    for (let idx = 0, len = this.args.length; idx < len; idx++) {
      value += String(this.args[idx]) + ' ';
    }
    value += this.name;
    return value;
  }

  sizeInBytes(): number {
    let size = 0;
    for (let idx = 0, len = this.args.length; idx < len; idx++) {
      const arg = this.args[idx];
      size += (arg instanceof PDFObject ? arg.sizeInBytes() : arg.length) + 1;
    }
    size += this.name.length;
    return size;
  }

  copyBytesInto(buffer: Uint8Array, offset: number): number {
    const initialOffset = offset;

    for (let idx = 0, len = this.args.length; idx < len; idx++) {
      const arg = this.args[idx];
      if (arg instanceof PDFObject) {
        offset += arg.copyBytesInto(buffer, offset);
      } else {
        offset += copyStringIntoBuffer(arg, buffer, offset);
      }
      buffer[offset++] = CharCodes.Space;
    }

    offset += copyStringIntoBuffer(this.name, buffer, offset);

    return offset - initialOffset;
  }
}

export default PDFOperator;
