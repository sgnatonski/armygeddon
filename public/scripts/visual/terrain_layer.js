function createTerrainLayer(){
    var layer = new Konva.Layer();

    layer.addGridNodes = (grid, nodeCallback) => {
        var minX = 999999999;
        var minY = 999999999;
        var maxX = 0;
        var maxY = 0;
        layer.destroyChildren();
        grid.getHexes().sort((a, b) => {
            if (a.center.x < minX) minX = a.center.x;
            if (a.center.x > maxX) maxX = a.center.x;
            if (a.center.y < minY) minY = a.center.y;
            if (a.center.y > maxY) maxY = a.center.y;         

            if (a.y > b.y) return 1;
            if (a.y < b.y) return -1;
        
            if (a.x > b.x) return 1;
            if (a.x < b.x) return -1;
        
            return 0;
        })
        .map(hex => nodeCallback(hex))
        .forEach(node => {
            layer.add(node);
        });

        return { minX, minY, maxX, maxY };
    }

    return layer;
}