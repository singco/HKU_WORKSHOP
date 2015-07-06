
/**
 *
 * DATA SOURCE:  http://www.census.gov/foreign-trade/statistics/country/
 *
 */

function fetchData() {
    //d3.csv("./data/ustrade_2000-2013.csv", function(csv) {
	d3.csv("./data/CHN_USA.csv", function(csv) {

        var normalized=[];

        for (var i=0; i < csv.length; i++)  {
            var row=csv[i];

            for (var y=1; y < 13; y++) {
                //if (row.CTY_CODE < "1000") continue;  //Remove Aggregated Continent Data
                var newRow={};
                newRow.Year=row.year;
                newRow.Country=row.CTYNAME;
                newRow.Month=(y < 10) ? "0" + String(y) : String(y);
                newRow.Imports=Number(row["USA_" + String(y)]);
                newRow.Exports=Number(row["CHN_" + String(y)]);
                normalized.push(newRow);

            }
        }
		//console.log("normalized:"+normalized);
        countriesGrouped = d3.nest()
            .key(function(d) { return d.Year; })
            .key(function(d) { return d.Month; })
            .entries(normalized);
		//console.log("countriesGrouped:");
		//console.log(countriesGrouped);
        //Sum total deficit for each month
        var totalImport=0;
        var totalExport=0;

        for (var y=0; y < countriesGrouped.length; y++) {
            var yearGroup=countriesGrouped[y];
            for (var m=0; m < yearGroup.values.length; m++) {
                var monthGroup=yearGroup.values[m];
                for (var c=0; c < monthGroup.values.length; c++) {
                    var country=monthGroup.values[c];
                    totalImport= Number(totalImport) + Number(country.Imports)*10000000;
                    totalExport=Number(totalExport) + Number(country.Exports)*10000000;
                }
                //    console.log("totalExport=" + String(totalExport));
                monthlyExports.push(totalExport);
                monthlyImports.push(totalImport);
            }

        }
		//console.log(monthlyExports);

        //Start running
        run();
        refreshIntervalId = setInterval(run, delay);
        // run();

    });

}
