import { useEffect, useState } from 'react';
import { ScrollView, View, Text, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';

import dayjs from 'dayjs';
import clsx from 'clsx';
import { api } from '../lib/api';

import { Loading } from '../components/Loading';
import { BackButton } from '../components/BackButton';
import { ProgressBar } from '../components/ProgressBar';
import { Checkbox } from '../components/Checkbox';
import { HabitsEmpty } from '../components/HabitsEmpty';

import { generateProgressPercentage } from '../utils/generate-progress-percentage';
interface Params {
    date: string;
}

interface DayInfoProps {
    completedHabits: string[];
    possibleHabits: {
        id: string;
        title: string;
    }[];
}

export function Habit() {
    const [isLoading, setIsLoading] = useState(true);
    const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null);
    const [completedHabits, setCompletedHabits] = useState<string[]>([]);

    const route = useRoute();
    const { date } = route.params as Params;

    // date validation
    const parsedDate = dayjs(date);
    const isDateInPast = parsedDate.endOf('day').isBefore(new Date());
    const dayOfWeek = parsedDate.format('dddd');
    const dayAndMonth = parsedDate.format('DD/MM');

    const habitsProgress = dayInfo?.possibleHabits.length
        ? generateProgressPercentage(
              dayInfo.possibleHabits.length,
              completedHabits.length
          )
        : 0;

    async function fetchHabits() {
        setIsLoading(true);
        try {
            const response = await api.get('/day', { params: { date } });
            setDayInfo(response.data);
            setCompletedHabits(response.data.completedHabits);
        } catch (error) {
            console.log(error);
            Alert.alert('Unable to load data', 'Unable to retrieve your routines. Try again later');
        } finally {
            setIsLoading(false);
        }
    }

    async function handleToggleHabit(habitId: string) {
        try {
            await api.patch(`/habits/${habitId}/toggle`);

            if (completedHabits.includes(habitId)) {
                setCompletedHabits((prevState) =>
                    prevState.filter((habit) => habit !== habitId)
                );
            } else {
                setCompletedHabits((prevState) => [...prevState, habitId]);
            }
        } catch (error: any | Error) {
            console.log(error);
            Alert.alert(
                'Cannot update the routine status',
                `${error.message}. Try again later`
            );
        }
    }

    useEffect(() => {
        fetchHabits();
    }, []);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <View className='flex-1 bg-background px-8 pt-16 '>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 100 }}
            >
                <BackButton />

                <Text className='mt-6 text-zinc-400 font-semibold text-base lowercase'>
                    {dayOfWeek}
                </Text>

                <Text className='text-white font-extrabold text-3xl'>
                    {dayAndMonth}
                </Text>

                <ProgressBar progress={habitsProgress} />

                <View
                    className={clsx('mt-6', {
                        ['opacity-50']: isDateInPast,
                    })}
                >
                    {dayInfo?.possibleHabits ? (
                        dayInfo?.possibleHabits.map((habit) => (
                            <Checkbox
                                key={habit.id}
                                title={habit.title}
                                disabled={isDateInPast}
                                checked={completedHabits.includes(habit.id)}
                                onPress={() => handleToggleHabit(habit.id)}
                            />
                        ))
                    ) : (
                        <HabitsEmpty />
                    )}
                </View>
            </ScrollView>
        </View>
    );
}
