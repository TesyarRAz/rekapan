import {
  Text,
  View,
  Button,
  TouchableOpacity,
  Alert,
  RefreshControl,
  FlatList,
} from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { Card } from "react-native-paper";
import { AntDesign, EvilIcons } from "@expo/vector-icons";
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { styles } from "../styles/default";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import dayjs from "dayjs";
import { formatNumber } from "../utils";
import { useTransactionStore } from "../stores/transactions";
import { useFocusEffect } from "@react-navigation/native";
import { supabase } from "../lib/supabase";

export default function HomeScreen({ navigation, route }) {
  const {
    transactions,
    previousTransactionTotal,
    removeTransaction,
    currentTransactionTotal,
    fetchTransactions,
    transactionError,
    selectedDate,
    setSelectedDate,
  } = useTransactionStore();

  // kita buat state untuk visiblity date picker dan juga value nya
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);

    try {
      await fetchTransactions(selectedDate);
    } finally {
      setRefreshing(false);
    }
  }, [fetchTransactions, selectedDate]);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  //buat listener ketika focus
  useFocusEffect(
    useCallback(() => {
      fetchTransactions();
    }, [fetchTransactions])
  );

  useEffect(() => {
    if (transactionError) {
      Alert.alert("Error", transactionError.message);
    }
  }, [transactionError]);

  // disini kita membuat fungsi handle remove, disini agak berbeda dengan create ketika submit dan juga update ketika submit
  // perlu untuk mereturn callback yg digunakan, dikarenakan setiap button memiliki index yang berbeda beda
  const handleRemove = (transaction) => {
    return () => {
      // munculkan aler konfirmasi
      Alert.alert("Konfirmasi", "Yakin ingin dihapus ?", [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Ya",
          onPress: async () => {
            // kita hapus transactionnya
            removeTransaction(transaction);

            fetchTransactions();
          },
        },
      ]);
    };
  };

  // ini digunakan untuk menambahkan button + di appbar
  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity
          onPress={() => {
            Alert.alert("Konfirmasi", "Yakin ingin logout ?", [
              {
                text: "Cancel",
                style: "cancel",
              },
              {
                text: "Ya",
                onPress: async () => {
                  supabase.auth.signOut()
                },
              },
            ]);
          }}
        >
          <SimpleLineIcons name="logout" size={24} color="black" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("create", {
              selectedDate: selectedDate.toISOString(),
            });
          }}
        >
          <AntDesign name="plus" size={24} color="black" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, selectedDate]);

  return (
    <FlatList
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
      data={transactions}
      keyExtractor={(e) => e.id}
      style={{
        marginTop: 10,
      }}
      ListHeaderComponent={
        <>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            date={selectedDate}
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
          <Button
            title={dayjs(selectedDate).format("DD-MM-YYYY")}
            style={{ marginBottom: 50 }}
            onPress={showDatePicker}
          />
          <Text
            style={{ marginTop: 10, marginBottom: 10, marginHorizontal: 10 }}
          >
            Nominal Sebelumnya : {formatNumber(previousTransactionTotal)}
          </Text>
        </>
      }
      renderItem={({ item }) => (
        <Card style={styles.item}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View>
              <View style={{ marginBottom: 5 }}>
                <Text style={{ fontSize: 16 }}>Jenis</Text>
                <Text>{item.type}</Text>
              </View>
              <View style={{ marginBottom: 5 }}>
                <Text style={{ fontSize: 16 }}>Name</Text>
                <Text>{item.name}</Text>
              </View>
              <View style={{ marginBottom: 5 }}>
                <Text style={{ fontSize: 16 }}>Nominal</Text>
                <Text>{formatNumber(item.nominal)}</Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "space-evenly",
              }}
            >
              <TouchableOpacity onPress={handleRemove(item)}>
                <EvilIcons name="trash" size={24} color="red" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.push("update", { id: item.id });
                }}
              >
                <EvilIcons name="pencil" size={24} color="green" />
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      )}
      ListFooterComponent={
        <>
          <Text
            style={{
              display: transactions.length > 0 ? "none" : "block",
              marginHorizontal: 10,
            }}
          >
            Tidak ada data
          </Text>
          <Text
            style={{
              display: transactions.length === 0 ? "none" : "block",
              marginHorizontal: 10,
            }}
          >
            Total : {formatNumber(currentTransactionTotal)}
          </Text>
        </>
      }
      ListFooterComponentStyle={{
        marginTop: 10,
        marginBottom: 30,
      }}
    />
  );
}
