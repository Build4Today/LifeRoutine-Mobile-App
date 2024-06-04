import { useState } from 'react';
import {
    TouchableOpacity,
    ScrollView,
    Text,
    TextInput,
    View,
    Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { api } from '../lib/api';

import colors from 'tailwindcss/colors';
import { Feather } from '@expo/vector-icons';
import { BackButton } from '../components/BackButton';
import { Checkbox } from '../components/Checkbox';

const availableWeekDays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];

export function New() {
    const [weekDays, setWeekDays] = useState<number[]>([]);
    const [title, setTitle] = useState<string>('');

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
                return Alert.alert(
                    'Missing habit',
                    'Please select your new routine name and commitment'
                );
            }
            await api.post('/habits', { title, weekDays });
            // Alert.alert(
            //     'Habit created',
            //     'Your habit was successfully created!'
            // );
            setTitle('');
            setWeekDays([]);
        } catch (error: any | Error) {
            console.log(error);
            Alert.alert('Ooops...',  error.message);
        } finally {
            navigate('home');
        }
    }

    return (
        <View className='flex-1 bg-background px-8 pt-16 '>
            <ScrollView showsVerticalScrollIndicator={false}>
                <BackButton />
                <Text className='mt-6 font-extrabold text-3xl text-white'>
                    Create habit
                </Text>
                <Text className='mt-6 font-semibold text-base text-white'>
                    What is your commitment?
                </Text>
                <TextInput
                    className='h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white focus:border-2 border-zinc-800 focus:border-green-600'
                    placeholder='ex.: Workout, Sleep 8h, etc...'
                    placeholderTextColor={colors.zinc[400]}
                    value={title}
                    onChangeText={setTitle}
                />
                <Text className='mt-6 font-semibold text-base text-white'>
                    What is the recurrence?
                </Text>
                {availableWeekDays.map((weekDay, index) => (
                    <Checkbox
                        key={weekDay}
                        title={weekDay}
                        checked={weekDays.includes(index)}
                        onPress={async () => handleToggleWeekDay(index)}
                    />
                ))}

                <TouchableOpacity
                    className='w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6'
                    activeOpacity={0.7}
                    onPress={handleCreateNewHabit}
                >
                    <Feather name='check' size={20} color={colors.white} />
                    <Text className='font-semibold text-base text-white ml-2'>
                        Confirm
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}
