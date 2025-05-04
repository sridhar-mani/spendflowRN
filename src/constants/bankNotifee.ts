const bankTempConvertor = (msg)=>{
    console.log("Notification inside the reader:  \n",msg.notification);
    const {bigText,text} = msg.notification;
   console.log("Text from inside the reader:  \n",bigText,text)

    let bankAcc = text.match(/X+(\d{4})/i);
    bankAcc= bankAcc? bankAcc: bigText.match(/X+(\d{4})/i);
    let typeMatch = text.match(/\b(credited+debited)/i);
    typeMatch = typeMatch? typeMatch: bigText.match(/\b(credited+debited)/i);
    return {
        bankAcc: bankAcc ? bankAcc : null,
        type: typeMatch ? typeMatch : null,
    }
}

export {bankTempConvertor}