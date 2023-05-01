import PDFContext from '../../core/PDFContext';
import PDFAcroButton from '../../core/acroform/PDFAcroButton';
import { AcroButtonFlags } from '../../core/acroform/flags';
import PDFDict from '../../core/objects/PDFDict';
import PDFRef from '../../core/objects/PDFRef';

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
