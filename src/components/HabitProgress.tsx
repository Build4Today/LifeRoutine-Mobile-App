import React from 'react';
import { View, Text } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

interface Props {
  progress: number[];
}

export function HabitProgress({ progress }: Props) {
  return (
    <View className='mt-6'>
      <Text className='text-white font-semibold mb-2'>Progress</Text>
      <LineChart
        data={{
          labels: progress.map((_, index) => (index + 1).toString()),
          datasets: [
            {
              data: progress,
            },
          ],
        }}
        width={300}
        height={200}
        chartConfig={{
          backgroundGradientFrom: '#1E2923',
          backgroundGradientTo: '#08130D',
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        }}
      />
    </View>
  );
}
