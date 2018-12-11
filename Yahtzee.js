window.onload = yahtzeeGame;

function yahtzeeGame () {

	var upperSecAccumulator = 0;
	var yahtzeeScore = 50;
	var totalElm = getElm("totalScore");
	var match;
	var tempMatch;
	var rolls = 0;
	var held = [false, false, false, false, false];
	var dice = [getElm("0"), getElm("1"), getElm("2"), getElm("3"), getElm("4")];

	// get the score function for category
	function getElm (id) {

		return document.getElementById(id);
	};

	//set the basic score value : "-" means 0
	function parseInnerHTML () { //Use: Element.parseInnerHTML(); defaults "-" to 0.

		if(this.innerHTML === "-") return 0;
		else return Number(this.innerHTML);
	};

	// function total (value) {

	// 	totalElm.innerHTML = Number(totalElm.innerHTML) + value;
	// };

	//Dice roll and hold start

	function updateHeld (id) {

		for(var i = 0; i<5; i++) {

			held[i] = getElm("hold" + i).checked;
		}
	};

	// make random number when click the Roll button
	function roll () {

		if(rolls < 3) {

			for(var i = 0; i<5; i++) {

				if(held[i] === false || rolls === 0) {

					dice[i].innerHTML = Math.floor(Math.random() * 6) + 1;
				}
			}
			rolls++;
		}
	};

	// reset the ramdom number like '0' when 
	function rollReset () {

		rolls = 0;

		for(var i = 0; i<5; i++) {

			dice[i].innerHTML = 0;
		}
	};

	// function disable (name) {

	// 	var elm = getElm(name);
	// 	elm.classList.add("strike");
	// 	elm.classList.remove("cell");
	// 	elm.onclick = undefined;
	// };
	for(var i = 0; i<5; i++) {

		getElm("hold" + i).onclick = updateHeld;
	}

	//display the chance value

	function cellScore (name, value) {

		getElm(name + "Score").innerHTML = value;
		rollReset();
		// disable(name);
		// total(value);
	};


	//get the total chance number 
	function sumDice() {

		var accumulator = 0;

		for(var i = 0; i<5; i++) {

			accumulator = accumulator + Number(dice[i].innerHTML);
		}

		return accumulator;
	};

	getElm("roll").onclick = roll;

	//End dice
	//Upper section start
	
	function upperSecScore (value) { //Sums up dice containing value.

		var accumulator = 0;

		for(var i = 0; i<5; i++) {

			if(Number(dice[i].innerHTML) === value) {

				accumulator = accumulator + value;
			}
		}

		return accumulator;
	};

	function upperSec (name, value) {

		function func1 () {

			if(rolls > 0) {

				var upperScore = upperSecScore(value)
				upperSecAccumulator = upperSecAccumulator + upperScore;
				cellScore(name, upperScore);
				checkUpperBonus();
			}
		};
		return func1;
	};

	// getElm("ones").onclick = upperSec("ones", 1);
	// getElm("twos").onclick = upperSec("twos", 2);
	// getElm("threes").onclick = upperSec("threes", 3);
	// getElm("fours").onclick = upperSec("fours", 4);
	// getElm("fives").onclick = upperSec("fives", 5);
	// getElm("sixes").onclick = upperSec("sixes", 6);

	//Upper section end
	//kind lower section start

	function kindScore (value, kindVal) { //Used in 3 or 4 in a kind, full house, and yahtzee. Checks for kindVal numbers (or higher) equal to value.

		var numbersOfAKind = 0;

		for(var i = 0; i<5; i++) {

			if(Number(dice[i].innerHTML) === value) {

				numbersOfAKind = numbersOfAKind + 1;
			}
		}

		if(numbersOfAKind >= kindVal) {

			return sumDice();

		} else {

			return undefined;
		}
	};

	function kind (kindVal) {

		function func2 () {

			var score = 0;

			for(var i = 1; i<7; i++) {

				score = kindScore(i, kindVal)

				if(score) {

					if(kindVal === 3) {

						cellScore("threeOfAKind", score);

					} else {

						cellScore("fourOfAKind", score);
					}
				}
			}
		};

		return func2;
	};

	// getElm("threeOfAKind").onclick = kind(3);
	// getElm("fourOfAKind").onclick = kind(4);

	//kind lower section end	
	//Full house lower section start

	function fullHouse () {

		var threeOfAKindFound = 0;
		var twoOfAKindFound = 0;

		for(var i = 1; i<7; i++) {

			if(kindScore(i, 3)) {

				threeOfAKindFound = i;
			}
		}

		for(var i = 1; i<7; i++) {

			if(threeOfAKindFound !== i && kindScore(i, 2)) {

				twoOfAKindFound = i;
			}
		}

		if(threeOfAKindFound && twoOfAKindFound) {

			cellScore("fullHouse", 25);
		}
	};

	// getElm("fullHouse").onclick = fullHouse;

	//Full house lower section end
	//Small and Large straight lower section start

	function searchDice (val) { //Returns true if a dice equal to value is found.

		var foundDice = false;

		for(var i = 0; i<5; i++) {

			if(Number(dice[i].innerHTML) === val) {

				foundDice = true;
			}
		}

		return foundDice;
	};

	function checkStraightCombo(search) {

		if(search[4] === undefined) { //Checking small straight combo

			if(searchDice(search[0]) && searchDice(search[1]) && searchDice(search[2]) && searchDice(search[3])) return true;

		} else { //Checking large straight combo

			if(searchDice(search[0]) && searchDice(search[1]) && searchDice(search[2]) && searchDice(search[3]) && searchDice(search[4])) return true;
		}
	};

	function straight (smallOrLarge) { //smallOrLarge is a boolean. True means small straight, false means large straight. Searches combinations of straights based on smallOrLarge boolean parameter.

		function func3 () {

			if(smallOrLarge) { //Small straight

				if(checkStraightCombo([1, 2, 3, 4, undefined]) || checkStraightCombo([2, 3, 4, 5, undefined]) || checkStraightCombo([3, 4, 5, 6, undefined])) cellScore("smallStraight", 30);

			} else { //Large straight

				if(checkStraightCombo([1, 2, 3, 4, 5]) || checkStraightCombo([2, 3, 4, 5, 6])) cellScore("largeStraight", 40);
			}
		};

		return func3;
	};

	// getElm("smallStraight").onclick = straight(true);
	// getElm("largeStraight").onclick = straight(false);

	//Small and Large straight lower section end
	//Chance lower section start

	function chance () {

		// if(rolls > 0) cellScore("chance", sumDice());
		cellScore("chance", sumDice());
	};

	getElm("chance").onclick = chance;

	//Chance lower section end
	//Yahtzee lower section start

	function yahtzee () {

		if(rolls > 0) {

			for(var i = 1, tempMatch = undefined, match = undefined; i<7; i++) {

				tempMatch = kindScore(i, 5);
				if(tempMatch !== undefined) match = true;
			}

			if(match) {

				cellScore("yahtzee", yahtzeeScore);
				yahtzeeScore = 100;
				yahtzeeExtend();
			}
		}
	};

	// getElm("yahtzee").onclick = yahtzee;

	//Yahtzee lower section end
	//Upper section bonus start

	function checkUpperBonus () {

		if(upperSecAccumulator > 62) cellScore("upperSecBonus", 35);
	};

	//Upper section bonus end
	//Yahtzee bonus start

	function yahtzeeExtend () {

		//Remove current Yahtzee cell functionality

		getElm("yahtzee").removeAttribute("id");
		getElm("yahtzeeScore").removeAttribute("id");

		//Create new Yahtzee cell elements

		var newYahtzeeRow = document.createElement("tr");
		var newYahtzeeData1 = document.createElement("td");
		var newYahtzeeData2 = document.createElement("td");

		//Attribute new Yahtzee cell elements

		newYahtzeeData1.innerHTML = "Yahtzee";
		newYahtzeeData2.innerHTML = "-";
		newYahtzeeData1.setAttribute("id", "yahtzee");
		newYahtzeeData1.setAttribute("class", "cell");
		newYahtzeeData1.onclick = yahtzee;
		newYahtzeeData2.setAttribute("id", "yahtzeeScore");

		//Add new Yahtzee cell elements to Yahtzee table

		newYahtzeeRow.appendChild(newYahtzeeData1);
		newYahtzeeRow.appendChild(newYahtzeeData2);
		getElm("yahtzeeTable").appendChild(newYahtzeeRow);
	};

	//Yahtzee bonus end
};