import PDFContext from '../../core/PDFContext.js';
import PDFAcroButton from '../../core/acroform/PDFAcroButton.js';
import { AcroButtonFlags } from '../../core/acroform/flags.js';
import PDFDict from '../../core/objects/PDFDict.js';
import PDFRef from '../../core/objects/PDFRef.js';

class PDFAcroPushButton extends PDFAcroButton {
  static fromDict = (dict: PDFDict, ref: PDFRef) =>
    new PDFAcroPushButton(dict, ref);

  static create = (context: PDFContext) => {
    const dict = context.obj({
      FT: 'Btn',
      Ff: AcroButtonFlags.PushButton,
      Kids: [],
    });
    const ref = context.register(dict);
    return new PDFAcroPushButton(dict, ref);
  };
}

export default PDFAcroPushButton;
