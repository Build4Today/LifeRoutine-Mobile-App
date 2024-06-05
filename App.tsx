import { useEffect } from 'react';
import { StatusBar } from 'react-native';
import {
    useFonts,
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import * as Notifications from 'expo-notifications';

import { Loading } from './src/components/Loading';
import { Routes } from './src/routes';

export default function App() {
    const [fontsLoaded] = useFonts({
        Inter_400Regular,
        Inter_600SemiBold,
        Inter_700Bold,
        Inter_800ExtraBold,
    });

    async function schedulePushNotification() {
        const schedule = await Notifications.getAllScheduledNotificationsAsync();

        if (schedule.length > 0) {
            await Notifications.cancelAllScheduledNotificationsAsync();
        }

        // TODO retrieve the day of the week (e.g. Monday)
        const dayOfTheWeek = 'Monday';
        const trigger = new Date(Date.now());
        trigger.setHours(trigger.getHours() + 5);
        trigger.setSeconds(0);

        await Notifications.scheduleNotificationAsync({
            content: {
                title: `Happy ${dayOfTheWeek}!`,
                body: 'Did you register your habits today?',
            },
            trigger,
        });
    }

    useEffect(() => {
        schedulePushNotification();
    }, []);

    if (!fontsLoaded) {
        return <Loading />;
    }

    return (
        <>
            <Routes />
            <StatusBar
                barStyle='light-content'
                backgroundColor='transparent'
                translucent
            />
        </>
    );
}
