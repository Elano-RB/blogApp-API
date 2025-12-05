import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/main.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { createRouter, createWebHistory } from 'vue-router';

import HomePage from './pages/HomePage.vue';
import RegisterPage from './pages/RegisterPage.vue'
import LoginPage from './pages/LoginPage.vue'
import ProfilePage from './pages/ProfilePage.vue'
import PostListPage from './pages/PostListPage.vue'
import SinglePostPage from './pages/SinglePostPage.vue'
import CreatePostPage from './pages/CreatePostPage.vue'
import EditPostPage from './pages/EditPostPage.vue'
// import AdminDashboard from './pages/AdminDashboard.vue';


const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomePage
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterPage
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginPage
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage
    },
    {
	  path: "/posts",
	  name: "PostListPage",
	  component: PostListPage
	},
	{
	  path: "/posts/:id",
	  name: "single-post",
	  component: SinglePostPage
	},
	{
	  path: "/posts/create",
	  name: "create-post",
	  component: CreatePostPage
	},
	{
	  path: "/posts/edit/:id",
	  name: "edit-post",
	  component: EditPostPage
	}
    
  ]
})

// route guard to protect admin routes
router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))

  // Protect admin-only pages
  if (to.meta.isAdmin && !user?.isAdmin) {
    return next('/products')
  }

  next()
})

export default router

const app = createApp(App)

app.use(createPinia())

app.use(router)

app.mount('#app')
