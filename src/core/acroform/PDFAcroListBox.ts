import PDFContext from '../../core/PDFContext.js';
import PDFAcroChoice from '../../core/acroform/PDFAcroChoice.js';
import PDFDict from '../../core/objects/PDFDict.js';
import PDFRef from '../../core/objects/PDFRef.js';

class PDFAcroListBox extends PDFAcroChoice {
  static fromDict = (dict: PDFDict, ref: PDFRef) =>
    new PDFAcroListBox(dict, ref);

  static create = (context: PDFContext) => {
    const dict = context.obj({
      FT: 'Ch',
      Kids: [],
    });
    const ref = context.register(dict);
    return new PDFAcroListBox(dict, ref);
  };
}

export default PDFAcroListBox;
