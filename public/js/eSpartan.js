
var DEBUG = true;

$(document).ready(function() {
	retrieveCategories();
	retrieveBrands();
	retrieveFeaturedItems();
});

function retrieveCategories() {
	var parentCategories;
	var childCategories;
	DEBUG = false;

	var categorySkeleton = ''+
		'<div class="panel panel-default">'+
		'	<div class="panel-heading">'+
		'		<h4 class="panel-title"><a id="categoryName" href="#"></a></h4>'+
		'	</div>'+
		'</div>';

	var categoryParentSkeleton = ''+
		'<div class="panel panel-default">'+
		'	<div class="panel-heading">'+
		'		<h4 class="panel-title">'+
		'			<a id="categoryParentLink" data-toggle="collapse" data-parent="#accordian" href="#sportswear">'+
		'				<span class="badge pull-right"><i class="fa fa-plus"></i></span>'+
		'					<span id="categoryName"></span>'+
		'			</a>'+
		'		</h4>'+
		'	</div>'+
		'	<div id="categoryChildLink" class="panel-collapse collapse">'+
		'		<div class="panel-body">'+
		'			<ul id="subCategoryName">'+
		'			</ul>'+
		'		</div>'+
		'	</div>'+
		'</div>';

	var categoryChildSkeleton = '<li><a href="#"></a></li>';		

	$.ajax({
			async: false,
			type: "GET",
			url: "/ui/categoryParents",
			contentType: 'application/json',
			success: function(data) {
			  parentCategories = eval(data);
			  if(DEBUG) { alert("[Request_Server] Request Successful. Data Received: \n"+JSON.stringify(data)); }
			 },
			 error: function(response) {
				  alert('There was a problem connecting to the server. Please try again.\nError details: '+response);
			  }
	}); //end of ajax

	$.ajax({
			async: false,
			type: "GET",
			url: "/ui/categoryChildren",
			contentType: 'application/json',
			success: function(data) {
			  childCategories = eval(data);
			  if(DEBUG) { alert("[Request_Server] Request Successful. Data Received: \n"+JSON.stringify(data)); }
			 },
			 error: function(response) {
				  alert('There was a problem connecting to the server. Please try again.\nError details: '+response);
			  }
	}); //end of ajax


	if(parentCategories.type && childCategories.type) {
		//There is some data to display
		//alert("Both calls were successful");
		parentCategories = parentCategories.data;
		childCategories = childCategories.data;

		for(var i=0;i<parentCategories.length;i++) {
			var matchingChildren = $.grep(childCategories, function(e){ return e.parent_id == parentCategories[i]._id; });
			//alert(parentCategories[i]+" - matchingChildren:"+JSON.stringify(matchingChildren));

			if(matchingChildren.length == 0){
				$(".category-products").append(categorySkeleton);
				$(".category-products").children().last().find("#categoryName").html(parentCategories[i].name);
			}else if(matchingChildren.length > 0){
				$(".category-products").append(categoryParentSkeleton);
				$(".category-products").children().last().find("#categoryName").html(parentCategories[i].name);
				$(".category-products").children().last().find("#categoryParentLink").attr("href","#"+parentCategories[i].name);
				$(".category-products").children().last().find("#categoryChildLink").attr("id",parentCategories[i].name);
				for(var j=0;j<matchingChildren.length;j++) {
					$(".category-products").children().last().find("#subCategoryName").append('<li><a href="#">'+matchingChildren[j].name+'</a></li>');
				}
			}
			//alert($(".category-products").html());
		} //End of for
	} //End of if

} //End of retrieveCategories()

function retrieveBrands() {
	DEBUG = false;
	var itemBrands;

	$.ajax({
			async: false,
			type: "GET",
			url: "/ui/itemBrands",
			contentType: 'application/json',
			success: function(data) {
			  itemBrands = eval(data);
			  if(DEBUG) { alert("[Request_Server] Request Successful. Data Received: \n"+JSON.stringify(data)); }
			 },
			 error: function(response) {
				  alert('There was a problem connecting to the server. Please try again.\nError details: '+response);
			  }
	}); //end of ajax

	if(itemBrands.type) {
		itemBrands = itemBrands.data;
		for(var i=0;i<itemBrands.length;i++) {
			$(".brands-name").find("ul").append('<li><a href="#"><span class="pull-right">('+itemBrands[i].count+')</span>'+itemBrands[i]._id+'</a></li>');
		}
	}

} //End of retrieveBrands()

function retrieveFeaturedItems() {
	DEBUG = false;
	var featuredItems;

	$.ajax({
			async: false,
			type: "GET",
			url: "/ui/featuredItems",
			contentType: 'application/json',
			success: function(data) {
			  featuredItems = eval(data);
			  if(DEBUG) { alert("[Request_Server] Request Successful. Data Received: \n"+JSON.stringify(data)); }
			 },
			 error: function(response) {
				  alert('There was a problem connecting to the server. Please try again.\nError details: '+response);
			  }
	}); //end of ajax	

	if(featuredItems.type) {
		featuredItems = featuredItems.data;
		for(var i=0;i<featuredItems.length;i++) {
			$(".features_items").append(''+
				'<div class="col-sm-4">'+
				'	<div class="product-image-wrapper">'+
				'		<div class="single-products">'+
				'			<div class="productinfo text-center">'+
				'				<img src="images/home/product1.jpg" alt="" />'+
				'				<h2>$'+featuredItems[i].price+'</h2>'+
				'				<p>'+featuredItems[i].name+'</p>'+
				'				<a href="#" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</a>'+
				'			</div>'+
				'			<div class="product-overlay">'+
				'				<div class="overlay-content">'+
				'					<p>'+featuredItems[i].description+'<p>'+
				'					<h2>$'+featuredItems[i].price+'</h2>'+
				'					<p>'+featuredItems[i].name+'</p>'+
				'					<a href="#" class="btn btn-default add-to-cart"><i class="fa fa-shopping-cart"></i>Add to cart</a>'+
				'				</div>'+
				'			</div>'+
				'		</div>'+
				'	<!-- <div class="choose">'+
				'			<ul class="nav nav-pills nav-justified">'+
				'				<li><a href="#"><i class="fa fa-plus-square"></i>Add to wishlist</a></li>'+
				'				<li><a href="#"><i class="fa fa-plus-square"></i>Add to compare</a></li>'+
				'			</ul>'+
				'		</div> -->'+
				'	</div>'+
				'</div>'+
				'');
		}
	}

} //End of retrieveFeaturedItems()

