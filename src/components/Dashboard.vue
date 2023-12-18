<template>
  <div>
  <v-row align="center" justify="start">
      <v-col cols="auto">
        <h1>Incomes</h1>
      </v-col>
    </v-row>
    <v-row align="center" justify="start">
      <v-col cols="4">
        <v-card
          class="mx-auto"
          title="Total"
        >
          <template v-slot:prepend>
            <v-avatar color="green-darken-2">
              <v-icon icon="mdi-trending-up"></v-icon>
            </v-avatar>
          </template>
          <v-divider></v-divider>
          <v-card-text><h3>{{ totalIncomes }}</h3></v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card
          class="mx-auto"
          title="This Month"
        >
          <template v-slot:prepend>
            <v-avatar color="green-darken-2">
              <v-icon icon="mdi-trending-up"></v-icon>
            </v-avatar>
          </template>
          <v-divider></v-divider>
          <v-card-text><h3>{{ monthIncomes }}</h3></v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card
          class="mx-auto"
          title="This Week"
        >
          <template v-slot:prepend>
            <v-avatar color="green-darken-2">
              <v-icon icon="mdi-trending-up"></v-icon>
            </v-avatar>
          </template>
          <v-divider></v-divider>
          <v-card-text><h3>{{ weekIncomes }}</h3></v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <v-row align="center" justify="start">
      <v-col cols="auto">
        <h1>Expenses</h1>
      </v-col>
    </v-row>
    <v-row align="center" justify="start">
      <v-col cols="4">
        <v-card
          class="mx-auto"
          title="Total"
        >
          <template v-slot:prepend>
            <v-avatar color="red-darken-2">
              <v-icon icon="mdi-trending-down"></v-icon>
            </v-avatar>
          </template>
          <v-divider></v-divider>
          <v-card-text><h3>{{ totalExpenses }}</h3></v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card
          class="mx-auto"
          title="This Month"
        >
          <template v-slot:prepend>
            <v-avatar color="red-darken-2">
              <v-icon icon="mdi-trending-down"></v-icon>
            </v-avatar>
          </template>
          <v-divider></v-divider>
          <v-card-text><h3>{{ monthExpenses }}</h3></v-card-text>
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card
          class="mx-auto"
          title="This Week"
        >
          <template v-slot:prepend>
            <v-avatar color="red-darken-2">
              <v-icon icon="mdi-trending-down"></v-icon>
            </v-avatar>
          </template>
          <v-divider></v-divider>
          <v-card-text><h3>{{ weekExpenses }}</h3></v-card-text>
        </v-card>
      </v-col>
    </v-row>
    
  </div>
</template>

<script>
import { getAllincomesFromDB } from '../indexDB';
import { getAllExpensesFromDB } from '../indexDB';
export default {
  name: 'Dashboard',
  data() {
    return {
      incomes: null,
      expenses: null,
    };
  },
  computed: {
    totalExpenses() {
      return this.expenses?this.expenses.reduce((accumulator, e) => accumulator + parseInt(e.amount), 0):0;
    },
    monthExpenses(){
      return 0;
    },
    weekExpenses(){
      const currentDate = new Date();
      const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
      const expensesThisWeek = this.expenses?.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= firstDayOfWeek && expenseDate <= lastDayOfWeek;
      });
      const totalAmountThisWeek = expensesThisWeek?.reduce((total, expense) => {
        return total + Number(expense.amount);
      }, 0);
      return this.expenses?totalAmountThisWeek:0;
    },
    totalIncomes() {
      return this.incomes?this.incomes.reduce((accumulator, e) => accumulator + parseInt(e.amount), 0):0;
    },
    monthIncomes(){
      return 0;
    },
    weekIncomes(){
      const currentDate = new Date();
      const firstDayOfWeek = new Date(currentDate.setDate(currentDate.getDate() - currentDate.getDay()));
      const lastDayOfWeek = new Date(firstDayOfWeek);
      lastDayOfWeek.setDate(lastDayOfWeek.getDate() + 6);
      const expensesThisWeek = this.incomes?.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= firstDayOfWeek && expenseDate <= lastDayOfWeek;
      });
      const totalAmountThisWeek = expensesThisWeek?.reduce((total, expense) => {
        return total + Number(expense.amount);
      }, 0);
      return this.incomes?totalAmountThisWeek:0;
    }
  },
  async created() {
    try {
      this.incomes = await getAllincomesFromDB();
      this.expenses = await getAllExpensesFromDB();
    } catch (error) {
      console.error('Error fetching incomes:', error);
    }
  },
};
</script>

<style scoped>
/* Add styling for cards, layout, etc. */
</style>
