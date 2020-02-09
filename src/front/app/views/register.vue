<template>
  <div>
    <Title />
    <div class="pure-g">
      <div class="pure-u-1 pure-u-sm-1-8 pure-u-md-1-4"></div>
      <div class="pure-u-1 pure-u-sm-3-4 pure-u-md-1-2">
        <Panel>
          <h2>Register yourself, Sir</h2>
          <div class="pure-form pure-form-aligned">
            <fieldset>
              <div class="pure-control-group">
                <label for="name">Username</label>
                <input type="text" name="name" v-model="name" placeholder="Username" />
              </div>
              <div class="pure-control-group">
                <label for="mail">Email</label>
                <input type="text" name="mail" v-model="mail" placeholder="Email" />
              </div>
              <div class="pure-control-group">
                <label for="password">Password</label>
                <input type="password" name="password" v-model="password" placeholder="Password" />
              </div>
              <div class="pure-control-group">
                <label for="confirm">Confirm password</label>
                <input type="password" name="confirm" v-model="confirm" placeholder="Confirm password" />
              </div>
              <div>{{error}}</div>
              <div>
                <a href="#"
                  v-on:click="register"
                  :disabled="sending"
                  class="btn btn_normal"
                >Register</a>
                <div style="margin: 0 auto; width: 16px;">or</div>
                <router-link class="btn btn_normal" to="/login">Login</router-link>
              </div>
            </fieldset>
          </div>
        </Panel>
      </div>
    </div>
  </div>
</template>

<script>
import { mutations } from "../stores/user";
import Panel from "../components/ui/panel.vue";
import Title from "../components/title.vue";
export default {
  components: {
    Title,
    Panel
  },
  data() {
    return {
      name: "",
      mail: "",
      password: "",
      confirm: "",
      sending: false,
      error: undefined
    };
  },
  methods: {
    register() {
      this.sending = true;
      mutations.register({ name: this.name, mail: this.mail, password: this.password, confirm: this.confirm }).then(
        r => this.$router.push("/"),
        e => {
          this.sending = false;
          this.password = this.confirm = "";
          this.error = e;
        }
      );
    }
  }
};
</script>

<style scoped>
</style>