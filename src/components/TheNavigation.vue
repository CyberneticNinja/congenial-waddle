<template>
  <div>
<!--
    <div class="columns is-centered">
      <div class="is-size-1">Company Records</div>
    </div>
-->
    <nav class="navbar">
      <div class="navbar-menu">
        <div class="navbar-start">
          <a class="navbar-item">
            <router-link to="/login">Login</router-link>
          </a>
          <a class="navbar-item">
            <router-link to="/logout">Logout</router-link>
          </a>
          <a class="navbar-item">
            <router-link to="/">Home</router-link>
          </a>
        </div>
      </div>
    </nav>
  </div>
</template>
<script>
import Cookies from "js-cookie";

export default {
    name:'TheNavigation',
    data() {
      return {
        token: null
      }
    },
    methods: {      
    },
  computed: {
    isloggedin() {

      //There is no cookie, user not logged in
      if(Cookies.get('token') !== 'undefined')
      {
        return false;
      }
      else
      {
        return true;
      }
      // return this.$store.getters.getisUserLoggedIn
    }
  },
};
</script>
<style></style>
