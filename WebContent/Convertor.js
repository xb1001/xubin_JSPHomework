/**
 * 坐标系转换函数
 * WGS->GCJ
 * WGS->BD09
 * GCJ->BD09
 */
function Convertor(ak) {
    this.stepCount = 100;
    this.pointCount = [];
    this.Result = [];
    this.NoisIndex = [];
    this.Time = new Date();
    this.AK = ak;
    this.M_PI = 3.14159265358979324;
    this.A = 6378245.0;
    this.EE = 0.00669342162296594323;
    this.X_PI = this.M_PI * 3000.0 / 180.0;
}
Convertor.prototype.outofChine = function (p) {
    if (p.lng < 72.004 || p.lng > 137.8347) {
        return true;
    }
    if (p.lat < 0.8293 || p.lat > 55.8271) {
        return true;
    }
    return false;
}
;
Convertor.prototype.WGS2GCJ_lat = function (x, y) {
    var ret1 = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret1 += (20.0 * Math.sin(6.0 * x * this.M_PI) + 20.0 * Math.sin(2.0 * x * this.M_PI)) * 2.0 / 3.0;
    ret1 += (20.0 * Math.sin(y * this.M_PI) + 40.0 * Math.sin(y / 3.0 * this.M_PI)) * 2.0 / 3.0;
    ret1 += (160.0 * Math.sin(y / 12.0 * this.M_PI) + 320 * Math.sin(y * this.M_PI / 30.0)) * 2.0 / 3.0;
    return ret1;
}
;
Convertor.prototype.WGS2GCJ_lng = function (x, y) {
    var ret2 = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret2 += (20.0 * Math.sin(6.0 * x * this.M_PI) + 20.0 * Math.sin(2.0 * x * this.M_PI)) * 2.0 / 3.0;
    ret2 += (20.0 * Math.sin(x * this.M_PI) + 40.0 * Math.sin(x / 3.0 * this.M_PI)) * 2.0 / 3.0;
    ret2 += (150.0 * Math.sin(x / 12.0 * this.M_PI) + 300.0 * Math.sin(x / 30.0 * this.M_PI)) * 2.0 / 3.0;
    return ret2;
}
;
Convertor.prototype.WGS2GCJ = function (poi) {
    if (this.outofChine(poi)) {
        return;
    }
    var poi2 = {};
    var dLat = this.WGS2GCJ_lat(poi.lng - 105.0, poi.lat - 35.0);
    var dLon = this.WGS2GCJ_lng(poi.lng - 105.0, poi.lat - 35.0);
    var radLat = poi.lat / 180.0 * this.M_PI;
    var magic = Math.sin(radLat);
    magic = 1 - this.EE * magic * magic;
    var sqrtMagic = Math.sqrt(magic);
    dLat = (dLat * 180.0) / ((this.A * (1 - this.EE)) / (magic * sqrtMagic) * this.M_PI);
    dLon = (dLon * 180.0) / (this.A / sqrtMagic * Math.cos(radLat) * this.M_PI);
    poi2.lat = poi.lat + dLat;
    poi2.lng = poi.lng + dLon;
    return poi2;
}
;
Convertor.prototype.GCJ2BD09 = function (poi) {
    var poi2 = {};
    var x = poi.lng
      , y = poi.lat;
    var z = Math.sqrt(x * x + y * y) + 0.00002 * Math.sin(y * this.X_PI);
    var theta = Math.atan2(y, x) + 0.000003 * Math.cos(x * this.X_PI);
    poi2.lng = z * Math.cos(theta) + 0.0065;
    poi2.lat = z * Math.sin(theta) + 0.006;
    return poi2;
}
;



/**
 * 百度转火星
 */
Convertor.prototype.BD092GCJ = function (poi) {
	var poi2 = {};
    var x = poi.lng-0.0065
      , y = poi.lat-0.006;
    var z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.X_PI);
    var theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.X_PI);
    poi2.lng = z * Math.cos(theta);
    poi2.lat = z * Math.sin(theta) ;
    return poi2;
}
;
/**
 * 火星->WGS
 */
Convertor.prototype.GCJ2WGS = function (poi) {
	var poi2 = {};
    var x = poi.lng
      , y = poi.lat;
	 if (this.outofChine(poi)) {
	        return;
	}else{
		var dlng = this.WGS2GCJ_lng(x-105.0,y-35.0);
		var dlat = this.WGS2GCJ_lat(x-105.0,y-35.0);
		var radlat = y/180.0*this.M_PI;
		var magic = Math.sin(radlat);
		magic = 1 - this.EE*magic*magic;
		var sqrtmagic = Math.sqrt(magic);
		dlat = (dlat*180.0)/((this.A*(1-this.EE))/(magic*sqrtmagic)*this.M_PI);
		dlng = (dlng*180.0)/(this.A*sqrtmagic*Math.cos(radlat)*this.M_PI);
		var mglng = x + dlng;
		var mglat = y + dlat;
		poi2.lng = x*2-mglng;
		poi2.lat = y*2-mglat;
		return poi2;
	}
}
;


/**
* WGS->百度坐标系
*/
Convertor.prototype.WGS2BD09 = function (poi) {
    //WGS->GCJ
    var poi2 = this.WGS2GCJ(poi);
    if (typeof poi2 === "undefined") {
        return;
    }
    //GCJ->百度坐标系
    return this.GCJ2BD09(poi2);
}
Convertor.prototype.WGS2BD09ARR = function (poi) {
    //WGS->GCJ
    //WGS->GCJ
	var poi2 = [];
	for(var i=0; i<poi.length; i++) {
	    poi2.push(this.WGS2BD09({lng: poi[i].O_LONGITUDE, lat: poi[i].O_LATITUDE}));
	}
    //GCJ->百度坐标系
    return poi2;
}




/**
 * 百度->WGS
 */
Convertor.prototype.BD092WGS = function (poi) {
    //WGS->GCJ
    var poi2 = this.BD092GCJ(poi);
    if (typeof poi2 === "undefined") {
        return;
    }
    //GCJ->百度坐标系
    return this.GCJ2WGS(poi2);
}
;
Convertor.prototype.BD092WGSARR = function (poi) {
    //WGS->GCJ
    //WGS->GCJ
	var poi2 = [];
	for(var i=0; i<poi.length; i++) {
	    poi2.push(this.BD092WGS({lng: poi[i].O_LONGITUDE, lat: poi[i].O_LATITUDE}));
	}
    //GCJ->百度坐标系
    return poi2;
}
;

var convertor = new Convertor();



//TEST
//var c = new Convertor();
//var r1 = c.WGS2BD09({ lng: 123, lat: 38 });
//console.log(r1);