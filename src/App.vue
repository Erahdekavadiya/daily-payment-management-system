<template>
  <v-app>
    <v-container>
      <v-btn color="primary" @click="goToDashboard">Go to Dashboard</v-btn>
      <!-- Your other Vuetify components -->
      <router-view></router-view>
    </v-container>
  </v-app>
</template>

<script>

export default {
  name: 'App',
  methods: {
    goToDashboard() {
      this.$router.push({ name: 'Dashboard' }); // Replace 'Home' with your dashboard route name
    },
  }
}
</script>

