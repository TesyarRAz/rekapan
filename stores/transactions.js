import { create } from "zustand";
import { combine } from "zustand/middleware";
import { supabase } from "../lib/supabase";
import dayjs from "dayjs";

const transactionAccessor = (transaction) => {
  return {
    ...transaction,
    date: new Date(transaction.date),
  };
};

export const useTransactionStore = create(
  combine(
    {
      transactions: [],
      selectedDate: new Date(),
      transactionError: null,
      previousTransactionTotal: 0,
      currentTransactionTotal: 0,
    },
    (set, get) => {
      const getPreviousTransactionTotal = async (selectedDate) => {
        const { data } = await supabase
            .rpc('sum_transactions', {
              selecteddate: selectedDate.toISOString(),
            })
            .single()

        console.log(data);

        return data;
      };

      const getCurrentTransactionTotal = (transactions) => {
        return transactions
          .map((e) => e.nominal * (e.type === "pemasukan" ? 1 : -1))
          .reduce((a, b) => a + b, 0);
      };

      const fetchTransactions = async () => {
        const { selectedDate } = get();
        console.log("fetch");

        const { data } = await supabase
          .from("transactions")
          .select()
          .order("id", {
            ascending: false,
          })
          .eq("date", dayjs(selectedDate).format("YYYY-MM-DD"));

        const previousTransactionTotal = await getPreviousTransactionTotal(
          selectedDate
        );

        set(() => ({
          transactions: data.map(transactionAccessor),
          transactionError: null,
          previousTransactionTotal,
          currentTransactionTotal:
            previousTransactionTotal + getCurrentTransactionTotal(data),
        }));
      };

      return {
        addTransaction: async (transaction) => {
          const { error } = await supabase.from("transactions").insert({
            ...transaction,
            date: transaction.date.toISOString(),
          });

          set(() => ({
            transactionError: error,
          }));
        },
        removeTransaction: async (transaction) => {
          const { error } = await supabase
            .from("transactions")
            .delete()
            .eq("id", transaction.id);

          set(() => ({
            transactionError: error,
          }));
        },
        updateTransaction: async (transaction) => {
          const { error } = await supabase
            .from("transactions")
            .update({
              ...transaction,
              date: transaction.date.toISOString(),
            })
            .eq("id", transaction.id);

          set(() => ({
            transactionError: error,
          }));
        },
        showTransaction: async (id) => {
          const { data, error } = await supabase
            .from("transactions")
            .select()
            .eq("id", id)
            .limit(1)
            .single();
          set(() => ({
            transactionError: error,
          }));
          return transactionAccessor(data);
        },
        setSelectedDate: (selectedDate) => {
          set(() => ({
            selectedDate,
          }));

          fetchTransactions();
        },
        clearError: () => {
          set(() => ({
            transactionError: null,
          }));
        },
        fetchTransactions,
      };
    }
  )
);
