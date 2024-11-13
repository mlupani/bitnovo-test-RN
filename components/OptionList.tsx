import { View, TextInput, StyleSheet, ScrollView, Dimensions } from "react-native"
import { useState } from "react"
import { OptionItem } from "./OptionItem"

interface Props {
    optionsList: any[];
    selectedValue: any;
    setChangeValue: React.Dispatch<React.SetStateAction<any>>
}

export const OptionList = ({optionsList, setChangeValue, selectedValue}: Props) => {
  const [search, setSearch] = useState('')
  return (
    <View style={{marginTop: 20}}>
        <TextInput value={search} onChangeText={val => setSearch(val)} placeholder='Buscar' style={styles.searchInput} keyboardType="default" />
        <ScrollView style={{marginTop: 10, flexGrow: 1, height: Dimensions.get('screen').height - 200}}>
            <View style={{marginTop: 20, marginHorizontal: 10}}>
            {
                optionsList.map((option) => {
                if(!search)
                    return (
                        <OptionItem key={option.id} option={option} setOptionSelected={setChangeValue} optionSelected={selectedValue}  />
                    )
                else if(option.id.toLowerCase().includes(search.toLowerCase()) || option.name.toLowerCase().includes(search.toLowerCase()))
                    return (
                        <OptionItem key={option.id} option={option} setOptionSelected={setChangeValue} optionSelected={selectedValue}  />
                    )
                })
            }
            </View>
        </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
    searchInput: {
        height: 60,
        borderColor: '#E5E9F2',
        borderWidth: 1,
        paddingHorizontal: 30,
        marginHorizontal: 20,
    }
})
