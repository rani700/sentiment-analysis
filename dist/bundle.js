(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
window.onload = ()=>{

	document.querySelector('.query').onkeyup = (e) => {
		if (e.keyCode === 13) {
			document.querySelector('.send_button').click()
		}
	}

	var positive = "green"
	var wpositive = "lightgreen"
	var spositive = "darkgreen"
	var negative = "pink"
	var wnegative = "orange"
	var snegative = "red"
	var neutral = "lightgrey"


	document.querySelector(".send_button").onclick = ()=>{
		document.querySelector('.search').style = "display: none;"
		document.querySelector('.loader').style = "display: flex;"
		var query = document.querySelector(".query").value
		console.log(query)
		
		var xhttp = new XMLHttpRequest()
		xhttp.open('GET',  "https://twitterapi.vishalpandey.co.in/"+query);
		xhttp.onreadystatechange = ()=>{
			if (xhttp.readyState == 4 && xhttp.status == 200) {
				console.log(JSON.parse(xhttp.responseText));
				content = JSON.parse(xhttp.responseText);
				console.log(content)
				var data = content.data
				var analysis = content.summary
				var chartData = [analysis.positive,analysis.wpositive,analysis.spositive,analysis.negative,analysis.wnegative,analysis.snegative,analysis.neutral]
				var chartColor = [positive,wpositive,spositive,negative,wnegative,snegative,neutral]
				var color = "white"
				var ana = "neuteral"
				for (var x of data){
					if (x.a == 0){
						color = neutral;
						ana = "Neuteral"
					}
					else if (x.a > 0 && x.a <= 0.3){
						color = wpositive
						ana = "Weekly Positive"
					}
					else if (x.a > 0.3 && x.a <= 0.6){
						color = positive
						ana = "Positive"
					}
					else if (x.a > 0.6 && x.a <= 1){
						color = spositive
						ana = "Strongly Positive"
					}
					else if (x.a > -0.3 && x.a <= 0){
						color = wnegative
						ana = "Weekly Negative"
					}
					else if (x.a > -0.6 && x.a <= -0.3){
						color = negative
						ana = "Negative"
					}
					else if (x.a > -1 && x.a <= -0.6){
						color = snegative
						ana = "Strongly Negative"
					}
					let row = '<tr><td>'+x.t+'</td>'+'<td>'+x.a+'</td>'+
					'<td style="background-color:'+color+';">'+ana+'</td></tr>';
					document.querySelector('table').insertAdjacentHTML('beforeend', row);
				}
				document.querySelector('.results').style = "display: flex;"
				
				document.querySelector('.loader').style = "display: none;"
				document.querySelector('.report-title').insertAdjacentHTML('beforeend', query)
				var ctx = document.getElementById('myChart').getContext('2d');
				var data = {
				    datasets: [{
				        data: chartData,
				        backgroundColor: chartColor,
				    }],

				    // These labels appear in the legend and in the tooltips when hovering different arcs
				    labels: [
				        "Positive","Weeklu Positive","Strongly Positive","Negative","Weekly Negative","Strongly Negative","Neutral"
				    ],
				};
				var myPieChart = new Chart(ctx, {
				    type: 'pie',
				    data: data,
				    options: {
				        scales: {
				            yAxes: [{
				                ticks: {
				                    beginAtZero: true
				                }
				            }]
				        }
				    }
				});

			}
		}
		xhttp.send()
	}
}
},{}]},{},[1]);
