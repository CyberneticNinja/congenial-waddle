<template>
  <section>
    <div class="is-size-3 has-text-centered">Logout</div>
 </section>
</template>

<script>
    import Cookies from "js-cookie";
    export default {
        name: "Logout",
        mounted () {
            Cookies.remove('token');
            Cookies.remove('userdata');
        },
    }
</script>

<style lang="scss" scoped>

</style>