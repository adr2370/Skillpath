var w = window.innerWidth,
    h = window.innerHeight,
    r = 720,
    x = d3.scale.linear().range([0, r]),
    y = d3.scale.linear().range([0, r]);
var svg = d3.select("body").append("svg")
.attr("width", w)
.attr("height", h)
.attr("pointer-events","all");

svg.append("svg:rect")
.attr("width",w)
.attr("height",h)
.attr("fill","white");
//.style("opacity",0);

function redraw() {
  console.log("here",d3.event.translate,d3.event.scale);
  svg.attr("transform","translate("+d3.event.translate+" scale("+d3.event.scale+")");
}

function drawGraph(graph){
  var width = w,
      height = h;

  var color = d3.scale.category20();

  var force = d3.layout.force()
    .linkDistance(150)
    .friction(0.3)
    .gravity(0.3)
    .size([width, height]);

  repulsion = -1700*Math.sqrt(graph.nodes.length);
  force
    .charge(repulsion)
    .nodes(graph.nodes)
    .links(graph.links)
    .start();
  console.log(repulsion);

  var link = svg.selectAll(".link")
    .data(graph.links)
    .enter().append("line")
    .attr("class", "link")
    .style("stroke-width", function(d) { return Math.sqrt(d.value); })
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

  var node = svg.selectAll(".node")
    .data(graph.nodes)
    .enter().append("g");
  node.append("circle")
    .attr("r",5)
    .attr("class","node")
    .attr("x",-8)
    .attr("y",-8)
    .style("fill",function(d){return color(d.color);});
  node.append("text")
    //.attr("text-anchor", "middle")
    .attr("dx",12)
    .attr("dy",".35em")
    .text(function(d) {return d.name});

  svg.style("opacity",1e-6)
    .transition()
    .duration(1000)
    .style("opacity",1);

  force.on("tick", function() {
      link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; });
      node.attr("transform", function(d) {return "translate("+d.x+","+d.y+")"; });
      });
}