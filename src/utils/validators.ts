export class Validators {
    static isValidIBAN(iban: string): boolean {
      // Ejemplo básico para España (ES)
      const ibanRegex = /^ES\d{22}$/;
      if (!ibanRegex.test(iban)) {
        return false;
      }
  
      // Validación del dígito de control
      const code = iban.substring(4) + iban.substring(0, 4);
      let remainder = '';
      for (let i = 0; i < code.length; i++) {
        remainder = (parseInt(remainder + code[i]) % 97).toString();
      }
  
      return parseInt(remainder) === 1;
    }
  
    static calculateCommission(amount: number, sourceBank: string, targetBank: string): number {
      if (sourceBank === targetBank) {
        return 0;
      }
      // Comisión del 3% para retiros en otros bancos
      return amount * 0.03;
    }
  }