let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 100;



let dino = {  // 변경하기 쉽게 오브젝트로 정리
    x:70, //왼쪽
    y : 200, //위에서부터 
    width : 50, //사이즈
    height : 50,
    draw(){
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x,this.y,this.width,this.height);
    }
}

// let img1 = new Image();
// img1.src ='주소'


class Cactus {   //장애물들도 오브젝트로 정리, but 각각 다른 특성을 띄기때문에 클래스로 선언 (클래스는 객체 찍어내는 기계)
    constructor(){
        this.x = 500;
        this.y = 200;
        this.width = 50;
        this.height = 50;
    }
    draw(){
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x,this.y,this.width,this.height);    //네모 박스는 hitbox 게임개발 할때 충돌이 일어나는 부분을 체킹하기 위해 
        // ctx.drawImage(img1, this.x, this.y);
    }
}


let timer = 0;
let cactusAll = [];
let jump = false;
let jumpTimer = 0;
let animation

function SecondFrame(){  // 프레임이란 - 1초에 60번 정도의 애니메이션
    animation = requestAnimationFrame(SecondFrame)  //자바스크립트 기본기능 1초에 60번씩 코드가 실행 모니터마다 다름
    timer++;

    ctx.clearRect(0,0,canvas.width,canvas.height) //잔상 없애기

    
    if(timer % 80 === 0){
        let cactus = new Cactus();
        cactusAll.push(cactus)
        
    }
    cactusAll.forEach((cactus,idx, o)=>{
        //x좌표가 0 미만이면 제거
        if(cactus.x === 0){
            o.splice(idx,1)
        }
        cactus.x -= 5;

        collision(dino,cactus); // 여기 안에서 충돌체크 해야함. 왜냐, 실시간으로 충돌하는지 알아야하므로, 반복문안에 넣는다. ex) 장애물이 100개가 있으면 공룡이랑 장애물이랑 실시간으로 충돌하는지 계속 확인해야하므로

        cactus.draw()
    })

    if(jump == true){
        dino.y -= 10; //1에 60번씩 2를 뺀다.
        jumpTimer++;  
    }
    if(jump == false){
        if(dino.y < 200){
            dino.y += 10;     
        } 
   
    }
    if(jumpTimer > 20){
        jump = false;
        jumpTimer = 0;
    }
    dino.draw()
}

SecondFrame()


// 충돌 확인 collision detection

const collision = (dino,cactus)=>{
    let xdistance = cactus.x - (dino.x + dino.width);
    let ydistance = cactus.y - (dino.y + dino.height);
    if(xdistance < 0 && ydistance < 0){                  // || 이게 아닌 && 이거인 이유는? 설명하기 그림 그려서
        cancelAnimationFrame(animation)
    }
}




document.addEventListener('keydown',(e)=>{
    if(e.code === 'Space'){
        if(dino.y == 200){
            jump = true;
        }
    }
})


//점프하고 내려오는 도중 점프금지, 점프 가능 기준 - 200px 아래 땅에 붙어있을때
// 점수 체크하는거 score 표기 - 프레임마다 1씩 증가
// 공룡이 달리는 것처럼 보이게 하고 싶다. 스프라이트이미지,-> 프레임마다 이미지 바꿔치기 하기
// 배경, 장애물 나오는 순서 랜덤함수