var authClient = new FirebaseAuthClient(fb,function(){});
var userid=authClient.readCookie("cookie");
var dirLevels=[];
var oldTrees=[];
var inTutorials=false;
var howFarIn=0;
var currCategoryTree="";
var currTutorialTree="";
var names=[];
var listNames=[];
var possibleGoals=[];
var listGoals=[];
var searched=false;
var currNode="";
var highlightedNodes=[];
fb.child("tree").once("value", function(data) {
	data.forEach(function(t) {
		var tree=new Object();
		tree.type="tree";
		tree.id=t.name();
		tree.name=t.child("name").val();
		names[tree.name]=tree;
		listNames.push(tree.name+"");
	});
});
$("#search").typeahead({
	source: function (query, process) {
		return listNames;
	},
	updater: function (item) {
		searched=true;
		var newCategory=names[item];
		backToBeginning();
		fb.child("tree").once("value", function(data) {
			var found=false;
			data.forEach(function(tree) {
				if(tree.child("nodes").child(newCategory.id).val()!=null) {
					found=true;
					addUserCategory(userid,tree.name());
					var count=0;
					tree.child("nodes").child(newCategory.id).child("children").forEach(function(d){
						count++;
					});
					if(count==0) {
						$("#path").html($("#path").html()+newCategory.name+"/");
						switchToTutorialTree(newCategory.id);
						clearCategories();
					} else {
						switchToSubCategory(tree.name(),newCategory.id);
					}
				}
			});
			if(!found) {
				addUserCategory(userid,newCategory.id);
				switchToTopDir(newCategory.id);
			}
		});
	}
});
if(userid==null) window.location.href="index.html";
var userfb=fb.child("user").child(userid);
userfb.child("name").on("value", function(data) {
	$("#name").text(data.val());
});
userfb.child("photo").on("value", function(data) {
	$("#photo").attr("src",data.val());
});
userfb.child("categories").once("value", function(dtop) {
	var count=0;
	dtop.forEach(function(data) {
		count++;
		fb.child("tree").child(data.name()).child("name").once("value", function(data2) {
			addToCategoryList(data.name(),data2.val(),false);
			$("#"+data.name()).attr("onclick","switchToTopDir('"+data.name()+"')");
			count--;
			if(count==0) {
				getMainGraph();
			}
		});
	});
	if(count==0) {
		getMainGraph();
	}
});
userfb.child("goals").on("child_added", function(data) {
	fb.child("node").child(data.name()).child("name").once("value", function(data2) {
		fb.child("tree").child(data.val()).child("name").once("value", function(data3) {
			$("#goals").append("<div class='btn btn-inverse' style='width:200px; float: left;clear: both;' id='"+data.name()+"'>"+data3.val()+"/"+data2.val()+"</div>");
			$("#"+data.name()).click(function() {
				getPathUp(data.val(),data.name());
			});
		});
	});
});
function getMainGraph() {
	var trees=[];
	var lookup=[];
	trees[0]={name:"me", id:0, index:0, color:0, level:0, children:[]};
	lookup[0]=0;
	var edges=[];
	var count=0;
	var overallCount=0;
	userfb.child("categories").once("value", function(data) {
		data.forEach(function(treeTot) {
			count++;
			var tree=treeTot.name();
			fb.child("tree").child(tree).child("name").once("value", function(d) {
				var t=new Object();
				t.id=tree;
				t.name=d.val();
				overallCount++;
				t.color=overallCount;
				t.index=trees.length;
				t.children=[];
				lookup[t.id]=t.index;
				t.level=1;
				trees[0].children.push(t.id);
				trees.push(t);
				edges.push({source:0,target:trees.length-1,value:10});
				count--;
				if(count==0) {
					addCategoryTrees(trees,edges,lookup);
				}
			});
		});
		if(count==0) {
			var dictionary=new Object();
			dictionary.nodes=trees;
			dictionary.links=edges;
			drawGraph(dictionary);
		}
	});
}
function addCategoryTrees(trees,edges,lookup) {
	var topTrees=[];
	var count=0;
	for(var i=1;i<trees.length;i++) topTrees.push(trees[i]);
	for(var i=0;i<topTrees.length;i++) {
		count++;
		fb.child("tree").child(topTrees[i].id).once("value", function(data) {
			if(data.child("nodes").val()==undefined) {
				count--;
			} else {
				var nodeCount=0;
				data.child("nodes").forEach(function(node) {
					nodeCount++;
					var n=new Object();
					n.children=[];
					node.child("children").forEach(function(child) {
						n.children.push(child.name());
					});
					fb.child("tree").child(node.name()).child("name").once("value", function(nodeName) {
						n.id=node.name();
						n.name=nodeName.val();
						var index=lookup[data.name()];
						n.color=topTrees[index-1].color;
						n.index=trees.length;
						lookup[n.id]=n.index;
						n.level=2+node.child("level").val();
						trees.push(n);
						if(node.child("level").val()==0) {
							edges.push({source:index,target:n.index,value:5});
							topTrees[index-1].children.push(n.id);
						} else {
							node.child("parents").forEach(function(parent) {
								edges.push({source:lookup[parent.name()],target:n.index,value:3});
							});
						}
						nodeCount--;
						if(nodeCount==0) {
							count--;
							if(count==0) {
								addSkillTrees(trees,edges,lookup,topTrees.length+1);
							}
						}
					});
				});
			}
		});
	}
}
function addSkillTrees(trees,edges,lookup,startSpot) {
	var secondLookup=[];
	var topTrees=[];
	var count=0;
	for(var i=startSpot;i<trees.length;i++) topTrees.push(trees[i]);
	for(var i=0;i<topTrees.length;i++) {
		count++;
		secondLookup[topTrees[i].id]=[];
		fb.child("tree").child(topTrees[i].id).once("value", function(data) {
			if(data.child("nodes").val()==undefined) {
				count--;
			} else {
				var nodeCount=0;
				topTrees[lookup[data.name()]-startSpot].children=[];
				data.child("nodes").forEach(function(node) {
					nodeCount++;
					fb.child("node").child(node.name()).child("name").once("value", function(nodeName) {
						var n=new Object();
						n.id=node.name();
						n.name=nodeName.val();
						var index=lookup[data.name()];
						n.level=1+topTrees[index-startSpot].level+node.child("level").val();
						n.color=topTrees[index-startSpot].color;
						n.index=trees.length;
						secondLookup[data.name()][n.id]=n.index;
						n.children=[];
						node.child("children").forEach(function(child) {
							n.children.push(child.name());
						});
						trees.push(n);
						if(node.child("level").val()==0) {
							edges.push({source:index,target:n.index,value:2});
							topTrees[lookup[data.name()]-startSpot].children.push(n.id);
						} else {
							node.child("parents").forEach(function(parent) {
								edges.push({source:secondLookup[data.name()][parent.name()],target:n.index,value:1});
							});
						}
						nodeCount--;
						if(nodeCount==0) {
							count--;
							if(count==0) {
								var dictionary=new Object();
								dictionary.nodes=trees;
								dictionary.links=edges;
								console.log(dictionary);
								drawGraph(dictionary);
							}
						}
					});
				});
			}
		});
	}
}
function toggleCheck(check) {
	var checked=$("#"+check+" label input").is(':checked');
	if(checked) {
		$("#"+check+" label input").attr("checked","checked");
		userfb.child("completed").child(check).set(1);
	} else {
		$("#"+check+" label input").removeAttr("checked");
		userfb.child("completed").child(check).set(null);
	}
	
}
function showAddingGoal() {
	$('#addingGoal').show();
	$("#addGoalButton").text("Hide");
	$("#addGoalButton").attr("onclick","hideAddingGoal();");
	fb.child("user").child(userid).on("value", function(data) {
		listGoals=[];
		possibleGoals=[];
		data.child("categories").forEach(function(category) {
			fb.child("tree").child(category.name()).once("value", function(trees) {
				trees.child("nodes").forEach(function(tree) {
					fb.child("tree").child(tree.name()).once("value", function(nodes) {
						nodes.child("nodes").forEach(function(node) {
							fb.child("node").child(node.name()).once("value", function(name) {
								var nameOfGoal=trees.child("name").val()+"/"+nodes.child("name").val()+"/"+name.child("name").val();
								listGoals.push(nameOfGoal);
								var obj=new Object();
								obj.category=trees.name();
								obj.tree=nodes.name();
								obj.node=name.name();
								possibleGoals[nameOfGoal]=obj;
							});
						});
					});
				});
			});
		});
	});
	$("#addGoal").typeahead({
		source: function (query, process) {
			return listGoals;
		},
		updater: function (item) {
			var goal=possibleGoals[item];
			addGoal(userid,goal.tree,goal.node);
		}
	});
}
function hideAddingGoal() {
	$("#addingGoal").hide();
	$("#addGoalButton").text("Add Goal");
	$("#addGoalButton").attr("onclick","showAddingGoal();");
	listGoals=[];
	possibleGoals=[];
}
function backToBeginning() {
	$("#back").text("");
	$("#back").removeClass("btn");
	$("#back").removeClass("btn-danger");
	$("#path").html("/");
	$("#back").attr("onclick","goBack();");
	$("#categories").html(dirLevels[0]);
	dirLevels=[];
	oldTrees=[];
	if(searched) {
		searched=!searched;
	} else {
		graphView();
	}
}
function getPathUp(treeid,id) {
	searched=true;
	backToBeginning();
	changePathDir(treeid,id);
	//find which category the treeid belongs to
	var category="";
	fb.child("user").child(userid).child("categories").once("value", function(data) {
		data.forEach(function(tree) {
			if(category=="") {
				fb.child("tree").child(tree.name()).child("nodes").once("value", function(n) {
					n.forEach(function(node) {
						if(category==""&&node.name()==treeid) {
							category=tree.name();
							findAllTreeParents(category,treeid,id);
						}
					});
				});
			}
		});
	});
}
function changePathDir(treeid,id) {
	addToPath(id,"node");
	clearCategories();
	fb.child("node").child(id).child("name").once("value", function(data) {
		addToCategoryList(id,data.val(),true);
		$("#"+id).attr("onclick","goToTheNodePage('"+id+"');");
		$("#"+id+" label input").attr("onclick","toggleCheck('"+id+"')");
	});
}
function findAllTreeParents(category,treeid,id) {
	var nodes=[];
	fb.child("tree").child(category).child("nodes").once("value", function(data) {
		nodes.push(treeid);
		var index=nodes.length-1;
		var nodeCount=nodes.length;
		while(index<nodeCount) {
			data.child(nodes[index]).child("parents").forEach(function(parent) {
				if($.inArray(parent.name(),nodes)==-1) {
					nodes.push(parent.name());
					nodeCount++;
				}
			});
			index++;
		}
		findAllSkillParents(category,treeid,id,nodes);
	});
}
function findAllSkillParents(category,treeid,id,nodes) {
	fb.child("tree").child(treeid).child("nodes").once("value", function(data) {
		nodes.push(id);
		var index=nodes.length-1;
		var nodeCount=nodes.length;
		while(index<nodeCount) {
			data.child(nodes[index]).child("parents").forEach(function(parent) {
				if($.inArray(parent.name(),nodes)==-1) {
					nodes.push(parent.name());
					nodeCount++;
				}
			});
			index++;
		}
		getGoalTreeData(category,nodes,drawTree);
	});
}
function addToCategoryList(id,name,checkbox) {
	if(!checkbox) {
		$("#categories").append("<div class='btn btn-inverse' style='width:200px; float: left;clear: both;' id='"+id+"'><div class='text'>"+name+"</div></div>");
	} else {	
		$("#categories").append("<div class='btn btn-inverse' style='width:200px; float: left;clear: both;' id='"+id+"'><div class='text' style='float: left;'>"+name+"</div><label class='checkbox' style='margin-top: 0px;margin-bottom: 0px;float: right;' onclick='event.stopPropagation();'><input type='checkbox'> Completed?</label></div>");
		userfb.child("completed").child(id).once("value", function(data) {
			if(data.val()!=null) {
				$("#"+id+" label input").attr("checked","checked");
			}
		});
	}
}
function goBack() {
	unHighlightNodes(highlightedNodes);
	if($("#nodeCon").is(":visible")) {
		$("#nodeCon").hide();
		$("#graph").show();
	} else {
		if(dirLevels.length<=1) {
			$("#back").text("");
			$("#back").removeClass("btn");
			$("#back").removeClass("btn-danger");
		}
		if(dirLevels.length<=howFarIn) {
			inTutorials=false;
		}
		if(dirLevels.length>0) {
			$("#categories").html(dirLevels[dirLevels.length-1]);
			dirLevels.splice(dirLevels.length-1, 1);
			var t=$("#path").html();
			t=t.substring(0,t.length-1);
			$("#path").html(t.substring(0,1+t.lastIndexOf("/")));
		}
		if(oldTrees.length>1&&$("#path").html()!="/") {
			getTreeData(oldTrees[oldTrees.length-2],"prev","");
			oldTrees.splice(oldTrees.length-1, 1);
		} else {
			backToBeginning();
		}
		updateCircleColors();
	}
}
function clearCategories() {
	unHighlightNodes(highlightedNodes);
	$("#nodeCon").hide();
	$("#graph").show();
	if(dirLevels.length<oldTrees.length) {
		dirLevels[dirLevels.length]=$("#categories").html();
	}
	$("#categories").html("");
	$("#back").text("Go Back");
	$("#back").addClass("btn");
	$("#back").addClass("btn-danger");
}
function addToPath(id,type) {
	fb.child(type).child(id).child("name").once("value", function(data) {
		$("#path").html($("#path").html()+data.val()+"/");
	});
}
function switchToSubInDir(id,child,callback) {
	currCategoryTree=id;
	addToPath(id,"tree");
	getTreeData(id,"next",drawTree);
	clearCategories();
	fb.child("tree").child(id).child("levels").child("0").once("value", function(dtop) {
		var count=0;
		dtop.forEach(function(data) {
			count++;
			fb.child("tree").child(data.name()).child("name").once("value", function(data2) {
				addToCategoryList(data.name(),data2.val(),false);
				$("#"+data.name()).attr("onclick","switchToSubCategory('"+id+"','"+data.name()+"');");
				count--;
				if(count==0) {
					callback(id,child);
				}
			});
		});
	});
}
function switchToTopDir(id) {
	currCategoryTree=id;
	addToPath(id,"tree");
	getTreeData(id,"next",drawTree);
	clearCategories();
	fb.child("tree").child(id).child("levels").child("0").once("value", function(dtop) {
		dtop.forEach(function(data) {
			fb.child("tree").child(data.name()).child("name").once("value", function(data2) {
				addToCategoryList(data.name(),data2.val(),false);
				$("#"+data.name()).attr("onclick","switchToSubCategory('"+id+"','"+data.name()+"');");
			});
		});
	});
}
function switchToSubCategory(treeid,id) {
	addToPath(id,"tree");
	//check if it is a leaf
	fb.child("tree").child(treeid).child("nodes").child(id).child("children").once("value", function(dtop) {
		var count=0;
		dtop.forEach(function() {count++;}); //count the children
		if(count==0) {
			//switch to tutorial tree
			switchToTutorialTree(id);
		} else {
			getTreeData(id,"next",drawTree);
			clearCategories();
			dtop.forEach(function(data) {
				fb.child("tree").child(data.name()).child("name").once("value", function(data2) {
					addToCategoryList(data.name(),data2.val(),false);
					$("#"+data.name()).attr("onclick","switchToSubCategory('"+treeid+"','"+data.name()+"');");
				});
			});
		}
	});
}
function switchToTutorialTree(id) {
	currTutorialTree=id;
	inTutorials=true;
	howFarIn=dirLevels.length;
	getTreeData(id,"next",drawTree);
	clearCategories();
	fb.child("tree").child(id).child("levels").child("0").once("value", function(dtop) {
		dtop.forEach(function(data) {
			fb.child("node").child(data.name()).child("name").once("value", function(data2) {
				addToCategoryList(data.name(),data2.val(),true);
				$("#"+data.name()).attr("onclick","switchToSubTutorialTree('"+id+"','"+data.name()+"');");
				$("#"+data.name()+" label input").attr("onclick","toggleCheck('"+data.name()+"')");
			});
		});
	});
}
function switchToSubTutorialTree(treeid,id) {
	addToPath(id,"node");
	getTreeData(id,"next",drawTree);
	clearCategories();
	fb.child("tree").child(treeid).child("nodes").child(id).child("children").once("value", function(dtop) {
		var count=0;
		dtop.forEach(function() {count++;}); //count the children
		if(count==0) {
			//go to the node page for this
			goToTheNodePage(id);
		} else {
			dtop.forEach(function(data) {
				fb.child("node").child(data.name()).child("name").once("value", function(data2) {
					addToCategoryList(data.name(),data2.val(),true);
					$("#"+data.name()).attr("onclick","switchToSubTutorialTree('"+treeid+"','"+data.name()+"');");
					$("#"+data.name()+" label input").attr("onclick","toggleCheck('"+data.name()+"')");
				});
			});
		}
	});
}
function getTreeData(treeid,type,callback) {
	currNode=treeid;
	if(type=="next"&&oldTrees[oldTrees.length-1]!=currNode) {
		oldTrees[oldTrees.length]=currNode;
	}
	treeView(treeid);
	/*var levels=[];
	var nodes=[];
	var nodeCount=0;
	fb.child("tree").child(treeid).once("value",function(top) {
		var topNode=new Object();
		topNode.name=top.child("name").val();
		topNode.children=[];
		nodes[treeid]=topNode;
		levels[0]=[];
		levels[0].push(treeid);
		dtop=top.child("nodes");
		var count = 0;
		for(var prop in dtop.val()) {
			if(dtop.val().hasOwnProperty(prop))
				++count;
		}
		if(count==0) {
			callback(nodes,levels);
		}
		dtop.forEach(function(data) {
			fb.child(type).child(data.name()).child("name").once("value",function(name) {
				var currdata=data.val();
				currdata.name=name.val();
				var childarray=[];
				var parentarray=[];
				data.child("children").forEach(function(child) {
					childarray.push(child.name());
				});
				data.child("parents").forEach(function(parent) {
					parentarray.push(parent.name());
				});
				currdata.children=childarray;
				currdata.parents=parentarray;
				if(currdata.level==0) {
					nodes[treeid].children.push(data.name());
				}
				currdata.level++;
				levels[currdata.level] = ( typeof levels[currdata.level] != 'undefined' && levels[currdata.level] instanceof Array ) ? levels[currdata.level] : []
				levels[currdata.level].push(data.name());
				nodes[data.name()]=currdata;
				nodeCount++;
				if(nodeCount==count) {
					callback(nodes,levels);
				}
			});
		});
	});
	*/
}
function getGoalTreeData(treeid,checkNodes,callback) {
	var levels=[];
	var nodes=[];
	var nodeCount=0;
	fb.child("tree").child(treeid).once("value",function(top) {
		var topNode=new Object();
		topNode.name=top.child("name").val();
		topNode.children=[];
		nodes[treeid]=topNode;
		levels[0]=[];
		levels[0].push(treeid);
		dtop=top.child("nodes");
		dtop.forEach(function(data) {
			if($.inArray(data.name(),checkNodes)!=-1) {
				fb.child("tree").child(data.name()).child("name").once("value",function(name) {
					var currdata=data.val();
					currdata.name=name.val();
					var childarray=[];
					var parentarray=[];
					var childCount=0;
					data.child("children").forEach(function(child) {
						childarray.push(child.name());
						childCount++;
					});
					if(childCount==0) {
						var idOfTree=data.name();
						var parentLevel=currdata.level+1;
						fb.child("tree").child(idOfTree).once("value",function(top) {
							dtop=top.child("nodes");
							dtop.forEach(function(data) {
								if($.inArray(data.name(),checkNodes)!=-1) {
										fb.child("node").child(data.name()).child("name").once("value",function(name) {
										var currdata=data.val();
										currdata.name=name.val();
										var childarray=[];
										var parentarray=[];
										data.child("children").forEach(function(child) {
											childarray.push(child.name());
										});
										data.child("parents").forEach(function(parent) {
											parentarray.push(parent.name());
										});
										currdata.children=childarray;
										currdata.parents=parentarray;
										if(currdata.level==0) {
											nodes[idOfTree].children.push(data.name());
										}
										currdata.level+=parentLevel+1;
										levels[currdata.level] = ( typeof levels[currdata.level] != 'undefined' && levels[currdata.level] instanceof Array ) ? levels[currdata.level] : []
										levels[currdata.level].push(data.name());
										nodes[data.name()]=currdata;
										nodeCount++;
										if(nodeCount==checkNodes.length) {
											for(var n in nodes) {
												for(var i=0;i<nodes[n].children.length;i++) {
													if($.inArray(nodes[n].children[i],checkNodes)==-1) {
														nodes[n].children.splice(i,1);
														i--;
													}
												}
											}
											var nodeArray=[];
											for(var key in nodes) {
												nodeArray.push(key);
											}
											//nodeArray has all nodes in path
											unHighlightNodes(highlightedNodes);
											highlightNodes(nodeArray);
											highlightedNodes=nodeArray;
										}
									});
								}
							});
						});
					}
					data.child("parents").forEach(function(parent) {
						parentarray.push(parent.name());
					});
					currdata.children=childarray;
					currdata.parents=parentarray;
					if(currdata.level==0) {
						nodes[treeid].children.push(data.name());
					}
					currdata.level++;
					levels[currdata.level] = ( typeof levels[currdata.level] != 'undefined' && levels[currdata.level] instanceof Array ) ? levels[currdata.level] : []
					levels[currdata.level].push(data.name());
					nodes[data.name()]=currdata;
					nodeCount++;
					if(childCount!=0&&nodeCount==checkNodes.length) {
						callback(nodes,levels);
					}
				});
			}
		});
	});
}
function drawTree(inNodes, inLevels) {
	$("#graph").html("");
	var graph = {nodes:inNodes,levels:inLevels};
	var width = window.innerWidth-270,
	  height = window.innerHeight-20;
	  radius = 40;
	var color = d3.scale.category20();
	  var nodes = [];
	  var links = []
	  var lookup = {};
	  var levelDepth = graph.levels.length;
	  var currentLevel = 1;
	  graph.levels.forEach(function(l) {
	    var levelIndex = 1;
	    l.forEach(function(node) {
	      var newNode = {};
		  newNode["id"] = node;
	      newNode["x"] = width/(l.length+1)*levelIndex;
	      newNode["y"] = height/(levelDepth+1)*currentLevel;
	      newNode["name"] = graph.nodes[node].name;
	      newNode["children"] = graph.nodes[node].children; 
	      lookup[node] = nodes.length; //Lookup table between node indices in "graph.nodes" and "nodes"
	      nodes.push(newNode);
	      levelIndex+=1;
	    });
	    currentLevel+=1;
	  });
	  nodes.forEach( function(node) {
	    node.children.forEach( function(child) {
	      links.push({source:node,target:nodes[lookup[child]]});
	    });
	  });
	var svg = d3.select("#graph").append("svg")
	    .attr("width",width)
	    .attr("height",height)
	   .append("g");
	svg.selectAll(".link")
	    .data(links)
	  .enter().append("svg:line")
	    .attr("x1",function(d) {return d.source.x; })
	    .attr("y1",function(d) {return d.source.y; })
	    .attr("x2",function(d) {return d.target.x; })
	    .attr("y2",function(d) {return d.target.y; })
	    .style("stroke", "rgb(0,0,0)");
	svg.selectAll(".node")
	    .data(nodes)
	  .enter().append("circle")
	    .attr("class","node")
	    .attr("r",radius)
	    .attr("cx", function(d) { return d.x })
	    .attr("cy", function(d) { return d.y })
		.attr("id", function(d) { return d.id })
		.attr("onclick", function(d) { return "goToTheNodePage('"+d.id+"');" })
	    .style("fill", function(d) { return color(5); })
	  .append("title")
	    .text(function(d) { return d.name; });
	svg.selectAll("text")
	    .data(nodes)
	  .enter().append("svg:text")
	    .attr("x", function(d) { return d.x})
	    .attr("y", function(d) { return d.y})
	    .attr("text-anchor", "middle")
		.attr("style","pointer-events: none;")
	    .text(function(d) { return d.name; });
	updateCircleColors();
}
function updateCircleColors() {
	userfb.child("completed").once("value", function(data) {
		var circleArray = $("#graph svg g circle");
		for(var i=1;i<circleArray.length;i++) {
			var id2=circleArray[i].className.baseVal;
			fb.child("node").child(id2).once("value",function(d) {
				if(d.val()!=null) {
					var id=d.name();
					if(data.child(id).val()==null) {
						$("#graph svg g circle."+id).css("fill","#DD0000");
					} else {
						$("#graph svg g circle."+id).css("fill","#00DD00");
					}
					userfb.child("completed").child(id).on("value", function(data) {
						if(data.val()==null) {
							$("#graph svg g circle."+data.name()).css("fill","#DD0000");
						} else {
							$("#graph svg g circle."+data.name()).css("fill","#00DD00");
						}
					});
				}
			});
		}
	});
}
function goToNode(id) {
	if(inTutorials) {
		switchToSubTutorialTree(currTutorialTree,id);
	} else {
		switchToSubCategory(currCategoryTree,id);
	}
}
