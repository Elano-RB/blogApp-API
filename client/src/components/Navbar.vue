<template>
  <nav class="navbar navbar-expand-lg sticky-top bg-light shadow-sm">
    <div class="container">
      <router-link :to="{name: 'Home'}" class="navbar-brand custom-link">CONNECT~</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div class="navbar-nav ms-auto">
          <!-- <router-link v-if="user?.isAdmin" class="nav-link custom-link" :to="{ name: 'Products' }">Admin Dashboard</router-link> -->
          <router-link v-if="user?.token" class="nav-link custom-link" :to="{ name: 'PostListPage' }">
            Community
          </router-link>

          <router-link v-if="user?.token && !user?.isAdmin" class="nav-link custom-link" :to="{ name: 'profile' }">My Profile</router-link>
          
          <router-link v-if="!user?.token" class="nav-link custom-link" :to="{ name: 'Register' }">Register</router-link>

          <router-link v-if="!user?.token" class="nav-link custom-link" :to="{ name: 'Login' }">Login</router-link>

          <a v-if="user?.token" class="nav-link custom-link" href="#" @click.prevent="logoutUser">Logout</a>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useGlobalStore } from '../stores/global.js'
import { useRouter } from 'vue-router'

const router = useRouter()
const { user, logout } = useGlobalStore()

console.log('Navbar user data:', user)
const logoutUser = () => {
  logout()
  router.push({ name: 'Home' })
}
</script>
