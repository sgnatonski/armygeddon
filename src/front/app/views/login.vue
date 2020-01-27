<template>
  <div>
    <Title />
    <div class="pure-g">
      <div class="pure-u-1 pure-u-sm-1-8 pure-u-md-1-4"></div>
      <div class="pure-u-1 pure-u-sm-3-4 pure-u-md-1-2">
        <Panel>
          <div>
            <h2>Who art thou, Sir?</h2>
            <div class="pure-form pure-form-aligned">
              <fieldset>
                <div class="pure-control-group">
                  <label for="name">Username</label>
                  <input type="text" name="name" v-model="name" placeholder="Username or Email" />
                </div>
                <div class="pure-control-group">
                  <label for="name">Password</label>
                  <input type="password" name="password" v-model="password" placeholder="Password" />
                </div>
                <div>{{error}}</div>
                <div class="pure-controls">
                  <button
                    v-on:click="login"
                    :disabled="sending"
                    class="pure-button pure-button-primary"
                  >Login</button>
                  or
                  <router-link to="/register">Register</router-link>
                </div>
              </fieldset>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  </div>
</template>

<script>
import Title from "../components/title.vue";
import Panel from "../components/ui/panel.vue";
import { mutations } from "../stores/user"; 
export default {
  components: {
    Title,
    Panel
  },
  data() {
    return {
      name: "",
      password: "",
      sending: false,
      error: undefined
    };
  },
  methods: {
    login() {
      this.sending = true;
      mutations.login({ name: this.name, password: this.password }).then(
        r => this.$router.push("/"),
        e => {
          this.sending = false;
          this.password = "";
          this.error = "Unrecognized user. Please check login data.";
        }
      );
    }
  }
};
</script>

<style scoped>
</style>