<template>
  <div class="panel">
    <div class="corner_dbl_tl">
      <div></div>
    </div>
    <div class="line_dbl_h1">
      <div></div>
    </div>
    <div class="corner_dbl_tr">
      <div></div>
    </div>
    <div class="line_dbl_v1">
      <div></div>
    </div>
    <div class="slot">
      <slot></slot>
    </div>
    <div class="line_dbl_v2">
      <div></div>
    </div>
    <div class="corner_dbl_bl">
      <div></div>
    </div>
    <div class="line_dbl_h2">
      <div></div>
    </div>
    <div class="corner_dbl_br">
      <div></div>
    </div>
  </div>
</template>

<style scoped>
.panel {
  display: grid;
  grid-template-columns: 25px auto 25px;
  grid-template-rows: 25px auto 25px;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
  justify-items: stretch;
  align-items: stretch;
  margin: 8px;
}

.panel > .slot {
  background-color: blanchedalmond;
  margin: -10px;
  padding: 10px;
  box-shadow: black -22px 22px 22px 0px;
}

.line_dbl_v1 {
  z-index: 1;
}
.line_dbl_h2 {
  margin-top: 6px;
}

.line_dbl_v2 {
  margin-left: 6px;
}
</style>