<template>
  <v-app>
    <v-app-bar color="background" elevation="0">
      <v-container class="text-center">
        <v-toolbar-title class="text-primary font-weight-bold">
          Text to XML Converter
        </v-toolbar-title>
        <v-toolbar-title class="text-secondary font-weight-bold">
          Convert pipe-delimited text format to structured XML
        </v-toolbar-title>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="d-flex justify-center">
        <div class="converter-wrapper">
          <TextServiceConverter />
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import TextServiceConverter from './components/TextServiceConverter.vue'
</script>

<style scoped>
.v-app {
  background-color: #08283F !important;
}

.converter-wrapper {
  width: 100%;
  max-width: 1000px;
}
</style>