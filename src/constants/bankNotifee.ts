const bankTempConvertor = (msg)=>{
    console.log("Notification inside the reader:  \n",msg.notification);
    const {bigText,text} = JSON.parse(msg.notification);
   console.log("Text from inside the reader:  \n",bigText,text)

    let bankAcc = text.match(/X+(\d{4})/i);
    bankAcc= bankAcc? bankAcc: bigText.match(/X+(\d{4})/i);
    let typeMatch = text.match(/\b(credited|debited)\b/i);
    typeMatch = typeMatch? typeMatch: bigText.match(/\b(credited|debited)/i);
    let amtMatch = text.match(/(?:\b(?:credited|debited)\s*RS\.?\s*([\d,]+(?:\.\d{1,2})?)|RS\.?\s*([\d,]+(?:\.\d{1,2})?)\s*\b(?:credited|debited)\b)/i);
    amtMatch = amtMatch? amtMatch: bigText.match(/(?:\b(?:credited|debited)\s*RS\.?\s*([\d,]+(?:\.\d{1,2})?)|RS\.?\s*([\d,]+(?:\.\d{1,2})?)\s*\b(?:credited|debited)\b)/i);
    amtMatch = amtMatch ? (amtMatch[1] ?? amtMatch[2]) : null;
    amtMatch = amtMatch ? parseFloat(amtMatch.replace(/,/g, "")) : null;
    return {
        bankAcc: bankAcc ? bankAcc[1] : null,
        type: typeMatch ? typeMatch[1] : null,
amtMatch: amtMatch ? amtMatch : null,
    }
}

export {bankTempConvertor}