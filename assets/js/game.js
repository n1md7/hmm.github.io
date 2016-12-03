


/**************************************************elements class start************************************************************************/
function Element(){
	this.getElement = function(element){
		this.element = element;
		return this;
	}
	this.getQuery = function(element){
		this.element = document.querySelector(element);
		return this;
	}
    this.createElement = function(element, parent, insertBefore){
		var d = document;
		if(!insertBefore){
      		this.element = d.querySelector(parent).appendChild(d.createElement(element));
		}else{
	      var newone = document.createElement(element);
	      d.querySelector(parent).insertBefore(newone, d.querySelector(insertBefore));
	      this.element = newone;
		}
      return  this;
    }
    this.delete = function(element){
    	element.parentNode.removeChild(element);
    }
    this.this = function(){
        return this.element;
    }
    this.attr = function(attr, value){
      this.element.setAttribute(attr,value);
        return this;
    }
    this.innerHTML = function(text){
      this.element.innerHTML = text;
      return this;
    }
    this.css = function(css){
	this.style = "";
      if(css instanceof Array){
        for(var index = 0; index < css.length; index ++){
          this.style += css[index] + ";";
        }
      }else if(typeof css === 'object'){
        for(var key in css){
          this.style += key + ": " + css[key] + "; ";
        }
      }else{
        this.style = css;
      }
        this.element.setAttribute("style",  this.style);
      return this;
    }
}
/**/
class Operations{
	getRandom(min, max){
		return Math.floor(Math.random()*(max-min+1)+min);
	}
} 
/**************************************************end of element class ************************************************************************/

class Canvas{
	constructor(querySelector){
		this.canvas = document.querySelector(querySelector);
		this.ctx = this.canvas.getContext("2d");
	}
	drawLine(A, B, Fill = false, closePath = false){ // A[x,y]  B[x,y] 
		/*drawLine([0,0],[[20,40],[60,70]]) or drawLine([0,0],[60,70])*/
		this.ctx.beginPath(); // not testit but hope no error :D
		this.ctx.moveTo(A[0], A[1]);
		if(Array.isArray(B[0])){
			for(var i = 0; i < B.length; i ++){
				this.ctx.lineTo(B[i][0], B[i][1]);
			}
		}else{
			this.ctx.lineTo(B[0], B[1]);
		}
		if(closePath == true)
			this.ctx.closePath();
		this.ctx.stroke();
		if(Fill == true)
			this.ctx.fill();
		return this;
	}
	drawImage(img, A, WH){
		this.ctx.drawImage(img,A[0],A[1],WH[0],WH[1]);
		return this;
	}
	cropImage(img,sx,sy,swidth,sheight,x,y,width,height){
		this.ctx.drawImage(img,sx,sy,swidth,sheight,x,y,width,height)
		return this
	}
	drawCircle(A, R){ //A[x,y] R=len
		this.ctx.arc(A[0], A[1], R, 0, 2*Math.PI);
		this.ctx.stroke();
		return this;
	}
	drawText(A, text, fontSize = 12, color = "black"){
		this.ctx.fillStyle = color;
		this.ctx.font = fontSize + "px dgt";
  		this.ctx.fillText(text, A[0], A[1]);
  		return this;
	}
	drawRect(A, WH, color){
		this.ctx.fillStyle = color?color:"black";
		this.ctx.fillRect(A[0], A[1], WH[0], WH[1]);
		return this;
	}
	strokeRect(A, WH){
		this.ctx.strokeRect(A[0], A[1], WH[0], WH[1]);
		return this;
	}
	clear(A, WH){
		this.ctx.clearRect(A[0], A[1], WH[0], WH[1]);
		return this;
	}
	getElement(){
		return this.canvas;
	}
}


/****************************************************end of canvas class*****************************************************************************/



/**************************************************Game is main claassssss ************************************************************************/

class Game{
	constructor(backgroundGame, bodyGame, userPopup){
		var w,h;
		w = new Element().getQuery(bodyGame).this().width;
		h = new Element().getQuery(bodyGame).this().height;
		this.canvas = {
			width: w,
			height: h,
			game : new Canvas(bodyGame),
			user : new Canvas(userPopup),
			back : new Canvas(backgroundGame),
			left: window.innerWidth > w ? (window.innerWidth - w) / 2 : window.innerWidth,
			top: window.innerHeight > h ? (window.innerHeight - h) / 2 : window.innerHeight
		}

		this.game = {
			level : 1,
			end : false,
			puased : false
		}
		this.texts = []
	
		this.bullets = [];
		this.enemyBullets = [];
		this.enemys = [];
		this.deadObjs = [];

		this.player = {
			width : 40,
			height : 40,
			x : this.canvas.width / 2,
			y : this.canvas.height - 50,
			bullet : 530,
			life  : 100,
			specialBullet : 10,
			direction : {
				left : false,
				right : false
			},
			shooting : false
		}
		this.bullet = {
			double : false,
			triple : false,
			maxPerShot : 6, // max 6
			speed : 1, //max 5
			width : 10,
			height : 10,
			x : 0,
			y : this.player.y-30
		}
		this.enemy = {
			width : 20,
			height : 20,
			damage : 50, // percentage of 100
			power : 1
		}
		// this.enemyPower = ["black","purple","yellow","white","green","red","silver","pink"]
		this.enemyPower = ["enemypower1.png","enemypower2.png","enemypower3.png","enemypower4.png","enemypower5.png","enemypower6.png"]

		this.pixels = {
			player : [0,0,200,170],
			playerLow : [0,200,200,165],
			enemy1 : [300,0,100,80],
			enemy2 : [400,0,100,80],
			enemy3 : [500,0,100,80],
			enemy4 : [300,85,100,80],
			enemy5 : [400,85,100,80],
			enemy6 : [500,85,100,80],
			enemyDown : [[600,0,100,85],[600,85,100,85]],
			bulletPlayer : [710,0,20,40],
			bulletEnemy : [770,0,20,40],
			collision : [740,0,25,40]
		}
		this.image = {
			image : "assets/images/imagenoback.png",
			player : "assets/images/playernoback.png",
			bullet : "assets/images/bullet.png",
			enemy : "assets/images/myenemynoback.png"
		}

		this.myImage = new Image()
		this.myImage.src = this.image.image
		this.sounds = {
			explode : new Audio("assets/sounds/explode.mp3"),
			shot : new Audio("assets/sounds/shot.mp3"),
			flyBack : new Audio("assets/sounds/flysound.mp3"),
			flyBack1 : new Audio("assets/sounds/flysound1.mp3"),
			mute : false
		}
		this.enemyInterval = 100 // 100 is ok.. and decrising for fastering
		this.enemyShootRandom = 800 // 1000 is ok and decrising for fastering

		this.score = 0

		this.bonus = 10000

		this.counter = 0
	}

	setUpEnvironment(){
		new Element().getQuery("body").css("background-color:black;");
		var css = {
			"position" : "absolute",
			"top" : this.canvas.top + "px",
			"left": this.canvas.left + "px",
			"z-index": 0
		}
		var back = new Element().getElement(this.canvas.back.getElement()).css(css).this();
		var user = new Element().getElement(this.canvas.user.getElement()).css(css).this();
		var game = new Element().getElement(this.canvas.game.getElement()).css(css).this();
		user.style.zIndex = back.style.zIndex = 0;
		game.style.zIndex = 1;

		this.canvas.back.drawRect([0,0], [this.canvas.width, this.canvas.height],"#323232");
		this.createFireForplayer();
		this.test();
	}
	createFireForplayer(){
		this.smoke = new Element().createElement("img","body").css({
			"position" : "absolute",
			"top" : this.canvas.top + this.canvas.height - 10 + "px",
			"left": "0px",
			"width":"8px",
			"transform":"rotate(180deg)"
		}).attr("src","assets/images/fire2.gif-c200").this()
	}
	smokeFollowsPlayer(self){
		self.smoke.style.left = self.canvas.left + self.player.x + 16 + "px"
	}


	test(){
		var self = this;
			new Element().createElement("button","body").innerHTML("double").this().addEventListener("click", function(){
				self.bullet.double = true;
				self.bullet.triple = false;
			})
			new Element().createElement("button","body").innerHTML("triple").this().addEventListener("click", function(){
				self.bullet.double = false;
				self.bullet.triple = true;
			})
			new Element().createElement("button","body").innerHTML("one").this().addEventListener("click", function(){
				self.bullet.double = false;
				self.bullet.triple = false;
			})
			new Element().createElement("button","body").innerHTML("mute").css("font-family:dgt;").this().addEventListener("click", function(){
				if(self.sounds.mute == true){
					self.sounds.mute = false
					this.innerHTML = "mute"
				} 
				else{
					self.sounds.mute = true
					this.innerHTML = "unmute"
				}
			})
			new Element().createElement("button","body").innerHTML("pause").css("font-family:dgt;").this().addEventListener("click", function(){
				if(self.game.paused == true){
					self.game.paused = false
					this.innerHTML = "pause"
				} 
				else{
					self.game.paused = true
					this.innerHTML = "resume"
				}
			})
	}
	createEnemy(self){
		
			for(var j = 20; j < 240; j +=80){
				for(var i = self.canvas.width / 10; i < self.canvas.width; i += self.canvas.width  / 20){
					self.enemys.push({
						x : i,
						y : j,
						power : self.enemy.power,
						moving : true,
						direction : {
							left : true,
							top : true 
						}
					})
				}
			}
		 
	}

	drawObjSpecficPoint(self, A, width = 20, color="black"){
		self.canvas.game.drawRect([A[0], A[1]],[width, width], color)
	}


	drawEnemys(self){
		/*var image = new Image();
		image.src = this.image.enemy
		image.onload = function(){
*/		
			for(var i = 0; i < self.enemys.length; i ++){
				// var imageXY = self.enemyPower[self.enemys[i].power] || self.enemyPower[self.enemyPower.length - 1] 
				var a,b,c,d;
				switch(self.enemys[i].power){
					case 1: 
							a = self.pixels.enemy1[0]
							b = self.pixels.enemy1[1]
							c = self.pixels.enemy1[2]
							d = self.pixels.enemy1[3]
						break
					case 2: 
							a = self.pixels.enemy2[0]
							b = self.pixels.enemy2[1]
							c = self.pixels.enemy2[2]
							d = self.pixels.enemy2[3]
						break
					case 3: 
							a = self.pixels.enemy3[0]
							b = self.pixels.enemy3[1]
							c = self.pixels.enemy3[2]
							d = self.pixels.enemy3[3]
						break
					case 4: 
							a = self.pixels.enemy4[0]
							b = self.pixels.enemy4[1]
							c = self.pixels.enemy4[2]
							d = self.pixels.enemy4[3]
						break
					case 5: 
							a = self.pixels.enemy5[0]
							b = self.pixels.enemy5[1]
							c = self.pixels.enemy5[2]
							d = self.pixels.enemy5[3]
						break
					case 6: 
							a = self.pixels.enemy6[0]
							b = self.pixels.enemy6[1]
							c = self.pixels.enemy6[2]
							d = self.pixels.enemy6[3]
						break
					default: 
							a = self.pixels.enemy6[0]
							b = self.pixels.enemy6[1]
							c = self.pixels.enemy6[2]
							d = self.pixels.enemy6[3]
						break
				}
				self.canvas.game.clear([self.enemys[i].x,self.enemys[i].y],[self.enemy.width,self.enemy.height])
				// img,sx,sy,swidth,sheight,x,y,width,height
				// var a = self.pixels.enemy1[0]
				// var b = self.pixels.enemy1[1]
				// var c = self.pixels.enemy1[2]
				// var d = self.pixels.enemy1[3]
				self.canvas.game.cropImage(self.myImage,a,b,c,d,self.enemys[i].x,self.enemys[i].y,self.enemy.width,self.enemy.height)
				// var color = self.enemyPower[self.enemys[i].power] || "pink"
				// self.canvas.game.drawRect([self.enemys[i].x,self.enemys[i].y],[self.enemy.width,self.enemy.height],color)
				// self.canvas.game.drawImage(this,[self.enemys[i].x,self.enemys[i].y],[self.enemy.width,self.enemy.height])
			}
		// }


	}
 

	createDeadObj(self, A, enemy = true, width = 20, color = "red", timer = 500){
		self.deadObjs.push({
			x : A[0],
			y : A[1],
			w : width,
			c : color,
			t : timer,
			e : enemy
		})
	}

	drawDeadObjs(self){
		for(var i = 0; i < self.deadObjs.length; i ++){
			if(self.deadObjs[i].t == 0){
				self.canvas.game.clear([self.deadObjs[i].x, self.deadObjs[i].y],[self.deadObjs[i].w, self.deadObjs[i].w])
				self.deadObjs.splice(i, 1)
				return
			}else{
				self.deadObjs[i].t --
				if(self.deadObjs[i].e == true){
					var rnd = new Operations().getRandom(0,1)
					var a = self.pixels.enemyDown[rnd][0]
					var b = self.pixels.enemyDown[rnd][1]
					var c = self.pixels.enemyDown[rnd][2]
					var d = self.pixels.enemyDown[rnd][3]
				}else{
					var a = self.pixels.collision[0]
					var b = self.pixels.collision[1]
					var c = self.pixels.collision[2]
					var d = self.pixels.collision[3]
				}

				self.canvas.game.cropImage(self.myImage,a,b,c,d,self.deadObjs[i].x, self.deadObjs[i].y,self.deadObjs[i].w, self.deadObjs[i].w)
				// self.canvas.game.drawRect([self.deadObjs[i].x, self.deadObjs[i].y],[self.deadObjs[i].w, self.deadObjs[i].w],self.deadObjs[i].c)
			}
		}
	}

	createPlayer(self){
		// var image = new Image();
		// image.src = this.image.player
		// image.onload = function(){
			self.canvas.game.clear([self.player.x-2,self.player.y],[self.player.width+4,self.player.height])
			// self.canvas.game.drawImage(this,[self.player.x,self.player.y],[self.player.width,self.player.height])
			var a,b,c,d;
			if(self.player.life < 50){
				a = self.pixels.playerLow[0]
				b = self.pixels.playerLow[1]
				c = self.pixels.playerLow[2]
				d = self.pixels.playerLow[3]
			}else{
				a = self.pixels.player[0]
				b = self.pixels.player[1]
				c = self.pixels.player[2]
				d = self.pixels.player[3]
			}
			self.canvas.game.cropImage(self.myImage,a,b,c,d,self.player.x,self.player.y,self.player.width,self.player.height)
			// self.canvas.game.drawRect([self.player.x,self.player.y],[self.player.width,self.player.height])
		// }
		if(self.player.direction.left == true){
			self.player.x >= 0?self.player.x -- : self.player.x;
		}
		if(self.player.direction.right == true){
			self.player.x <= self.canvas.width - self.player.width?self.player.x ++ : self.player.x;
		}
		self.smokeFollowsPlayer(self)
	}

	shotSound(self){
		if(self.sounds.mute == true) return
		self.sounds.shot.currentTime = 0;
		self.sounds.shot.play();
	}

	createBullet(self){
		if(self.game.end == true || self.game.paused == true) return
		if(self.bullets.length < self.bullet.maxPerShot){
			if(self.bullet.double == true){
				if(self.player.bullet >= 2){
					self.shotSound(self);
					for(var i = self.player.width / 3; i < self.player.width; i += self.player.width / 3){
						self.bullets.push({
							x : self.player.x + i - (self.bullet.width / 2),
							y : self.player.y
						});
					}
					self.player.bullet -= 2
				} 
			}else if(self.bullet.triple == true){
				if(self.player.bullet >= 3){
					self.shotSound(self);
					var middle = 0
					for(var i = self.player.width / 4; i < self.player.width; i += self.player.width / 4){
						self.bullets.push({
							x : self.player.x + i - (self.bullet.width / 2),
							y : self.player.y - (middle == 1 ? 10 : 0)
						});
						middle ++;
					}
					self.player.bullet -= 3
				}
			}else{
				if(self.player.bullet >= 1){
					self.shotSound(self);
					self.bullets.push({
						x : self.player.x + (self.player.width / 2) - (self.bullet.width / 2),
						y : self.player.y
					});
					self.player.bullet -= 1
				}
			}
		}
	}

	animateBullet(self){
		for(var i = 0; i < self.bullets.length; i ++){
			if(self.bullets[i].y < 0){
				self.canvas.game.clear([self.bullets[i].x, self.bullets[i].y], [self.bullet.width, self.bullet.height])
				self.bullets.splice(i, 1);
			}else{
				var a,b,c,d;
				a = self.pixels.bulletPlayer[0]
				b = self.pixels.bulletPlayer[1]
				c = self.pixels.bulletPlayer[2]
				d = self.pixels.bulletPlayer[3]
				// image.onload = function(){
					self.canvas.game.clear([self.bullets[i].x, self.bullets[i].y], [self.bullet.width, self.bullet.height])
					self.bullets[i].y -= self.bullet.speed;
					// self.canvas.game.drawImage(image, [self.bullets[i].x, self.bullets[i].y], [self.bullet.width, self.bullet.height])
					self.canvas.game.cropImage(self.myImage, a,b,c,d,self.bullets[i].x, self.bullets[i].y, self.bullet.width, self.bullet.height)
				// }
			}
		}
	}

	 
	addListenerToCanvas(){
		var self = this;
		document.addEventListener("keydown", function(event){
			switch(event.keyCode){
				case 39:
					self.player.direction.right = true;
					break;
				case 37: 
					self.player.direction.left = true;
					break;
				case 32: //38 up 
					// self.player.shooting = true;
					self.createBullet(self)
					break;
			}
		});
		document.addEventListener("keyup", function(event){
			switch(event.keyCode){
				case 39:
					self.player.direction.right = false;
					break;
				case 37: 
					self.player.direction.left = false;
					break;
			}
		});
	}

	backgroundSound(self){
		if(self.sounds.mute == true){
			self.sounds.flyBack.pause()
			self.sounds.flyBack1.pause()
			return;
		}
		self.sounds.flyBack.play()
		self.sounds.flyBack1.play()
		self.sounds.flyBack.volume = 0.1
		self.sounds.flyBack1.volume = 0.2
		if(self.sounds.flyBack.currentTime > 2.2){
			self.sounds.flyBack.currentTime = 0.2
		}
		if(self.sounds.flyBack1.currentTime > 3){
			self.sounds.flyBack1.currentTime = 0
		}
	}

	detectCollision(self){
		for(var i = 0; i < self.enemys.length; i ++){
			for(var j = 0; j < self.bullets.length; j ++){
				var x1, x2, y1, y2;
				 x1 = self.enemys[i].x - self.bullet.width
				 x2 = self.enemys[i].x + self.enemy.width
				 y1 = self.enemys[i].y
				 y2 = self.enemys[i].y + self.enemy.height
				 if(x1 <= self.bullets[j].x && x2 >= self.bullets[j].x){
					 if(y1 <= self.bullets[j].y && y2 >= self.bullets[j].y){
						self.canvas.game.clear([self.bullets[j].x, self.bullets[j].y], [self.bullet.width, self.bullet.height])
					 	self.bullets.splice(j, 1)

					 	if(self.enemys[i].power == 1){
							self.canvas.game.clear([self.enemys[i].x, self.enemys[i].y], [self.enemy.width, self.enemy.height])

							self.createDeadObj(self, [self.enemys[i].x, self.enemys[i].y])

							// self.drawObjSpecficPoint(self, [self.enemys[i].x, self.enemys[i].y], self.enemy.width, "red")
						 	self.enemys.splice(i, 1)
						 }else{
						 	self.enemys[i].power --
						 }
						self.score += 20 * self.enemy.power

					 }
				 }
			}
		}
	}



	detectCollisionBetweenPlayerAndEnemyBullet(self){
		for(var i = 0; i < self.enemyBullets.length; i ++){
			var x1,x2,y1,y2;
			x1 = self.player.x - self.bullet.width
			x2 = self.player.x + self.player.width
			y1 = self.player.y - self.bullet.height
			y2 = self.player.y + self.player.height
			if(self.enemyBullets[i].x >= x1 && self.enemyBullets[i].x <= x2){
				if(self.enemyBullets[i].y >= y1 && self.enemyBullets[i].y <= y2){
					self.player.life -= new Operations().getRandom(self.enemy.damage / 2, self.enemy.damage)
					self.canvas.game.clear([self.enemyBullets[i].x, self.enemyBullets[i].y], [self.bullet.width, self.bullet.height])

					self.createDeadObj(self, [self.enemyBullets[i].x, self.enemyBullets[i].y])

					// self.drawObjSpecficPoint(self, [self.enemyBullets[i].x, self.enemyBullets[i].y],self.bullet.width, "yellow")
					
					self.enemyBullets.splice(i, 1)

				}
			}
		}
	}


	enemyBulletsAndPlayerBuletsCollision(self){
		for(var i = 0; i < self.enemyBullets.length; i ++){
			for(var j = 0; j < self.bullets.length; j ++){
				var x1,x2,y1,y2;
				x1 = self.enemyBullets[i].x - self.bullet.width
				x2 = self.enemyBullets[i].x + self.bullet.width
				y1 = self.enemyBullets[i].y - self.bullet.height
				y2 = self.enemyBullets[i].y + self.bullet.height
				if(self.bullets[j].x >= x1 && self.bullets[j].x <= x2){
					if(self.bullets[j].y >= y1 && self.bullets[j].y <= y2){
						self.canvas.game.clear([self.bullets[j].x,self.bullets[j].y],[self.bullet.width,self.bullet.height])
						self.canvas.game.clear([self.enemyBullets[i].x,self.enemyBullets[i].y],[self.bullet.width,self.bullet.height])

						self.createDeadObj(self, [self.enemyBullets[i].x,self.enemyBullets[i].y],false, 10)

						// self.drawObjSpecficPoint(self, [self.enemyBullets[i].x,self.enemyBullets[i].y], self.bullet.width, "green")
						self.bullets.splice(j, 1)
						self.enemyBullets.splice(i, 1)

						self.score += 10

					}
				}
			}	
		}
	}

 
	createEnemyBullet(self){
		if((new Operations().getRandom(0, self.enemyShootRandom)) == (new Operations().getRandom(0, self.enemyShootRandom))){

			if(self.enemys.length <= 0) return;
			var enemyIndex = new Operations().getRandom(0, self.enemys.length - 1);
				self.enemyBullets.push({
					x : self.enemys[enemyIndex].x,
					y : self.enemys[enemyIndex].y + self.enemy.height
				})
		}
		self.drawEnemyBullets(self)
	}

	drawEnemyBullets(self){
		for (var i = 0; i < self.enemyBullets.length; i ++) {
			self.canvas.game.clear([self.enemyBullets[i].x, self.enemyBullets[i].y], [self.bullet.width, self.bullet.height])
			self.enemyBullets[i].y += self.bullet.speed;
			// self.canvas.game.drawRect([self.enemyBullets[i].x, self.enemyBullets[i].y], [self.bullet.width, self.bullet.height],"red")
				var a = self.pixels.bulletEnemy[0]
				var b = self.pixels.bulletEnemy[1]
				var c = self.pixels.bulletEnemy[2]
				var d = self.pixels.bulletEnemy[3]
			self.canvas.game.cropImage(self.myImage,a,b,c,d,self.enemyBullets[i].x, self.enemyBullets[i].y, self.bullet.width, self.bullet.height)
			if(self.enemyBullets[i].y >= self.canvas.height){
				self.canvas.game.clear([self.enemyBullets[i].x, self.enemyBullets[i].y], [self.bullet.width, self.bullet.height])
				self.enemyBullets.splice(i, 1)
			}
		}
	}

	drawBulletsCount(self){
		self.canvas.user.clear([0,0], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,30], "Bullets : " + self.player.bullet, 28, "red");
	}
	drawHelthCount(self){
		self.canvas.user.clear([0,30], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,60], "health : " + self.player.life + "%", 28, "green");
	}
	enemyLevel(self){
		self.canvas.user.clear([0,60], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,90], "Enemy Level : " + self.enemy.power , 25, "purple");
	}
	enemyCount(self){
		self.canvas.user.clear([0,90], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,120], "Enemys : " + self.enemys.length , 25, "red");
	}

	bulletLevel(self){
		self.canvas.user.clear([0,120], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,150], "Bullet Level : " + self.bullet.speed , 23, "blue");
	}

	bonusCOunterDown(self){
		if(self.bonus == 0) return
		self.bonus --
		self.canvas.user.clear([0,150], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,180], "Bonus : + " + self.bonus , 23, "navy");
	}

	levelCount(self){
		self.canvas.user.clear([0,180], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,210], "Level : " + self.game.level, 23, "green");
	}

	scoreCount(self){
		self.canvas.user.clear([0,210], [self.canvas.user.getElement().getAttribute("width"), 30]);
		self.canvas.user.drawText([10,240], "SCORE : " + self.score, 23, "black");
	}

	createLeftPanel(){
		new Element().getElement(this.canvas.user.getElement()).css({
			"position":"absolute",
			"top": this.canvas.top + "px",
			"right": "20px",
			"border":"solid 1px green",
			"background-color":"silver"
		}).attr("width",200).attr("height",this.canvas.height)
	}
	chekHelth(self){
		if(self.player.life <= 0){
			self.game.end = true
			return;
		}
	}

	enemyMoving(self){
		self.counter ++
		if(self.counter < self.enemyInterval) return
		self.counter = 0
		for(var i =  0; i < self.enemys.length; i ++){
			if(self.enemys[i].moving == true){
				if(self.enemys[i].direction.left == true){
					self.canvas.game.clear([self.enemys[i].x,self.enemys[i].y],[self.enemy.width,self.enemy.height])
					self.enemys[i].x -= 10	
					if(self.enemys[i].x <= 10){
						self.enemys[i].direction.left = false
						self.enemys[i].y += 40
					}
				}else{
					self.canvas.game.clear([self.enemys[i].x,self.enemys[i].y],[self.enemy.width,self.enemy.height])
					self.enemys[i].x += 10	
					if(self.enemys[i].x >= self.canvas.width - 30){
						self.enemys[i].direction.left = true
						self.enemys[i].y += 40
					}
				}

			}
		}	
	}
	enemyCollidesPlayer(self){
		for(var i = 0; i < self.enemys.length; i ++){
				var x1,x2,y1,y2;
				x1 = self.enemys[i].x - self.enemy.width
				x2 = self.enemys[i].x + self.enemy.width
				y1 = self.enemys[i].y - self.enemy.height
				y2 = self.enemys[i].y + self.enemy.height
				if(self.player.x >= x1 && self.player.x <= x2){
					if(self.player.y >= y1 && self.player.y <= y2){
						self.game.end = true
					}
				}
		}	
	}

	init(){
		this.setUpEnvironment()
		this.createLeftPanel()
		// this.createPlayer(this)
		this.addListenerToCanvas()
		this.createEnemy(this)
		var self  = this;
		this.myImage.onload = function(){
			console.log("image loaded")
			self.gameLoop();
		}
	}
	gameLoop(){

		/*initialise all components*/
		var self = this;
		/*realtime loop */
		setInterval(function(){
			// self.enemyMoving(self)
		},100)





		/*main loop for game*/
		setInterval(function(){
			if (self.game.end == true) return;
			if (self.game.paused == true) return;
			self.enemyMoving(self)

			self.drawDeadObjs(self)

			self.chekHelth(self)
			self.enemyCollidesPlayer(self)
			self.drawBulletsCount(self)
			self.drawHelthCount(self)
			self.enemyLevel(self)
			self.enemyCount(self)
			self.bulletLevel(self)
			self.bonusCOunterDown(self)
			self.scoreCount(self)
			self.levelCount(self)
			/*bulets colision*/
			self.enemyBulletsAndPlayerBuletsCollision(self)
			/*es player da emeny*/
			self.detectCollisionBetweenPlayerAndEnemyBullet(self)
			/*create random shoot from enemy*/
			self.createEnemyBullet(self)
			/*collision detection*/
			self.detectCollision(self)
			/*repete sound*/
			self.backgroundSound(self)
			/*player moving*/
			self.createPlayer(self)
			/*create bullet if needed :)*/
			self.animateBullet(self)
			self.drawEnemys(self)

			if(self.enemys.length == 0){
				self.score += self.bonus
				self.game.level ++
				(self.bullet.speed < 5)? self.bullet.speed++ : self.bullet.speed 
				self.enemy.power ++
				self.player.bullet += 200
				self.bonus = self.game.level * 10000;
				self.enemyInterval = (self.enemyInterval > 10)?self.enemyInterval - 10 : 10
				self.enemyShootRandom = (self.enemyShootRandom > 100)?self.enemyShootRandom - 100 : 100
				self.createEnemy(self)
			}

		},5);
	}

	 
}

new Game("#gameBack","#gameFront","#gamePopup").init()



/*mokled ar modzraobs player gamossawoebelia */
