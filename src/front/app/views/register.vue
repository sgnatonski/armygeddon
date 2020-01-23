<template>
  <div>
    <Title />
    <div class="pure-g">
    <div class="pure-u-1 pure-u-md-1-3"></div>
    <div class="pure-u-1 pure-u-md-1-3 bordered-box">
        <div>
            <h2>Register yourself, Sir</h2>
            <form method="post" action="login/register" class="pure-form pure-form-aligned">
                <fieldset>
                    <div class="pure-control-group">
                        <label for="name">Username</label>
                        <input type="text" name="name" value="" placeholder="Username">
                    </div>
                    <div class="pure-control-group">
                        <label for="mail">Email</label>
                        <input type="text" name="mail" value="" placeholder="Email">
                    </div>
                    <div class="pure-control-group">
                        <label for="password">Password</label>
                        <input type="password" name="password" value="" placeholder="Password">
                    </div>
                    <div class="pure-control-group">
                        <label for="confirm">Confirm password</label>
                        <input type="password" name="confirm" value="" placeholder="Confirm password">
                    </div>
                    <div class="pure-controls">
                        <input type="submit" name="commit" value="Register" class="pure-button pure-button-primary"> or
                        <router-link to="/login">Login</router-link>
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
  },
  data: function() {
    return {
      title: "Armygeddon"
    };
  }
};
</script>

<style scoped>
</style>