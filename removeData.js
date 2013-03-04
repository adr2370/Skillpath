fb.child("tree").once("value", function(data) {
	data.forEach(function(d) {
		if(d!=null&&d.name()!="pushed data") {
			fb.child("tree").child(d.name()).remove();
		}
	});
});
fb.child("node").once("value", function(data) {
	data.forEach(function(d) {
		if(d!=null&&d.name()!="node num") {
			fb.child("node").child(d.name()).remove();
		}
	});
});
fb.child("user").once("value", function(data) {
	data.forEach(function(u) {
		if(u!=null&&u.name()!="userid") {
			fb.child("user").child(u.name()).child("categories").remove();
			fb.child("user").child(u.name()).child("completed").remove();
			fb.child("user").child(u.name()).child("goals").remove();
		}
	});
});