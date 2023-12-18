<template>
  <div>
    <!-- Overview Cards -->
    <div class="overview-cards">
        <v-card>
            <v-card-title>Total Expenses</v-card-title>
            <v-card-text>{{ totalExpenses }}</v-card-text>
        </v-card>
        <!-- Expense form -->
        <form @submit.prevent="addNewExpense">
            <input type="text" v-model="newExpense.description" placeholder="Description">
            <input type="number" v-model="newExpense.amount" placeholder="Amount">
            <v-btn type="submit">Add Expense</v-btn>
        </form>
    </div>
    <div class="overview-cards">
      <v-card>
        <v-card-title>Total Incomes</v-card-title>
        <v-card-text>{{ totalIncomes }}</v-card-text>
      </v-card>
    </div>

    <!-- Transaction List -->
    <div class="transaction-list">
      <v-card>
        <v-card-title>Recent Transactions</v-card-title>
        <v-card-text>
          <ul>
            <li v-for="transaction in recentTransactions" :key="transaction.id">
              {{ transaction.amount }} - {{ transaction.category }}
            </li>
          </ul>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Dashboard',
  data() {
    return {
      newExpense: {
        description: '',
        amount: 0,
      },
    };
  },
  methods: {
    addNewExpense() {
      this.$store.dispatch('addExpense', this.newExpense);
      this.newExpense = { description: '', amount: 0 }; // Reset the form fields
    },
    // Other methods if needed
  },
  computed: {
    totalExpenses() {
      return this.$store.state.expenses.reduce((total, expense) => total + expense.amount, 0);
    },
    totalIncomes() {
      return this.$store.state.incomes.reduce((total, income) => total + income.amount, 0);
    },
    recentTransactions() {
      return this.$store.getters.recentTransactions(5); // Get the latest 5 transactions
    },
  },
};
</script>

<style scoped>
/* Add styling for cards, layout, etc. */
</style>
