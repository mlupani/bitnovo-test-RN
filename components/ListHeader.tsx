import { Pressable, StyleSheet, Text, View } from "react-native";
import { Currency } from "@/interfaces/Currency";
import AntDesign from '@expo/vector-icons/AntDesign';


interface Props {
    title: string;
    titleSelect: string;
    selectedOpt: any;
    showList: boolean;
    setShowList: React.Dispatch<React.SetStateAction<boolean>>
}

export const ListHeader = ({title, titleSelect, selectedOpt, showList, setShowList}: Props) => {

  return (
    <View style={{flexDirection: 'row', justifyContent: !showList ? 'space-between': 'flex-start', alignItems: 'center'}}>
        {
            !showList &&
                <View style={{width: 50}}></View>
        }
        {
            showList &&
                <Pressable style={{marginLeft: 20, marginRight: 50}} onPress={() => setShowList(false)}>
                    <AntDesign name="arrowleft" size={24} color="black" />
                </Pressable>
        }
        <Text style={styles.title}>
            {
                showList ? titleSelect : title
            }
        </Text>
        {
            !showList &&
                <Pressable style={{display: 'flex', justifyContent: 'flex-end', flexDirection: 'row', alignItems: 'center', gap: 5, marginRight: 20}} onPress={() => setShowList(true)}>
                    <Text style={{fontWeight: 'bold'}}>{selectedOpt.id}</Text>
                    <AntDesign name="caretdown" size={12} color="black" />
                </Pressable>
        }
    </View>
  )
}

const styles = StyleSheet.create({
    containerHeader: {
        flexDirection: 'row',
        marginBottom: 20,
        borderBottomColor: 'gray',
        borderBottomWidth: 1,
        paddingBottom: 30,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: "#002859",
    }
  });
