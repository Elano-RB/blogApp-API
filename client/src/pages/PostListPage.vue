<script setup>
import { ref, onMounted } from "vue";
import api from "../api";
import { useRouter } from "vue-router";

const posts = ref([]);
const loading = ref(false);
const errorMsg = ref("");
const router = useRouter();

const fetchPosts = async () => {
  loading.value = true;
  try {
    const { data } = await api.get("/posts/all");
    posts.value = data;
  } catch (err) {
    errorMsg.value = "Failed to load posts.";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchPosts);
</script>

<template>
  <div class="timeline-container container py-4">

    <!-- 🌟 Header with Create Post Button -->
    <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
      <h2 class="timeline-title">Community</h2>
      <button 
        class="btn btn-success btn-lg mt-2 mt-md-0"
        @click="router.push('/posts/create')"
      >
        + Create Post
      </button>
    </div>

    <!-- Loading Spinner -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>

    <!-- Error Message -->
    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

    <!-- Posts -->
    <div v-for="post in posts" :key="post._id" class="timeline-card card mb-4 shadow-sm">
      <div class="card-body">
        <!-- Post Header -->
        <div class="d-flex justify-content-between align-items-start mb-2">
          <h4 class="card-title">{{ post.title }}</h4>
          <small class="text-muted">{{ new Date(post.createdAt).toLocaleDateString() }}</small>
        </div>

        <!-- Post Content -->
        <p class="card-text">{{ post.content.substring(0, 250) }}...</p>

        <!-- Post Footer -->
        <div class="d-flex justify-content-between align-items-center mt-3 flex-wrap">
          <small class="text-muted">By: {{ post.author.email }}</small>
          <button 
            class="btn btn-primary btn-sm mt-2 mt-md-0"
            @click="router.push(`/posts/${post._id}`)"
          >
            View Post
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
/* Timeline container */
.timeline-container {
  max-width: 800px;
  margin: auto;
}

/* Header / Title */
.timeline-title {
  font-weight: 600;
  font-size: 1.5rem;
  color: #555;
  flex: 1 1 auto;
}

/* Card styling for timeline posts */
.timeline-card {
  border-radius: 12px;
  transition: transform 0.2s, box-shadow 0.2s;
  background-color: #fff;
}

.timeline-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

/* Post title */
.card-title {
  font-weight: 600;
  font-size: 1.25rem;
  color: #333;
}

/* Post content */
.card-text {
  font-size: 0.95rem;
  color: #444;
  line-height: 1.5;
}

/* Buttons */
.btn-success {
  border-radius: 50px;
  padding: 0.5rem 1.2rem;
}

.btn-primary {
  border-radius: 30px;
  padding: 0.25rem 0.8rem;
  font-size: 0.875rem;
}

/* Responsive adjustments */
@media (max-width: 576px) {
  .timeline-title {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }

  .btn-success {
    width: 100%;
  }
}
</style>
