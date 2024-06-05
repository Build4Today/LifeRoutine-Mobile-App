import { useState } from "react";
import {
  TouchableOpacity,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { api } from "../lib/api";
import Toast from "react-native-toast-message";

import colors from "tailwindcss/colors";
import { Feather } from "@expo/vector-icons";
import { BackButton } from "../components/BackButton";
import { Checkbox } from "../components/Checkbox";
import { weekDaysEUFormat } from "../lib/date.format";

export function New() {
  const [weekDays, setWeekDays] = useState<number[]>([]);
  const [title, setTitle] = useState<string>("");

  function handleToggleWeekDay(weekDayIndex: number) {
    if (weekDays.includes(weekDayIndex)) {
      setWeekDays((prevState) =>
        prevState.filter((weekDay) => weekDay !== weekDayIndex)
      );
    } else {
      setWeekDays((prevState) => [...prevState, weekDayIndex]);
    }
  }

  const { navigate } = useNavigation();

  async function handleCreateNewHabit() {
    try {
      if (!title || weekDays.length === 0) {
        Toast.show({
          type: "info",
          text1: "Missing Routine",
          text2: "Select a name and commitment",
        });
        return;
      }
      const payload = { title, weekDays };
      await api.post("/habits", payload);
      Toast.show({
        type: "success",
        text1: "Habit created",
        text2: "Your habit was successfully created!",
      });
      setTitle("");
      setWeekDays([]);
      navigate("home");
    } catch (error: any | Error) {
      console.log(error);
      Toast.show({
        type: "error",
        text1: "Oops...",
        text2: error.message,
      });
    }
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView showsVerticalScrollIndicator={false}>
        <BackButton />
        <Text className="mt-6 font-extrabold text-3xl text-white">
          Create routine
        </Text>
        <Text className="mt-6 font-semibold text-base text-white">
          What's the commitment?
        </Text>
        <TextInput
          className="h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white focus:border-2 border-zinc-800 focus:border-green-600"
          placeholder="ex.: Workout, Sleep 8h, etc..."
          placeholderTextColor={colors.zinc[400]}
          value={title}
          onChangeText={setTitle}
        />
        <Text className="mt-6 font-semibold text-base text-white">
          What is the recurrence?
        </Text>
        {weekDaysEUFormat.map((weekDay, index) => (
          <Checkbox
            key={weekDay}
            title={weekDay}
            checked={weekDays.includes(index)}
            onPress={async () => handleToggleWeekDay(index)}
          />
        ))}

        <TouchableOpacity
          className="w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6"
          activeOpacity={0.7}
          onPress={handleCreateNewHabit}
        >
          <Feather name="check" size={20} color={colors.white} />
          <Text className="font-semibold text-base text-white ml-2">
            Confirm
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
