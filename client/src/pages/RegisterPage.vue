<template>
	<div class="container">
		<h1 class="my-5 pt-3 text-dark text-center">Register</h1>
		<div class="row d-flex justify-content-center">
			<div class="col-md-5 border round-3 mx-auto p-5">
				<form v-on:submit="handleSubmit">
					<div class="mb-3">

						<label for="fName" class="form-label">
							First Name
						</label>
						<input type="text" class="form-control" id="fName" placeholder="e.g, Juan" v-model="firstName">

						<label for="lName" class="form-label">
							Last Name
						</label>
						<input type="text" class="form-control" id="lName" placeholder="e.g, Dela Cruz" v-model="lastName">

						<label for="emailInput" class="form-label">
							Email Address
						</label>
						<input type="email" class="form-control" id="emailInput" placeholder="e.g, juan.delacruz@example.com" v-model="email">
					</div>

					<div class="mb-3">
						<label for="passwordInput" class="form-label">
							Password
						</label>
						<input type="password" class="form-control" id="passwordInput" placeholder="Minimum 8 characters" v-model="password">
					</div>

					<div class="mb-3">
						<label for="cpasswordInput" class="form-label">
							Confirm Password
						</label>
						<input type="password" class="form-control" id="cpasswordInput" placeholder="Re-Enter your password" v-model="confirmPass">
					</div>

					<div class="d-grid mt-5">
						<button type="submit" class="btn btn-info text-white btn-block" v-if="isEnabled">Submit</button>
						<button type="submit" class="btn btn-danger btn-block" v-else disabled>Submit</button>
					</div>

					<div class="text-center mt-3">
  						<span class="text-muted">Already have an account?</span>
  						<RouterLink to="/login" class="ms-1">Login here</RouterLink>
					</div>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup>
	
	import { watch, ref, onBeforeMount } from "vue";
	import { useRouter } from 'vue-router';
	import { useGlobalStore } from '../stores/global.js'
	import { Notyf } from 'notyf';
	import axios from "axios";
	import api from "../api";

	const firstName = ref("");
	const lastName = ref("");
	const email = ref("");
	const password = ref("");
	const confirmPass = ref("");
	const isEnabled = ref(false);
	const router = useRouter()
	const { user } = useGlobalStore();
	const notyf = new Notyf();

	watch([email, password, confirmPass], (currentValue, oldValue) => {

		if(currentValue.every(input => input !== "") && currentValue[1] === currentValue[2]) {

			isEnabled.value = true
		} else {
			isEnabled.value = false
		}
	})

	async function handleSubmit(e) {
		e.preventDefault();

		try{
			let res = await api.post('users/register', {
                firstName: firstName.value,
                lastName: lastName.value,
                email: email.value,
                password: password.value
            })

			if(res.data.message == "User registered successfully"){	
				notyf.success("Registration Successful");

				firstName.value = "";
				lastName.value= "";
				email.value = "";
				password.value = "";
				confirmPass.value = "";

				router.push({path: '/login'})
			}
		}
		catch(err){
			console.log(err)
			if(err.response.status === 404 || err.response.status === 401 || err.response.status === 400){ // <<
			    notyf.error(err.response.data.message) // <<
			}
			else{
			    notyf.error("Registration failed. Please contact administrator")
			}
		}
		
	}

	onBeforeMount(() => {
		if(user.email) {
			router.push({path: '/'})
		}
	})

</script>