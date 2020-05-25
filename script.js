let cards = [];
let filteredCards = [];

let flList = [[],[],[],[]];

let page = 0;
let pageSize = 5;

let cors_api_url = 'https://cors-anywhere.herokuapp.com/';
	
	function templateEngine(template, options) {
		let re = /<%([^%>]+)?%>/g, reExp = /(^( )?(if|for|else|switch|case|break|{|}))(.*)?/g, code = 'var r=[];\n', cursor = 0, match;
		let add = function(line, js) {
			js? (code += line.match(reExp) ? line + '\n' : 'r.push(' + line + ');\n') :
				(code += line != '' ? 'r.push("' + line.replace(/"/g, '\\"') + '");\n' : '');
			return add;
		}
		while(match = re.exec(template)) {
			add(template.slice(cursor, match.index))(match[1], true);
			cursor = match.index + match[0].length;
		}
		add(template.substr(cursor, template.length - cursor));
		code += 'return r.join("");';
		return new Function(code.replace(/[\r\t\n]/g, '')).apply(options);
	}

	function doCORSRequest(options, printResult) {
		let x = new XMLHttpRequest();
		x.open(options.method, cors_api_url + options.url);
		x.onload = function() {
			printResult(x.responseText);
		};
		x.send();
	}

	// Bind event - get updated card lit.
	(function getCardList() {
		doCORSRequest({
			method: 'GET',
			url: 'https://www.duelingbook.com/static/cards.json',
		}, function printResult(result) {
			cards = JSON.parse(result);
		});
	})();
	
	//for now just text search in name...
	function getFilteredCardList(){
		let searchName = document.getElementById("filterName").value.toUpperCase();
		let searchText = document.getElementById("filterText").value.toUpperCase();
		return cards.filter(function(c){
			return c.n.toUpperCase().indexOf(searchName)!=-1 && c.e && c.e.toUpperCase().indexOf(searchText)!=-1;
		});
	}
	
	function updateCardList(){
		filteredCards = getFilteredCardList();
		page = 0;
		updatePage();
	}
	
	function updatePage(){
		document.getElementById("pageNum").innerText = "Page "+(page+1)+" of "+Math.ceil(filteredCards.length/pageSize);
		let container  = document.getElementById("cardListScroll");
		container.innerHTML = templateEngine(listItemsTemplate,{});
	}
	
	function redrawList(listIndex){
		let container = document.querySelector(".flRow:nth-child("+(listIndex+1)+") > .flRowContentContainer");
		
		let html = templateEngine(flListItemsTemplate,{
			cardsInList:flList[listIndex],
			list:listIndex,
		});
		
		console.log(html);
		
		container.innerHTML = html;
	}
	
	function addToFL(id){
		let list = document.querySelector("[name=list]:checked")
		let listIndex = list?Number(list.value):0;
		flList[listIndex].push(cards.find(function(e){
			return e.id == id
		}));
		redrawList(listIndex);
	}
	
	function removeFromFL(id,listIndex){
		console.log(id);
		console.log(listIndex);
		
		let index = flList[listIndex].findIndex(function(e){
			return e.id==id;
		});
		
		flList[listIndex].splice(index,1);
		
		
		redrawList(listIndex);
	}
	
	function changePage(dir){
		page+=dir;
		updatePage();
	}
	
	window.onload = function(){
		console.log("loading")
		document.getElementById("cardSearchBtn").onclick = updateCardList;
		document.getElementById("btnPrev").onclick = function(){changePage(-1)};
		document.getElementById("btnNext").onclick = function(){changePage(1)};
		
		
	}