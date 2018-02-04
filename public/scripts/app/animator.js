function Animator(){
    var anims = [];
    var c;
    var currentAnimation;

    return {
        registerAnimation: (id, node, center) => {
            anims[id] = node;
            c = center;
        },
        getAnimation: (id, path) => {
            currentAnimation = getUnitMoveAnim(path, anims[id], c).then(() => currentAnimation = null);
            return currentAnimation;
        },
        isAnimating: () =>{
            return currentAnimation;
        }
    }
};