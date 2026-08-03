class CollectableObject extends DrawableObject{

    constructor(IMAGES, x, y, height, width) {
        super();
        this.IMAGES = IMAGES;
        this.loadImages(this.IMAGES);
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.setImg();
    }

    setImg() {
        let index = 0;
        let path = this.IMAGES[index];
        this.img = this.imageCache[path];
        setInterval(()=>{
            if (index == 0) {
                index = 1;
                
            } else {
                index = 0
            }
            path = this.IMAGES[index];
            this.img = this.imageCache[path];
        }, 500)
    }
}