<template>
  <div>
    <div>
      <h2>Ranking</h2>
      <ul class="select-list">
        <li v-for="item in ranking" :key="item.playerName">
          <span>{{item.playerName}}</span>
          <span>{{item.totalExp}}</span>
          <span>{{item.totalRank}}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  data: function() {
    return {
      ranking: [
        {
          playerName: "",
          totalExp: "",
          totalRank: ""
        }
      ]
    };
  }
};
</script>

<style scoped>
</style>