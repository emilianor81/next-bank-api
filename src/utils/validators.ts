export class Validators {
  //formato correcto: ES9121000418450200051332
    static isValidIBAN(iban: string): boolean {
      // Eliminar espacios y convertir a mayúsculas
      iban = iban.replace(/\s/g, '').toUpperCase();
      // Validar formato básico
      if (!/^ES\d{22}$/.test(iban)) {
        return false;
      }

      // Reordenar IBAN
      const reordered = iban.substring(4) + iban.substring(0, 4);
      // Convertir letras a números (A=10, B=11, etc.)
      const converted = reordered.split('').map(char => {
        const code = char.charCodeAt(0);
        return (code >= 65) ? (code - 55).toString() : char;
      }).join('');

      // Calcular módulo 97
      let remainder = '';
      for (let i = 0; i < converted.length; i++) {
        remainder = (parseInt(remainder + converted[i]) % 97).toString();
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