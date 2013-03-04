var fb = new Firebase("https://skillpath.firebaseio.com/");
function addNode(name) {
	return fb.child("node").push({name: name}).name();
}
function removeNode(node) {
	fb.child("node").child(node).set(null);
}
function addConnection(tree,parent,child) {
	fb.child("tree").child(tree).child("nodes").child(parent).child("children").child(child).set(1);
	fb.child("tree").child(tree).child("nodes").child(child).child("parents").child(parent).set(1);
	updateNodeLevel(tree,child);
}
function removeConnection(tree,parent,child) {
	fb.child("tree").child(tree).child("nodes").child(parent).child("children").child(child).set(null);
	fb.child("tree").child(tree).child("nodes").child(child).child("parents").child(parent).set(null);
	updateNodeLevel(tree,child);
}
function addLink(node,url) {
	return fb.child("node").child(node).child("links").child(window.btoa(url)).set({down: 0, up: 0, url: window.btoa(url)});
}
function removeLink(node,url) {
	fb.child("node").child(node).child("links").child(window.btoa(url)).set(null);
}
function addUpVote(node,link,userid) {
	var linkRef = fb.child("node").child(node).child("links").child(link);
	linkRef.child("voters").child(userid).once("value", function(position) {
		if ( position.val() === 'up' ) {
		} else if ( position.val() === 'down' ) {
			linkRef.child("down").once("value", function(down) {
				linkRef.child("down").set(down.val()-1);
			});
			linkRef.child("up").once("value", function(up) {
				linkRef.child("up").set(up.val()+1);
			});
			linkRef.child("voters").child(userid).set("up");
		} else {
			linkRef.child("up").once("value", function(up) {
				linkRef.child("up").set(up.val()+1);
			});
			linkRef.child("voters").child(userid).set("up");
		}
	});
}
function addDownVote(node,link,userid) {
	var linkRef = fb.child("node").child(node).child("links").child(link);
	linkRef.child("voters").child(userid).once("value", function(position) {
		if ( position.val() === 'down' ) {
		} else if ( position.val() === 'up' ) {
			linkRef.child("up").once("value", function(up) {
				linkRef.child("up").set(up.val()-1);
			});
			linkRef.child("down").once("value", function(down) {
				linkRef.child("down").set(down.val()+1);
			});
			linkRef.child("voters").child(userid).set("down");
		} else {
			linkRef.child("down").once("value", function(down) {
				linkRef.child("down").set(down.val()+1);
			});
			linkRef.child("voters").child(userid).set("down");
		}
	});
}
function addTree(name,type) {
	return fb.child("tree").push({name: name, type: type}).name();
}
function removeTree(tree) {
	fb.child("tree").child(tree).set(null);
}
function addNodeToTree(tree,node) {
	fb.child("tree").child(tree).child("nodes").child(node).child("level").set(0);
	changeNodeLevel(tree,node,0);
}
function updateNodeLevel(tree,node) {
	fb.child("tree").child(tree).child("nodes").child(node).once("value", function(nodeSnapshot) {
		fb.child("tree").child(tree).once("value", function(snap) {
			var parents=nodeSnapshot.child("parents");
			var children=nodeSnapshot.child("children");
			var nodes=snap.child("nodes");
			var maxLevel=0;
			parents.forEach(function(p) {
				if(nodes.child(p.name()).val()!=null) {
					var curr=nodes.child(p.name()).child("level").val();
					if(curr+1>maxLevel) {
						maxLevel=curr+1;
					}
				}
			});
			changeNodeLevel(tree,node,maxLevel);
			children.forEach(function(c) {
				if(nodes.child(c.name()).val()!=null) {
					var curr=nodes.child(c.name()).child("level").val();
					if(curr<maxLevel+1) {
						changeNodeLevel(tree,c.name(),maxLevel+1);
					}
				}
			});
		});
	});
}
function changeNodeLevel(tree,node,newLevel) {
	fb.child("tree").child(tree).child("nodes").child(node).child("level").once("value", function(dataSnapshot) {
		try {
			fb.child("tree").child(tree).child("levels").child(dataSnapshot.val()).child(node).set(null);
		}
		catch(err) {}
		fb.child("tree").child(tree).child("levels").child(newLevel).child(node).set(1);
		fb.child("tree").child(tree).child("nodes").child(node).child("level").set(newLevel);
	});
}
function addUser(userid,name,photo,email) {
	fb.child("user").child(userid).child("name").set(name);
	fb.child("user").child(userid).child("photo").set(photo);
	fb.child("user").child(userid).child("email").set(email);
}
function removeUser(userid) {
	fb.child("user").child(userid).set(null);
}
function addUserCategory(userid,category,finalDes,found) {
	fb.child("user").child(userid).child("categories").child(category).once("value", function(data) {
		if(data.val()==null) {
			var trees=[];
			var lookup=[];
			trees[0]={name:"me", id:0, index:0, color:0, level:0, children:[]};
			lookup[0]=0;
			var edges=[];
			var count=1;
			var overallCount=0;
			var tree=category;
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
			fb.child("user").child(userid).child("categories").child(category).set(1);
		} else {
			fb.child("tree").child(category).once("value", function(tree) {
				if(!found) {
					addUserCategory(userid,finalDes,finalDes,found);
					switchToTopDir(finalDes);
				} else {
					var count=0;
					tree.child("nodes").child(finalDes).child("children").forEach(function(d){
						count++;
					});
					if(count==0) {
						fb.child("tree").child(finalDes).child("name").once("value", function(d) {
							$("#path").html($("#path").html()+d.val()+"/");
						});
						switchToTutorialTree(finalDes);
						clearCategories();
					} else {
						switchToSubCategory(tree.name(),finalDes);
					}
				}
				treeView(finalDes);
			});
		}
	});
}
function addCompletedNode(userid,node) {
	fb.child("user").child(userid).child("completed").child(node).set(1);
}
function addGoal(userid,tree,node) {
	fb.child("user").child(userid).child("goals").child(node).set(tree);
}
function removeUserCategory(userid,category) {
	fb.child("user").child(userid).child("categories").child(category).set(null);
}
function removeCompletedNode(userid,node) {
	fb.child("user").child(userid).child("completed").child(node).set(null);
}
function removeGoal(userid,node) {
	fb.child("user").child(userid).child("goals").child(node).set(null);
}
