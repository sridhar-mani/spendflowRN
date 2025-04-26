import {createNativeStackNavigator} from '@react-navigation/native-stack'
import HomeScreen from '../screens/HomeScreen';
import HistoryScreen from '../screens/HistoryScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = ()=>{
return (
    <Stack.Navigator screenOptions={{headerShown:false}} >
        <Stack.Screen name="Home" component={HomeScreen}/>
        <Stack.Screen name="History" component={HistoryScreen}/>
    </Stack.Navigator>
);
};

export default AppNavigator;
