var transTable={};
var treeMode = false;
var graph;
var force;
var w;
var h,link,node,levels;

function drawGraph(ingraph){
  graph=ingraph;
  w = window.innerWidth-250;
  h = window.innerHeight-10;
	var r = 720,
	    x = d3.scale.linear().range([0, r]),
	    y = d3.scale.linear().range([0, r]);
	var svg = d3.select("#graph").append("svg")
	.attr("width", w)
	.attr("height", h)
	.attr("pointer-events","all");

	/*svg.append("svg:rect")
	.attr("width",w)
	.attr("height",h)
	.attr("fill","white");*/
	//.style("opacity",0);

	function redraw() {
	  svg.attr("transform","translate("+d3.event.translate+" scale("+d3.event.scale+")");
	}
	
  var width = w,
      height = h;

  var color = d3.scale.category20();

  force = d3.layout.force()
    .linkDistance(50)
    .friction(0.2)
    .gravity(0.3)
    .size([width, height]);

  repulsion = -1700*Math.sqrt(graph.nodes.length);
  force
    .charge(repulsion)
    .nodes(graph.nodes)
    .links(graph.links)
    .start();

  link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", function(d) { return Math.sqrt(d.value); })
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { transTable[d.source.id]=d.source; transTable[d.target.id]=d.target; return d.target.y; });

  node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g");
  node.append("circle")	
    .attr("r",function(d){return 30-3*d.level})
    .attr("class","node")
    .attr("x",-8)
    .attr("y",-8)
    .attr("class",function(d){return d.id})
    .attr("id",function(d){return d.name})
    .style("fill",function(d){return color(d.color);});
  node.append("text")
    //.attr("text-anchor", "middle")
    .attr("dx",22)
    .attr("dy",".35em")
    .text(function(d) {return d.name});

  svg.style("opacity",1)
    .transition()
    .duration(1000)
    .style("opacity",1);

  force.on("tick", function() {
      if(treeMode){
        root = graph.nodes[transTable[levels[0][0]].index];
        root.x = w/2;
        root.y = 100;
        var inPlace=[];
        inPlace[transTable[levels[0][0]].index]=true;
        for(var i=1;i<levels.length;i++){
          for(var j=0;j<levels[i].length;j++){
            inPlace[transTable[levels[i][j]].index]=true;
            currNode = graph.nodes[transTable[levels[i][j]].index];
            currNode.x = (j+1)*w/(levels[i].length+1);
            currNode.y = (h)*(i+1)/(levels.length);
          }
        }
        for(var i=0;i<graph.nodes.length;i++) {
          if(inPlace[i]) {
          } else {
            graph.nodes[i].x=w/2;
            graph.nodes[i].y=-100;
          }  
        }
      }
      else{
        graph.nodes[0].x = w / 2;
        graph.nodes[0].y = h / 2;
        for(var i=0;i<graph.nodes.length;i++) {
          if(graph.nodes[i].x>w) graph.nodes[i].x=w;
          if(graph.nodes[i].x<0) graph.nodes[i].x=0;
          if(graph.nodes[i].y>h) graph.nodes[i].y=h;
          if(graph.nodes[i].y<0) graph.nodes[i].y=0;
        }
      }
      link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
      node.attr("transform", function(d) {return "translate("+d.x+","+d.y+")"; });
      });

	  //updateCircleColors();
}
function treeView(nodeID){
  var svg = d3.select("#graph");
  var nodes = svg.selectAll(".node");
  /*
  var selectedNode = svg.select("#"+nodeName);
  var xoffset = selectedNode[0][0]["parentNode"]["__data__"].x,
      yoffset = selectedNode[0][0]["parentNode"]["__data__"].y;
      nodeID= selectedNode[0][0]["parentNode"]["__data__"].id;
      */
    if(svg.select(".posList")[0][0]==null){
      var newPosList = {};
      nodes.data().forEach(function(d) {
          newPosList[d.id]=[d.x,d.y]; });
    };
  levels=[];
  levels[0]=[];
  levels[0].push(nodeID);
  count=0;
  for(var i=0;levels[i].length>0;i++){
    levels[i+1]=[];
    levels[i].forEach(function(node){
      levels[i+1] = levels[i+1].concat(transTable[node].children);});
  }
  force.resume();
  treeMode=true;
  updateCircleColors();
}



