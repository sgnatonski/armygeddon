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
      >
        <l-polygon-fill-pattern
          v-for="tile in tiles"
          :key="tile.name"
          :lat-lngs="tile.latlngs"
          :fillPattern="tile.image"
          imageScale="0.2"
        ></l-polygon-fill-pattern>
        <l-marker v-for="tile in tiles" :key="tile.name" :lat-lng="tile" :icon="tile.icon">
          <l-popup>
            <v-card class="mx-auto" max-width="344">
              <v-card-text>
                <div>{{tile.name}}</div>
                <p class="display-1 text--primary">be•nev•o•lent</p>
                <p>adjective</p>
                <div class="text--primary">
                  well meaning and kindly.
                  <br />"a benevolent smile"
                </div>
              </v-card-text>
              <v-card-actions>
                <v-btn text color="deep-purple accent-4">Learn More</v-btn>
              </v-card-actions>
            </v-card>
          </l-popup>
        </l-marker>
        <l-marker v-for="unit in units" :key="unit.name" :lat-lng="unit" :icon="unit.icon">
        </l-marker>
      </l-map>
    </Panel>
  </div>
</template>

<script>
import Menu from "../components/game/menu.vue";
import Panel from "../components/ui/panel.vue";
import { getters, actions } from "../stores/realm";
const s = 50;
const t = 30;
const u = 56;

const grid = [
  [0, -u],
  [s, -t],
  [s, t],
  [0, u],
  [-s, t],
  [-s, -t]
];

export default {
  components: {
    Menu,
    Panel,
    LMap: window.Vue2Leaflet.LMap,
    LTileLayer: window.Vue2Leaflet.LTileLayer,
    LMarker: window.Vue2Leaflet.LMarker,
    LPolygon: window.Vue2Leaflet.LPolygon,
    LPopup: window.Vue2Leaflet.LPopup
  },
  data() {
    return {
      minZoom: -1,
      maxZoom: 3,
      zoom: 1,
      crs: window.L.CRS.Simple,
      center: [0, 0]
    };
  },
  computed: {
    tiles: () =>
      getters.map().map(t => ({
        name: t.name,
        lng: t.coord.x,
        lat: t.coord.y,
        latlngs: grid.map(g => [g[1] + t.coord.y, g[0] + t.coord.x]),
        image: "/images/Geographical Features/Grass Group5.png",
        icon: window.L.icon({
          iconUrl: "/images/Settlements/C-Fort.png",
          iconSize: [64, 64],
          iconAnchor: [32, 32]
        })
      })),
    units: () =>
      getters
        .map()
        .filter(t => t.armyId)
        .map(t => ({
          name: t.name,
          lng: t.coord.x,
          lat: t.coord.y,
          icon: window.L.icon({
            iconUrl: "/images/Embelishment Icons/Pendant4.png",
            iconSize: [40, 40],
            iconAnchor: [80, 80]
          })
        }))
  },
  created() {
    actions.loadMap();
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