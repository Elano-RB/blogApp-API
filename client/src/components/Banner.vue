<template>
  <div id="banner">
    <div class="banner-content">
      <h1 id="banner-title">{{ bannerProps.title }}</h1>
      <p id="motto">{{ bannerProps.tagline }}</p>
      <router-link 
        class="btn btn-info btn-lg text-white rounded-pill px-3" 
        :to="{ name: bannerProps.destination }">
        {{ bannerProps.buttonLabel }} <i class="bi bi-arrow-right"></i>
      </router-link>
    </div>
  </div>
</template>

<script setup>
defineProps({
  bannerProps: Object
});
</script>

<style scoped>
  h1 {
    font-family: serif;
    font-style: normal;
    font-weight: 700;
    font-size: 48px;
  }
</style>
