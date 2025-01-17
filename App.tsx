import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from "@expo-google-fonts/inter";
import * as Notifications from "expo-notifications";
import { api } from "./src/lib/api";
import { Loading } from "./src/components/Loading";
import { Routes } from "./src/routes";
import { weekDaysEUFormat } from "./src/lib/date.format";
import { getDeviceId } from "./src/lib/device.util";

const dayOfTheWeek = () => {
  const today = new Date();
  return weekDaysEUFormat[today.getDay()];
};

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const createOrUpdateDevice = async () => {
      try {
        const deviceId = await getDeviceId();

        await api.post("/device", { deviceId });
        setIsLoading(false);
      } catch (error: any | Error) {
        console.log(error.message);
      }
    };

    createOrUpdateDevice();
  }, []);

  async function schedulePushNotification() {
    const schedule = await Notifications.getAllScheduledNotificationsAsync();
    if (schedule.length > 0) {
      await Notifications.cancelAllScheduledNotificationsAsync();
    }
    const trigger = new Date(Date.now());
    trigger.setHours(trigger.getHours() + 5);
    trigger.setSeconds(0);
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Happy ${dayOfTheWeek()}!`,
        body: "Have you registered your habits today?",
      },
      trigger,
    });
  }

  useEffect(() => {
    schedulePushNotification();
  }, []);

  if (!fontsLoaded || isLoading) {
    return <Loading />;
  }

  return (
    <>
      <Routes />
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
    </>
  );
}
