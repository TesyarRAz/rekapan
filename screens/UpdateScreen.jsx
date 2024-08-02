import {
    Text,
    SafeAreaView,
    View,
    Button,
    TextInput,
    TouchableOpacity,
  } from 'react-native';
  import { useEffect, useState } from 'react';
  import { Card, RadioButton } from 'react-native-paper';
  import { styles, formStyles } from '../styles/default';
  import DateTimePickerModal from 'react-native-modal-datetime-picker';
  import dayjs from 'dayjs'
import { useTransactionStore } from '../stores/transactions';
  
  // screen ini digunakan untuk data yang akan di edit
  // disini mirip seperti di createscreen, hanya saja ada props baru yang route dan transactions yang sangat dibutuhkan disini
  export default function UpdateScreen({
    navigation,
    route,
  }) {
    // kita ambil data transaction menggunakan index yang dipassing melalui navigation.navigate(route, params)
    const [item, setItem] = useState({})
    // kita buat property nya dimana hanya ada pemasukan dan pengeluaran, nah kita atur defaultnya ke pemasukan
    const [type, setType] = useState("");
    // kita buat juga untuk nama nya
    const [name, setName] = useState("");
    // buat juga untuk nominal yang dikeluarkan atau didapat
    const [nominal, setNominal] = useState(null);
    // buat state date dan juga visibility untuk date picker
    const [date, setDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

    // gunakan store state transactions
    const { showTransaction, updateTransaction } = useTransactionStore()

    useEffect(() => {
      const search = async () => {
        const transaction = await showTransaction(route.params.id)

        setItem(transaction)
      }

      search()
    }, [route.params.id, showTransaction])

    useEffect(() => {
      setType(item.type)
      setName(item.name)
      setNominal(item.nominal?.toString())
      setDate(item.date)
    }, [item])
  
    // ini aksi yg akan dijalankan ketika tombol simpan di click
    const handleUpdate = () => {
      // karena react perlu untuk merubah state untuk memperbarui tampilan, maka kita akan menggunakan refresh state dengan data yg sudah ada
      updateTransaction({
        ...item,
        type,
        name,
        nominal,
        date,
      })
  
      // navigasi kan lagi ke home ketika sudah selesai
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
          <Button title="Simpan" onPress={handleUpdate} />
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
  