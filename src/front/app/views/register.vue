<template>
  <div>
    <Title />
    <v-content>
      <div class="pure-u-1 pure-u-sm-1-8 pure-u-md-1-4"></div>
      <div class="pure-u-1 pure-u-sm-3-4 pure-u-md-1-2">
        <Panel>
          <v-container>
            <h2>Register thyself, Sir</h2>
            <v-row>
              <v-col cols="12" sm="12" md="8" xl="6" offset-md="2" offset-xl="3">
                <v-form ref="form" v-model="valid">
                  <v-text-field label="Username" v-model="name" :rules="nameRules"></v-text-field>
                  <v-text-field label="Email" v-model="mail" :rules="emailRules"></v-text-field>
                  <v-text-field
                    label="Password"
                    type="password"
                    v-model="password"
                    :rules="passwordRules"
                  ></v-text-field>
                  <v-text-field
                    label="Confirm password"
                    type="password"
                    v-model="confirm"
                    :rules="[passwordConfirmationRule]"
                  ></v-text-field>
                  <v-alert v-if="error && !valid" type="error">{{error}}</v-alert>
                  <a
                    href="#"
                    v-on:click="register"
                    :disabled="!valid || sending"
                    class="btn btn_normal"
                  >Register</a>
                  <div style="margin: 0 auto; width: 16px;">or</div>
                  <router-link class="btn btn_normal" to="/login">Login</router-link>
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
      error: undefined,
      valid: false,
      nameRules: [        
        v => !!v || "Required.",
        v => v.length >= 5 || "Name must have at least 5 characters"
      ],
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
      ],
      passwordRules: [
        v => !!v || "Required.",
        v => v.length >= 3 || "Password must have at least 3 characters"
      ]
    };
  },
  computed: {
    passwordConfirmationRule() {
      return this.password === this.confirm || "Password must match";
    }
  },
  methods: {
    register() {
      this.sending = true;
      mutations
        .register({
          name: this.name,
          mail: this.mail,
          password: this.password,
          confirm: this.confirm
        })
        .then(
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