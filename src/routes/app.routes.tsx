import { createNativeStackNavigator } from '@react-navigation/native-stack';

const { Navigator, Screen } = createNativeStackNavigator();

import { Home } from '../screens/Home';
import { New } from '../screens/New';
import { Habit } from '../screens/Routine';
import { ScreenName } from './navigation.type';

export function AppRoutes() {
    return (
        <Navigator screenOptions={{ headerShown: false }}>
            <Screen name={ScreenName.HOME} component={Home} />
            <Screen name={ScreenName.NEW} component={New} />
            <Screen name={ScreenName.HABIT} component={Habit} />
        </Navigator>
    );
}
