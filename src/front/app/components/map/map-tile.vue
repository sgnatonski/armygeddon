<template>
  <div>
    <l-polygon-fill-pattern
      :lat-lngs="mapTile.latlngs"
      :fillPattern="mapTile.image"
      imageScale="0.2"
    ></l-polygon-fill-pattern>
    <l-marker :lat-lng="mapTile" :icon="mapTile.icon">
      <l-popup>
        <v-card class="mx-auto" max-width="344">
          <v-card-text>
            <div>{{mapTile.name}}</div>
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
    <l-marker v-if="mapUnit" :lat-lng="mapUnit" :icon="mapUnit.icon"></l-marker>
  </div>
</template>

<script>
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
    LMap: window.Vue2Leaflet.LMap,
    LTileLayer: window.Vue2Leaflet.LTileLayer,
    LMarker: window.Vue2Leaflet.LMarker,
    LPolygon: window.Vue2Leaflet.LPolygon,
    LPopup: window.Vue2Leaflet.LPopup
  },
  props: {
    tile: {},
    unit: {}
  },
  computed: {
    mapTile: args => ({
      name: args.tile.name,
      lng: args.tile.coord.x,
      lat: args.tile.coord.y,
      latlngs: grid.map(g => [
        g[1] + args.tile.coord.y,
        g[0] + args.tile.coord.x
      ]),
      image: "/images/Geographical Features/Grass Group5.png",
      icon: window.L.icon({
        iconUrl:
          args.tile.type == "fort"
            ? "/images/Settlements/C-Fort.png"
            : "/images/Geographical Features/Dirt1.png",
        iconSize: [64, 64],
        iconAnchor: [32, 32]
      })
    }),
    mapUnit: args => ( args.unit ? {
      name: args.unit.name,
      lng: args.unit.coord.x,
      lat: args.unit.coord.y,
      icon: window.L.icon({
        iconUrl: "/images/Embelishment Icons/Pendant4.png",
        iconSize: [40, 40],
        iconAnchor: [80, 80]
      })
    } : null)
  }
};
</script>
