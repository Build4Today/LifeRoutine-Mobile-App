import {
    TouchableOpacity,
    Dimensions,
    TouchableOpacityProps,
} from 'react-native';
import dayjs from 'dayjs';
import clsx from 'clsx';

import { generateProgressPercentage } from '../utils/generate-progress-percentage';

interface Props extends TouchableOpacityProps {
    amountOfHabits?: number;
    amountCompleted?: number;
    date: Date;
}

const weekDays = 7;
const screenHorizontalPadding = (32 * 2) / 5;
export const dayGap = 8;
export const daySize =
    Dimensions.get('screen').width / weekDays - (screenHorizontalPadding + 5);

export function HabitDay({
    amountOfHabits = 0,
    amountCompleted = 0,
    date,
    ...rest
}: Props) {
    const amountAccomplishedPercentage =
        amountOfHabits > 0
            ? generateProgressPercentage(amountOfHabits, amountCompleted)
            : 0;
    const today = dayjs().startOf('day').toDate();
    const isCurrentDay = dayjs(date).isSame(today);

    return (
        <TouchableOpacity
            className={clsx('rounded-lg border-2 m-1', {
                ['bg-zinc-900 border-zinc-800']:
                    amountAccomplishedPercentage === 0,
                ['bg-yellow-900 border-yellow-700']:
                    amountAccomplishedPercentage > 0 &&
                    amountAccomplishedPercentage < 20,
                ['bg-yellow-800 border-yellow-600']:
                    amountAccomplishedPercentage >= 20 &&
                    amountAccomplishedPercentage < 40,
                ['bg-yellow-700 border-yellow-500']:
                    amountAccomplishedPercentage >= 40 &&
                    amountAccomplishedPercentage < 60,
                ['bg-yellow-600 border-yellow-500']:
                    amountAccomplishedPercentage >= 60 &&
                    amountAccomplishedPercentage < 80,
                ['bg-yellow-500 border-yellow-400']:
                    amountAccomplishedPercentage >= 80,
                ['border-white border-4']: isCurrentDay,
            })}
            style={{ width: daySize, height: daySize }}
            activeOpacity={0.7}
            {...rest}
        />
    );
}
