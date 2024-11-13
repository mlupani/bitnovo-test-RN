import { StyleSheet, View, Text, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ParallaxScrollView } from '@/components';
import QRCode from 'react-native-qrcode-svg';
import { AntDesign } from '@expo/vector-icons';
import { useEffect } from 'react';

export default function MostrarQRPago() {

  const { value, currency, url, identifier } = useLocalSearchParams();

  const ws = new WebSocket(`wss://payments.pre-bnvo.com/ws/merchant/${identifier}`);

  ws.onmessage = function (event) {
    const data = JSON.parse(event.data);
    try {
      const { url_ok, status } = data
      if(status){
        router.replace({
          pathname: url_ok ?? '/Pago-recibido',
          params: {
            status
          }
        })
      }
      ws.close();
    } catch (err) {
      console.log(err);
    }
  };
 
  return (
    <View style={{flex: 1}}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#ffffff', dark: '#1D3D47' }}>
        <View style={styles.header}>
          <Pressable style={{marginLeft: 10, marginRight: 50}} onPress={() => router.navigate({
            pathname: '/Solicitud-pago',
            params: {
              url,
              value,
              currency
            }
          })}>
              <AntDesign name="arrowleft" size={24} color="black" />
          </Pressable>
        </View>
        <View style={styles.content}>
          <View style={styles.info}>
            <AntDesign name="infocirlceo" size={20} color="blue" />
            <Text style={{marginHorizontal: 10, fontSize: 13, color: '#002859'}}>
              Escanea el QR y serás redirigido a la pasarela de pago de Bitnovo Pay.
            </Text>
          </View>
          <View style={styles.qrCode}>
            <QRCode size={260} color='#1d2973' value={(url) as string} />
          </View>
          <Text style={styles.value}>
            {value} {currency}
          </Text>
          <Text style={{color: 'white'}}>
            Esta pantalla se actualizará automáticamente.
          </Text>
          <View style={{flex: 1}} />
        </View>
      </ParallaxScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
    marginBottom: 8,
  },
  info: {
    width: 330,
    height: 60,
    backgroundColor: '#EAF3FF',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    gap: 5,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingLeft: 20,
  },
  qrCode: {
    width: 330,
    height: 300,
    backgroundColor: 'white',
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
    //flex: 1,
    backgroundColor: '#035AC5',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
    gap: 30,
    paddingTop: 30
  },
  value: {
    color: 'white',
    fontSize: 30,
    fontWeight: 'bold',
  }
});
