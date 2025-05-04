import {  bankTempConvertor } from '../constants/bankNotifee';
import useStore from '../store';

const gettingNotInfo= async (notification) => {
    const notifeeInfo = await bankTempConvertor(notification);
    
    const { bankAcc, type, amount } = notifeeInfo;
    
    if(bankAcc && type && amount){

        useStore.getState().addTransactionToHistory({
            type: type === 'credited' ? 'income' : 'expense',
            description: `Transaction from account ending with ${bankAcc}`,
            amount: amount,
            date: new Date(),
            category: 'Uncategorized',
            tags: [],
            accountName: `Account ending with ${bankAcc}`,
        })
    }
};

export {gettingNotInfo};
