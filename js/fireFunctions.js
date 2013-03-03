function addNode(fb,name) {
	return fb.child("node").push({name: name}).name();
}
function removeNode(fb,node) {
	fb.child("node").child(node).set(null);
}
function addConnection(fb,parent,child) {
	fb.child("node").child(parent).child("children").child(child).set(1);
	fb.child("node").child(child).child("parents").child(parent).set(1);
}
function removeConnection(fb,parent,child) {
	fb.child("node").child(parent).child("children").child(child).set(null);
	fb.child("node").child(child).child("parents").child(parent).set(null);
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
	fb.child("node").child(node).once("value", function(nodeSnapshot) {
		fb.child("tree").child(tree).child("levels").once("value", function(treeSnapshot) {
			var parents=nodeSnapshot.child("parents");
			var maxLevel=0;
			parents.forEach(function(p) {
				treeSnapshot.forEach(function(level) {
					if(level.child(p.name()).val()!=null&&parseInt(level.name())+1>maxLevel) {
						maxLevel=parseInt(level.name())+1;
					}
				});
			});
			fb.child("tree").child(tree).child("levels").child(maxLevel).child(node).set(1);
		})
	});
}
function changeNodeLevel(fb,tree,node,oldLevel,newLevel) {
	fb.child("tree").child(tree).child("levels").child(oldLevel).child(node).set(null);
	fb.child("tree").child(tree).child("levels").child(newLevel).child(node).set(1);
}
function addUser(fb,userid,name,photo) {
	fb.child("user").child(userid).set({name: name, photo: photo});
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
