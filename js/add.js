var authClient = new FirebaseAuthClient(fb,function(){});
var userid=authClient.readCookie("cookie");
if(userid==null) window.location.href="index.html";
var userfb=fb.child("user").child(userid);
userfb.child("name").on("value", function(data) {
	$("#name").text(data.val());
});
userfb.child("photo").on("value", function(data) {
	$("#photo").attr("src",data.val());
});

var treeid="";
var children=[];
var category="";
var categoryName="";

var names=[];
var listNames=[];
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
		category=names[item].id;
		return item;
	}
});

function nameSkill() {
	$("#treeBox").show();
	if(treeid==""&&category!="") {
		//make the tree
		treeid=addTree($("#skillName input").val(),"tree");
		addNodeToTree(category,treeid);
		$("#skillName div").hide();
		$("#skillName input").attr("readonly","readonly");
	} else {
		//update tree name
	}
}
function addSkill() {
	children.push(addNode($("#specificName").val()));
	addNodeToTree(treeid,children[children.length-1]);
	$("#treeBox").prepend("<div id='"+children[children.length-1]+"'>"+$("#specificName").val()+"</div>");
	$("#specificName").val("");
}