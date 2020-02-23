<template>
  <div>
    <Title />
    <v-content>
      <div class="pure-u-1 pure-u-sm-1-8 pure-u-md-1-4"></div>
      <div class="pure-u-1 pure-u-sm-3-4 pure-u-md-1-2">
        <Panel>
          <v-container>
            <h2>Who art thou, Sir?</h2>
            <v-row>
              <v-col cols="12" sm="12" md="8" xl="6" offset-md="2" offset-xl="3">
                <v-form ref="form" v-model="valid">
                  <v-text-field label="Username or Email" v-model="name" :rules="[rules.required]"></v-text-field>
                  <v-text-field
                    label="Password"
                    type="password"
                    v-model="password"
                    :rules="[rules.required]"
                  ></v-text-field>
                  <v-alert v-if="error && !valid" type="error">{{error}}</v-alert>
                  <a
                    href="#"
                    v-on:click="login"
                    :disabled="!valid || sending"
                    class="btn btn_normal"
                  >Login</a>
                  <div style="margin: 0 auto; width: 16px;">or</div>
                  <router-link class="btn btn_normal" to="/register">Register</router-link>
                </v-form>
              </v-col>
            </v-row>
          </v-container>
        </Panel>
      </div>
    </v-content>
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
      error: undefined,
      valid: false,
      rules: {
        required: value => !!value || "Required."
      }
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