function createTooltipLayer(stage){
    var tooltipLayer = new Konva.Layer({
        hitGraphEnabled : false
    });

    var tooltip = createTooltipVisual();

    tooltipLayer.add(tooltip.node);

    function updateTooltipWithUnitStats(unit){
        var mousePos = stage.getPointerPosition();
        mousePos.x -= stage.getPosition().x;
        mousePos.y -= stage.getPosition().y;
        var texts = [
            `Endurance: ${unit.endurance} / ${unit.lifetime.endurance}`,
            `Mobility: ${unit.mobility} / ${unit.lifetime.mobility}`,
            `Agility: ${unit.agility} / ${unit.lifetime.agility}`,
            `Damage: ${unit.damage}`,
            `Armor: ${unit.armor}`,
            `Range: ${unit.range}`,
        ];
        tooltip.show(texts, mousePos, texts.length);
        tooltipLayer.batchDraw();
    }

    function updateTooltipWithMoveStats(unit, cost){
        var mousePos = stage.getPointerPosition();
        mousePos.x -= stage.getPosition().x;
        mousePos.y -= stage.getPosition().y;
        if (cost <= unit.mobility){
            var texts = [
                `Moves: ${cost} / ${unit.mobility}`                
            ];
            if (unit.range == 1){
                texts.push(`Charge: +${cost}`);
            }
            if (unit.agility && cost == unit.mobility){
                texts.push(`Agility: -${unit.agility}`);
            }
            tooltip.show(texts, mousePos, texts.length);
            tooltipLayer.batchDraw();
        }
    }

    function updateTooltipWithAttackStats(aUnit, tUnit){
        var dmg = Damage().getChargeDamage(aUnit, tUnit);
        var mousePos = stage.getPointerPosition();
        var texts = [
            `Endurance: ${tUnit.endurance}`,
            `-${dmg} damage`
        ];
        tooltip.show(texts, mousePos, texts.length);
        tooltipLayer.batchDraw();
    }

    return {
        node: tooltipLayer,
        updateTooltipWithUnitStats: updateTooltipWithUnitStats,
        updateTooltipWithMoveStats: updateTooltipWithMoveStats,
        updateTooltipWithAttackStats: updateTooltipWithAttackStats,
        hideTooltip: function(){
            tooltip.hide();
            tooltipLayer.draw();
        }
    };
}