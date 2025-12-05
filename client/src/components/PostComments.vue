<script setup>
import { ref, watch } from "vue";
import api from "../api";
import { useGlobalStore } from "../stores/global";


const props = defineProps({
  postId: { type: String, required: true }
});

const emit = defineEmits(['comments-updated']);

const globalStore = useGlobalStore();
const user = globalStore.user;

const comments = ref([]);
const newComment = ref("");
const loading = ref(false);
const errorMsg = ref("");

// Fetch comments when postId changes or on mount
const fetchComments = async () => {
  loading.value = true;
  try {
    const { data } = await api.get(`/comments/get-comment/${props.postId}`);
    comments.value = data;

    // Emit to parent
    emit('comments-updated', comments.value);
  } catch (err) {
    errorMsg.value = "Failed to load comments.";
  } finally {
    loading.value = false;
  }
};

watch(() => props.postId, fetchComments, { immediate: true });

const addComment = async () => {
  if (!newComment.value.trim()) return;

  try {
    const { data } = await api.post(`/comments/add-comment/${props.postId}`, {
      content: newComment.value
    });
    comments.value = data.comments;
    newComment.value = "";

    // Emit to parent
    emit('comments-updated', comments.value);
  } catch (err) {
    errorMsg.value = err.response?.data?.error || "Failed to add comment.";
  }
};

const deleteComment = async (commentId) => {
  if (!confirm("Delete this comment?")) return;

  try {
    await api.delete(`/comments/delete-comment/${commentId}`);
    comments.value = comments.value.filter(c => c._id !== commentId);

    // Emit to parent
    emit('comments-updated', comments.value);
  } catch (err) {
    errorMsg.value = err.response?.data?.error || "Failed to delete comment.";
  }
};
</script>

<template>
  <div class="py-4">
    <h3 class="mb-3">Comments</h3>

    <div v-if="loading" class="text-center py-3">
      <div class="spinner-border text-primary" role="status"></div>
    </div>

    <div v-if="errorMsg" class="alert alert-danger">{{ errorMsg }}</div>

    <!-- Add Comment Box (only if logged in) -->
    <div v-if="user.token" class="mb-4">
      <textarea
        v-model="newComment"
        class="form-control mb-2"
        rows="2"
        placeholder="Write a comment..."
      ></textarea>
      <button class="btn btn-primary btn-sm" @click="addComment">Post Comment</button>
    </div>

    <!-- No comments -->
    <div v-if="comments.length === 0" class="text-muted">
      No comments yet. Be the first to comment!
    </div>

    <!-- Comment List -->
    <div v-for="comment in comments" :key="comment._id" class="card mb-3 shadow-sm">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-1">
          <div>
            <strong>{{ comment.author.username || comment.author.email }}</strong>
            <small class="text-muted"> • {{ new Date(comment.createdAt).toLocaleString() }}</small>
          </div>
          <button
            v-if="user.token && (user.email === comment.author.email || user.isAdmin)"
            class="btn btn-sm btn-outline-danger"
            @click="deleteComment(comment._id)"
          >
            Delete
          </button>
        </div>
        <p class="mb-0">{{ comment.content }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.card {
  border-radius: 12px;
}

textarea.form-control {
  border-radius: 8px;
}

button.btn-sm {
  border-radius: 20px;
}
</style>
