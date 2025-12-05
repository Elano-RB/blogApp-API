<script setup>
import Navbar from './components/Navbar.vue'
import { useGlobalStore } from './stores/global.js'
import { onMounted } from 'vue'

const global = useGlobalStore()

onMounted(() => {
  global.initializeUser()
})
</script>

<template>
  <Navbar />
  <router-view />
</template>