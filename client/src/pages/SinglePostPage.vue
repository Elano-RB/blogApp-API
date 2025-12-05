<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api";
import PostComments from "../components/PostComments.vue";

const route = useRoute();
const router = useRouter();

const post = ref(null);
const commentsForPost = ref([]); // reactive comment list
const loading = ref(false);
const errorMsg = ref("");

const fetchPost = async () => {
  loading.value = true;
  try {
    const { data } = await api.get(`/posts/getSingle/${route.params.id}`);
    post.value = data;
  } catch (err) {
    errorMsg.value = "Post not found.";
  } finally {
    loading.value = false;
  }
};

const deletePost = async () => {
  if (!confirm("Delete this post?")) return;

  try {
    await api.delete(`/posts/delete-post/${route.params.id}`);
    router.push("/posts");
  } catch (err) {
    alert("Not authorized to delete this post.");
  }
};

// Handle comment updates from PostComment component
const updateComments = (updatedComments) => {
  commentsForPost.value = updatedComments;
};

onMounted(fetchPost);
</script>

<template>
  <div class="container py-4">
    <div v-if="loading">Loading...</div>
    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

    <div v-if="post">
      <h2>{{ post.title }}</h2>
      <p>{{ post.content }}</p>

      <small class="text-muted">
        By {{ post.author.username || post.author.email }}
      </small>

      <div class="mt-3">
        <router-link 
          class="btn btn-warning me-2"
          :to="`/posts/edit/${post._id}`"
        >
          Edit
        </router-link>

        <button class="btn btn-danger" @click="deletePost">
          Delete
        </button>
      </div>

      <!-- Comments Section -->
      <PostComments 
        :postId="post._id" 
        @comments-updated="updateComments" 
      />

      <!-- Optional: display comment count -->
      <p class="text-muted mt-2">Total Comments: {{ commentsForPost.length }}</p>
    </div>
  </div>
</template>
