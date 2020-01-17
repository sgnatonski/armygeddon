function createWaitLayer(width, height) {
    var waitLayer = new Konva.Layer({
        hitGraphEnabled : true,
        draggable: false
    });
    var waitOverlay = new Konva.Rect({
        x: 0,
        y: 0,
        width: width,
        height: height,
        fill: 'black',
        opacity: 0.5
    });
    waitLayer.add(waitOverlay);

    var textWidth = 320;

    function createText(text) {
        var texts = (text || []).map((t, i) => {
            return new Konva.Text({
                x: 0,
                y: i * 20,
                text: t,
                fontSize: 16,
                fontFamily: 'Calibri',
                width: textWidth,
                align: 'center',
                padding: 20,
            });
        });
        var textsHeight = texts.length * 20 + 40;
        var group = new Konva.Group({
            x: width / 2 - textWidth / 2,
            y: height / 2 - textsHeight / 2,
            height: textsHeight,
            fill: '#555'
        });

        var rect = new Konva.Rect({
            x: 0,
            y: -5,
            height: textsHeight,
            stroke: '#555',
            strokeWidth: 5,
            fill: '#ddd',
            width: textWidth,
            shadowColor: 'black',
            shadowBlur: 10,
            shadowOffset: [10, 10],
            shadowOpacity: 0.2
        });

        group.add(rect);
        texts.forEach(t => group.add(t));
        
        return group;
    }

    var complexText = createText();
    waitLayer.add(complexText);

    return {
        show: function (text) {
            waitOverlay.show();
            complexText = createText(text);
            waitLayer.add(complexText);
            waitLayer.draw();
        },
        hide: function () {
            waitOverlay.hide();
            complexText.destroy();
            waitLayer.draw();
        },
        node: waitLayer
    };
}