<template>
  <section>
    <div class="is-size-3 has-text-centered">Login</div>
    <form v-on:submit.prevent>
      <div class="field">
        <label class="label">Email</label>
        <div class="control">
          <input
            class="input"
            type="text"
            placeholder="JohnSmith@somemail.com"
            v-model="email"
            required
          />
        </div>
      </div>
      <div class="field">
        <label class="label">Password</label>
        <div class="control">
          <input
            class="input"
            type="password"
            placeholder="somerandompassword"
            v-model="password"
            required
          />
        </div>
      </div>
      <button class="button is-success" @click="attemptlogin">Submit</button>
      <br/>
      <div v-show="showLoginError()" class="errors">
        <!-- {{ errors }} -->
        <div v-for="error in errors" :key="error.id">
          {{ error }}
        </div>
      </div>
    </form>
  </section>
</template>

<script>
import Cookies from "js-cookie";
export default {
  
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      token:null
    };
  },
  methods: {
    home()  {
      this.$router.push({ name:'home' });
    },
    attemptlogin() {
      this.$store.dispatch("login",{
        email:this.email,
        password:this.password
      }).
      then(() => {
        //user has logged in
        if(typeof Cookies.get('token') !== 'undefined')
        {
          this.$router.push({ name:'home' })
        }
      })
    },
    showLoginError()  {
      if(this.$store.getters.getErrors == null)
      {
        //hide
        return false;
      }
      else
      {
        //show
        return true;
      }
    }
  },
  computed: {
    errors() {
      return this.$store.getters.getErrors
    }
  },
  mounted () {
    this.token = this.$store.getters.getToken;
  },
};
</script>

<style scoped>
form {
  margin: auto;
  width: 33%;
}
.errors
{
  color:red
}

</style>
