import { createStore } from 'vuex';

export default createStore({
  state: {
    expenses: [],
    incomes: [],
  },
  mutations: {
    addExpense(state, newExpense) {
      state.expenses.push(newExpense);
    },
    addIncome(state, newIncome) {
      state.incomes.push(newIncome);
    },
  },
  actions: {
    addExpense({ commit }, newExpense) {
      commit('addExpense', newExpense);
    },
    addIncome({ commit }, newIncome) {
      commit('addIncome', newIncome);
    },
  },
  getters: {
    recentTransactions: (state) => (start = 0,limit = 10) => {
      return state.transactions.slice(start, limit);
    },
    fetchExpenses: (state) => {
      return state.expenses.length;
    },
    fetchIncomes: (state) => {
      return state.incomes.length;
    },
  },
});
