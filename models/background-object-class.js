class BackgroundObject extends MovableObject{
  
    constructor(imagePath, x, width, height){
    super().loadImage(imagePath);
    this.x = x;
    this.height = height;
    this.width = width;
    this.y = 480 - this.height;

  }

  setInTheMiddle(){
    this.x = (720 - this.width) / 2;
    this.y = (480 - this.height) / 2;
  }
}