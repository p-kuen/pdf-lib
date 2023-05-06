import PDFContext from '../../core/PDFContext.js';
import PDFAcroChoice from '../../core/acroform/PDFAcroChoice.js';
import { AcroChoiceFlags } from '../../core/acroform/flags.js';
import PDFDict from '../../core/objects/PDFDict.js';
import PDFRef from '../../core/objects/PDFRef.js';

class PDFAcroComboBox extends PDFAcroChoice {
  static fromDict = (dict: PDFDict, ref: PDFRef) =>
    new PDFAcroComboBox(dict, ref);

  static create = (context: PDFContext) => {
    const dict = context.obj({
      FT: 'Ch',
      Ff: AcroChoiceFlags.Combo,
      Kids: [],
    });
    const ref = context.register(dict);
    return new PDFAcroComboBox(dict, ref);
  };
}

export default PDFAcroComboBox;
