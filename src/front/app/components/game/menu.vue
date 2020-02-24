<template>
  <div class="game-menu">
    <div class="icon"></div>
    <input type="checkbox" class="wrapper" :checked="expanded" />
    <div class="contents">
      <ul>
        <li v-for="item in items" :key="item.name">
          <v-btn tile small text @click="item.action">
            <v-icon v-if="item.icon">mdi-{{item.icon}}</v-icon>
            {{item.name}}
            </v-btn>
        </li>
        <li>
          <v-btn tile small text icon to="/start">
            <v-icon>mdi-home-import-outline</v-icon>
          </v-btn>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    expanded: false,
    items: []
  }
};
</script>

<style scoped>
.v-btn{
  background-color: aliceblue;
    opacity: 0.7;
}
</style>