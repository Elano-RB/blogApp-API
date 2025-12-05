<script setup>
import { ref, watch, onMounted } from "vue";
import api from "../api";
import { useRouter } from "vue-router";

const title = ref("");
const content = ref("");
const errorMsg = ref("");
const successMsg = ref("");
const loading = ref(false);
const existingTitles = ref([]);
const isDuplicateTitle = ref(false);

const router = useRouter();

// Fetch existing post titles
const fetchExistingTitles = async () => {
  try {
    const { data } = await api.get("/posts/all");
    existingTitles.value = data.map(post => post.title.toLowerCase());
  } catch (err) {
    console.error("Failed to fetch existing titles:", err);
  }
};

onMounted(fetchExistingTitles);

// Watch title for duplicates
watch(title, (newTitle) => {
  isDuplicateTitle.value = existingTitles.value.includes(newTitle.trim().toLowerCase());
  // Clear messages when user types
  errorMsg.value = "";
  successMsg.value = "";
});

const createPost = async () => {
  // Clear previous messages
  errorMsg.value = "";
  successMsg.value = "";

  if (!title.value.trim() || !content.value.trim()) {
    errorMsg.value = "Title and content are required.";
    return;
  }

  if (isDuplicateTitle.value) {
    errorMsg.value = "Post title already exists. Please choose a different title.";
    return;
  }

  loading.value = true;

  try {
    const { data } = await api.post("/posts/create", {
      title: title.value.trim(),
      content: content.value.trim(),
    });

    successMsg.value = "Post created successfully!";
    // Optional: reset inputs
    title.value = "";
    content.value = "";
    // Redirect to post list after short delay
    setTimeout(() => router.push(`/posts/${data.result._id}`), 800);

  } catch (err) {
    if (err.response && err.response.status === 409) {
      errorMsg.value = err.response.data.message; // Backend check
    } else {
      errorMsg.value = err.response?.data?.message || "Failed to create post.";
    }
  } finally {
    loading.value = false;
  }
};

// Go back to post list
const goBack = () => {
  router.push("/posts");
};
</script>

<template>
  <div class="container py-4">
    <h2>Create New Post</h2>

    <!-- Messages -->
    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>
    <div v-if="successMsg" class="alert alert-success">{{ successMsg }}</div>

    <form @submit.prevent="createPost">
      <div class="mb-2">
        <input 
          v-model="title" 
          class="form-control" 
          placeholder="Post title" 
          required
        />
      </div>
      <div v-if="isDuplicateTitle" class="text-danger mb-2">
        This title already exists!
      </div>

      <textarea
        v-model="content"
        class="form-control mb-3"
        rows="6"
        placeholder="Write your post..."
        required
      ></textarea>

      <div class="mb-2 d-flex gap-2">
      <button class="btn btn-primary" :disabled="isDuplicateTitle || loading">
        {{ loading ? "Creating..." : "Create Post" }}
      </button>
      <button 
		type="button" 
		class="btn btn-secondary" 
		@click="goBack"
		>
		Back
		</button>
		</div>
    </form>
  </div>
</template>
