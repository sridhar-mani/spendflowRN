
import RNAndroidNotificationListener  from 'react-native-notification-listener';

const checkNotifeePer  = async ()=>{
    return await RNAndroidNotificationListener.getPermissionStatus();
}

export {checkNotifeePer};