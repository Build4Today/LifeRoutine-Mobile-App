import { useState, useEffect } from "react";
import {
  ScrollView,
  View,
  Text,
  Alert,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";
import DeviceInfo from "react-native-device-info";

import { api } from "../lib/api";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { HabitsEmpty } from "../components/HabitsEmpty";
import clsx from "clsx";

interface HabitParams {
  date: string;
}

interface DayInfoProps {
  possibleHabits: {
    id: string;
    title: string;
  }[];
  completedHabits: string[];
}

export function Habit() {
  const [isLoading, setIsLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [deviceId, setDeviceId] = useState("");

  const route = useRoute();
  const { date } = route.params as HabitParams;

  // date validation
  const parsedDate = dayjs(date);
  const isDateInPast = parsedDate.endOf("day").isBefore(new Date());
  const dayOfWeek = parsedDate.format("dddd");
  const dayAndMonth = parsedDate.format("DD/MM");

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(
        dayInfo.possibleHabits.length,
        completedHabits.length
      )
    : 0;

  const { navigate } = useNavigation();

  useEffect(() => {
    const getDeviceId = async () => {
      const id = await DeviceInfo.getUniqueId();
      setDeviceId(id);
    };

    getDeviceId();
  }, []);

  async function fetchHabits() {
    setIsLoading(true);
    try {
      const response = await api.get("/day", {
        params: { date, deviceId },
      });
      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
    } catch (error: any | Error) {
      console.log(error);
      Toast.show({
        text1: "Unable to load data. Try again later",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`, { deviceId });
      const isHabitAlreadyCompleted = completedHabits.includes(habitId);
      let completedHabitsUpdated: string[] = [];
      if (isHabitAlreadyCompleted) {
        completedHabitsUpdated = completedHabits.filter(
          (id) => id !== habitId
        );
      } else {
        completedHabitsUpdated = [...completedHabits, habitId];
      }
      setCompletedHabits(completedHabitsUpdated);
    } catch (error: any | Error) {
      console.log(error);
      Toast.show({
        text1: "Cannot update the routine status",
        text2: `${error.message}. Try again later`
      });
    }
  }

  useEffect(() => {
    fetchHabits();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View
        className={clsx("mt-6", {
          ["opacity-50"]: isDateInPast,
        })}>
          {dayInfo?.possibleHabits ? (
            dayInfo.possibleHabits?.map((habit) => (
              <Checkbox
                key={habit.id}
                title={habit.title}
                checked={completedHabits.includes(habit.id)}
                disabled={isDateInPast}
                onPress={() => handleToggleHabit(habit.id)}
              />
            ))
          ) : (
            <HabitsEmpty />
          )}
        </View>

        {isDateInPast && (
          <Text className="text-white mt-10 text-center">
            You cannot edit past habits.
          </Text>
        )}
        <Toast />
      </ScrollView>
    </View>
  );
}
