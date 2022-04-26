<template>
  <div class="container">
    <br/>
    <br/>
    <br/>
      <TheNavigation/>
  <router-view></router-view>
  </div>

</template>

<script>
  import TheNavigation from './components/TheNavigation.vue'
  export default {
    name: 'App',
    components: {
      TheNavigation,
    }
  }
</script>