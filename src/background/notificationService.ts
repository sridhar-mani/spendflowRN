import BackgroundService   from 'react-native-background-actions';

export const notificationWatcher = async () => {
    while(BackgroundService.isRunning()){
        await new Promise(resolve=>setTimeout(resolve,1000));
    }
};

export const startForegroundService = async () => {
    await BackgroundService.start(notificationWatcher,{
        taskName:'NotificationWatcher',
        taskTitle:'Listening for Transaction Notifications',
        taskDesc:'Parse bank SMS transaction notifications in background',
        taskIcon:{
            name:'ic_launcher',
            type:'mipmap',
        },
    });
};
