import { defineStore } from 'pinia';
import { reactive } from 'vue';
import axios from "axios";
import api from '../api.js';

export const useGlobalStore = defineStore('global', () => {
  const token = localStorage.getItem('token');
  const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;

  const user = reactive({
    token,
    email: decodedToken ? decodedToken.email : null,
    isAdmin: decodedToken ? decodedToken.isAdmin : null,
    isLoading: false
  });

  async function getUserDetails(tokenParam) {
    const activeToken = tokenParam || localStorage.getItem('token');
    if (!activeToken) {
      user.token = null;
      user.email = null;
      user.isAdmin = null;
      return;
    }

    try {
      user.isLoading = true;
      const { data } = await api.get(
        "users/details",
        {
          headers: { Authorization: `Bearer ${activeToken}` },
        }
      );

      user.email = data.email;
      user.isAdmin = data.isAdmin;
      user.token = activeToken;
    } catch (error) {
      console.error("Error fetching user details:", error);

      logout();
    } finally {
      user.isLoading = false;
    }
  }

  function logout() {
    user.email = null;
    user.isAdmin = null;
    user.token = null;
    localStorage.removeItem('token');
  }

  function initializeUser() {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      getUserDetails(storedToken);
    }
  }

  return { user, getUserDetails, logout, initializeUser };
});
