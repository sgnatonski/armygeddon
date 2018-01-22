function createTerrainLayer(){
    var layer = new Konva.Layer();

    layer.addGridNodes = (grid, nodeCallback) => {
        layer.destroyChildren();
        grid.getHexes().sort((a, b) => {
            if (a.y > b.y) return 1;
            if (a.y < b.y) return -1;
        
            if (a.x > b.x) return 1;
            if (a.x < b.x) return -1;
        
            return 0;
        })
        .map(hex => nodeCallback(hex))
        .forEach(node => {
            layer.add(node.node);
            layer.add(node.coord);
        });
    }

    return layer;
}