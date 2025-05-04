
import RNAndroidNotificationListener  from 'react-native-notification-listener';

const parseNotification = (text:string)=>{
const amtMatch = text.toLowerCase().match(/amount:\s*\$?(\d+(\.\d{1,2})?)/);
const type = text.includes('debited') ? 'debit' : lower.includes('credited')
? 'credit'
: null;

if (!amtMatch || !type) return null;

return {
    amount: parseFloat(amtMatch[1].replace(/,/g, '')),
};

};


const checkNotifeePer  = async ()=>{
    return await RNAndroidNotificationListener.getPermissionStatus();
}

export {parseNotification,checkNotifeePer};