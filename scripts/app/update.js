function update(y,m) {

    updateMonths(y,m);

    buildChords(y,m);
	
    eText = eGroup.selectAll("g.group")
        .data(e_labels, function (d) {
            return d.label;
        });

    iText = iGroup.selectAll("g.group")
        .data(i_labels, function (d) {
            return d.label;
        });

    eChords=eGroup.selectAll("g.chord")
        .data(e_chords, function (d) {
            return d.label;
        });

    iChords=iGroup.selectAll("g.chord")
        .data(i_chords.sort(), function (d) {
            return d.label;
        });

    var td=(monthlyExports[y*12+m]/monthlyImports[y*12+m])*100; "total data,show in the middle"
    var fs=(12 + (String(td).length-10)*4);
    td=td.toFixed(1);
	//console.log(baseYear+y+"-"+monthsMap[m]);
	//console.log(outerRadius);
    dGroup.transition()
        .select("text.mainLabel")
        .delay(delay)
        .text(td+"%")
        .attr("transform", "translate(" + (outerRadius - (td.length * fs/2)/2) + ","  + (outerRadius + 80) +")")
        .style("font-size", fs + "px");
		
	dGroup.transition()
        .select("text.secondLabel")
		.delay(delay)
		.text(baseYear+y+"-"+monthsMap[m])
		.attr("transform", "translate(" + (outerRadius - (td.length * fs/3)/2) + ","  + (outerRadius + 40) +")")
        .style("font-size", Number(fs)/3 + "px");

    eText.enter()
        .append("g")
        .attr("class", "group")
        .append("text")
        .attr("class","export")
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (innerRadius + 6) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) { return  (d.index+1)  + ". " + d.label; })
        .on("mouseover", function (d) { node_onMouseOver(d); })
        .on("mouseout", function (d) {node_onMouseOut(d); });

    eText.transition()
        .duration(delay-10)
        .select("text")
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (innerRadius + 6) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) { return  (d.index+1)  + ". " + d.label; });

    eText.exit().remove();

    eChords.enter()
        .append("g")
        .attr("class","chord")
        .append("path")
        .attr("class","chord")
		.style("stroke", 0)
		.style("fill","#DC3912")
		.style("fill-opacity",0.7)
        //.style("stroke", function(d) { return d3.rgb(getExportColor(d.source.index)).darker(); })
        //.style("fill", function(d) { return getExportColor(d.source.index); })
        //.style("fill-opacity", function (d,i) { return .85*(topCountryCount- d.index)/topCountryCount})
        .attr("d", d3.svg.arc_chord().radius(innerRadius))
        //.style("opacity",0)
        .on("mouseover", function (d) { node_onMouseOver(d); })
        .on("mouseout", function (d) {node_onMouseOut(d); });


    eChords.transition()
        .select("path")
        .duration(delay)
        .attr("d", d3.svg.arc_chord().radius(innerRadius))
		.style("fill","#DC3912")
		.style("fill-opacity",0.5);
       // .style("stroke", function(d) { return d3.rgb(getExportColor(d.source.index)).darker(); })
       // .style("fill", function(d) { return getExportColor(d.source.index); })
       // .style("stroke-opacity", function (d,i) { return Math.max(.85*(topCountryCount-d.index)/topCountryCount,.2);})
        //.style("fill-opacity", function (d,i) { return .85*(topCountryCount-d.index)/topCountryCount})
       // .style("opacity",1);


    eChords.exit()
        .remove();

    iText.enter()
        .append("g")
        .attr("class", "group")
        .append("text")
        .attr("class","import")
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (innerRadius + 6) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) { return  (20-d.index)  + ". " + d.label; })
        .on("mouseover", function (d) { node_onMouseOver(d); })
        .on("mouseout", function (d) {node_onMouseOut(d); });

    iText.transition()
        .select("text")
        .duration(delay-10)
        .attr("dy", ".35em")
        .attr("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .attr("transform", function(d) {
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
                + "translate(" + (innerRadius + 6) + ")"
                + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .text(function(d) { return  (20-d.index)  + ". " + d.label; });

    iText.exit()
        .attr("class", "exit")
        .transition()
        .duration(delay)
        .attr("y",0)
        .attr("fill-opacity",1e-6)
        .remove();

    iChords.enter()
        .append("g")
        .attr("class","chord")
        .append("path")
        .attr("class","chord")
		.style("stroke",0)
        //.style("stroke", function(d) { return d3.rgb(getImportColor(d.source.index)).darker(); })
        .style("stroke-opacity", function (d,i) { return Math.max(.85*(topCountryCount-d.index)/topCountryCount,.2);})
        .style("fill", "#06177f" )
		.style("fill-opacity",0.6)
		//.style("fill", function(d) { return getImportColor(20-d.source.index); })
        //.style("fill-opacity", function (d,i) { return .7*(topCountryCount- d.index)/topCountryCount})
        .attr("d", d3.svg.arc_chord().radius(innerRadius))
        .on("mouseover", function (d) { node_onMouseOver(d); }) //传递进去d
        .on("mouseout", function (d) {node_onMouseOut(d); });

    iChords.transition()
        .select("path")
        .duration(delay-10)
        .attr("d", d3.svg.arc_chord().radius(innerRadius))
        //.style("stroke", function(d) { return d3.rgb(getImportColor(d.source.index)).darker(); })
        //.style("fill", function(d) { return  getImportColor(20-d.source.index); })
		.style("fill", "#06177f" )
        .style("stroke-opacity", function (d,i) { return Math.max(.85*(topCountryCount-d.index)/topCountryCount,.2);})
        //.style("fill-opacity", function (d,i) { return .7*(topCountryCount- d.index)/topCountryCount});


    iChords.exit()
        .remove();

}

function updateMonths(y,m) { //制作上面的月份筛选器

    var monthAxis=mGroup.selectAll("g.month")
        .data(months);

    monthEnter= monthAxis.enter()
        .append("g")
        .attr("class","month");

    monthEnter.append("line")
        .attr("x1",function (d,i) {
            return i*monthOffset;
        })
        .attr("x2",function (d,i) { return i*monthOffset; })
        .attr("y1",function (d,i) { //控制月份竖线的高低
            var ratio=(y*12+m)-i;
			
            if (ratio < 0) ratio=ratio*-1;
            if (ratio==0)
                return 0;
            else if (ratio==1)
                return 4;
            else if (ratio==2)
                return 8;
            else if (ratio==3)
                return 11;
            else if (ratio==4)
                return 14;
            else if (ratio==5)
                return 15;
            else if (ratio==6)
                return 15;
            else
                return 16;

        })
        .attr("y2",30)
        .attr("shape-rendering","crispEdges")
        .style("stroke-opacity", function (d,i) {
            var ratio=(y*12+m)-i;
            if (ratio < 0) ratio=ratio*-1;
            if (ratio==0)
                return 1;
            else if (ratio==1)
                return .9;
            else if (ratio==2)
                return .8;
            else if (ratio==3)
                return .7;
            else if (ratio==4)
                return .6;
            else if (ratio==5)
                return .5;
            else if (ratio==6)
                return .4;
            else
                return .3;

        })
        .style("stroke","#000")
		.on("mouseover",function(d){
			year= Math.floor(d.index/12);
            month=d.index%12;
            if (running==true) stopStart();
            update(year,month);
		});



    monthEnter.append("text")//显示月 June
        .attr("transform",function (d,i) { return "translate (" + String(i*monthOffset-10) + ",-2)"; })
        .text(function(d,i) { return monthsMap[i % 12]; })
        .style("fill-opacity",function (d,i) { return (i==0) ? 1:0;});

    monthEnter.append("text")//显示年 2010
        .attr("transform",function (d,i) { return "translate (" + String(i*monthOffset-10) + ",33)"; })
        .text(function(d,i) {
            if ((i==0) || (i % 12==0)) {
                return String(baseYear + Math.floor(i/12));
            }
            else
                return "";
        })
        .on("click",function (d) {
            year= Math.floor(d.index/12);
            month=0;
            if (running==true) stopStart();
            update(year,month);
            //          console.log("y=" + y + " m=" + m);
        });

    monthUpdate=monthAxis.transition();

    monthUpdate.select("text")
        .delay(delay)
        .style("fill-opacity",function (d) {
            if (d.index==(y*12+m)) {
                return 1;
            }
            else
                return 0;
        });

    monthUpdate.select("line")
        .delay(delay)
        .attr("y1",function (d,i) {
            var ratio=(y*12+m)-i;
            if (ratio < 0) ratio=ratio*-1;
            if (ratio==0)
                return 0;
            else if (ratio==1)
                return 4;
            else if (ratio==2)
                return 8;
            else if (ratio==3)
                return 11;
            else if (ratio==4)
                return 14;
            else if (ratio==5)
                return 15;
            else if (ratio==6)
                return 15;
            else
                return 16;

        })
        .style("stroke-width",function (d,i) {
            var ratio=(y*12+m)-i;
            if (ratio < 0) ratio=ratio*-1;
            if (ratio==0)
                return 2;
            else
                return 1.5;
        })
        .style("stroke-opacity", function (d,i) {
            var ratio=(y*12+m)-i;
            if (ratio < 0) ratio=ratio*-1;
            if (ratio==0)
                return 1;
            else if (ratio==1)
                return .9;
            else if (ratio==2)
                return .8;
            else if (ratio==3)
                return .7;
            else if (ratio==4)
                return .6;
            else if (ratio==5)
                return .5;
            else if (ratio==6)
                return .4;
            else
                return .3;

        })
        .style("stroke","#000");

}


function getExportColor(i) {
    var country=e_nameByIndex[i];
    if (e_colorByName[country]==undefined) {
        e_colorByName[country]=e_fill(i);
    }

    return e_colorByName[country];
}

function getImportColor(i) {
    var country=i_nameByIndex[i];
    if (i_colorByName[country]==undefined) {
        i_colorByName[country]=i_fill(i);
    }

    return i_colorByName[country];
}
