function goToTheNodePage(nodeId) {
	$("#nodeCon").show();
	$("#graph").hide();
	// Updates H1 & grabs node links
	fb.child("node").child(nodeId).on("value", function(nodeInfo) {
		var nodeName = nodeInfo.val().name;
		var nodeLinks = nodeInfo.val().links;
		var sortedLinks = _.chain(nodeLinks)
			.sortBy(function(link){ return link.down-link.up; })
			.map(function(link){ return { "url": link.url, "up": link.up, "down": link.down } } )
			.value();
		var links = [];

		$('h1').text(nodeName);
		// console.log(sortedLinks);
		$.each( sortedLinks, function(key,value) {
			url = window.atob(value.url); // Reverses base64
			links.push(
				'<div class="linkListing">'+
					'<div class="arrows">'+
						'<div class="arrowUp upVote" data-nodelink="'+value.url+'">'+
							'<span class="upCount" data-nodelink="'+value.url+'">'+value.up+'</span>'+
						'</div>'+
						'<div class="arrowDown downVote" data-nodelink="'+value.url+'">'+
							'<span class="downCount" data-nodelink="'+value.url+'">'+value.down+'</span>'+
						'</div>	'+
					'</div>'+
					'<a href="'+url+'">'+
					'<div class="linkText">'+
						'<h2>'+url+'</h2>'+
						'<em>'+url+'</em>'+
					'</div>'+
					'</a>'+
				'</div>'
			);
		});
		$('#urlContainer').html(links.join(''));
	});
	// Pushes upvotes to firebase
	$('#urlContainer').on('click', '.upVote', function() {
		var nodeLink = $(this).data('nodelink');
		addUpVote(nodeId,nodeLink,userid);
	});
	// Pushes downvotes to firebase
	$('#urlContainer').on('click', '.downVote', function() {
		var nodeLink = $(this).data('nodelink');
		addDownVote(nodeId,nodeLink,userid);
	});
}