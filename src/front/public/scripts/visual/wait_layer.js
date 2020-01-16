function createWaitLayer(width, height) {
    var waitLayer = new Konva.Layer({
        hitGraphEnabled : false
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
        return new Konva.Text({
            x: width / 2 - textWidth / 2,
            y: 100,
            text: text,
            fontSize: 16,
            fontFamily: 'Calibri',
            fill: '#555',
            width: textWidth,
            padding: 20,
            align: 'center'
        });
    }

    var complexText = createText();

    var rect = new Konva.Rect({
        x: width / 2 - textWidth / 2,
        y: 100,
        stroke: '#555',
        strokeWidth: 5,
        fill: '#ddd',
        width: textWidth,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: [10, 10],
        shadowOpacity: 0.2
    });

    waitLayer.add(rect);
    waitLayer.add(complexText);

    return {
        show: function (text) {
            waitOverlay.show();
            complexText = createText(text);
            waitLayer.add(complexText);
            rect.setHeight(complexText.getHeight());
            rect.show();
            waitLayer.draw();
        },
        hide: function () {
            waitOverlay.hide();
            complexText.destroy();
            rect.hide();
            waitLayer.draw();
        },
        node: waitLayer
    };
}