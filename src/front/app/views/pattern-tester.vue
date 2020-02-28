<template>
  <div>
    <Panel>
      <v-range-slider
        v-model="param[0]"
        :min="0"
        :max="8"
        step="1"
        ticks="always"
        tick-size="4"
        color="green darken-3"
        track-color="gray"
        @end="update"
        label="Space"
      ></v-range-slider>
      <v-range-slider
        v-model="param[1]"
        :min="0"
        :max="8"
        step="1"
        ticks="always"
        tick-size="4"
        color="green darken-3"
        track-color="gray"
        @end="update"        
        label="Shape"
      ></v-range-slider>
      <v-range-slider
        v-model="param[2]"
        :min="0"
        :max="8"
        step="1"
        ticks="always"
        tick-size="4"
        color="green darken-3"
        track-color="gray"
        @end="update"
        label="Stance"
      ></v-range-slider>
      <v-range-slider
        v-model="param[3]"
        :min="0"
        :max="8"
        step="1"
        ticks="always"
        tick-size="4"
        color="green darken-3"
        track-color="gray"
        @end="update"
        label="Score"
      ></v-range-slider>
      <v-range-slider
        v-model="param[4]"
        :min="0"
        :max="8"
        step="1"
        ticks="always"
        tick-size="4"
        color="green darken-3"
        track-color="gray"
        @end="update"
        label="Org"
      ></v-range-slider>
      <v-range-slider
        v-model="param[5]"
        :min="0"
        :max="8"
        step="1"
        ticks="always"
        tick-size="4"
        color="green darken-3"
        track-color="gray"
        @end="update"        
        label="Mob"
      ></v-range-slider>
      <v-range-slider
        v-model="param[6]"
        :min="0"
        :max="8"
        step="1"
        ticks="always"
        tick-size="4"
        color="green darken-3"
        track-color="gray"
        @end="update"
        label="Def"
      ></v-range-slider>
      <v-range-slider
        v-model="param[7]"
        :min="0"
        :max="8"
        step="1"
        ticks="always"
        tick-size="4"
        color="green darken-3"
        track-color="gray"
        @end="update"
        label="Rng"
      ></v-range-slider>
      <v-data-iterator
        :items="result"
        hide-default-footer
        disable-filtering
        disable-pagination
        disable-sort
        :loading="loading"
      >
        <template v-slot:default="{ items }">
          <v-row>
            <v-col v-for="item in items" :key="item.key" cols="12" xs="6" sm="6" md="4" lg="3">
              <v-card tile>
                <v-card-title class="subheading font-weight-bold">{{ item.key }}</v-card-title>

                <v-divider></v-divider>

                <v-list dense>
                  <v-list-item>
                    <v-list-item-content>Influence:</v-list-item-content>
                    <v-list-item-content class="align-end">{{ item.influence.toFixed(0) }}</v-list-item-content>
                  </v-list-item>

                  <v-list-item>
                    <v-list-item-content>Cost:</v-list-item-content>
                    <v-list-item-content class="align-end">{{ item.cost.toFixed(3) }}</v-list-item-content>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </template>
      </v-data-iterator>
    </Panel>
  </div>
</template>

<script>
import Panel from "../components/ui/panel.vue";
import axios from "axios";

export default {
  components: {
    Panel
  },
  data: () => ({
    param: [
      [0, 8],
      [0, 8],
      [0, 8],
      [0, 8],
      [0, 8],
      [0, 8],
      [0, 8],
      [0, 8]
    ],
    result: [],
    loading: false
  }),
  mounted() {
    if (localStorage.getItem('nn_param')){
      this.param = JSON.parse(localStorage.getItem('nn_param'));
    }
    this.update();
  },
  methods: {
    update() {
      this.loading = true;
      axios.post("/armies/matchunit", this.param).then(r => {
        this.result = r.data;
        this.loading = false;
        localStorage.setItem('nn_param', JSON.stringify(this.param));
      });
    }
  }
};
</script>