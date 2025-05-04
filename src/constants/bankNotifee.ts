const bankTempConvertor = (msg)=>{
    console.log("Notification inside the reader:  \n",msg.notification);
    const {bigText,text} = JSON.parse(msg.notification);
   console.log("Text from inside the reader:  \n",bigText,text)

    let bankAcc = text.match(/X+(\d{4})/i);
    bankAcc= bankAcc? bankAcc: bigText.match(/X+(\d{4})/i);
    let typeMatch = text.match(/\b(credited|debited)/i);
    typeMatch = typeMatch? typeMatch: bigText.match(/\b(credited+debited)/i);
    let amtMatch = text.match(/(?:\b(?:credited|debited)\s*RS\.?\s*([\d,]+(?:\.\d{1,2})?)|RS\.?\s*([\d,]+(?:\.\d{1,2})?)\s*\b(?:credited|debited)\b)/i);
    amtMatch = amtMatch? amtMatch: bigText.match(/(?:\b(?:credited|debited)\s*RS\.?\s*([\d,]+(?:\.\d{1,2})?)|RS\.?\s*([\d,]+(?:\.\d{1,2})?)\s*\b(?:credited|debited)\b)/i);
    return {
        bankAcc: bankAcc ? bankAcc : null,
        type: typeMatch ? typeMatch : null,
amtMatch: amtMatch ? parseFloat(amtMatch) : null,
    }
}

export {bankTempConvertor}