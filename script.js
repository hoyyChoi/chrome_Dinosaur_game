
let option = document.getElementById('option');
let score = document.getElementById('score');
let description = document.getElementById('description');



let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

canvas.width = window.innerWidth - 100;
canvas.height = window.innerHeight - 400;
 
let dino1 = new Image();
let dino2 = new Image();
dino2.src = 'dino1.png';
dino1.src ='dino2.png';
let dieDino = new Image();
dieDino.src ='die.png';

let dino = {  // 변경하기 쉽게 오브젝트로 정리
    x:20, //왼쪽
    y : 200, //위에서부터 
    width : 50, //사이즈
    height : 50,
    draw(img){
        ctx.drawImage(img, this.x, this.y,this.width,this.height);
    }
}

let background = {
    x:0,
    y:230,
    width:800,
    height:40,
    draw(){
        ctx.drawImage(backgroundImg, this.x, this.y,this.width,this.height);
    }
}


let gameover = {
    x:280,
    y:80,
    width:200,
    height:100,
    draw(){
        ctx.drawImage(overimg, this.x, this.y,this.width,this.height);
    }
}
let overimg = new Image();
overimg.src ='gameover.png'


let backgroundImg = new Image();
backgroundImg.src = 'background.jpg'

class Background {   
    constructor(){
        this.x = 200;
        this.y = 230;
        this.width = 600; 
        this.height = 40;
    }
    draw(){
        ctx.drawImage(backgroundImg, this.x, this.y,this.width,this.height);
    }
}

let cactus1 = new Image();
let cactus2 = new Image();
let cactus3 = new Image();
cactus1.src = 'cactus1.jpg';
cactus2.src = 'cactus2.jpg';
cactus3.src = 'cactus3.jpg';
const imgArray = [cactus1,cactus2,cactus3];

class Cactus {  //각각 다른 특성을 띄기때문에 클래스로 선언
    constructor(num,size){
        this.x = 600;
        this.y = 200;
        this.width = size; 
        this.height = 50;
        this.num = num;
    }
    draw(){
        ctx.drawImage(imgArray[this.num], this.x, this.y,this.width,this.height);
    }
}


//네모 박스는 hitbox 게임개발 할때 충돌이 일어나는 부분을 체킹하기 위해 
let animation
let timer = 0;
let backgroundArray =[]

let cactusAll = [];
let sizeArray = [30,50,80];

let jump = false;
let jumpTimer = 0;

let switching = true
let start = true


const SecondFrame = ()=>{  // 프레임 코드
    animation = requestAnimationFrame(SecondFrame)  
    timer++;
    score.innerText = timer++

    ctx.clearRect(0,0,canvas.width,canvas.height) //잔상 없애기
    
    if(timer%20 === 0){
        let back = new Background()
        backgroundArray.push(back)
    }
    backgroundArray.forEach((back,idx,o)=>{
        if(back.x === -20){
            o.splice(idx,1)
        }
        back.x-=7
        back.draw()
    })


    if(timer % 150 === 0){
        let num = Math.floor(Math.random() * 3);
        let size = sizeArray[num]
        let cactus = new Cactus(num,size);
        cactusAll.push(cactus)
    }
    cactusAll.forEach((cactus,idx, o)=>{
        //x좌표가 0 미만이면 배열에서 제거
        if(cactus.x === -20){
            o.splice(idx,1)
        }
        cactus.x -= 10;
        collision(dino,cactus); // 여기 안에서 충돌체크 해야함. 왜냐, 실시간으로 충돌하는지 알아야하므로, 반복문안에 넣는다. ex) 장애물이 100개가 있으면 공룡이랑 장애물이랑 실시간으로 충돌하는지 계속 확인해야하므로
        //반복문이 1초에 60번씩 진행되기 때문에 사실 계속 지워지면서 그려진다. (이동과 동시에)
        cactus.draw()
    })


    if(jump == true){
        dino.y -= 7; //1에 60번씩 2를 뺀다.
        jumpTimer++;  
    }
    if(jump == false){
        if(dino.y < 200){
            dino.y += 7;     
        } 
   
    }
    if(jumpTimer > 20){
        jump = false;
        jumpTimer = 0;
    }

    if(timer%12===0){
        dino.draw(dino1)
    }else{
        dino.draw(dino2)
    }

    if(switching === false){
        dino.draw(dieDino)
        gameover.draw()
    }
    
}

// 충돌 확인 collision detection

const collision = (dino,cactus)=>{
    let xdistance = (cactus.x+5) - (dino.x + dino.width);
   
    let ydistance = cactus.y - (dino.y + dino.height);
    if(xdistance < 0 && ydistance < 0 ){    // || 이게 아닌 && 이거인 이유는? 설명하기 그림 그려서
            switching = false;
            cancelAnimationFrame(animation)
            // 게임 오바 되었을때 나오는 게임오버 이미지보여주기 (게임오버 이미지)
    }
}




document.addEventListener('keydown',(e)=>{
    if(e.code === 'Space'){
        if(start === true){
            description.innerText = ''
            option.style.opacity = 1
            SecondFrame()
            start = false
        }
        
        if(dino.y == 200){
            jump = true;
        }
        if(switching === false){
            location.reload();
        }
    }
    if(e.code ==='ArrowUp'){
        if(dino.y == 200){
            jump = true;
        }
    }
    
})




//점프하고 내려오는 도중 점프금지, 점프 가능 기준 - 200px 아래 땅에 붙어있을때
// 점수 체크하는거 score 표기 - 프레임마다 1씩 증가
// 공룡이 달리는 것처럼 보이게 하고 싶다. 스프라이트이미지,-> 프레임마다 이미지 바꿔치기 하기
// 배경, 장애물 나오는 순서 랜덤함수
// 충돌체크 부분 픽셀단위가 아니므로 사실상 이미지끼리 부딪히는것 -> 이걸 해결하려면 1. 사진의 여백을 줄이거나, 픽셀로 그림을 그리거나, 아니면 뭔가 충돌체크하는 함수에서 높이와 너비를 - 단위로 체크한다.
// 배경부분 움직이는 것처럼 보이려면 배경자체가 반복하면서 옆으로 이동해야한다. 배경
//위에서 충돌하는거 어떻개 해결해야하나
//배경이 무제한으로 나오는 법.. 후 

// 프레임 코드 밖에서 이미지를 바꿀경우, 이미지가 먹혀서 안바뀜 바뀌긴하지만, 뭔가 이벤트를 통해서 이미지를 변경할 경우, 프레임 코드 안에서 변경해야함.