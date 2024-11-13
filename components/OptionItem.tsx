import { Currency } from "@/interfaces/Currency";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from 'expo-image';
import AntDesign from '@expo/vector-icons/AntDesign';


interface Props {
    option: any;
    setOptionSelected: React.Dispatch<React.SetStateAction<any>>;
    optionSelected: any;
}

export const OptionItem = ({option, optionSelected, setOptionSelected}: Props) => {
  return (
    <Pressable style={styles.buttonCurrency} key={option.id} onPress={() => { setOptionSelected(option); }}>
        <View style={{width: 50, height: 50, borderRadius: 50, overflow: 'hidden', alignItems: 'center'}}>
            <Image
                style={styles.image}
                source={option.image}
                contentFit="cover"
            />
        </View>
        <View style={{flex: 1}}>
            <Text>{option.id}</Text>
            <Text>{option.name}</Text>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'flex-end', marginRight: 20}}>
            {
                optionSelected.id == option.id ? 
                <AntDesign name="checkcircle" size={20} color="#71B0FD" /> :
                <AntDesign name="right" size={20} color="gray" />
            }
        </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
    buttonCurrency: {
        backgroundColor: '#ffffff',
        height: 50,
        width: 'auto',
        flexDirection: 'row',
        alignItems: 'center',
        margin: 10,
        gap: 10,
    },
    image: {
        width: 90,
        height: 50,
        borderRadius: 75,
    }
})
