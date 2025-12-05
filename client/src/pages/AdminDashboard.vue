<template>
	<div class="admin-dashboard container py-4">
		<h2 class="mb-4 text-center">Admin Dashboard</h2>

		<table class="table table-bordered table-striped">
			<thead>
				<tr>
					<th>Title</th>
					<th>Author</th>
					<th>Comments</th>
					<th>Created At</th>
					<th>Actions</th>
				</tr>
			</thead>

			<tbody>
				<tr v-for="post in posts" :key="post._id">
					<td>
						<strong>{{ post.title }}</strong>
					</td>

					<td>{{ post.author?.email || 'Unknown' }}</td>

					<td>
						{{ post.comments?.length || 0 }}
						<button
						class="btn btn-sm btn-outline-primary ms-2"
						@click="toggleComments(post._id)"
						>
						{{ post.showComments ? 'Hide' : 'View' }}
						</button>
					</td>

					<td>{{ new Date(post.createdAt).toLocaleString() }}</td>

					<td>
						<button 
							class="btn btn-sm btn-danger"
							@click="deletePost(post._id)"
							>
							Delete Post
						</button>
					</td>
				</tr>

				<!-- Comments Section When Expanded -->
				<tr v-for="post in posts" :key="post._id + '-comments'" v-if="post.showComments">
					<td colspan="5" class="bg-light">

						<h6 class="mb-3">Comments</h6>

						<!-- No comments -->
						<div v-if="post.comments?.length === 0" class="text-muted">
							No comments yet.
						</div>

						<!-- Comments List -->
						<ul class="list-group">
							<li 
								v-for="comment in post.comments" 
								:key="comment._id"
								class="list-group-item d-flex justify-content-between align-items-start"
								>
								<div>
									<strong>{{ comment.author?.email }}</strong>
									<br />
									{{ comment.content }}
								</div>

								<button 
									class="btn btn-sm btn-outline-danger"
									@click="deleteComment(comment._id, post._id)"
									>
									Delete
								</button>
							</li>
						</ul>

					</td>
				</tr>

			</tbody>
		</table>
	</div>
</template>

<script setup>
	import { ref, onMounted } from "vue";
	import api from "../api";

	const posts = ref([]);

	const fetchPosts = async () => {
		try {
			const { data } = await api.get("/posts");
    // Ensure comments exist + UI flags
			posts.value = data.map((p) => ({
				...p,
				comments: p.comments || [],
				showComments: false,
			}));
		} catch (err) {
			console.error("Failed to load posts:", err);
		}
	};

	const toggleComments = async (postId) => {
		const post = posts.value.find((p) => p._id === postId);
		post.showComments = !post.showComments;

  // Fetch comments only when needed
		if (post.showComments && post.comments.length === 0) {
			try {
				const res = await api.get(`/comments/get-comment/${postId}`);
				post.comments = res.data;
			} catch (err) {
				console.error("Failed to load comments:", err);
			}
		}
	};

	const deletePost = async (postId) => {
		if (!confirm("Delete this post?")) return;

		try {
			await api.delete(`/admin/posts/${postId}`);
			posts.value = posts.value.filter((p) => p._id !== postId);
		} catch (err) {
			console.error("Failed to delete post:", err);
		}
	};

	const deleteComment = async (commentId, postId) => {
		if (!confirm("Delete this comment?")) return;

		try {
			await api.delete(`/admin/comments/${commentId}`);
			const post = posts.value.find((p) => p._id === postId);
			post.comments = post.comments.filter((c) => c._id !== commentId);
		} catch (err) {
			console.error("Failed to delete comment:", err);
		}
	};

	onMounted(fetchPosts);
</script>

<style scoped>
	.admin-dashboard {
		max-width: 1100px;
	}
</style>
