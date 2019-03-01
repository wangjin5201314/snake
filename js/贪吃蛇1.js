let drawSize = 10;//网格的个数
let time;//蛇移动的定时器
let snakePos;//蛇的位置
let direction;//蛇移动的方向
let moveSpeed;//蛇的移动速度，单位毫秒
let keyFlag;//键盘开关
let score;
//初始化网格
function initDraw(){
	//网格的行
	for(let i = 0;i<drawSize;i++){
		//网格的行
		for(let j = 0;j<drawSize;j++){
			//网格的列
			let div = $("<div id= '"+i+ "-"+j+"' class ='item'></div>");
			div.css({
				width:$(".screen").innerWidth()/drawSize+"px",
				height:$(".screen").innerHeight()/drawSize+"px"
			});
			$(".screen").append(div);
		}
	}
}
initDraw();
//画蛇
function drawSnake(){
	// 清除上一次的蛇身
	$(".snake").removeClass("snake");
	// 清除上一次的蛇头
	$(".item.head").removeClass("head");
	//重新绘制蛇身体
	$.each(snakePos,function(index,val){
		$(`#${val.x}-${val.y}`).addClass("snake");
	})
	// 重新标记蛇头
	let snakeHeadInfo = snakePos[snakePos.length-1];
	$(`#${snakeHeadInfo.x}-${snakeHeadInfo.y}`).addClass("head");
}
//蛇移动
function snakeMove(){
	time = setInterval(function(){
		//新蛇头的信息
		let newHeadInfo = {};
		//旧蛇头的信息
		let oldHeadInfo = snakePos[snakePos.length-1];
		if(direction === "right"){
			newHeadInfo ={
				x:oldHeadInfo.x,
				y:oldHeadInfo.y+1
			};
		}else if(direction === "left"){
			newHeadInfo ={
				x:oldHeadInfo.x,
				y:oldHeadInfo.y-1
			};
		} else if(direction === "top"){
			newHeadInfo ={
				x:oldHeadInfo.x-1,
				y:oldHeadInfo.y
			};
		}else if(direction === "bottom"){
			newHeadInfo ={
				x:oldHeadInfo.x+1,
				y:oldHeadInfo.y
			};
		}
		//判断是否吃到食物
		if(!$("#"+newHeadInfo.x +"-"+newHeadInfo.y).hasClass("food")){
			//删除蛇尾
			snakePos.shift();
		}
		//蛇配到边界的处理(Y)
		if(newHeadInfo.y>drawSize-1){
			newHeadInfo.y = 0;
		}
		//蛇配到边界的处理(X)
		if(newHeadInfo.x > drawSize-1){
			newHeadInfo.x = 0;
		}else if(newHeadInfo.x < 0){
			newHeadInfo.x = drawSize-1;
		}
		//舌头碰到身体
		if($("#"+newHeadInfo.x +"-"+newHeadInfo.y).hasClass("snake")){
			stop();
			return;
		}
		//添加蛇头
		snakePos.push(newHeadInfo);
		//重新画蛇
		drawSnake();
		//重新生成食物
		if($("#"+newHeadInfo.x +"-"+newHeadInfo.y).hasClass("food")){
			createFood();
			score++;
			setScore();
		}
		//打开控制方向的开关
		keyFlag = true;
	},moveSpeed);
}
//改变蛇的移动方向(方法1)
function changeDirection(){
	$(window).keydown(function(e){
		if(e.keyCode === 13){
			snakeMove();
		}
		if(!keyFlag){
			return;
		}
		keyFlag = false;
		if(e.keyCode===38 && (direction === "left" || direction === "right")){
			direction = "top";
		}else if(e.keyCode === 40 && (direction === "left" || direction === "right")){
			direction = "bottom";
		}else if(e.keyCode === 37 && (direction === "top" || direction === "bottom")){
			direction = "left";
		}else if(e.keyCode ===39 && (direction === "top" || direction === "bottom")){
			direction = "right";
		}else if(e.keyCode === 32){
			clearInterval(time);
		}
	});
}
//改变蛇的移动方向(方法2)
/* function changeDirection(){
	$(window).keydown(function(e){
		if(keyFlag){
			if(e.keyCode===38 && (direction === "left" || direction === "right")){
				direction = "top";
			}else if(e.keyCode === 40 && (direction === "left" || direction === "right")){
				direction = "bottom";
			}else if(e.keyCode === 37 && (direction === "top" || direction === "bottom")){
				direction = "left";
			}else if(e.keyCode ===39 && (direction === "top" || direction === "bottom")){
				direction = "right";
			}else if(e.keyCode === 32){
				clearInterval(time);
			}else if(e.keyCode === 13){
				snakeMove();
			}
		}
	});
} */
//生成食物
function createFood(){
	$(".item.food").removeClass("food");
	let x,y;
	do{
		x = getRandom(0, drawSize-1);
		y = getRandom(0, drawSize-1);
	}while($("#"+x+"-"+y).hasClass("snake"));
	$("#"+x+"-"+y).addClass("food");
}
//生成随机数
function getRandom(start, end) {
	return Math.round(Math.random() * (end - start) + start);
}
//开始游戏
function start(){
	time;//蛇移动的定时器
	snakePos = [{x:0,y:0},{x:0,y:1},{x:0,y:2}];//蛇的位置
	direction = "right";//蛇移动的方向
	moveSpeed = 300;//蛇的移动速度，单位毫秒
	keyFlag = true;//键盘开关
	score = 0//分数
	drawSnake();//画蛇
	snakeMove();//蛇移动
	createFood();//生成食物
	changeDirection();//蛇改变方向
	setScore();//设置分数
}
start();
//设置分数
function setScore(){
	if(score%5===0 || score%5!=0){
		moveSpeed -= 10;
		clearInterval(time);
		snakeMove();
	}
	$(".now span").text(score);
	if(score>localStorage.maxScore*1||!localStorage.maxScore){
		$(".now span").text(score);
	}else{
		$(".now span").text(localStorage.maxScore);
	}
}
//停止游戏
function stop(){
	clearInterval(time);
	$(window).off("keydown");
	if(confirm("游戏失败，是否重新开始游戏？")){
		start();
		if(score>localStorage.maxScore*1||!localStorage.maxScore){
			localStorage.maxScore = score;
		}
	}
}







