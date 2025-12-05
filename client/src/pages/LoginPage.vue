<script setup>

    import { watch, ref, onBeforeMount } from 'vue';
    import { useGlobalStore } from '../stores/global.js';
    import { Notyf } from 'notyf';
    import 'notyf/notyf.min.css';
    import { useRouter } from 'vue-router'
    import axios from "axios";
    import api from "../api";

    const router = useRouter();
    const { user } = useGlobalStore();
    const { getUserDetails } = useGlobalStore()
    const email = ref("");
    const password = ref("");
    const isEnabled = ref(false);
    const notyf = new Notyf();

   
    watch([email,password], (currentValue, oldValue) => {

        if(currentValue.every(input => input !== "")){
            isEnabled.value = true
        } else {
            isEnabled.value = false
        }
    });

    async function handleSubmit(e){

        e.preventDefault();

        try{
          let res = await api.post("users/login",
            {
                email: email.value,
                password: password.value
            }
          )

          if(res.data.message == "User logged in successfully"){

             notyf.success("Login Successful");

             localStorage.setItem("token", res.data.access)

             getUserDetails(res.data.access) 
             
             email.value = "";
             password.value = "";

             router.push({path: '/'})
          }
        }catch(err){
            if(err.response.status === 404 || err.response.status === 401 || err.response.status === 400){ // <<
                notyf.error(err.response.data.message) // <<
            }
            else{
                notyf.error("Login failed. Please contact administrator")
            }
        }      
    }

    onBeforeMount(() => {
        if(user.token) { // <<
            router.push({path: '/'})
        }
    })
</script>

<template>
    <div class="container">
        <h1 class="my-5 pt-3 text-dark text-center">Login</h1> 
        <div class="row d-flex justify-content-center">
            <div class="col-md-5 border border rounded-3 mx-auto p-5">
                <form v-on:submit="handleSubmit">
                    <div class="mb-3">
                        <label for="emailInput" class="form-label">Email Address</label>
                        <input type="email" class="form-control" id="emailInput" placeholder="Email" v-model="email" />
                    </div>
                    <div class="mb-3">
                        <label for="passwordInput" class="form-label">Password</label>
                        <input type="password" class="form-control" id="passwordInput" placeholder="Password" v-model="password" />
                    </div>
                    <div class="d-grid mt-5">
                        <button type="submit" class="btn btn-info text-white btn-block"  v-if="isEnabled">Login</button>
                        <button type="submit" class="btn btn-danger btn-block" disabled v-else>Login</button>
                    </div>
                    <div class="text-center mt-3">
  						<span class="text-muted">Don't have an account yet?</span>
  						<RouterLink to="/register" class="ms-1">Register here</RouterLink>
					</div>
                </form>
            </div>
        </div>
    </div>
</template>
