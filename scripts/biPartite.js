!function(){
	var bP={};	
	var b=30, bb=180, height=600, buffMargin=1, minHeight=14;
	var c1=[-170, 40], c2=[-50, 120], c3=[-10, 160]; //Column positions of labels. 每个数组的第一个数字是调整前面三列的位置，第二个数字是调整后面的位置
	var colors =["#3366CC", "#A55D35" ,"#FF9900","#DC3912", "#990099", "#0099C6","#109618"];
	
	bP.partData = function(data,p){
		var sData={};
		
		sData.keys=[
			d3.set(data.map(function(d){ return d[0];})).values().sort(function(a,b){ return ( a<b? -1 : a>b ? 1 : 0);}),
			d3.set(data.map(function(d){ return d[1];})).values().sort(function(a,b){ return ( a<b? -1 : a>b ? 1 : 0);})		
		];
		
		sData.data = [	sData.keys[0].map( function(d){ return sData.keys[1].map( function(v){ return 0; }); }),
						sData.keys[1].map( function(d){ return sData.keys[0].map( function(v){ return 0; }); }) 
		];
		
		data.forEach(function(d){ 
			sData.data[0][sData.keys[0].indexOf(d[0])][sData.keys[1].indexOf(d[1])]=d[p];
			sData.data[1][sData.keys[1].indexOf(d[1])][sData.keys[0].indexOf(d[0])]=d[p]; 
		});
		
		return sData;
	}
	
	function visualize(data){
		var vis ={};
		function calculatePosition(a, s, e, b, m){
			var total=d3.sum(a);
			var sum=0, neededHeight=0, leftoverHeight= e-s-2*b*a.length;
			var ret =[];
			
			a.forEach(
				function(d){ 
					var v={};
					v.percent = (total == 0 ? 0 : d/total); 
					v.value=d;
					v.height=Math.max(v.percent*(e-s-2*b*a.length), m);
					(v.height==m ? leftoverHeight-=m : neededHeight+=v.height );
					ret.push(v);
				}
			);
			
			var scaleFact=leftoverHeight/Math.max(neededHeight,1), sum=0;
			
			ret.forEach(
				function(d){ 
					d.percent = scaleFact*d.percent; 
					d.height=(d.height==m? m : d.height*scaleFact);
					d.middle=sum+b+d.height/2;
					d.y=s + d.middle - d.percent*(e-s-2*b*a.length)/2;
					d.h= d.percent*(e-s-2*b*a.length);
					d.percent = (total == 0 ? 0 : d.value/total);
					sum+=2*b+d.height;
				}
			);
			return ret;
		}

		vis.mainBars = [ 
			calculatePosition( data.data[0].map(function(d){ return d3.sum(d);}), 0, height, buffMargin, minHeight),
			calculatePosition( data.data[1].map(function(d){ return d3.sum(d);}), 0, height, buffMargin, minHeight)
		];
		
		vis.subBars = [[],[]];
		vis.mainBars.forEach(function(pos,p){
			pos.forEach(function(bar, i){	
				calculatePosition(data.data[p][i], bar.y, bar.y+bar.h, 0, 0).forEach(function(sBar,j){ 
					sBar.key1=(p==0 ? i : j); 
					sBar.key2=(p==0 ? j : i); 
					vis.subBars[p].push(sBar); 
				});
			});
		});
		vis.subBars.forEach(function(sBar){
			sBar.sort(function(a,b){ 
				return (a.key1 < b.key1 ? -1 : a.key1 > b.key1 ? 
						1 : a.key2 < b.key2 ? -1 : a.key2 > b.key2 ? 1: 0 )});
		});
		
		vis.edges = vis.subBars[0].map(function(p,i){
			return {
				key1: p.key1,
				key2: p.key2,
				y1:p.y,
				y2:vis.subBars[1][i].y,
				h1:p.h,
				h2:vis.subBars[1][i].h
			};
		});
		vis.keys=data.keys;
		return vis;
	}
	
	function arcTween(a) {
		var i = d3.interpolate(this._current, a);
		this._current = i(0);
		return function(t) {
			return edgePolygon(i(t));
		};
	}
	
	function drawPart(data, id, p){
		d3.select("#"+id).append("g").attr("class","part"+p)
			.attr("transform","translate("+( p*(bb+b))+",0)");
		d3.select("#"+id).select(".part"+p).append("g").attr("class","subbars");
		d3.select("#"+id).select(".part"+p).append("g").attr("class","mainbars");
		
		var mainbar = d3.select("#"+id).select(".part"+p).select(".mainbars")
			.selectAll(".mainbar").data(data.mainBars[p])
			.enter().append("g").attr("class","mainbar");

		mainbar.append("rect").attr("class","mainrect")
			.attr("x", 0).attr("y",function(d){ return d.middle-d.height/2; })
			.attr("width",b).attr("height",function(d){ return d.height; })
			.style("shape-rendering","auto")
			.style("fill-opacity",0).style("stroke-width","0.5")
			.style("stroke","black").style("stroke-opacity",0);
			
		mainbar.append("text").attr("class","barlabel")
			.attr("x", c1[p]).attr("y",function(d){ return d.middle+5;})
			.text(function(d,i){ return data.keys[p][i];})
			.attr("text-anchor","start" );
			
		mainbar.append("text").attr("class","barvalue")
			.attr("x", c2[p]).attr("y",function(d){ return d.middle+5;})
			.text(function(d,i){ return d.value ;})
			.attr("text-anchor","end");
			
		mainbar.append("text").attr("class","barpercent")
			.attr("x", c3[p]).attr("y",function(d){ return d.middle+5;})
			.text(function(d,i){ return "( "+Math.round(100*d.percent)+"%)" ;})
			.attr("text-anchor","end").style("fill","grey");
			
		d3.select("#"+id).select(".part"+p).select(".subbars")
			.selectAll(".subbar").data(data.subBars[p]).enter()
			.append("rect").attr("class","subbar")
			.attr("x", 0).attr("y",function(d){ return d.y})
			.attr("width",b).attr("height",function(d){ return d.h})
			.style("fill",function(d){ return colors[d.key1];});
	}
	
	function drawEdges(data, id){
		d3.select("#"+id).append("g").attr("class","edges").attr("transform","translate("+ b+",0)");

		d3.select("#"+id).select(".edges").selectAll(".edge")
			.data(data.edges).enter().append("polygon").attr("class","edge")
			.attr("points", edgePolygon).style("fill",function(d){ return colors[d.key1];})
			.style("opacity",0.5).each(function(d) { this._current = d; });	
	}	
	
	function drawHeader(header, id){
		d3.select("#"+id).append("g").attr("class","header").append("text").text(header[2])
			.style("font-size","20").attr("x",108).attr("y",-20).style("text-anchor","middle")
			.style("font-weight","bold");
		
		[0,1].forEach(function(d){
			var h = d3.select("#"+id).select(".part"+d).append("g").attr("class","header");
			
			h.append("text").text(header[d]).attr("x", (c1[d]-5))
				.attr("y", -5).style("fill","grey");
			
			h.append("text").text("Count").attr("x", (c2[d]-10))
				.attr("y", -5).style("fill","grey");
			
			h.append("line").attr("x1",c1[d]-10).attr("y1", -2)
				.attr("x2",c3[d]+10).attr("y2", -2).style("stroke","black")
				.style("stroke-width","1").style("shape-rendering","crispEdges");
		});
	}
	
	function edgePolygon(d){
		return [0, d.y1, bb, d.y2, bb, d.y2+d.h2, 0, d.y1+d.h1].join(" ");
	}	
	
	function transitionPart(data, id, p){
		var mainbar = d3.select("#"+id).select(".part"+p).select(".mainbars")
			.selectAll(".mainbar").data(data.mainBars[p]);
		
		mainbar.select(".mainrect").transition().duration(500)
			.attr("y",function(d){ return d.middle-d.height/2;})
			.attr("height",function(d){ return d.height;});
			
		mainbar.select(".barlabel").transition().duration(500)
			.attr("y",function(d){ return d.middle+5;});
			
		mainbar.select(".barvalue").transition().duration(500)
			.attr("y",function(d){ return d.middle+5;}).text(function(d,i){ return d.value ;});
			
		mainbar.select(".barpercent").transition().duration(500)
			.attr("y",function(d){ return d.middle+5;})
			.text(function(d,i){ return "( "+Math.round(100*d.percent)+"%)" ;});
			
		d3.select("#"+id).select(".part"+p).select(".subbars")
			.selectAll(".subbar").data(data.subBars[p])
			.transition().duration(500)
			.attr("y",function(d){ return d.y}).attr("height",function(d){ return d.h});
	}
	
	function transitionEdges(data, id){
		d3.select("#"+id).append("g").attr("class","edges")
			.attr("transform","translate("+ b+",0)");

		d3.select("#"+id).select(".edges").selectAll(".edge").data(data.edges)
			.transition().duration(500)
			.attrTween("points", arcTween)
			.style("opacity",function(d){ return (d.h1 ==0 || d.h2 == 0 ? 0 : 0.5);});	
	}
	
	function transition(data, id){
		transitionPart(data, id, 0);
		transitionPart(data, id, 1);
		transitionEdges(data, id);
	}
	
	bP.draw = function(data, svg){
		data.forEach(function(biP,s){
			svg.append("g")
				.attr("id", biP.id)
				.attr("transform","translate("+ (600*s)+",0)");
				
			var visData = visualize(biP.data);
			drawPart(visData, biP.id, 0);
			drawPart(visData, biP.id, 1); 
			drawEdges(visData, biP.id);
			drawHeader(biP.header, biP.id);
			
			[0,1].forEach(function(p){			
				d3.select("#"+biP.id)
					.select(".part"+p)
					.select(".mainbars")
					.selectAll(".mainbar")
					.on("mouseover",function(d, i){ return bP.selectSegment(data, p, i); })
					.on("mouseout",function(d, i){ return bP.deSelectSegment(data, p, i); });	
			});
		});	
	}
	
	bP.selectSegment = function(data, m, s){
		data.forEach(function(k){
			var newdata =  {keys:[], data:[]};	
				
			newdata.keys = k.data.keys.map( function(d){ return d;});
			
			newdata.data[m] = k.data.data[m].map( function(d){ return d;});
			
			newdata.data[1-m] = k.data.data[1-m]
				.map( function(v){ return v.map(function(d, i){ return (s==i ? d : 0);}); });
			
			transition(visualize(newdata), k.id);
				
			var selectedBar = d3.select("#"+k.id).select(".part"+m).select(".mainbars")
				.selectAll(".mainbar").filter(function(d,i){ return (i==s);});
			
			selectedBar.select(".mainrect").style("stroke-opacity",1);			
			selectedBar.select(".barlabel").style('font-weight','bold');
			selectedBar.select(".barvalue").style('font-weight','bold');
			selectedBar.select(".barpercent").style('font-weight','bold');
		});
	}	
	
	bP.deSelectSegment = function(data, m, s){
		data.forEach(function(k){
			transition(visualize(k.data), k.id);
			
			var selectedBar = d3.select("#"+k.id).select(".part"+m).select(".mainbars")
				.selectAll(".mainbar").filter(function(d,i){ return (i==s);});
			
			selectedBar.select(".mainrect").style("stroke-opacity",0);			
			selectedBar.select(".barlabel").style('font-weight','normal');
			selectedBar.select(".barvalue").style('font-weight','normal');
			selectedBar.select(".barpercent").style('font-weight','normal');
		});		
	}
	
	this.bP = bP;
}();
var sales_data=[
['Agriculture','BGD',1010,0],
['Agriculture','ISR',1440,960],
['Agriculture','KEN',170,0],
['Agriculture','LAO',1500,0],
['Agriculture','NLD',0,1210],
['Agriculture','PAK',270,0],
['Agriculture','PHL',110,0],
['Agriculture','QAT',160,0],
['Agriculture','RUS',0,2040],
['Agriculture','SAU',990,500],
['Agriculture','SGP',200,0],
['Agriculture','THA',100,0],
['Agriculture','VNM',690,0],
['Chemicals','KAZ',1700,0],
['Chemicals','SAU',700,560],
['Chemicals','SGP',110,0],
['Energy','AFG',400,0],
['Energy','BGD',560,0],
['Energy','KHM',4880,1670],
['Energy','CZE',100,0],
['Energy','EGY',5560,0],
['Energy','IND',8720,0],
['Energy','IDN',10200,1970],
['Energy','IRN',11630,0],
['Energy','IRQ',12780,1250],
['Energy','ITA',200,3320],
['Energy','KAZ',19680,1200],
['Energy','KEN',1990,0],
['Energy','KWT',350,0],
['Energy','KGZ',210,1400],
['Energy','LAO',7500,0],
['Energy','MYS',3540,0],
['Energy','MNG',1260,0],
['Energy','MMR',1520,0],
['Energy','NPL',1700,0],
['Energy','PAK',4230,9630],
['Energy','PHL',2760,1000],
['Energy','POL',1300,190],
['Energy','QAT',100,0],
['Energy','RUS',9790,0],
['Energy','SAU',6820,0],
['Energy','SRB',220,720],
['Energy','SGP',5220,0],
['Energy','TJK',640,0],
['Energy','THA',100,0],
['Energy','TKM',3130,600],
['Energy','UZB',620,0],
['Energy','VNM',9210,0],
['Energy','YEM',470,0],
['Metals','AFG',2870,0],
['Metals','KHM',500,0],
['Metals','EGY',940,0],
['Metals','IND',1700,0],
['Metals','IDN',7370,600],
['Metals','IRN',2650,350],
['Metals','KAZ',420,490],
['Metals','MYS',3340,0],
['Metals','MNG',150,0],
['Metals','MMR',2990,0],
['Metals','PHL',1020,0],
['Metals','RUS',2550,0],
['Metals','SAU',5190,0],
['Metals','UKR',160,0],
['Metals','UZB',190,0],
['Metals','VNM',1350,0],
['Real estate','EGY',1380,0],
['Real estate','GRC',130,0],
['Real estate','IDN',1630,0],
['Real estate','IRN',0,160],
['Real estate','IRQ',110,240],
['Real estate','ITA',490,0],
['Real estate','KEN',0,290],
['Real estate','KWT',1370,0],
['Real estate','LAO',1520,0],
['Real estate','MYS',3080,1550],
['Real estate','MMR',0,200],
['Real estate','PAK',230,0],
['Real estate','QAT',1390,0],
['Real estate','RUS',1650,1040],
['Real estate','SAU',2360,0],
['Real estate','SGP',1690,160],
['Real estate','TJK',300,0],
['Real estate','THA',1500,0],
['Real estate','UKR',2220,0],
['Real estate','YEM',220,0],
['Technology','BGD',350,0],
['Technology','IND',750,0],
['Technology','ISR',240,0],
['Technology','ITA',2400,0],
['Technology','NLD',270,0],
['Technology','PAK',960,520],
['Technology','RUS',300,0],
['Technology','THA',0,880],
['Technology','VNM',110,0],
['Transport','BGD',350,1550],
['Transport','KHM',370,0],
['Transport','EGY',470,0],
['Transport','GRC',5010,200],
['Transport','IND',380,0],
['Transport','IDN',5470,2600],
['Transport','IRN',2090,0],
['Transport','ISR',140,1020],
['Transport','ITA',460,0],
['Transport','KEN',4520,0],
['Transport','KWT',410,0],
['Transport','MYS',1390,1300],
['Transport','MMR',1070,0],
['Transport','NPL',150,250],
['Transport','NLD',140,0],
['Transport','PAK',1600,350],
['Transport','POL',100,0],
['Transport','QAT',1580,0],
['Transport','RUS',660,2330],
['Transport','SAU',1280,590],
['Transport','SRB',1440,0],
['Transport','SGP',2150,290],
['Transport','THA',440,0],
['Transport','VNM',1540,140],
['Transport','YEM',0,510],
];

var width = document.body.clientWidth-20, height = 640, margin ={b:0, t:40, l:(width-1170)/2+180, r:50};

var svg = d3.select("#singco")
	.append("svg").attr('width',width).attr('height',(height))
	.append("g").attr("transform","translate("+ margin.l+","+margin.t+")");

var data = [ 
	{data:bP.partData(sales_data,2), id:'Before', header:["Sector","Country", "Before Sep. 2013"]},
	{data:bP.partData(sales_data,3), id:'After', header:["Sector","Country", "After Sep. 2013"]}
];

bP.draw(data, svg);