function createTooltipVisual(){
    var rect = new Konva.Rect({
        width: 100,
        height: 50,
        cornerRadius: 3,
        fill: 'grey',
        stroke: '#252525',
        strokeWidth: 2,
        opacity: 0.8,
        listening: false,
        shadowColor: 'black',
        shadowBlur: 5,
        shadowOffset: {x : 6, y : 6},
        shadowOpacity: 0.5
    });
    var text = new Konva.Text({
        fontFamily: "Calibri",
        fontSize: 11,
        padding: 5,
        fill: "#dedede",
        listening: false/*,
        shadowColor: 'black',
        shadowBlur: 0,
        shadowOffset: {x : 2, y : 2},
        shadowOpacity: 0.5*/
    });

    var group = new Konva.Group({
        listening: false
    });

    group.add(rect);
    group.add(text);
    group.hide();

    return {
        show: (txt, position, lines) => {
            if (!lines){
                lines = 1;
            }
            text.text(txt.join('\n'));
            group.position({
                x : position.x + 5,
                y : position.y + 5
            });
            rect.height(10 + lines * 11);
            group.show();
        },
        hide: () => {
            group.hide();
        },
        node: group
    };
}