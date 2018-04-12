function createTerrainLayer(){
    var layer = new Konva.Layer();

    layer.addGridNodes = (grid, nodeCallback) => {
        var minX = 999999999;
        var minY = 999999999;
        var maxX = 0;
        var maxY = 0;
        layer.destroyChildren();
        grid.getHexes().sort((a, b) => {
            a.points.forEach(p => {
                if (p.x < minX) minX = p.x;
                if (p.x > maxX) maxX = p.x;
                if (p.y < minY) minY = p.y;
                if (p.y > maxY) maxY = p.y;
            });            

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

        return { x1: minX, x2: maxX, y1: minY, y2: maxY };
    }

    return layer;
}