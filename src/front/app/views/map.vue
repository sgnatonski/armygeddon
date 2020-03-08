<template>
  <div id="map-scene">
    <Panel class="map-panel">
      <l-map
        ref="map"
        :zoom="zoom"
        :min-zoom="minZoom"
        :max-zoom="maxZoom"
        :center="center"
        :crs="crs"
        :attributionControl="false"
        @zoomstart="zoomstart"
        @zoomend="zoomend"
      >
        <MapTile
          v-for="tile in tiles"
          :key="tile.name"
          :tile="tile"
        ></MapTile>
      </l-map>
    </Panel>
  </div>
</template>

<script>
import Menu from "../components/game/menu.vue";
import Panel from "../components/ui/panel.vue";
import MapTile from "../components/map/map-tile.vue";
import { getters, actions } from "../stores/realm";

export default {
  components: {
    Menu,
    Panel,
    MapTile,
    LMap: window.Vue2Leaflet.LMap
  },
  data() {
    return {
      minZoom: 0,
      maxZoom: 3,
      zoom: 1,
      crs: window.L.CRS.Simple,
      center: [0, 0],
      showMarkers: true,
      showUnits: true
    };
  },
  computed: {
    tiles: args => (args.showMarkers ? getters.map() : []),
    units: args =>
      args.showMarkers && args.showUnits
        ? getters.map().filter(t => t.armyId)
        : []
  },
  created() {
    actions.loadMap();
  },
  methods: {
    zoomstart(evt) {
      this.showMarkers = false;
    },
    zoomend(evt) {
      var z = this.$refs.map.mapObject.getZoom();
      this.showUnits = z > 0;
      this.showMarkers = true;
    }
  }
};
</script>

<style>
.panel.map-panel > .slot {
  grid-row: 2;
  grid-column: 2;
  padding: 0px;
}

.panel.map-panel > .slot > .vue2leaflet-map {
  height: 800px;
}

.leaflet-pane > svg path.leaflet-interactive {
  fill: rgb(16, 131, 16);
  fill-opacity: 0.7;
  stroke: green;
  stroke-width: 1px;
}
.leaflet-pane > svg path.leaflet-interactive:hover {
  fill-opacity: 0.8;
}

img.leaflet-marker-icon.leaflet-interactive {
  border-radius: 50px;
  background-color: transparent;
  object-fit: fill;
  object-position: -5px 5px;
}
img.leaflet-marker-icon.leaflet-interactive:hover {
  background: radial-gradient(
    circle,
    rgba(220, 220, 236, 1) 0%,
    rgba(0, 0, 0, 0) 70%
  );
}
.leaflet-control-attribution {
  display: none;
}
.leaflet-popup-content {
  margin: unset;
  line-height: unset;
}
.leaflet-popup-content-wrapper {
  padding: unset;
  text-align: unset;
  border-radius: unset;
}
</style>