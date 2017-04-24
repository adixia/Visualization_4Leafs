/*
4Leafed: oddClick to aggregate, evenClick to disperse
*/

var hypotenuse = 0;
var leafSizes = [0.678, 0.883, 1.32, 1.234, 1.212, 1.0263, 1.334, 1.099, 0.554, 1.1203, 0.88, 1.206, 1.122, 0.9332, 0.90, 0.79];
var sizesMod = leafSizes.length;
var N_4leafed = 30;
var radius=N_4leafed*6;

//4leafed's SVG Paths
var path1 = "M19.597,7.264 C17.98,2.748 12.307,3.261 10.947,7.264 L19.458,18.491 L27.969,7.264 C26.609,3.261 20.936,2.748 19.319,7.264";
var path2 ="M19.589,31.615 C17.972,36.131 12.299,35.618 10.939,31.615 L19.45,20.388 L27.961,31.615 C26.601,35.618 20.928,36.131 19.311,31.615";
var path3 = "M7.285,19.597 C2.769,17.98 3.282,12.307 7.285,10.947 L18.512,19.458 L7.285,27.969 C3.282,26.609 2.769,20.936 7.285,19.319" ;
var path4 = "M31.615,19.597 C36.131,17.98 35.618,12.307 31.615,10.947 L20.388,19.458 L31.615,27.969 C35.618,26.609 36.131,20.936 31.615,19.319";


function populateQuadrifogli(data) {   
    for(var i=0; i<N_4leafed; i++)  {
        var speedR = Math.floor(Math.random()*1000);
        var rotate = Math.floor(Math.random()*1000)%360;
        var scale = leafSizes[Math.floor(Math.random()*10)%sizesMod];
        var randomQF;
        if(i==(parseInt(N_4leafed/2)-1))
            randomQF={onX:getScreenCenterX(), onY:getScreenCenterY(),  color1:"#D10000", color2:"#901414", rotate:rotate, speedR:speedR, leafS:scale};
        else
            randomQF={onX:getScreenCenterX(), onY:getScreenCenterY(),  color1:"#B5F509", color2:"#29E752",rotate:rotate, speedR:speedR, leafS:scale};
        data.push(randomQF);
    }
}

var isEven=0;
var myLeafs = [];
populateQuadrifogli(myLeafs);
var svgContainer = d3.select("svg"); 
var leafG = svgContainer.selectAll("foglia").data(myLeafs).enter().append("g").attr("id", "groupOfPaths").attr("transform",function(d){
    return "translate("+d.onX+","+d.onY+") rotate("+d.rotate+") scale(+"+d.leafS+")";});

leafG.append("path").attr("d",path1)
    .attr("fill",function(d){return d.color2;});
leafG.append("path").attr("d",path2)
    .attr("fill",function(d){return d.color2;});
leafG.append("path").attr("d",path3)
    .attr("fill",function(d){return d.color1;});
leafG.append("path").attr("d",path4)
    .attr("fill",function(d){return d.color1;});



createACircle(getScreenCenterX(),getScreenCenterY());

var redLeaf=d3.selectAll("#groupOfPaths").filter(function(d){
    return d.color1=="#D10000";});
redLeaf.on('mouseover', function(event){
    var X; var Y;
    var transformV=d3.select(this).attr("transform");
    var sub=transformV.substring(0,transformV.indexOf("scale"));
    X=transformV.substring(transformV.indexOf('(')+1,transformV.indexOf(','));
    Y=transformV.substring(transformV.indexOf(',')+1,transformV.indexOf(')'));
    createACircle(X,Y);
},true);


document.body.addEventListener('click', function(event){
    var j=0;
    var X=event.clientX;
    var Y=event.clientY;
    var all4Leafed= d3.selectAll("#groupOfPaths");
    all4Leafed.transition()
        .duration(function(el){
        var xn;
        var yn;
        var transformV=d3.select(this).attr("transform");
        transformV=transformV.substring(10);
        var x=transformV.substring(0,transformV.indexOf(','));
        var y=transformV.substring(transformV.indexOf(',')+1,transformV.indexOf(')'));
        var dx=x-X;
        var dy=y-Y;
        var distance = Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2));
        if(distance<150)
            return el.speedR*Math.random()*10+distance*13;
        else
            return el.speedR*Math.random()*10+distance*5;})

        .attr("transform",function(d){
        var randomR=(Math.random()*1000);
        j++;

        if(isEven%2===0){
            var randomX=X+(Math.random()*100);
            var randomY=Y+(Math.random()*100);
            d.onX=randomX; d.onY=randomY;
            return "translate("+randomX+","+randomY+") rotate("+randomR+") scale("+leafSizes[Math.floor(Math.random()*10)%sizesMod]+")";

        }
        else{
            var xn;
            var yn;
            var transformV=d3.select(this).attr("transform");
            transformV=transformV.substring(10);
            var x=transformV.substring(0,transformV.indexOf(','));
            var y=transformV.substring(transformV.indexOf(',')+1,transformV.indexOf(')'));

            var dx=x-X;
            var dy=y-Y;
            hypotenuse = Math.sqrt( Math.pow(dx, 2) + Math.pow(dy, 2));

            if(hypotenuse<150){
                //console.log("near click");
                xn=X+(dx*8);
                yn=Y+(dy*8);
            }else{
                //console.log("far click");
                xn=X+(dx*1.5);
                yn=Y+(dy*1.5);
            }
            d.onX=xn; d.onY=yn;
            var scale=leafSizes[Math.floor(Math.random()*10)%sizesMod];
            return "translate("+xn+","+yn+") rotate("+randomR+") scale("+scale+")";
        }});
    isEven++;

}, true);


function createACircle(X,Y){
    var i=0;
    d3.selectAll("#groupOfPaths").transition().duration(3000).attr("transform",function(d){
        i++;
        var angle = (i / (N_4leafed/2)) * Math.PI; 
        var x1n =parseFloat(X)+parseFloat(radius*Math.cos(angle));
        var y1n = parseFloat(Y)+parseFloat(radius*Math.sin(angle));
        d.onX=x1n; d.onY=y1n;
        return "translate("+x1n+","+y1n+")";

    });
}


function getScreenCenterY() {
    return(document.body.clientHeight/2)-25;
}

function getScreenCenterX() {
    return(document.body.clientWidth/2)-25;
}