<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "../api";

const route = useRoute();
const router = useRouter();

const title = ref("");
const content = ref("");
const loading = ref(true);
const errorMsg = ref("");

const loadPost = async () => {
  loading.value = true;
  try {
    const { data } = await api.get(`/posts/getSingle/${route.params.id}`);

    // Load title and content regardless of author (backend will protect update)
    title.value = data.title;
    content.value = data.content;

  } catch (err) {
    errorMsg.value = "Post not found.";
  } finally {
    loading.value = false;
  }
};

const updatePost = async () => {
  errorMsg.value = "";

  try {
    await api.put(`/posts/update/${route.params.id}`, {
      title: title.value,
      content: content.value,
    });
    router.push(`/posts/${route.params.id}`);
  } catch (err) {
    errorMsg.value = err.response?.data?.error || "Failed to update post.";
  }
};

onMounted(loadPost);
</script>

<template>
  <div class="container py-4">
    <h2>Edit Post</h2>

    <div v-if="loading">Loading...</div>

    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

    <form v-if="!loading" @submit.prevent="updatePost">
      <input
        v-model="title"
        class="form-control mb-2"
        placeholder="Post Title"
        required
      />
      <textarea
        v-model="content"
        class="form-control mb-3"
        rows="6"
        placeholder="Post Content"
        required
      ></textarea>

      <button type="submit" class="btn btn-primary">Update Post</button>
    </form>
  </div>
</template>
