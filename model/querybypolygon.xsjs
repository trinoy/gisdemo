var conn = $.db.getConnection();

var polygon_dim = $.request.parameters.get("polydim");

var sql;

sql = "select PARTY, count(*) AS COUNT from DEMO_SPA.INDIA_PC where shape.ST_Within('POLYGON((" +
polygon_dim + "))') = 1 group by PARTY";

/*sql =   "select ST_CODE, ST_NAME, count(*) AS COUNT from DEMO_SPA.INDIA_PC where shape.ST_Within('POLYGON((" +
		"69.3343734741211 28.22697003891834,72.5973129272461 28.110748760633534,73.3333969116211 26.29341500426577,73.6410140991211 25.31423555219758,70.92739105224608 24.307053283225915,68.5323715209961 26.80446076654616,69.3343734741211 28.22697003891834))')" +
		" = 1 group by ST_CODE, ST_NAME,PARTY";*/


var pstmt = conn.prepareStatement(sql);
var rs = pstmt.executeQuery();
var data = [];
var rv = {};


while(rs.next())
{
	var res =
	{
        "PARTY"  : rs.getString(1),
        "PC_COUNT" : rs.getInteger(2)
	};

    data.push(res);
}

rv.items = data;

$.response.contentType = "application/json";
$.response.setBody(JSON.stringify(rv));

rs.close();
pstmt.close();
conn.close();
