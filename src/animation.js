let canva = document.getElementById("myCanvas");
let ctx = canva.getContext("2d");
ctx.strokeWidth=5;
let grav = 0.99;

effectiveW = window.innerWidth;
effectiveH = window.innerHeight;
canva.width = effectiveW;
canva.height = effectiveH;

/*Fonction to generate random color*/
function randomColor(){
    let r = Math.round(Math.random()*255);
    let g = Math.round(Math.random()*255);
    let b = Math.round(Math.random()*255);
    let a = 1;
    let color = "rgba("+r+","+g+","+b+","+a+")";
    return color;
}

/**Distance function*/
function distance(x1,y1,x2,y2){
    return Math.sqrt((x2-x1)**2 + (y2-y1)**2);
}

/**Distance function squared*/
function distanceSquare(x1,y1,x2,y2){
    return ((x2-x1)**2 + (y2-y1)**2);
}


/*Class representing balls*/
class Ball{
    constructor(){
        this.color = randomColor();
        this.radius = Math.min(1,(Math.random()+0.1))*Math.min(effectiveH,effectiveW)/6 //Max size of radius is 1/6 of max(width,height) of canvas
        this.x= Math.random()*(effectiveW-this.radius*2)+this.radius
        this.y= Math.random()*(effectiveH-this.radius*2) +this.radius
        this.dx=(Math.random()-0.5) * 10;
        this.dy=(Math.random()-0.5) * 10;
    }
    update(){
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,2*Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    }
}

vecBalls = []
for(let i=0;i<10;i++){
    vecBalls.push(new Ball());
}

function draw(){
    if (effectiveW != window.innerWidth || effectiveH != innerHeight){ //Update size of canvas if window was resized
        effectiveW = window.innerWidth;
        effectiveH = window.innerHeight;
        canva.width = effectiveW;
        canva.height = effectiveH;
    }
    window.requestAnimationFrame(draw); //Execute draw before refresh
    ctx.clearRect(0,0,effectiveW,effectiveH);
    
    for (let i = 0;i<vecBalls.length;i++){
        let ball = vecBalls[i];
        ball.update();
        ball.x += ball.dx;
        ball.y += ball.dy;

        //If ball touches side reverse direction
        if ((ball.x - ball.radius <= 0) || (ball.x+ball.radius>= effectiveW)){
            ball.dx = -ball.dx;
        }
        //If ball touches top or bottom reverse direction
        if ((ball.y - ball.radius <= 0) || (ball.y+ball.radius>= effectiveH)){
            ball.dy = -ball.dy*grav;
        }else{

        }
    }

    //Collision tests
    console.log("tests")
    for (let i = 0;i<vecBalls.length;i++){
        let A = vecBalls[i];
        for (let j = i+1;j<vecBalls.length;j++){
            let B = vecBalls[j];
            if (i != j){
                let xDist = A.x - B.x;
                let yDist = A.y - B.y;
                let distSquare = xDist**2 + yDist**2;
                //Use distance square to avoid calculating sqrt
                if(distSquare <= (B.radius + A.radius)**2){

                    let xVelocity = B.dx - A.dx;
                    let yVelocity = B.dy - A.dy;
                    let dotProduct = xDist*xVelocity + yDist*yVelocity;

                    //If they are moving towards one another
                    if(dotProduct > 0){
                        let collisionScale = dotProduct / distSquare;
                        let xCollision = xDist * collisionScale;
                        let yCollision = yDist * collisionScale;

                        //The Collision vector is the speed difference projected on the Dist vector,
                        //thus it is the component of the speed difference needed for the collision.

                        let combinedMass = A.radius + B.radius;
                        let collisionWeightA = 2 * B.radius / combinedMass;
                        let collisionWeightB = 2 * A.radius / combinedMass;

                        A.dx += collisionWeightA * xCollision;
                        A.dy += collisionWeightA * yCollision;
                        B.dx -= collisionWeightB * xCollision;
                        B.dy -= collisionWeightB * yCollision;
                    }
                }
            }
        }
    }
}

draw();