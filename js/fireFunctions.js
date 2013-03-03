function addNode(fb,name) {
	return fb.child("node").push({name: name}).name();
}
function removeNode(fb,node) {
	fb.child("node").child(node).set(null);
}
function addConnection(fb,tree,parent,child) {
	fb.child("tree").child(tree).child("nodes").child(parent).child("children").child(child).set(1);
	fb.child("tree").child(tree).child("nodes").child(child).child("parents").child(parent).set(1);
	updateNodeLevel(fb,tree,child);
}
function removeConnection(fb,tree,parent,child) {
	fb.child("tree").child(tree).child("nodes").child(parent).child("children").child(child).set(null);
	fb.child("tree").child(tree).child("nodes").child(child).child("parents").child(parent).set(null);
	updateNodeLevel(fb,tree,child);
}
function addLink(fb,node,url) {
	return fb.child("node").child(node).child("links").child(url).set({down: 0, up: 0}).name();
}
function removeLink(fb,node,url) {
	fb.child("node").child(node).child("links").child(url).set(null);
}
function addDownVote(fb,node,link) {
	fb.child("node").child(node).child("links").child(link).child("down").once("value", function(dataSnapshot) {
		fb.child("node").child(node).child("links").child(link).child("down").set(dataSnapshot.val()+1);
	});
}
function addUpVote(fb,node,link) {
	fb.child("node").child(node).child("links").child(link).child("up").once("value", function(dataSnapshot) {
		fb.child("node").child(node).child("links").child(link).child("up").set(dataSnapshot.val()+1);
	});
}
function addTree(fb,name,type) {
	return fb.child("tree").push({name: name, type: type}).name();
}
function removeTree(fb,tree) {
	fb.child("tree").child(tree).set(null);
}
function addNodeToTree(fb,tree,node) {
	fb.child("tree").child(tree).child("nodes").child(node).child("level").set(0);
	changeNodeLevel(fb,tree,node,0);
}
function updateNodeLevel(fb,tree,node) {
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
			changeNodeLevel(fb,tree,node,maxLevel);
			children.forEach(function(c) {
				if(nodes.child(c.name()).val()!=null) {
					var curr=nodes.child(c.name()).child("level").val();
					if(curr<maxLevel+1) {
						changeNodeLevel(fb,tree,c.name(),maxLevel+1);
					}
				}
			});
		});
	});
}
function changeNodeLevel(fb,tree,node,newLevel) {
	fb.child("tree").child(tree).child("nodes").child(node).child("level").once("value", function(dataSnapshot) {
		fb.child("tree").child(tree).child("levels").child(dataSnapshot.val()).child(node).set(null);
		fb.child("tree").child(tree).child("levels").child(newLevel).child(node).set(1);
		fb.child("tree").child(tree).child("nodes").child(node).child("level").set(newLevel);
	});
}
function addUser(fb,userid,name,photo,email) {
	fb.child("user").child(userid).set({name: name, photo: photo, email: email});
}
function removeUser(fb,userid) {
	fb.child("user").child(userid).set(null);
}
function addUserCategory(fb,userid,category) {
	fb.child("user").child(userid).child("categories").child(category).set(1);
}
function addCompletedNode(fb,userid,node) {
	fb.child("user").child(userid).child("completed").child(node).set(1);
}
function addGoal(fb,userid,node) {
	fb.child("user").child(userid).child("goals").child(node).set(1);
}
function removeUserCategory(fb,userid,category) {
	fb.child("user").child(userid).child("categories").child(category).set(null);
}
function removeCompletedNode(fb,userid,node) {
	fb.child("user").child(userid).child("completed").child(node).set(null);
}
function removeGoal(fb,userid,node) {
	fb.child("user").child(userid).child("goals").child(node).set(null);
}
