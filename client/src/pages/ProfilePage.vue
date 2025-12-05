<script setup>
import { ref, onMounted } from 'vue'
import api from '../api' // axios instance with token
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const notyf = new Notyf();

const loading = ref(false)
const saving = ref(false)
const message = ref('')
const errorMsg = ref('')

// Profile data (read-only fields)
const profile = ref({
  firstName: '',
  lastName: '',
  email: '',
  role: '',
  createdOn: ''
})

// Password form
const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const fetchProfile = async () => {
  loading.value = true
  message.value = ''
  errorMsg.value = ''
  try {
    // adjust endpoint to your backend: /users/me or /users/profile or /users/details
    const { data } = await api.get('/users/details')
    profile.value = data.user
  } catch (err) {
    console.error(err)
    errorMsg.value = 'Failed to load profile. Please re-login.'
  } finally {
    loading.value = false
  }
}

const changePassword = async () => {
  message.value = ''
  errorMsg.value = ''

  // client-side checks
  if (!currentPassword.value || !newPassword.value) {
    errorMsg.value = 'Please provide current and new password.'
    return
  }
  if (newPassword.value.length < 8) {
    errorMsg.value = 'New password must be at least 8 characters.'
    return
  }
  if (newPassword.value !== confirmPassword.value) {
    errorMsg.value = 'New password and confirmation do not match.'
    return
  }

  saving.value = true
  try {
    // typical secure pattern is to require currentPassword
    await api.patch('/users/update-password', {
      currentPassword: currentPassword.value,
      newPassword: newPassword.value
    })
    message.value = 'Password updated successfully.'
    currentPassword.value = ''
    newPassword.value = ''
    confirmPassword.value = ''

    notyf.success("Password updated successfully.");
  } catch (err) {
    console.error(err)
    // common server responses: 400/401 with message
    errorMsg.value = err?.response?.data?.message || 'Failed to change password.'

    notyf.error(errorMsg.value);
  } finally {
    saving.value = false
  }
}

onMounted(fetchProfile)
</script>

<template>
  <div class="container py-4">
    <h1 class="text-dark text-center mb-4">My Profile</h1>

    <!-- Profile Card -->
    <div class="card mb-4">
      <div class="card-header fw-bold">User Details</div>
      <div class="card-body" v-if="!loading">
        <div class="row g-3">
          <div class="col-md-6">
            <label class="form-label">FirstName</label>
            <input class="form-control" :value="profile.firstName" readonly />
          </div>
          <div class="col-md-6">
            <label class="form-label">LastName</label>
            <input class="form-control" :value="profile.lastName" readonly />
          </div>
          <div class="col-md-6">
            <label class="form-label">Email</label>
            <input class="form-control" :value="profile.email" readonly />
          </div>
        </div>
      </div>
      <div class="card-body" v-else>
        <span class="text-muted">Loading profile…</span>
      </div>
    </div>

    <!-- Change Password -->
    <div class="card">
      <div class="card-header fw-bold">Change Password</div>
      <div class="card-body">
        <div class="mb-3">
          <label class="form-label">Current Password</label>
          <input v-model="currentPassword" type="password" class="form-control" autocomplete="current-password" />
        </div>
        <div class="mb-3">
          <label class="form-label">New Password</label>
          <input v-model="newPassword" type="password" class="form-control" autocomplete="new-password" />
        </div>
        <div class="mb-3">
          <label class="form-label">Confirm New Password</label>
          <input v-model="confirmPassword" type="password" class="form-control" autocomplete="new-password" />
        </div>

        <button class="btn btn-primary" :disabled="saving" @click="changePassword">
          {{ saving ? 'Saving…' : 'Update Password' }}
        </button>
      </div>
    </div>
  </div>
</template>
