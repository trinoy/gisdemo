var eString = "";

try
{
	var conn = $.db.getConnection();
	var pstmt = conn.prepareStatement("select ST_CODE, ST_NAME, color, PC_NAME, PC_TYPE, PC_NO, PARTY, shape.ST_AsGeoJson() as ST_SHAPE from DEMO_SPA.INDIA_PC");
	var rs = pstmt.executeQuery();


	var response = {type: "FeatureCollection"};
	response.features = [];

	while ( rs.next() ) {
		response.features.push( {type: "Feature",  ST_CODE:rs.getString(1),ST_NAME:rs.getString(2), color:rs.getString(3), PC_NAME:rs.getString(4),PC_TYPE:rs.getString(5), PC_NO:rs.getInteger(6),PARTY:rs.getString(7), geometry: JSON.parse( rs.getString(8)) } );
	}

	response.properties = {};

	rs.close();
	pstmt.close();
	conn.close();
	
	$.response.contentType = "application/json";
	$.response.headers.set("Access-Control-Allow-Origin","*");
	$.response.setBody(JSON.stringify(response));	
	response.status = $.net.http.OK;


}
catch(e)
{
	eString = "\nException.toString(): " + e.toString() + "\n";
    var prop = "";
    
    for (prop in e) {
        eString += prop + ": " + e[prop] + "\n";

    response.status = $.net.http.INTERNAL_SERVER_ERROR;
    response.contentType = "plain/text";
    response.setBody(eString);
 
}
}

   