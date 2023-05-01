import PDFContext from '../../core/PDFContext';
import PDFAcroChoice from '../../core/acroform/PDFAcroChoice';
import { AcroChoiceFlags } from '../../core/acroform/flags';
import PDFDict from '../../core/objects/PDFDict';
import PDFRef from '../../core/objects/PDFRef';

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
