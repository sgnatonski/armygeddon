<template>
  <div class="pure-menu pure-menu-horizontal">
    <div v-if="authenticated" class="user">
        {{ name }}
    </div>
    <ul v-else class="pure-menu-list">
      <li class="pure-menu-item">
        <router-link to="/login">Login</router-link>
      </li>
      <li class="pure-menu-item">
        <router-link to="/register">Register</router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import { getters } from "../stores/user";

export default {
  computed: { ...getters }
};
</script>

<style scoped>
.user{
  color: antiquewhite;
}
</style>