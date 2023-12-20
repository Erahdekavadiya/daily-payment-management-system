<template>
  <div>
    <v-row align="center" justify="start" v-if="(expenses && expenses.length > 0) || (incomes && incomes.length > 0)">
      <v-col cols="12">
        <v-tabs v-model="selectedTab" align-tabs="center" color="blue-darken-3">
          <v-tab @click="filterAllTime">All Time</v-tab>
          <v-tab @click="filterThisYear">This Year</v-tab>
          <v-tab @click="filterThisMonth">This Month</v-tab>
          <v-tab @click="filterThisWeek">This Week</v-tab>
        </v-tabs>
        <v-card class="mb-3">
          <v-row align="center" justify="center">
            <v-col cols="12" md="6">
              <MyChart :incomeData="filteredincomes" :expenseData="filteredexpenses" />
            </v-col>
          </v-row> 
        </v-card>
      </v-col>
    </v-row>
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
          color="green-lighten-2"
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
          color="green-lighten-3"
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
          color="green-lighten-4"
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
          color="red-lighten-3"
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
          color="red-lighten-4"
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
          color="red-lighten-5"
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
import MyChart from './MyChart.vue';
export default {
  name: 'Dashboard',
  components: {
    MyChart,
  },
  data() {
    return {
      incomes: [],
      expenses: [],
      filteredincomes: [],
      filteredexpenses: [],
      selectedTab: 0,
    };
  },
  computed: {
    totalExpenses() {
      return this.expenses?this.expenses.reduce((accumulator, e) => accumulator + parseInt(e.amount), 0):0;
    },
    monthExpenses(){
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const expensesThisMonth = this.expenses?.filter(expense => {
        const expenseDate = new Date(expense.date);
        const expenseYear = expenseDate.getFullYear();
        const expenseMonth = expenseDate.getMonth() + 1;
        return expenseYear === currentYear && expenseMonth === currentMonth;
      });
      const totalAmountThisMonth = expensesThisMonth?.reduce((total, expense) => {
        return total + Number(expense.amount);
      }, 0);
      return this.expenses?totalAmountThisMonth:0;
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
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const expensesThisMonth = this.incomes?.filter(expense => {
        const expenseDate = new Date(expense.date);
        const expenseYear = expenseDate.getFullYear();
        const expenseMonth = expenseDate.getMonth() + 1;
        return expenseYear === currentYear && expenseMonth === currentMonth;
      });
      const totalAmountThisMonth = expensesThisMonth?.reduce((total, expense) => {
        return total + Number(expense.amount);
      }, 0);
      return this.incomes?totalAmountThisMonth:0;
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
      this.filterAllTime();
    } catch (error) {
      console.error('Error fetching incomes:', error);
    }
  },
  methods: {
    filterAllTime() {
      this.selectedTab = 0;
      this.filteredincomes = this.incomes;
      this.filteredexpenses = this.expenses;
    },
    filterThisYear() {
      this.selectedTab = 1;
      const thisYear = new Date().getFullYear();
      this.filteredincomes = this.incomes.filter(item => new Date(item.date).getFullYear() === thisYear);
      this.filteredexpenses = this.expenses.filter(item => new Date(item.date).getFullYear() === thisYear);
    },
    filterThisMonth() {
      this.selectedTab = 2;
      const thisMonth = new Date().getMonth();
      const thisYear = new Date().getFullYear();
      this.filteredincomes = this.incomes.filter(item => new Date(item.date).getFullYear() === thisYear && new Date(item.date).getMonth() === thisMonth);
      this.filteredexpenses = this.expenses.filter(item => new Date(item.date).getFullYear() === thisYear && new Date(item.date).getMonth() === thisMonth);
    },
    filterThisWeek() {
      this.selectedTab = 3;
      const today = new Date();
      const startOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
      const endOfWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay() + 6);
      this.filteredincomes = this.incomes.filter(item => new Date(item.date) >= startOfWeek && new Date(item.date) <= endOfWeek);
      this.filteredexpenses = this.expenses.filter(item => new Date(item.date) >= startOfWeek && new Date(item.date) <= endOfWeek);
    },
    updateChart() {
      this.$refs.chart.updateChart(this.filteredIncomeData, this.filteredExpenseData);
    },
  },
  watch: {
    filteredIncomeData: {
      handler() {
        this.updateChart();
      },
      deep: true,
    },
    filteredExpenseData: {
      handler() {
        this.updateChart();
      },
      deep: true,
    },
  },
};
</script>

<style scoped>
/* Add styling for cards, layout, etc. */
</style>
