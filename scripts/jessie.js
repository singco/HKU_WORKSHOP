var width = document.body.clientWidth/2,
	height = 600;

var color = d3.scale.category20();
	
var indata = ["Out","In","All"];
	
legend = d3.select("#legend").append("svg").attr("width","100%").attr("height",500).selectAll(".legend")
			.data(indata)
			.enter()
			.append("g")
			.attr("class","legend")

			
	legend.append("circle")
	    .attr("class","index")
		.attr("cx",25)
		.attr("cy",function(d,i){return i*35+60})
		.attr("r",10)
		
		.on("mouseover",function(d){
			d3.select(this).style("cursor","pointer")
		})
		.on("click",function(d){
			var name = d;
			d3.selectAll(".index").transition().attr("r",function(d){if(d==name){return 10;}else{return 5;}})
			d3.selectAll(".nodes")
			    .transition()
			    .attr("r",function(d){if(d.road==name){ return rscale(d.gdp*1.5);}else if(name=="All"){return rscale(d.gdp*1.5);}else{return 0;} })
			s = d3.selectAll(".nodes").filter(function(d){if(d.road==name){return true;}else if(name=="All"){return true;}else{return false;}});
			d3.select("#statics").text("total:"+s[0].length)

			})
		.style("fill",function(d){if (d == "Out" ){return "#3366CC";}
			else if (d=="In")  {return "#DC3912";}
           else {return "#FF9900";}
			});

		
	legend.append("text")
		.attr("x",40)
		.attr("y",function(d,i){return i*35+65})
		.text(function(d){return d;});
			
	legend.append("text")
		.attr("x",0)
		.attr("y",25)
		.text("In or Out of OBOR")
		.attr("font-size","20px")

	

svg = d3.select(".col-md-7").append("svg")
	.attr("width",width)
	.attr("height",height)
	.attr("id","graph");
//statics	
svg.append("text").attr("x",2).attr("y",20).attr("id","statics").style("opacity",0.2).style("font-weight","bold")
	
var drag_vertical = d3.behavior.drag()
    .origin(Object)
    .on("drag", move_vertical);
	
function move_vertical() {
			d3.select("#horizontal_line")
			.attr("y1", function(){if(d3.mouse(this)[1]<0){ return 0;}else if(d3.mouse(this)[1]>height){ return height;}else{return d3.mouse(this)[1];}})
			.attr("y2", function(){if(d3.mouse(this)[1]<0){ return 0;}else if(d3.mouse(this)[1]>height){ return height;}else{return d3.mouse(this)[1];}});
			d3.selectAll(".horizontal_ball")
			.attr("cy", function(){if(d3.mouse(this)[1]<0){ return 0;}else if(d3.mouse(this)[1]>height){ return height;}else{return d3.mouse(this)[1];}});
			d3.select("#horizontal_text")
			.text(function(){if(d3.mouse(this)[1]<0){ return "失业率 46%";}else if(d3.mouse(this)[1]>height){ return "失业率 0%";}else{return "失业率 "+d3.round(vyscale(d3.mouse(this)[1]),1)+"%";}})
			.attr("y", function(){if(d3.mouse(this)[1]<15){ return 15;}else if(d3.mouse(this)[1]>height){ return height-8;}else{return d3.mouse(this)[1]-8;}});
			d3.select("#remind")
			.attr("y",function(){if(d3.mouse(this)[1]<15){ return 15;}else if(d3.mouse(this)[1]>height){ return height-8;}else{return d3.mouse(this)[1]-4;}});
			d3.selectAll(".nodes")
				.style("fill-opacity",function(d){if(yscale(d.Joblessrate)>d3.mouse(this)[1]){return 0.2;}else{return 0.5;}});
				
			
			

}

	
d3.json("./data/creditdata.json",function(error,root){
	

	
	var Debt_max = 0, 
	t=0,j=0,
		Debt_min = 0,
		Joblessrate_max = 0,
		Joblessrate_min = 0,
		gdp_max=0,
		gdp_min=0;
		
	for(i=0;i<root.length;i++){
		
		t = t+root[i].Debt;
		j= j+root[i].Joblessrate;

		if(root[i].Debt>Debt_max){
			Debt_max = root[i].Debt;
			}
		if(root[i].Debt<Debt_min){
			Debt_min = root[i].Debt;
			}
		if(root[i].Joblessrate>Joblessrate_max){
			Joblessrate_max = root[i].Joblessrate;
			}
		if(root[i].Joblessrate<Joblessrate_min){
			Joblessrate_min = root[i].Joblessrate;
			}
		if(root[i].gdp>gdp_max){
			gdp_max = root[i].gdp;
			}
		if(root[i].gdp<gdp_min){
			gdp_min = root[i].gdp;
			}

	}
	
	avgDebt = t/root.length;
	avgJob = j/root.length;
	
	xscale = d3.scale.linear()
		.domain([Debt_min,Debt_max])
		.range([20,width-20]);
	yscale = d3.scale.linear()
		.domain([Joblessrate_min,Joblessrate_max])
		.range([height-30,30]);
	rscale = d3.scale.linear()
		.domain([gdp_min,gdp_max])
		.range([5,25]);
	color = d3.scale.category20();
	
	vyscale = d3.scale.linear()
		.domain([height-20,20])
		.range([Joblessrate_min*100,Joblessrate_max*100]);
	
	g = svg.selectAll(".g")
		.data(root)
		.enter()
		.append("g")
		.attr("class","circle")
		//.attr("transform",function(d){return "translate("+xscale(d.Debt)+","+yscale(d.Joblessrate)+")";});
		
	g.append("circle")
		.attr("class","nodes")
		.attr("cx",function(d){return xscale(d.Debt);})
		.attr("cy",function(d){return yscale(d.Joblessrate);})
		.attr("r",function(d){return rscale(d.gdp*1.5);})
		.style("fill",function(d){if (d.road == "Out" ){return "#3366CC";}
			else if (d.road =="In")  {return "#DC3912";}
           else {return "#FF9900";}
			})
		.style("fill-opacity",0.7)
		.on("mouseover",function(){d3.select(this).style("fill-opacity",0.7).style("cursor","pointer");})
		.on("mouseout",function(){d3.select(this).style("fill-opacity",0.5);})
		.on("click",function(d){ 

			d3.select("#name").remove();
			d3.select("#Joblessrate").remove();
			d3.select("#Debt").remove();
			d3.select("#status").remove();
			d3.select("#SP").remove();



			d3.select("#pname").append("span").text(d.name).attr("id","name");
			d3.select("#pid").append("span").text(d.ID).attr("id","ID");
			d3.select("#pJoblessrate").append("span").text((d.Joblessrate*100).toFixed(2)+" %").attr("id","Joblessrate");
			d3.select("#pDebt").append("span").text((d.Debt*100).toFixed(2)+" %").attr("id","Debt");
			d3.select("#pSP").append("span").text(d.SP).attr("id","SP");
			d3.select("#pstatus").append("span").text(d.status).attr("id","status");

		})	
		
		g.append("title")
			.text(function(d){return d.name;})

	
	horizontal = svg.append("g")
		.call(drag_vertical);
	
	horizontal.append("circle")
		.attr("class","horizontal_ball")
		.attr("cx",width)
		.attr("cy",yscale(0))
		.attr("r",5)
		.style("fill","gray")
		
	horizontal.append("circle")
		.attr("class","horizontal_ball")
		.attr("cx",0)
		.attr("cy",yscale(0))
		.attr("r",5)
		.style("fill","gray")

		
	horizontal.append("line")
		.attr("id","horizontal_line")
		.attr("x1",0)
		.attr("y1",yscale(avgJob))
		.attr("x2",width)
		.attr("y2",yscale(avgJob))
		.style("stroke","gray")
		.style("stroke-weight",2);
		
	horizontal.append("text")
		.attr("id","remind")
		.attr("x",width-180)
		.attr("y",yscale(avgJob)-5)
		.text(function(){ return "Average Jobless Rate:"+(avgJob*100).toFixed(2)+"%";})
		.style("fill","red")
		.style("font-size","16px");
		
		
	
	vertical = svg.append("g")
		.attr("class","vertical")
		
	vertical.append("line")
		.attr("x1",xscale(avgDebt))
		.attr("y1",0)
		.attr("x2",xscale(avgDebt))
		.attr("y2",height)
		.style("stroke","gray")
		.style("stroke-weight",2)
		
	vertical.append("text")
		.attr("x",xscale(avgDebt)-15)
		.attr("y",15)
		.text(function(){ return "Average Debt Rate:"+(avgDebt*100).toFixed(2)+"%";})
		.style("fill","red")
		.style("font-size","16px");
		
		

		
})
