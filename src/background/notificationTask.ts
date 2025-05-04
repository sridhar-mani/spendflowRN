import RNAndroidNotificationListener  from 'react-native-notification-listener';
import {  bankTempConvertor } from '../constants/bankNotifee';

const gettingNotInfo= async (notification) => {
    // RNAndroidNotificationListener.onNotificationReceived(noti=>{
    //     const data = noti?.text;
    //     console.log(data);
    // });
        console.log('here',bankTempConvertor(notification));
    
};

export {gettingNotInfo};