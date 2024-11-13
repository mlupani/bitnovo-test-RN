import { StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Link, useLocalSearchParams } from 'expo-router';
import { ParallaxScrollView } from '@/components';
import ConfettiCannon from 'react-native-confetti-cannon';

export default function HomeScreen() {

  const { status } = useLocalSearchParams();

  return (
    <View style={styles.container}>
      {
        status === 'CO' ?
          <ConfettiCannon count={200} origin={{x: -10, y: 0}} /> : null
      }
      <Image
        style={{width: 80, height: 80, zIndex: -50}}
        source={require('../assets/images/Bitnovo-pay.png')}
        contentFit="contain"
      />
      <ParallaxScrollView headerBackgroundColor={{ light: '#ffffff', dark: '#1D3D47' }}>
        <View style={{flex: 1,justifyContent: 'space-around', alignItems: 'center', gap: 20, marginTop: 150}}>
          {/* <Image
              style={{width: 100, height: 100}}
              source={require('../assets/images/tick-circle.png')}
              contentFit="cover"
            /> */}
          <Text style={{fontSize: 20, fontWeight: 'bold', color: '#002859'}}>{status === 'CO' ? 'Pago recibido' : 'Pago cancelado'}</Text>
          <Text style={{color: '#647184', textAlign: 'center'}}>
            {
              status === 'CO' ? 'El pago se ha confirmado con &eacute;xito':
              'El pago ha sido cancelado'
            }
          </Text>
        </View>
        </ParallaxScrollView>
        <Link style={{color: '#035AC5', fontSize: 18, position: 'absolute', bottom: 50}} href="/">Finalizar</Link>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
  }
});
