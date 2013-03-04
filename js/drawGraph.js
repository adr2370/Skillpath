var transTable={};
var treeMode = false;
var graph;
var force;
var w;
var h,link,node,levels,svg;
var firstTick=true;

function drawGraph(ingraph){
  newGraph = graph == null;
  if(newGraph){
    graph=ingraph;
  }
  else{
    ingraph.nodes = ingraph.nodes.splice(1,ingraph.nodes.length);
    ingraph.links.push({"source":0,"target":graph.nodes.length,"value":10});
    ingraph.links.forEach(function(d){
      if(d.source!=0){
        d.source+=graph.nodes.length-1;
      }
      d.target+=graph.nodes.length-1;
    });
    graph.nodes[0].children.push(ingraph.nodes[0].id);
    graph.nodes = graph.nodes.concat(ingraph.nodes);
    graph.links = graph.links.concat(ingraph.links);
  }
  w = window.innerWidth-250;
  h = window.innerHeight-10;
	
		$("#graph").html("");
//  if(newGraph){
    svg = d3.select("#graph").append("svg")
    .attr("width", w)
    .attr("height", h)
    .attr("pointer-events","all");
//  }

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

//  if(newGraph){
    force = d3.layout.force()
      .linkDistance(50)
      .friction(0.2)
      .gravity(0.3)
      .size([width, height]);

//  }
  repulsion = -2700*Math.sqrt(graph.nodes.length);
  force
    .charge(repulsion)
    .nodes(graph.nodes)
    .links(graph.links)
    .start();
//  addNodes = ingraph.nodes;
//  addLinks = ingraph.links;
//  if(newGraph){
    addNodes=graph.nodes;
    addLinks=graph.links;
//  }
    
  link = svg.selectAll(".link")
    .data(addLinks)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", function(d) { return Math.sqrt(d.value); })
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { transTable[d.source.id]=d.source; transTable[d.target.id]=d.target; return d.target.y; });

  node = svg.selectAll(".node")
    .data(addNodes)
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
    .attr("dx",function(d){return 32-3*d.level})
    .attr("dy",".35em")
    .text(function(d) {return d.name});

  svg.style("opacity",1)
    .transition()
    .duration(1000)
    .style("opacity",1);

  force.on("tick", function(e) {
    var k = e.alpha*.5;
      if(treeMode){
        root = graph.nodes[transTable[levels[0][0]].index];
        //root = [transTable[levels[0][0]]];
        root.x += (w/2-root.x)*5*k;
        root.y += (0-root.y)*5*k;
        var inPlace=[];
        inPlace[transTable[levels[0][0]].index]=true;
        for(var i=1;i<levels.length;i++){
          for(var j=0;j<levels[i].length;j++){
            inPlace[transTable[levels[i][j]].index]=true;
            currNode = graph.nodes[transTable[levels[i][j]].index];
            currNode.x += ((j+1)*w/(levels[i].length+1)-currNode.x)*2*k;
            currNode.y += ((1.5*h)*(i)/(Math.min(5,levels.length))-100-currNode.y)*2*k;
          }
        }
        for(var i=0;i<graph.nodes.length;i++) {
          if(inPlace[i]) {
          } else {
            graph.nodes[i].x+=(w/2-graph.nodes[i].x)*5*k;
            graph.nodes[i].y+=(-800-graph.nodes[i].y)*5*k;
          }  
        }
      }
      else{
        graph.nodes[0].x += (w / 2 - graph.nodes[0].x)*5*k;
        graph.nodes[0].y += (h / 2 - graph.nodes[0].y)*5*k;
        if(firstTick) {
			for(var i=0;i<graph.nodes.length;i++) {
	          if(graph.nodes[i].x>w) graph.nodes[i].x=w;
	          if(graph.nodes[i].x<0) graph.nodes[i].x=0;
	          if(graph.nodes[i].y>h) graph.nodes[i].y=h;
	          if(graph.nodes[i].y<0) graph.nodes[i].y=0;
        	}
			firstTick=false;
		}
      }
      link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
      node.attr("transform", function(d) {return "translate("+d.x+","+d.y+")"; });
      });

	  updateCircleColors();	
		var e=$("#graph svg g");
		for(var i=0;i<e.length;i++) {
			var id=e[i].firstChild.className.baseVal;
			fb.child("node").child(id).once("value",function(data) {
				if(data.val()!=null) {
					$("#graph svg g circle."+data.name()).parent()[0].onclick=function() {
						$("#back").text("Go Back");
						$("#back").addClass("btn");
						$("#back").addClass("btn-danger");
						goToTheNodePage(data.name());
					}
				} else {
					var selectNode=svg.select("."+data.name());
					var level=selectNode[0][0]["parentNode"]["__data__"].level;
					if(level==1) {
						$("#graph svg g circle."+data.name()).parent()[0].onclick=function() {
							switchToTopDir(data.name());
						}
					} else {
						fb.child("tree").once("value",function(data2) {
							data2.forEach(function(tree) {
								if(tree.child("nodes").child(data.name()).val()!=null) {
									$("#graph svg g circle."+data.name()).parent()[0].onclick=function() {
										switchToSubCategory(tree.name(),data.name());
									}
								}
							});
						});
					}
				}
			});
		}
}
function treeView(nodeID){
  /*
  var svg = d3.select("#graph");
  var nodes = svg.selectAll(".node");
  var selectedNode = svg.select("#"+nodeName);
  var xoffset = selectedNode[0][0]["parentNode"]["__data__"].x,
      yoffset = selectedNode[0][0]["parentNode"]["__data__"].y;
      nodeID= selectedNode[0][0]["parentNode"]["__data__"].id;
    if(svg.select(".posList")[0][0]==null){
      var newPosList = {};
      nodes.data().forEach(function(d) {
          newPosList[d.id]=[d.x,d.y]; });
    };
      */
  levels=[];
  levels[0]=[];
  levels[0].push(nodeID);
  count=0;
  for(var i=0;levels[i].length>0;i++){
    levels[i+1]=[];
    levels[i].forEach(function(node){
		if(transTable[node]!=undefined) {
      levels[i+1] = levels[i+1].concat(transTable[node].children);
	}
	});
  }
  force.linkStrength(0.2).resume();
  treeMode=true;
  updateCircleColors();
}
function graphView(){
  treeMode=false;
  firstTick=true;
  force.linkStrength(1).resume();
}
var color="#000000";
function highlightNodes(nodes) {
	for(var i=0;i<nodes.length;i++) {
		var selectedNode = svg.select("."+nodes[i]);
		selectedNode[0][0]["style"]["background"]=selectedNode[0][0]["style"]["fill"];
		selectedNode[0][0]["style"]["fill"]=color;
	}
}
function unHighlightNodes(nodes) {
	for(var i=0;i<nodes.length;i++) {
		var selectedNode = svg.select("."+nodes[i]);
		if(selectedNode[0][0]["style"]["fill"]==color) {
			selectedNode[0][0]["style"]["fill"]=selectedNode[0][0]["style"]["background"];
		}
	}
}

