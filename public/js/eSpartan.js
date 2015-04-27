
var serverUrl = "http://localhost:3000/api";
var DEBUG = false;

$(document).ready(function() {

retrieveCategories();

});

function retrieveCategories() {
	var parentCategories;
	var childCategories;

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
			url: serverUrl+"/categoryParents",
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
			url: serverUrl+"/categoryChildren",
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


/*

*/
}