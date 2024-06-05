import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export function HabitsEmpty() {
    const { navigate } = useNavigation();

    return (
        <Text className='text-zinc-400 text-base'>
            You're still not tracking any habit{'   '}
            <Text
                className='text-yellow-400 text-base underline active:text-yellow-500'
                onPress={() => navigate('new')}
            >
                Start routine
            </Text>
        </Text>
    );
}
