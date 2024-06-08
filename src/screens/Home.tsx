import { useCallback, useState, useEffect } from "react";
import { View, Text, ScrollView, Platform } from "react-native";
import * as Application from "expo-application";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { api } from "../lib/api";
import dayjs from "dayjs";
import Toast from "react-native-toast-message";

import { Header } from "../components/Header";
import { HabitDay, daySize } from "../components/HabitDay";
import { Loading } from "../components/Loading";

import { generateDatesFromYearBeginning } from "../utils/generate-dates-from-year-beginning";
import { weekDaysEUShortFormat } from "../lib/date.format";
import { getDeviceId } from "../lib/device.util";

type SummaryProps = {
  id: string;
  date: string;
  amount: number;
  completed: number;
}[];

const datesFromYearBeginning = generateDatesFromYearBeginning();

const minimumSummaryDatesSizes = 18 * 5;
const amountOfDaysToFill =
  minimumSummaryDatesSizes - datesFromYearBeginning.length;

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryProps | null>(null);
  const [deviceId, setDeviceId] = useState<string | null>("");

  const { navigate } = useNavigation();

  useEffect(() => {
    (async () => {
      const id = await getDeviceId();
      setDeviceId(id);
    })();
  }, []);

  async function fetchData() {
    setIsLoading(true);
    try {
      const response = await api.get("summary", {
        params: { deviceId },
      });
      setSummary(response.data);
    } catch (error: any | Error) {
      Toast.show({
        type: "error",
        text1: "Data temporary unavailable",
        text2: error.message,
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [deviceId])
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />

      <View className="flex-row mt-6 mb-2">
        {weekDaysEUShortFormat.map((weekDay, index) => (
          <Text
            key={`${weekDay}-${index}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: daySize }}
          >
            {weekDay}
          </Text>
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {summary && (
          <View className="flex-row flex-wrap">
            {datesFromYearBeginning.map((date) => {
              const dayWithHabits = summary.find((day) => {
                return dayjs(date).isSame(day.date, "day");
              });
              return (
                <HabitDay
                  key={date.toISOString()}
                  date={date}
                  amountOfHabits={dayWithHabits?.amount}
                  amountCompleted={dayWithHabits?.completed}
                  onPress={() =>
                    navigate("habit", {
                      date: date.toISOString(),
                    })
                  }
                />
              );
            })}

            {amountOfDaysToFill > 0 &&
              Array.from({ length: amountOfDaysToFill }).map((_, index) => (
                <View
                  key={index}
                  className="bg-yellow-900 rounded-lg border-2 m-1 border-yellow-800 opacity-40"
                  style={{
                    width: daySize,
                    height: daySize,
                  }}
                />
              ))}
          </View>
        )}
      </ScrollView>
      <Toast />
    </View>
  );
}
