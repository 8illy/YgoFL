var cards = [];
var cors_api_url = 'https://cors-anywhere.herokuapp.com/';
	
	
	function doCORSRequest(options, printResult) {
		var x = new XMLHttpRequest();
		x.open(options.method, cors_api_url + options.url);
		x.onload = function() {
			printResult(x.responseText);
		};
		x.send();
	}

	// Bind event - get updated card lit.
	(function() {
		var urlField = document.getElementById('url');
		var dataField = document.getElementById('data');
		var outputField = document.getElementById('output');
		document.getElementById('get').onclick =
		document.getElementById('post').onclick = function(e) {
			e.preventDefault();
			doCORSRequest({
				method: 'GET',
				url: 'https://www.duelingbook.com/static/cards.json',
			}, function printResult(result) {
				cards = JSON.parse(result);
			});
		};
	})();
  
