import PDFAcroTerminal from '../../core/acroform/PDFAcroTerminal.js';
import PDFDict from '../../core/objects/PDFDict.js';
import PDFRef from '../../core/objects/PDFRef.js';

class PDFAcroSignature extends PDFAcroTerminal {
  static fromDict = (dict: PDFDict, ref: PDFRef) =>
    new PDFAcroSignature(dict, ref);
}

export default PDFAcroSignature;
