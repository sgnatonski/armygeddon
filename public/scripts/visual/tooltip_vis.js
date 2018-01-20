function createTooltipVisual(){
    var rect = new Konva.Rect({
        width: 100,
        height: 50,
        cornerRadius: 3,
        fill: 'grey',
        stroke: '#252525',
        strokeWidth: 2,
        alpha: 0.75,
        listening: false,
        shadowColor: 'black',
        shadowBlur: 10,
        shadowOffset: {x : 6, y : 6},
        shadowOpacity: 0.5
    });
    var text = new Konva.Text({
        fontFamily: "Calibri",
        fontSize: 11,
        padding: 5,
        textFill: "white",
        fill: "black",
        listening: false
    });

    var group = new Konva.Group({
        listening: false
    });

    group.add(rect);
    group.add(text);

    return {
        show: (txt, position) => {
            text.text(txt);
            group.position({
                x : position.x + 5,
                y : position.y + 5
            });
            group.show();
        },
        hide: () => {
            group.hide();
        },
        node: group
    };
}