<template>
  <div id="map-scene">
    <div id="map">
      <canvas id="mapgen4" width="2048" height="2048" />
    </div>
    <div id="ui">
      <button id="small">
        <svg viewBox="-50 -50 100 100">
          <circle r="20" />
        </svg>
      </button>
      <button id="medium">
        <svg viewBox="-50 -50 100 100">
          <circle r="35" />
        </svg>
      </button>
      <button id="large">
        <svg viewBox="-50 -50 100 100">
          <circle r="50" />
        </svg>
      </button>

      <button id="ocean" title="Ocean">
        <svg viewBox="-50 -50 100 100">
          <text y="45">Ocean</text>
          <path d="M -60,-30 Q 0,80 60,-30 z" fill="hsl(240,50%,40%)" />
        </svg>
      </button>
      <button id="shallow" title="Water">
        <svg viewBox="-50 -50 100 100">
          <text y="45">Water</text>
          <path d="M -60,-10 Q 0,30 60,-10 z" fill="hsl(200,50%,70%)" />
        </svg>
      </button>
      <button id="valley" title="Valley">
        <svg viewBox="-50 -50 100 100">
          <text y="45">Valley</text>
          <path d="M -60,10 L -50,-10 L 50,-10 L 60,10 z" fill="hsl(100,50%,70%)" />
        </svg>
      </button>
      <button id="mountain" title="Mountain">
        <svg viewBox="-50 -50 100 100">
          <text y="45">Mountain</text>
          <path d="M -60,30 L 0,-30 L 60,30 z" fill="hsl(60,50%,40%)" />
        </svg>
      </button>

      <div id="sliders">
        <button id="button-reset">Reset</button>
      </div>
    </div>
  </div>
</template>

<script>
import Menu from "../components/game/menu.vue";
import Panel from "../components/ui/panel.vue";
import MapTile from "../components/map/map-tile.vue";
import { getters, actions } from "../stores/realm";

import mapgen4 from "../../mapgen/mapgen4";

export default {
  components: {
    Menu,
    Panel,
    MapTile
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
    actions.loadMap().then(() => mapgen4());
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