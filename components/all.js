function Dog(nickname) {
	this.attack = targets => {
		bark();
		this.run();
		this.eat.apply(this, targets);
	}
	
	this.getName = function() {
		return nickname;
	}
	
	if (nickname.length < 4) {
		function bark() {
			console.log(nickname.toLowerCase());
		}
	} else {
		function bark() {
			console.log(this.getName().toUpperCase());
		}
	}
}

Dog.prototype.stomach = [];

Dog.prototype.run = function() {
	console.log(this.getName() + ' is running');
}

Dog.prototype.eat = function eat() {
	Array.prototype.push.apply(this.stomach, arguments);
}

var bigDog = new Dog('Lucky');
bigDog.attack(['Cat', 'Bird']);

var smallDog = new Dog('Kid');
smallDog.eat('sausage');