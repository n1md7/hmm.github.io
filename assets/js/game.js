


/**************************************************elements class start************************************************************************/
function Element(){
	this.getElement = function(element){
		this.element = element;
		return this;
	}
	this.getIt = function(element){
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
		this.canvas = {
			back : new Canvas(backgroundGame),
			game : new Canvas(bodyGame),
			user : new Canvas(userPopup),
			width: new Element().getId(bodyGame).width,
			height: new Element().getId(bodyGame).height
		}

		this.game = {
			bullet : 30,
			life  : 5,
			specialBullet : 10
		}
	}
	test(){
		return this.canvas.width
	}
}





alert(new Game("#gameBack","#gameFront","#gamePopup").test())