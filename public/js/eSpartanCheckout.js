
var DEBUG = false;

$(document).ready(function() {
	retrieveCart();

	$("#checkoutButton").on('click',function(){
		checkoutCart();
	});
});

function retrieveCart() {
	var userCart;
	var ecoTax = 0;
	var shippingTax = "$0";
	var cartSubTotal = 0;

	$.ajax({
			async: false,
			type: "GET",
			url: "loadCartDetails",
			contentType: 'application/json',
			success: function(data) {
			  userCart = eval(data);
			  if(DEBUG) { alert("[Request_Server] Request Successful. Data Received: \n"+JSON.stringify(data)); }
			 },
			 error: function(response) {
				  alert('There was a problem connecting to the server. Please try again.\nError details: '+JSON.stringify(response));
			  }
	}); //end of ajax

	if(userCart.type) {
		userCart = userCart.data;
		
		if(userCart.items.length > 0)
			$(".cart_info").find(".tbody").html("");
		for(var i=0;i<userCart.items.length;i++) {
			cartSubTotal = cartSubTotal + userCart.items[i].price;
			$(".cart_info").find(".tbody").append('' +
			//Add each TR here
			'	<tr>'+
			'		<td class="cart_product">'+
			'			<a><img src="' + userCart.items[i].imagePath +'" alt="' + userCart.items[i].name+ '" height = "100px" width="150px"></a>'+
			'		</td>'+
			'		<td class="cart_description">'+
			'			<h4><a>'+userCart.items[i].name+'</a></h4>'+
			'			<p>Retailer ID: '+userCart.items[i].retailer_id+'</p>'+
			'		</td>'+
			'		<td class="cart_price">'+
			'			<p>$'+userCart.items[i].price+'</p>'+
			'		</td>'+
			'		<td class="cart_quantity">'+
			'			<div class="cart_quantity_button">'+
			'				<input class="cart_quantity_input" disabled type="text" name="quantity" value="'+userCart.items[i].quantity+'" autocomplete="off" size="2">'+
			'			</div>'+
			'		</td>'+
			'		<td class="cart_total">'+
			'			<p class="cart_total_price">$'+userCart.items[i].price+'</p>'+
			'		</td>'+
			'	</tr>'+
			'');	
		} //End of for loop
		ecoTax = 2;
		shippingTax = "Free";
	}
		$("#ecoTax").html("$"+ecoTax);
		$("#shippingTax").html(shippingTax);
		$("#cartSubTotal").html("$"+cartSubTotal);
		$("#cartTotal").html("$"+(ecoTax+cartSubTotal));
}// End of retrieveCart()

function checkoutCart() {
	DEBUG = false;

	if($("#form1")[0].checkValidity() && $("#form2")[0].checkValidity()) {
		var infoToSend;
		var receipientName = document.getElementById("firstName") + document.getElementById("lastName");
		var receipientPhoneNumber = document.getElementById("phone");
		var creditCard = document.getElementById("cardNo");
		var AddressLine1 = document.getElementById("address1");
		var AddressLine2 = document.getElementById("address2");
		var City = document.getElementById("city");
		var State = document.getElementById("state");
		var ZipCode = document.getElementById("zip");

		infoToSend = JSON.stringify({"receipientName": receipientName.value, "receipientPhoneNumber": receipientPhoneNumber.value, "creditCard": creditCard.value, "shippingAddress": { "AddressLine1": AddressLine1.value, "AddressLine2": AddressLine2.value,	"City": City.value, "State": State.value, "ZipCode": ZipCode.value } });
		console.log(infoToSend);
		$.ajax({
			async: false,
			type: "POST",
			url: "checkout",
			contentType: 'application/json',
			data: infoToSend,
			success: function(data) {
			  userCart = eval(data);
			  if(DEBUG) { alert("[Request_Server] Request Successful. Data Received: \n"+JSON.stringify(data)); }
			 },
			 error: function(response) {
				  alert('There was a problem connecting to the server. Please try again.\nError details: '+JSON.stringify(response));
			  }
	}); //end of ajax

		if(userCart.type) {
			$("#checkoutModal").modal('show');
		} else {
			$("#cantCheckoutModal").modal('show');
		}
		//$("#home").find("a").trigger('click');
	} else {
		//Display message to enter form details - mandatory fields
		alert("Please enter all the fields in the form");
	}
	
}