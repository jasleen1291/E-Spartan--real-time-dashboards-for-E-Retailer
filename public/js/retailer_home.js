var socket;

$(document).ready(function() {
    startTime();
    $(".button-collapse").sideNav();
    $('.modal-trigger').leanModal();
    showDashboard();
    socket = io();
    socket.on('updateDashboard', function(msg){
        loadSalesCard();
    });
    
});

$('#logOut').click(function() {
    console.log("logout");
    $.ajax({
        url: 'logout',
        type: 'POST',
        async: true,
        cache: false,
        crossDomain: true,
        dataType: "json",
        success: function(res) {
            if (!res.type) {
                console.log("Please try again.");
            } else {
                sessionStorage.removeItem("user_id");
                window.location.href = "/";
            }
        }
    });
});

function startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);

    var weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    var day = weekday[today.getDay()].toUpperCase();
    $('#dateCard-day').html(day);
    $('#dateCard-date').html(today.toLocaleDateString());
    $('#dateCard-time').html(h + ":" + m + ":" + s);
    var t = setTimeout(function() {
        startTime()
    }, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = "0" + i
    }; // add zero in front of numbers < 10
    return i;
}

function loadSalesCard() {
    var d = new Date();
    yr = d.getFullYear();
    month = d.getMonth() + 1;
    rid = 4;
    startDate = month + "/01/" + yr;


    $.get("getAvgSalesByMonth", {
        year: yr,
        retailerid: rid
    }, function(res) {
        // console.log(res);
        res.forEach(function(obj) {
            if (obj._id == month) {
                avg = parseFloat(obj.avg).toFixed(0);
                $('#avgSaleCard-month').html("$" + avg);
            }
        });
    });
    $.get("getAvgSalesByYear", {
        retailerid: rid
    }, function(res) {
        //console.log(res);
        res.forEach(function(obj) {

            if (obj._id == yr) {
                avg = parseFloat(obj.avg).toFixed(0);
                $('#avgSaleCard-year').html("$" + avg);
            }
        });
    });

    $.get("getTotalSalesByMonth", {
        year: yr,
        retailerid: rid
    }, function(res) {
        //console.log(res);
        res.forEach(function(obj) {
            if (obj._id == month) {
                $('#totalSaleCard-month').html("$" + obj.sum);
            }
        });

    });
    $.get("getTotalSalesByYear", {
        retailerid: rid
    }, function(res) {
        //console.log(res);
        res.forEach(function(obj) {
            if (obj._id == yr) {
                $('#totalSaleCard-year').html("$" + obj.sum);
            }
        });
    });

    $.get("getSalesTrends", {
        startDate: startDate,
        endDate: new Date(),
        retailerid: rid
    }, function(res) {
        //console.log(res);
        var date = [];
        var sale = [];
        res.forEach(function(obj) {
            var d = new Date(obj.date)
            date[date.length] = d.getDate() + "-" + (d.getMonth() + 1);
            sale[sale.length] = obj.sale;
        });
        // console.log(date);
        // console.log(sale);
        generateSaleTrendsGraph(date, sale);
    });

    $.get("getTopProducts", {
        year: yr,
        month: month,
        retailerid: rid
    }, function(res) {
        //console.log(res);
        var productIds = [];
        var quantity = [];
        var productName = [];
        res.forEach(function(obj) {
            productIds[productIds.length] = obj._id;
            productName[productName.length] = obj.name;
            quantity[quantity.length] = obj.qty;
        });

        $('#topProductsChart').highcharts({
            chart: {
                type: 'bar'
            },
            title: {
                text: 'Top Products'
            },
            xAxis: {
                categories: productName,
                title: {
                    text: null
                }
            },
            yAxis: {
                min: 0,
                title: {
                    text: null,
                    align: 'high'
                }
            },
            plotOptions: {
                bar: {
                    dataLabels: {
                        enabled: true,
                        borderWidth: 0
                    },
                    borderWidth: 0
                }
            },
            series: [{
                name: 'This Month',
                data: quantity
            }]

        });
    });


    $.get("getSaleByLocation", {
        year: yr,
        retailerid: rid
    }, function(res) {
        //console.log("Original Map:")
        // console.log(res);

        var state = [];
        var str = "";
        res.forEach(function(obj) {
            str += obj._id + ":" + obj.qty + ", ";
        });
        //  console.log(str);

        $('#usMapSalesChart').highcharts('Map', {

            chart: {
                borderWidth: 1
            },

            title: {
                text: 'Sale Locations'
            },

            legend: {
                layout: 'horizontal',
                borderWidth: 0,
                backgroundColor: '#0EA4C9',
                floating: true,
                verticalAlign: 'top',
                y: 25
            },

            mapNavigation: {
                enabled: true
            },

            colorAxis: {
                min: 1000,
                max: 10000,
                type: 'logarithmic',
                stops: [
                    [0, '#FFFFFF'],
                    [0.8, '#0EA4C9'],
                    [1, '#0EA4C9']
                ]

            },

            series: [{
                animation: {
                    duration: 1000
                },
                minColor: '#FFFFFF',
                maxColor: '#0EA4C9',
                data: res,
                mapData: Highcharts.maps['countries/us/us-all'],
                joinBy: ['postal-code', '_id'],
                dataLabels: {
                    enabled: true,
                    color: 'white',
                    format: '{point._id}'
                },
                name: 'Sale Count',
                tooltip: {
                    pointFormat: '{point._id}: {point.qty}'
                }
            }]
        });
    });
}

function showDashboard() {
    $('#retailerDashboardSection').show();
    $('#listItemSection').hide();
    $('#addItemSection').hide();
    $('#listOrderSection').hide();
    loadSalesCard();
}

function showAddItem() {
    $('#retailerDashboardSection').hide();
    $('#listItemSection').hide();
    $('#addItemSection').show();
    $('#listOrderSection').hide();
}

function showUpdateOrder() {
    $('#retailerDashboardSection').hide();
    $('#listItemSection').hide();
    $('#addItemSection').hide();
    $('#listOrderSection').hide();
}

function showItemList() {
    console.log("getting Item List");
    $("#itemListTable tbody").empty();
    $.get("item", function(res) {
        console.log("success");
        //console.log(res);
        res.forEach(function(thisdata) {
            var tr = "<tr id=\"" + thisdata.name + "\" onclick=\"openItemDetails(\'" + thisdata._id + "\') \">";
            tr += "<td>" + thisdata._id + "</td>";
            if (thisdata.name.length > 50) {
                name = thisdata.name.substring(0, 48) + "...";
            } else {
                name = thisdata.name;
            }
            if (thisdata.description.length > 100) {
                description = thisdata.description.substring(0, 98) + "...";
            } else {
                description = thisdata.description;
            }
            tr += "<td>" + name + "</td>";
            tr += "<td>" + description + "</td>";
            tr += "<td>" + "$" + thisdata.price + "</td>";
            tr += "</tr>";
            $("#itemListTable tbody").append(tr);
        });
    });
    $('#retailerDashboardSection').hide();
    $('#listItemSection').show();
    $('#addItemSection').hide();
    $('#listOrderSection').hide();
}

function showOrderList() {
    console.log("getting order List");
    $("#orderListTable tbody").empty();
    userid = sessionStorage.getItem("user_id");
    url = "retailer/" + userid + "/order";
    $.get(url, function(res) {
        resLen = res.data.length;
        var data = res.data;
        //console.log(data);

        for (var i = 0; i < 15; i++) {
            // $.each(data, function(thisdata) {
            thisdata = data[i];
            var tr = "<tr id=\"" + thisdata.orderid + "\" onclick=\"openOrderDetails(\'" + thisdata.orderid + "\') \">";
            tr += "<td>" + thisdata.orderid + "</td>";
            tr += "<td>" + thisdata.item_id + "</td>";
            tr += "<td>" + thisdata.receipientName + "</td>";
            tr += "<td>" + thisdata.receipientPhoneNumber + "</td>";
            tr += "<td>" + thisdata.shippingAddress.State + "</td>";
            tr += "<td>" + thisdata.updated_at + "</td>";
            tr += "<td>" + thisdata.status + "</td>";
            tr += "</tr>";
            $("#orderListTable tbody").append(tr);
        }
        // });
        $('#retailerDashboardSection').hide();
        $('#listItemSection').hide();
        $('#addItemSection').hide();
        $('#listOrderSection').show();
    });
}

function openItemDetails(itemId) {
    console.log("openItemDetails(" + itemId + ")");
    $.ajax({
        url: 'item/' + itemId,
        type: 'GET',
        async: true,
        crossDomain: true, // enable this
        dataType: "json",
        cache: false,
        success: function(res) {
            console.log(res);
            $('#itemDetails-id').val(res._id);
            $('#itemDetails-categoryid').val(res.category_id);
            $('#itemDetails-name').val(res.name);
            $('#itemDetails-desc').val(res.description);
            $('#itemDetails-price').val(res.price);
            $('#itemDetails-discount').val(res.discount);
            $('#itemDetails-quantity').val(res.quantity);
            $('#itemDetails-features').val(JSON.parse(res.features));
        }
    });
    $('#itemDetailsModal').modal('show');
}

function openOrderDetails(orderId) {
    console.log("openOrderDetails(" + orderId + ")"); 
    userid = sessionStorage.getItem("user_id");
    url = "user/" + userid + "/order/" + orderId;

    $.ajax({
        url: url,
        type: 'GET',
        async: true,
        crossDomain: true, // enable this
        dataType: "json",
        cache: false,
        success: function(res) {
            //console.log(res);
            $('#orderDetails-orderid').val(res.data.orderid);
            $('#orderDetails-updated_at').val(res.data.updated_at);
            $('#orderDetails-item_id').val(res.data.item_id);
            $('#orderDetails-quantity').val(res.data.quantity);
            $('#orderDetails-price').val(res.data.price);
            $('#orderDetails-receipientName').val(res.data.receipientName);
            $('#orderDetails-receipientPhoneNumber').val(res.data.receipientPhoneNumber);
            //var x = JSON.parse(res.data.shippingAddress);

            $('#orderDetails-addressline1').val(res.data.shippingAddress.AddressLine1);
            $('#orderDetails-addressline2').val(res.data.shippingAddress.AddressLine2);
            $('#orderDetails-city').val(res.data.shippingAddress.City);    
            $('#orderDetails-state').val(res.data.shippingAddress.State);    
            $('#orderDetails-zop').val(res.data.shippingAddress.Zip);
            var status = res.data.status;
            console.log(status);
            if(status=="Pending"){
                $('#orderDetails-status').val(1);
            }else if(status=="Shipped"){
                $('#orderDetails-status').val(2);
            }else if(status=="Delivered"){
                $('#orderDetails-status').val(3);
            }else if(status="Cancelled"){
                $('#orderDetails-status').val(4);
            }
        }
    });

    $('#orderDetailsModal').modal('show');
}


$('#addItem').click(function() {

    var category_id = $('#addItem-categoryid').val();
    var name = $('#addItem-name').val();
    var description = $('#addItem-desc').val();
    var price = $('#addItem-price').val();
    var discount = $('#addItem-discount').val();
    var quantity = $('#addItem-quantity').val();
    var features = JSON.stringify($('#addItem-features').val());
    $.ajax({
        url: 'item/create',
        type: 'POST',
        async: true,
        cache: false,
        crossDomain: true,
        dataType: "json",
        data: {
            name: name,
            description: description,
            price: price,
            quantity: quantity,
            category_id: category_id,
            discount: discount,
            features: features
        },
        success: function() {
            $("#addItemForm input[type=text], #addItemForm input[type=number]").val("");
        }
    });
});

$('#updateItem').click(function() {
    var id = $('#itemDetails-id').val();
    var category_id = $('#itemDetails-categoryid').val();
    var name = $('#itemDetails-name').val();
    var description = $('#itemDetails-desc').val();
    var price = $('#itemDetails-price').val();
    var discount = $('#itemDetails-discount').val();
    var quantity = $('#itemDetails-quantity').val();
    var features = JSON.stringify($('#itemDetails-features').val());

    if (id != null) {
        $.ajax({
            url: 'item/update/' + id,
            type: 'PUT',
            async: true,
            cache: false,
            crossDomain: true,
            dataType: "json",
            data: {
                name: name,
                description: description,
                price: price,
                quantity: quantity,
                category_id: category_id,
                discount: discount,
                features: features
            },
            success: function() {
                alert('Item Updated');
                showItemList();
                $('#itemDetailsModal').modal('hide');
            }
        });
    }
});

$('#deleteItem').click(function() {
    var id = $('#itemDetails-id').val();
    if (id != null) {
        $.ajax({
            url: 'item/delete/' + id,
            type: 'DELETE',
            async: 'true',
            crossDomain: true,
            success: function() {
                alert('Item Deleted');
                showItemList();
                $('#itemDetailsModal').modal('hide');
            }
        });
    }
});

function generateSaleTrendsGraph(date, sale) {
    $('#saleTrendsGraph').highcharts({
        chart: {
            height: 300,
            zoomType: 'xy'
        },

        title: {
            text: 'Sale Trends'
        },
        xAxis: {
            categories: date
        },
        yAxis: {
            title: {
                text: 'Sales'
            },
        },
        series: [{
            name: 'Date',
            data: sale

        }]
    });
}