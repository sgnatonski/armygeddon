function loadImages(){
    return load([
        '/images/grid/plain1.png',
        '/images/grid/plain2.png',
        '/images/grid/plain3.png',
        '/images/grid/plain4.png',
        '/images/grid/plain5.png',
        '/images/grid/plain6.png',
        '/images/grid/forrest1.png',
        '/images/grid/forrest2.png'
    ]).then(imgs =>{
        return {
            plains: imgs.slice(0, 6),
            forrests: [imgs[6]]
        };
    });
}