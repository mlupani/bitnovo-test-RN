import { StyleSheet, View, Text, TextInput, Pressable, Keyboard } from 'react-native';
import { useEffect, useState } from 'react';
import { ListHeader, OptionList, ParallaxScrollView} from '@/components';
import { currencyList, CHARACTER_LIMIT, deviceId } from '@/constants';
import { Currency } from '@/interfaces';
import { router } from 'expo-router';

export default function CrearPagoScreen() {
  const [currencySelected, setCurrencySelected] = useState<Currency>(currencyList.at(0)!);
  const [showList, setShowList] = useState(false);
  const [value, setValue] = useState<string | undefined>();
  const [concept, setConcept] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [sended, setSended] = useState(false)

  const solicitudPago = async () => {
    if(!value) return;
    setSended(true);
    const valueToSend = value;
    const currencySymbolSelected = currencySelected.symbol;
    const conceptSelected = concept;
    const resp = await fetch('https://payments.pre-bnvo.com/api/v1/orders/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-device-id': deviceId
      },
      body: JSON.stringify({
        expected_output_amount: Number(valueToSend.replaceAll('.', ',')).toFixed(2),
        notes: conceptSelected,
        merchant_urlok: '/Pago-recibido',
      })
    });
    const { web_url, identifier } = await resp.json();
    setCurrencySelected(currencyList.at(0)!);
    setValue("");
    setConcept("");
    setSended(false);
    router.navigate({ pathname: '/Solicitud-pago', params: {
      value: Number(valueToSend.replaceAll('.', ',')).toFixed(2),
      currency: currencySymbolSelected,
      concept: conceptSelected,
      url: web_url,
      identifier
    }});
  }

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => setIsEditing(true));
    Keyboard.addListener('keyboardDidHide', () => setIsEditing(false));

    return () => {
      showSubscription.remove();
    }
  }, []);

  return (
    <View style={{flex: 1}}>
          <ParallaxScrollView headerBackgroundColor={{ light: '#ffffff', dark: '#1D3D47' }}>
            <ListHeader showList={showList} setShowList={setShowList} titleSelect='Selecciona una divisa' title={!isEditing ? "Crear Pago" : "Importe a pagar"} selectedOpt={currencySelected} />
            {
              !showList ? (
                  <View style={{flex: 1, justifyContent: 'space-between'}}>
                    <View style={{...styles.inputContainer, height: isEditing ? 150 : 300}}>
                        <TextInput placeholderTextColor={'#C0CCDA'} onPress={() => setIsEditing(true)} style={styles.valueInput} placeholder={value ? '' : `${currencySelected.symbol} 0.00`} 
                        value={`${value ?? '' }`}
                        keyboardType="numeric" onChangeText={(text) => setValue(text.replaceAll('.', ','))} />
                        {
                          value &&
                          <Text style={styles.valueInput}>
                            {currencySelected.symbol}
                          </Text>
                        }
                    </View>
                    <View style={{...styles.conceptContainer }}>
                      <Text style={{fontWeight: 'bold'}}>Concepto</Text>
                      <TextInput multiline={true} value={concept.substring(0,CHARACTER_LIMIT - 1)} onChangeText={val => setConcept(val)} placeholder='Añade descripción del pago' style={styles.inputConcept} keyboardType="default" />
                      {
                        concept &&
                          <Text style={{alignSelf: 'flex-end', color: 'gray'}}>{concept.length}/{CHARACTER_LIMIT} caracteres</Text>
                      }
                    </View>
                  </View>
                )
              :
              (
                <OptionList optionsList={currencyList} setChangeValue={setCurrencySelected} selectedValue={currencySelected} />
              )
            }
        </ParallaxScrollView>
        {
          !showList &&
          <Pressable disabled={sended} style={{...styles.buttonContinuar, backgroundColor: value ? '#035AC5' : '#EAF3FF'}}
          onPress={solicitudPago}>
            <Text style={{color: value ? 'white' : '#71B0FD', fontSize: 18}}>
              {sended ? 'Enviando...' : 'Continuar'}
            </Text>
          </Pressable>
        }
      </View>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginBottom: 20
  },
  valueInput: {
      fontSize: 50,
      textAlign: 'center',
      color: '#035AC5',
      width: 'auto',
  },
  conceptContainer: {
    flexDirection: 'column',
    flex: 1,
    marginBottom: 20,
    marginHorizontal: 20
  },
  inputConcept: {
    maxHeight: 120,
    height: 56,
    flex: 1,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  buttonContinuar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignSelf: 'center',
    marginVertical: 30,
    padding: 20,
    borderRadius: 10,
    width: 350,
  }
});
