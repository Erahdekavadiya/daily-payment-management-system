<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-toolbar-title>Daily Payment Management System - Er A H Dekavadiya</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items v-if="isLoggedIn">
        <v-btn text @click="this.$router.push('/')">Dashboard</v-btn>
        <v-btn text @click="this.$router.push('/incomes')">Incomes</v-btn>
        <v-btn text @click="this.$router.push('/expenses')">Expenses</v-btn>
        <v-btn text @click="logout">Logout</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <!-- Your main content -->
      <v-container v-if="isLoggedIn">
        <router-view></router-view> <!-- If using Vue Router -->
      </v-container>
      <v-container v-else>
        <v-row align="center" justify="center">
          <v-col cols="12" sm="8" md="6" lg="4" class="mt-3">
            <v-alert v-if="showError" type="error" class="mb-3" dismissible>
              Incorrect username or password
            </v-alert>
            <v-card color="primary" dark class="px-4 py-6">
              <v-card-title>
                <h1 class="mb-3">Login</h1>
              </v-card-title>
              <v-card-text>
                <v-form @submit.prevent="login">
                  <v-text-field v-model="username" label="Username" placeholder="demo"></v-text-field>
                  <v-text-field v-model="password" label="Password" type="password"  placeholder="demo@123"></v-text-field>
                  <v-btn type="submit" color="white" block>Login</v-btn>
                </v-form>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      username: '',
      password: '',
      showError: false,
    };
  },
  methods: {
    login() {
      if (this.username == 'demo' && this.password == 'demo@123') {
        localStorage.setItem('isLoggedIn', true);
        this.isLoggedIn = true;
      } else {
        this.showError = true;
      }
    },
    logout() {
      localStorage.removeItem('isLoggedIn');
      this.isLoggedIn = false;
    },
  },
  created() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      this.isLoggedIn = true;
    }
  },
};
</script>

<style>
/* Add custom styles if needed */
</style>
