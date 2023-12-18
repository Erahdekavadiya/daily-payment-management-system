<template>
  <v-app>
    <v-app-bar app color="primary">
      <v-toolbar-title>Daily Payment Management System - Er A H Dekavadiya</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text @click="this.$router.push('/')">Dashboard</v-btn>
        <v-btn text @click="this.$router.push('/incomes')">Incomes</v-btn>
        <v-btn text @click="this.$router.push('/expenses')">Expenses</v-btn>
      </v-toolbar-items>
    </v-app-bar>

    <v-main>
      <!-- Your main content -->
      <v-container>
        <router-view></router-view> <!-- If using Vue Router -->
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
</script>

<style>
/* Add custom styles if needed */
</style>
