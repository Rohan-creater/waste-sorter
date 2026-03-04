const wasteItems={
 Wet:["Banana Peel","Vegetable Scraps","Tea Leaves"],
 Dry:["Plastic Bottle","Newspaper","Cardboard Box"],
 Hazardous:["Battery","Expired Medicine","Broken Glass"],
 "E-Waste":["Old Mobile Phone","Laptop Charger","Broken Keyboard"],
 Recycle:["Glass Bottle","Steel Can","Paper Bag"]
};

let items=[],score=0,combo=0,lives=3,timeLeft=60;
let gameInterval;

const scoreEl=document.getElementById("score");
const comboEl=document.getElementById("combo");
const livesEl=document.getElementById("lives");
const timerEl=document.getElementById("timer");
const itemEl=document.getElementById("currentItem");
const startBtn=document.getElementById("startBtn");
const restartBtn=document.getElementById("restartBtn");
const gameArea=document.getElementById("gameArea");
const endScreen=document.getElementById("endScreen");
const bgMusic=document.getElementById("bgMusic");

const binMouth=document.getElementById("binMouth");
const binBody=document.getElementById("binBody");
const binLid=document.getElementById("binLid");

const pupils=document.querySelectorAll(".pupil");

/* ================= BIN REACTION ================= */

function showMark(sym){
 if(sym==="✔️"){
   binMouth.className="mouth happy";
   binLid.classList.add("open");
   binBody.classList.add("jump");

   setTimeout(()=>{
     binLid.classList.remove("open");
     binBody.classList.remove("jump");
   },500);
 }else{
   binMouth.className="mouth sad";
   binBody.classList.add("binShake");

   setTimeout(()=>{
     binBody.classList.remove("binShake");
   },400);
 }

 setTimeout(()=>{
   binMouth.className="mouth";
 },900);
}

/* ================= EYES FOLLOW CURSOR ================= */

document.addEventListener("mousemove",(e)=>{
 pupils.forEach(pupil=>{
   const rect=pupil.parentElement.getBoundingClientRect();

   const x=e.clientX-rect.left-rect.width/2;
   const y=e.clientY-rect.top-rect.height/2;

   const angle=Math.atan2(y,x);

   pupil.style.transform=
     `translate(${Math.cos(angle)*4}px,
                ${Math.sin(angle)*4}px)`;
 });
});

/* ================= DRAG ================= */

itemEl.addEventListener("dragstart",
 e=>e.dataTransfer.setData("text","x"));

/* ================= GAME LOGIC ================= */

function prepareItems(){
 items=[];
 for(let c in wasteItems)
   wasteItems[c].forEach(i=>items.push({name:i,type:c}));

 items.sort(()=>Math.random()-0.5);
}

function loadItem(){
 if(!items.length)return endGame("Mission Complete!");
 const cur=items.pop();
 itemEl.innerText=cur.name;
 itemEl.dataset.type=cur.type;
}

startBtn.onclick=startGame;
restartBtn.onclick=startGame;

function startGame(){

 bgMusic.volume = 0.15;  // soothing volume
 bgMusic.play();

 score=0;combo=0;lives=3;timeLeft=60;

 scoreEl.innerText=0;
 comboEl.innerText=0;
 livesEl.innerText=lives+" ❤️";
 timerEl.innerText=timeLeft;

 startBtn.classList.add("hidden");
 restartBtn.classList.add("hidden");
 gameArea.classList.remove("hidden");
 endScreen.innerText="";

 prepareItems();
 loadItem();
 startTimer();
}

document.querySelectorAll(".bin").forEach(bin=>{

 bin.addEventListener("dragover",e=>e.preventDefault());

 bin.addEventListener("drop",e=>{
 e.preventDefault();

 if(bin.dataset.bin===itemEl.dataset.type){
   combo++;
   score+=1+combo;
   showMark("✔️");
   loadItem();
 }else{
   combo=0;
   lives--;
   showMark("✖️");

   if(lives<=0)
     return endGame("Mission Failed");
 }

 scoreEl.innerText=score;
 comboEl.innerText=combo;
 livesEl.innerText=lives+" ❤️";
 });
});

function startTimer(){
 clearInterval(gameInterval);

 gameInterval=setInterval(()=>{
   timeLeft--;
   timerEl.innerText=timeLeft;

   if(timeLeft<=0)
     endGame("Time Up");
 },1000);
}

function endGame(msg){
 clearInterval(gameInterval);

 endScreen.innerText=msg+" | Score: "+score;

 restartBtn.classList.remove("hidden");
}
