import { View, StyleSheet, ActivityIndicator } from 'react-native';

export function Loading() {
    return (
        <View style={styles.loading}>
            <ActivityIndicator color='#FCD089' />
        </View>
    );
}

const styles = StyleSheet.create({
    loading: {
        flex: 1,
        backgroundColor: '#09090A',
        justifyContent: 'center',
        alignItems: 'center',
    },
});
