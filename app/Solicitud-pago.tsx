import { StyleSheet, View, Text, TextInput, Pressable, Share, Linking, AppState } from 'react-native';
import { Image } from 'expo-image';
import { Link, router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ListHeader, OptionList, ParallaxScrollView } from '@/components';
import { countries } from '@/constants';
import { AntDesign } from '@expo/vector-icons';
import Modal from 'react-native-modal';

export default function SolicitudPagoScreen() {

  const { value, currency, url, identifier } = useLocalSearchParams();
  const appState = useRef(AppState.currentState);
  const [selectedCountry, setSelectedCountry] = useState(countries.at(0));
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [showList, setShowList] = useState(false)
  const [email, setEmail] = useState("")
  const [showModal, setShowModal] = useState(false);
  const [showTextShare, setshowTextShare] = useState("")

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

  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' && value && currency && url
      ) {
          setShowModal(true)
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const onShare = async () => {
    try {
      await Share.share({
        message:
          'Solicitud de pago: ' + url,
      });
    } catch (error: any) {
      console.log(error)
    }
  };

  const enviarWhatsapp = async () => {
    setshowTextShare("Tu solicitud de pago enviada ha sido enviado con éxito por WhatsApp.")
    await Linking.openURL(`whatsapp://send?phone=${selectedCountry?.id}${phoneNumber}&text=Solicitud de pago: ${url}`);
  }

  const enviarEmail = async () => {
    setshowTextShare("Tu solicitud de pago enviada ha sido enviado con éxito por Email.")
    await Linking.openURL(`mailto:${email}?subject=Solicitud de pago&body=${url}`)
  }

  const generateQR = () => {
    router.replace({
      pathname: '/Mostrar-qr-pago',
      params: {
        url,
        value,
        currency,
        identifier
      }
    })
  }

  const resetValues = () => {
    setshowTextShare("");
    setShowModal(false); 
  }

  if(showList){
    return (
      <View style={{marginTop: 10}}>
        <ListHeader showList={showList} setShowList={setShowList} title={"Seleccionar pais"} titleSelect={'Seleccionar pais'} selectedOpt={selectedCountry} />
        <OptionList optionsList={countries} setChangeValue={setSelectedCountry} selectedValue={selectedCountry} />
      </View>
    )
  }

  return (
    <View style={{flex: 1}}>
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#ffffff', dark: '#1D3D47' }}>
        <View style={styles.solicitud}>
            <Image
                  style={styles.image}
                  source={require('../assets/images/solicitud-pago.png')}
                  contentFit="cover"
              />
          <View style={styles.solicitudText}>
            <Text style={{color: 'gray', fontWeight: 'bold'}}>Solicitud de pago</Text>
            <Text style={{fontSize: 35, fontWeight: 'bold'}}>{`${value.toString().replaceAll('.',',')} ${currency}`}</Text>
          </View>
        </View>
        <Text style={{alignSelf: 'center', fontSize: 13, color: 'gray'}}>Comparte el enlace de pago con el cliente</Text>
        <View style={styles.inputsContainer}>
          <View style={styles.inputsView}>
            <Image
              style={{width: 20, height: 20}}
              source={require('../assets/images/link.png')}
              contentFit="cover"
            />
            <TextInput value={url.toString()} readOnly placeholder='Link de bitnovo' style={{...styles.inputs, width: 252, color: 'black'}} />
            <Pressable style={styles.buttonCode} onPress={generateQR}>
              <Image
                style={{width: 20, height: 20}}
                source={require('../assets/images/scan-barcode.png')}
                contentFit="cover"
              />
            </Pressable>
          </View>
          <View style={styles.inputsView}>
            <Image
              style={{width: 20, height: 20}}
              source={require('../assets/images/sms.png')}
              contentFit="cover"
            />
            <TextInput onChangeText={text => setEmail(text)} onFocus={() => !phoneNumber.length && setIsEditingPhone(false)} value={email} placeholder='Enviar por correo electronico' style={{...styles.inputs, width: email.includes("@") && email.length > 6 ? 240 : 350 }} />
            {
              email.length > 6 && email.includes('@') &&
                <Pressable style={{backgroundColor: '#035AC5', padding: 6,paddingHorizontal: 10, alignItems: 'center', borderRadius: 10}} onPress={enviarEmail}>
                  <Text style={{color: 'white'}}>Enviar</Text>
                </Pressable>
            }
          </View>
          <View style={{...styles.inputsView, gap:isEditingPhone ? 0 : 10, borderColor: isEditingPhone || phoneNumber ? '#035AC5' : '#D3DCE6'}}>
            <Image
              style={{width: 20, height: 20}}
              source={require('../assets/images/whatsapp.png')}
              contentFit="cover"
            />
            {
              isEditingPhone &&
                <Pressable style={{...styles.inputs, gap: 5, alignItems: 'center', width: 60, marginRight: 10}} onPress={() => setShowList(true)}>
                    <Text>{selectedCountry?.id}</Text>
                    <AntDesign name="caretdown" size={12} color="black" />
                </Pressable>
            }
            <TextInput onChangeText={text => setPhoneNumber(text)} keyboardType="numeric" onFocus={() => setIsEditingPhone(true)} value={phoneNumber} placeholder='Enviar a numero de whatsapp' style={{width: phoneNumber.length > 6 ? 170 : 230}} />
            {
              phoneNumber.length > 6 &&
                <Pressable style={{backgroundColor: '#035AC5', padding: 6,paddingHorizontal: 10, alignItems: 'center', borderRadius: 10}} onPress={enviarWhatsapp}>
                  <Text style={{color: 'white'}}>Enviar</Text>
                </Pressable>
            }
          </View>
          <View style={styles.inputsView}>
            <Image
              style={{width: 20, height: 20}}
              source={require('../assets/images/export.png')}
              contentFit="cover"
            />
            <Pressable style={styles.inputs} onPress={() => onShare()}>
              <Text>Compartir con otras aplicaciones</Text>
            </Pressable>
          </View>
        </View>
      </ParallaxScrollView>
      <View style={{gap: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 50}}>
        <Link style={{color: '#035AC5', fontSize: 20}} replace href="/"> Nueva solicitud</Link>
        <Image
          style={{width: 20, height: 20}}
          source={require('../assets/images/wallet-add.png')}
          contentFit="cover"
        />
      </View>
      {
          <Modal isVisible={showModal} style={styles.bottomModal}>
            <View style={styles.modalContent}>
            <Image
                  style={styles.image}
                  source={require('../assets/images/Icon_enviada.png')}
                  contentFit="cover"
              />
              <Text style={{fontSize: 25, fontWeight: 'bold'}}>Solicitud enviada</Text>
              <View style={{justifyContent: 'center', gap: 20}}>
                <Text style={{textAlign: 'center'}}>
                  {
                    showTextShare
                  }
                </Text>
                <Pressable style={{backgroundColor: '#035AC5', padding: 20, alignItems: 'center', borderRadius: 10}} onPress={resetValues}>
                    <Text style={{color: 'white'}}>Entendido</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
      }
    </View>
  );
}

const styles = StyleSheet.create({
  solicitud: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    flex: 1
  },
  solicitudText: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 70,
    height: 70,
  },
  inputsContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20
  },
  inputsView: {
    width: 340,
    height: 60,
    borderRadius: 5,
    paddingHorizontal: 10,
    flexDirection: 'row',
    borderColor: '#D3DCE6',
    borderWidth: 1,
    alignItems: 'center',
  },
  inputs: {
    width: 340,
    height: 60,
    borderRadius: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonCode: {
    backgroundColor: '#035AC5',
    padding: 30,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: 56,
    height: 56,
    borderRadius: 5
  },
  bottomModal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    paddingVertical: 50,
    paddingHorizontal: 20,
    gap: 30,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
    flexDirection: 'column',
    width: '100%',
  },
});
