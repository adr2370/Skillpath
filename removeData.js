fb.child("tree").once("value", function(data) {
	data.forEach(function(d) {
		if(d.name()!="pushed data") {
			fb.child("tree").child(d.name()).remove();
		}
	});
});
fb.child("node").once("value", function(data) {
	data.forEach(function(d) {
		if(d.name()!="node num") {
			fb.child("node").child(d.name()).remove();
		}
	});
});