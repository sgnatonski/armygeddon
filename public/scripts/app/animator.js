function Animator(){
    var anims = [];
    var c;

    return {
        registerAnimation: (id, node, center) => {
            anims[id] = node;
            c = center;
        },
        getAnimation: (id, path) => {
            return getUnitMoveAnim(path, anims[id], c);
        }
    }
};