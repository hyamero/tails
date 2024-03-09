import type { StateCreator } from "zustand";

type Transactions = {
  donationAmount: number;
};

type TransactionsSliceActions = {
  setDonation: (amount: number) => void;
};

export type TransactionsSlice = Transactions & TransactionsSliceActions;

export const createTransactionsSlice: StateCreator<TransactionsSlice> = (
  set,
) => ({
  donationAmount: 0,

  setDonation: (amount) =>
    set(() => ({
      donationAmount: amount,
    })),
});
