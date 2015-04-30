var DEBUG = false;

$(document).ready(function() {
    retrieveCart();
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
                if (DEBUG) {
                    alert("[Request_Server] Request Successful. Data Received: \n" + JSON.stringify(data));
                }
            },
            error: function(response) {
                alert('There was a problem connecting to the server. Please try again.\nError details: ' + JSON.stringify(response));
            }
        }); //end of ajax

        if (userCart.type) {
            userCart = userCart.data;

            if (userCart.items.length > 0)
                $(".cart_info").find("tbody").html("");
            for (var i = 0; i < userCart.items.length; i++) {
                cartSubTotal = cartSubTotal + userCart.items[i].price;
                $(".cart_info").find("tbody").append('' +
                    //Add each TR here
                    '	<tr item-id="' + userCart.items[i]._id + '">' +
                    '		<td class="cart_product" style="margin-right:2px">' +
                    '			<a><img src="' + userCart.items[i].imagePath + '" alt="' + userCart.items[i].name + '" height = "100px" width="150px"></a>' +
                    '		</td>' +
                    '		<td class="cart_description">' +
                    '			<h4><a>' + userCart.items[i].name + '</a></h4>' +
                    '			<p>Retailer ID: ' + userCart.items[i].retailer_id + '</p>' +
                    '		</td>' +
                    '		<td class="cart_price">' +
                    '			<p>$' + userCart.items[i].price + '</p>' +
                    '		</td>' +
                    '		<td class="cart_quantity">' +
                    '			<div class="cart_quantity_button">' +
                    '				<input class="cart_quantity_input" disabled type="text" name="quantity" value="' + userCart.items[i].quantity + '" autocomplete="off" size="2">' +
                    '			</div>' +
                    '		</td>' +
                    '		<td class="cart_total">' +
                    '			<p class="cart_total_price">$' + userCart.items[i].price + '</p>' +
                    '		</td>' +
                    '		<td class="cart_delete">' +
                    '			<a class="cart_quantity_delete"><i class="fa fa-times"></i></a>' +
                    '		</td>' +
                    '	</tr>' +
                    '');
            } //End of for loop
            ecoTax = 2;
            shippingTax = "Free";
        }
        $("#ecoTax").html("$" + ecoTax);
        $("#shippingTax").html(shippingTax);
        $("#cartSubTotal").html("$" + cartSubTotal);
        $("#cartTotal").html("$" + (ecoTax + cartSubTotal));
    } // End of retrieveCart()

$(".cart_quantity_delete").on('click', function(e) {
    console.log("Deleting item");
    e.preventDefault();
    //alert("Add to cart is clicked");
    DEBUG = false;
    var deleteFromCartResponse;

    var itemId = $(this).parents("tr").attr('item-id');
    console.log(itemId);

    var s = JSON.stringify({
        "itemid": itemId
    });
    //alert(s);
    console.log(s);
    //alert(JSON.parse(s).item_id);

    $.ajax({
        async: false,
        type: "POST",
        url: "deleteItemFromCart",
        data: s,
        contentType: 'application/json',
        dataType: 'json',
        success: function(data) {
            deleteFromCartResponse = eval(data);
            if (DEBUG) {
                alert("[Request_Server] Request Successful. Data Received: \n" + JSON.stringify(data));

            }

        },
        error: function(response) {
            alert('There was a problem connecting to the server. Please try again.\nError details: ' + JSON.stringify(response));

        }
    }); //end of ajax
    if (deleteFromCartResponse.type) {
        retrieveCart();
    } else {

    }
});