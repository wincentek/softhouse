<template>
  <v-app>
    <AppHeader></AppHeader>

    <WorkMode></WorkMode>

    <div class="mt-8 bg-black">
        <TextServiceConverter />
    </div>
  </v-app>
</template>

<script setup lang="ts">
import AppHeader from './components/AppHeader.vue';
import TextServiceConverter from './components/TextServiceConverter.vue'
import WorkMode from './components/WorkMode.vue';

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