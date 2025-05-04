 const bankTempConvertor =async (msg) => {
  
    const { bigText = "", text = "" } = JSON.parse(msg.notification);
  
    let bankAcc = text.match(/X+(\d{4})/i) || bigText.match(/X+(\d{4})/i);
    let typeMatch = text.match(/\b(credited|debited)\b/i) || bigText.match(/\b(credited|debited)\b/i);
    let amtMatch =
      text.match(
        /(?:\b(?:credited|debited)\b\s*RS\.?\s*([\d,]+(?:\.\d{1,2})?)|RS\.?\s*([\d,]+(?:\.\d{1,2})?)\s*\b(?:credited|debited)\b)/i
      ) ||
      bigText.match(
        /(?:\b(?:credited|debited)\b\s*RS\.?\s*([\d,]+(?:\.\d{1,2})?)|RS\.?\s*([\d,]+(?:\.\d{1,2})?)\s*\b(?:credited|debited)\b)/i
      );
  
    let amount = amtMatch ? (amtMatch[1] ?? amtMatch[2]) : null;
    amount = amount ? parseFloat(amount.replace(/,/g, '')) : null;
  
    return {
      bankAcc: bankAcc ? bankAcc[1] : null,
      type: typeMatch ? typeMatch[1].toLowerCase() : null,
      amount: amount,
    };
  };
  
  export { bankTempConvertor };
  