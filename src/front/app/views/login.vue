<template>
  <div>
    <Title />
    <div class="pure-g">
      <div class="pure-u-1 pure-u-md-1-3"></div>
      <div class="pure-u-1 pure-u-md-1-3 bordered-box">
        <div>
          <h2>Who art thou, Sir?</h2>
          <form method="post" action="login" class="pure-form pure-form-aligned">
            <fieldset>
              <div class="pure-control-group">
                <label for="name">Username</label>
                <input type="text" name="name" value placeholder="Username or Email" />
              </div>
              <div class="pure-control-group">
                <label for="name">Password</label>
                <input type="password" name="password" value placeholder="Password" />
              </div>
              <div class="pure-controls">
                <input
                  type="submit"
                  name="commit"
                  value="Login"
                  class="pure-button pure-button-primary"
                />
                or
                <router-link to="/register">Register</router-link>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "../components/title.vue";
export default {
  components: {
    Title
  }
};
</script>

<style scoped>
</style>