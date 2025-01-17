import { useState, useEffect } from "react";
import { ScrollView, View, Text } from "react-native";
import { useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";
import clsx from "clsx";

import { api } from "../lib/api";
import { generateProgressPercentage } from "../utils/generate-progress-percentage";

import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { Checkbox } from "../components/Checkbox";
import { Loading } from "../components/Loading";
import { HabitsEmpty } from "../components/HabitsEmpty";
import { getDeviceId } from "../lib/device.util";
import { HabitProgress } from "../components/HabitProgress";

interface HabitParams {
  date: string;
}

interface DayInfoProps {
  possibleHabits: {
    id: string;
    title: string;
    streak: number;
    progress: number[];
  }[];
  completedHabits: string[];
}

export function Habit() {
  const [isLoading, setIsLoading] = useState(true);
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
  const [completedHabits, setCompletedHabits] = useState<string[]>([]);
  const [deviceId, setDeviceId] = useState<string | null>("");

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

  useEffect(() => {
    (async () => {
      const id = await getDeviceId();
      setDeviceId(id);
    })();
  }, []);

  async function fetchHabits() {
    setIsLoading(true);
    try {
      const response = await api.post("/day", {
        date,
        deviceId,
      });
      setDayInfo(response.data);
      setCompletedHabits(response.data.completedHabits);
    } catch (error: any | Error) {
      Toast.show({
        text1: "Unable to load data. Try again later",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      const payload = { id: habitId, deviceId };
      await api.patch("/habits/toggle", payload);
      const isHabitAlreadyCompleted = completedHabits.includes(habitId);
      let completedHabitsUpdated: string[] = [];

      if (isHabitAlreadyCompleted) {
        completedHabitsUpdated = completedHabits.filter((id) => id !== habitId);
      } else {
        completedHabitsUpdated = [...completedHabits, habitId];
      }
      setCompletedHabits(completedHabitsUpdated);
    } catch (error: any | Error) {
      console.log(error);
      Toast.show({
        text1: "Cannot update the routine status",
        text2: `${error.message}. Try again later`,
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
        <Text className="text-black font-extrabold text-3xl">
          {dayAndMonth}
        </Text>

        <ProgressBar progress={habitsProgress} />

        <View
          className={clsx("mt-6", {
            ["opacity-50"]: isDateInPast,
          })}
        >
          {dayInfo?.possibleHabits ? (
            dayInfo.possibleHabits?.map((habit) => (
              <View key={habit.id}>
                <Checkbox
                  title={habit.title}
                  checked={completedHabits.includes(habit.id)}
                  streak={habit.streak}
                  disabled={isDateInPast}
                  onPress={() => handleToggleHabit(habit.id)}
                />
                <HabitProgress progress={habit.progress} />
              </View>
            ))
          ) : (
            <HabitsEmpty />
          )}
        </View>

        {isDateInPast && (
          <Text className="text-black mt-10 text-center">
            You can't edit past habits
          </Text>
        )}
        <Toast />
      </ScrollView>
    </View>
  );
}
