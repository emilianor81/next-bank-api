export class FeeCalculator {
    static readonly FEES = {
      WITHDRAWAL: {
        OTHER_BANK: 0.03, // 3% para retiros en otros bancos
        SAME_BANK: 0
      },
      TRANSFER: {
        OTHER_BANK: 0.02, // 2% para transferencias a otros bancos
        SAME_BANK: 0,
        INTERNATIONAL: 0.05 // 5% para transferencias internacionales
      }
    };
  
    static calculateWithdrawalFee(amount: number, sourceBank: string, atmBank: string): number {
      if (sourceBank === atmBank) {
        return amount * this.FEES.WITHDRAWAL.SAME_BANK;
      }
      return amount * this.FEES.WITHDRAWAL.OTHER_BANK;
    }
  
    static calculateTransferFee(
      amount: number, 
      sourceBank: string, 
      destinationBank: string, 
      isInternational: boolean = false
    ): number {
      if (isInternational) {
        return amount * this.FEES.TRANSFER.INTERNATIONAL;
      }
      if (sourceBank === destinationBank) {
        return amount * this.FEES.TRANSFER.SAME_BANK;
      }
      return amount * this.FEES.TRANSFER.OTHER_BANK;
    }
  }