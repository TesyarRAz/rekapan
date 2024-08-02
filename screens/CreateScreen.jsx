import {
    Text,
    SafeAreaView,
    View,
    Button,
    TextInput,
    TouchableOpacity,
  } from 'react-native';
  import { useState } from 'react';
  import { Card, RadioButton } from 'react-native-paper';
  import { styles, formStyles } from '../styles/default';
  import DateTimePickerModal from 'react-native-modal-datetime-picker';
  import dayjs from 'dayjs';
import { useTransactionStore } from '../stores/transactions';
  
  // Screen untuk tambah transaksi
  // disini kita pakai props yang di passing dari App.js
  export default function CreateScreen({ navigation, route }) {
    // kita buat property nya dimana hanya ada pemasukan dan pengeluaran, nah kita atur defaultnya ke pemasukan
    const [type, setType] = useState('pemasukan');
    // kita buat juga untuk nama nya
    const [name, setName] = useState('');
    // buat juga untuk nominal yang dikeluarkan atau didapat
    const [nominal, setNominal] = useState(0);
    // buat state date dan juga visibility untuk date picker
    const [date, setDate] = useState(route.params.selectedDate ? new Date(route.params.selectedDate) : new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    // gunakan store state transactions
    const { 
      addTransaction,
    } = useTransactionStore()
  
    // ini fungsi yang digunakan ketika tombol simpan di click
    const handleAdd = () => {
      // kita tambahkan transaction baru yang sudah di buat ke state yg ada di app
      addTransaction({
        type,
        name,
        nominal,
        date,
      })
  
      // ketika sudah diisi, kita pindah ke home lagi
      navigation.navigate('home');
    };
  
    const showDatePicker = () => {
      setDatePickerVisibility(true);
    };
  
    const hideDatePicker = () => {
      setDatePickerVisibility(false);
    };
  
    const handleConfirm = (date) => {
      setDate(date);
      hideDatePicker();
    };
  
    return (
      <SafeAreaView style={styles.container}>
        <Card style={formStyles.form}>
          <View style={formStyles.formGroup}>
            <Text style={formStyles.header}>Tanggal</Text>
            <Button
              title={dayjs(date).format('DD-MM-YYYY')}
              onPress={showDatePicker}
            />
          </View>
          <View style={formStyles.formGroup}>
            <Text style={formStyles.header}>Jenis Transaksi</Text>
            <RadioButton.Group value={type} onValueChange={setType}>
              <View style={formStyles.radioGroup}>
                <View style={formStyles.inputRadio}>
                  <RadioButton value="pemasukan"></RadioButton>
                  <TouchableOpacity onPress={() => setType('pemasukan')}>
                    <Text>Pemasukan</Text>
                  </TouchableOpacity>
                </View>
                <View style={formStyles.inputRadio}>
                  <RadioButton value="pengeluaran"></RadioButton>
                  <TouchableOpacity onPress={() => setType('pengeluaran')}>
                    <Text>Pengeluaran</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </RadioButton.Group>
          </View>
  
          <View style={formStyles.formGroup}>
            <Text style={formStyles.header}>Nama</Text>
            <TextInput
              style={formStyles.input}
              value={name}
              onChangeText={setName}
            />
          </View>
          <View style={formStyles.formGroup}>
            <Text style={formStyles.header}>Nominal</Text>
            <TextInput
              style={formStyles.input}
              value={nominal}
              onChangeText={setNominal}
              inputMode="numeric"
            />
          </View>
        </Card>
        <View
          style={{
            flexDirection: 'row',
            margin: 12,
            justifyContent: 'flex-end',
          }}>
          <Button title="Simpan" onPress={handleAdd} />
        </View>
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          date={date}
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
        />
      </SafeAreaView>
    );
  }
  