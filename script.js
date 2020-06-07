let versionNumber = 1.5;

let liststatus = [
	{
		name:"Banned",
		image:"./images/banned.png",
	},	
	{
		name:"Limited",
		image:"./images/limited.png",
	},	
	{
		name:"Semi-Limited",
		image:"./images/semilimited.png",
	},	
	{
		name:"Unlimited",
		image:"./images/unlimited.png",
	},
];

let cards = [];
let filteredCards = [];

let flList = liststatus.map(function(e){return[]});
let urlHash = window.location.hash.substr(1);
if(urlHash){
	flList = JSON.parse(atob(urlHash));
}

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
			cards = JSON.parse(result).map(function(c){
				c.tcgl = c.tcgl==undefined?3:c.tcgl;
				c.ocgl = c.ocgl==undefined?3:c.ocgl;
				return c;
			}).sort(function(a,b){
				return a.n > b.n ?1:-1;
			});
			
			enableCardSearch();
			
			redrawAllLists();
			
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
	
	function enableCardSearch(){
		document.getElementById("btnNext").disabled = false;
		document.getElementById("btnPrev").disabled = false;
		document.getElementById("cardSearchBtn").disabled = false;
		
		document.getElementById("cardSearchBtn").onclick = updateCardList;
		document.getElementById("btnPrev").onclick = function(){changePage(-1)};
		document.getElementById("btnNext").onclick = function(){changePage(1)};
		
		document.getElementById("exportLinkBtn").onclick = exportURLHash;
		document.getElementById("exportImgBtn").onclick = exportImage;
		
	}
	
	function updateCardList(){
		filteredCards = getFilteredCardList();
		page = 0;
		updatePage();
	}
	
	function updatePage(){
		let maxPage = Math.ceil(filteredCards.length/pageSize);
		if(page<0){
			page = 0;
		}
		if(page>=maxPage){
			page = maxPage-1;
		}
		document.getElementById("pageNum").innerText = "Page "+(page+1)+" of "+maxPage;
		let container  = document.getElementById("cardListScroll");
		container.innerHTML = templateEngine(listItemsTemplate,{});
	}
	
	function redrawAllLists(){
		for(let i in liststatus){
			redrawList(Number(i));//?
		}
	}
	
	function redrawList(listIndex){
		let container = document.querySelector(".flRow:nth-child("+(listIndex+1)+") > .flRowContentContainer");
		
		let html = templateEngine(flListItemsTemplate,{
			cardsInList:flList[listIndex],
			list:listIndex,
		});
			
		container.innerHTML = html;
	}
	
	function addToFL(id){
		for(let c in flList){
			removeFromFL(id,Number(c));//?
		}
		let list = document.querySelector("[name=list]:checked")
		let listIndex = list?Number(list.value):0;
		flList[listIndex].push(cards.find(function(e){
			return e.id == id;
		}).id);
		
		redrawList(listIndex);
	}
	
	function removeFromFL(id,listIndex){

		let index = flList[listIndex].findIndex(function(e){
			//return e.id==id;
			return e==id;
		});
		
		if(index!=-1){
			flList[listIndex].splice(index,1);
			
			redrawList(listIndex);
			return true;
		}
		return false;
	}
	
	function changePage(dir){
		page+=dir;
		updatePage();
	}
	
	function exportURLHash(){
		let hash = btoa(JSON.stringify(flList));
		prompt("Copy this Link",window.location.origin+window.location.pathname+"#"+hash);
	}
	
	function exportImage(){
		let node = document.getElementById('flListColInner');
		domtoimage.toPng(node).then(function (blob) {
			window.saveAs(blob, 'my-ban-list.png');
			//window.open(dataUrl,"_blank");
			//let img = new Image();
			//img.src = dataUrl;
			//document.body.appendChild(img);
		}).catch(function (error) {
			console.error('oops, something went wrong!', error);
		});
	}
	
	window.onload = function(){
		
		var isAndroid = navigator.userAgent.toLowerCase().indexOf("android") > -1; //&& ua.indexOf("mobile");
		if(isAndroid) {
			document.body.innerHTML = '<meta name="viewport" content="width=device-width,height='+window.innerHeight+', initial-scale=1.0">'+ document.body.innerHTML;
		}
		
		console.log("loading")
		
		let html = templateEngine(limitOptionsTemplate,{});	
		let container  = document.getElementById("limitOptions");
		container.innerHTML = html;		
		
		let flListColHtml = templateEngine(limitOptionsRowTemplate,{});	
		let flListColContainer  = document.getElementById("flListColInner");
		flListColContainer.innerHTML = flListColHtml;
		
		document.getElementById("versionNumber").innerText = "v"+versionNumber;
		
	}