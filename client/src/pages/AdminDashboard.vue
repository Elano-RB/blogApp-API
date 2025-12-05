<script setup>
import { ref, onMounted } from "vue";
import api from "../api";
import PostComments from "../components/PostComments.vue";

// Reactive state
const posts = ref([]);
const loading = ref(false);
const errorMsg = ref("");

// Fetch all posts
const fetchPosts = async () => {
  loading.value = true;
  try {
    const { data } = await api.get("/posts/all"); // adjust endpoint if needed
    // Add showComments property to each post for UI toggling
    posts.value = data.map(post => ({
      ...post,
      showComments: false
    }));
  } catch (err) {
    console.error(err);
    errorMsg.value = "Failed to load posts.";
  } finally {
    loading.value = false;
  }
};

// Delete a post
const deletePost = async (postId) => {
  if (!confirm("Delete this post?")) return;

  try {
    await api.delete(`/admin/posts/${postId}`);
    // Remove deleted post from local state
    posts.value = posts.value.filter(post => post._id !== postId);
  } catch (err) {
    alert("Not authorized or failed to delete post.");
  }
};

// Handle updated comments from PostComments component
const updateComments = (postId, updatedComments) => {
  const post = posts.value.find(p => p._id === postId);
  if (post) post.comments = updatedComments;
};

// Load posts on mount
onMounted(fetchPosts);
</script>

<template>
  <div class="container py-4">
    <h2>Welcome back, Admin!</h2>

    <div v-if="loading">Loading posts...</div>
    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

    <table class="table table-striped mt-3" v-if="posts.length">
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Content</th>
          <th>Author</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="post in posts" :key="post._id">
          <tr>
            <td>{{ post._id }}</td>
            <td>{{ post.title }}</td>
            <td>{{ post.content }}</td>
            <td>{{ post.author.username || post.author.email }}</td>
            <td>
              <button class="btn btn-sm btn-primary me-1" 
                      @click="post.showComments = !post.showComments">
                {{ post.showComments ? 'Hide Comments' : 'View Comments' }}
              </button>
              <button class="btn btn-sm btn-danger" @click="deletePost(post._id)">
                Delete
              </button>
            </td>
          </tr>
          <tr v-if="post.showComments">
            <td colspan="5">
              <PostComments 
                :postId="post._id" 
                @comments-updated="updateComments(post._id, $event)" 
              />
            </td>
          </tr>
        </template>
      </tbody>
    </table>

    <div v-else class="mt-3">No posts found.</div>
  </div>
</template>



<style scoped>
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th, .table td {
  padding: 0.75rem;
  border: 1px solid #dee2e6;
}
.table-striped tbody tr:nth-of-type(odd) {
  background-color: #f9f9f9;
}
</style>
