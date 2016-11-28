


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
	drawCircle(A, R){ //A[x,y] R=len
		this.ctx.arc(A[0], A[1], R, 0, 2*Math.PI);
		this.ctx.stroke();
		return this;
	}
	drawText(A, text, fontSize = 12){
		this.ctx.font = fontSize + "px serif";
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

		this.mouse = {
			globalx : 0,
			globaly : 0,
			canvasX : 0,
			canvasY : 0,
			canvasClickedX: 0,
			canvasClickedY: 0,
			globalClickedX: 0,
			globalClickedY: 0
		}

		this.game = {
			level : 1
		}
		this.bullet = {
			width : 10,
			height : 10,
			x : 0,
			y : 0
		}
		this.player = {
			width : 20,
			height : 20,
			x : 100,
			y : 10,
			bullet : 30,
			life  : 5,
			specialBullet : 10
		}

		this.image = {
			player : "assets/images/player1.png",
			bullet : "assets/images/bullet.png"
		}
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

		this.allListenerToMousePosition();

		return this;
	}
	createPlayer(self){
		var image = new Image();
		image.src = this.image.player
		image.onload = function(){
			self.canvas.game.clear([self.player.x,self.player.y],[self.player.width,self.player.height])
			self.canvas.game.drawImage(this,[self.player.x,self.player.y],[self.player.width,self.player.height])
		}
	}
	 
	gameLoop(){
		var self = this;
		setInterval(function(){
			//self.playerMove();
		},1);
	}

	allListenerToMousePosition(){
		var self = this;
		this.canvas.game.getElement().addEventListener("click", function(event){
			self.mouse.globalClickedX = event.clientX;
			self.mouse.globalClickedY = event.clientY;
			self.mouse.canvasClickedX = event.clientX - self.canvas.left;
			self.mouse.canvasClickedY = event.clientY - self.canvas.top;
		});

		this.canvas.game.getElement().addEventListener("mousemove", function(event){
			self.mouse.globalX = event.clientX;
			self.mouse.globalY = event.clientY;
			self.mouse.canvasX = event.clientX - self.canvas.left;
			self.mouse.canvasY = event.clientY - self.canvas.top;
			self.createPlayer(self);
		});
	}


	test(){
		return [this.canvas.height,this.canvas.width,this.canvas.left,this.canvas.top]
	}
}

new Game("#gameBack","#gameFront","#gamePopup").setUpEnvironment()



/*mokled ar modzraobs player gamossawoebelia */
