var OrderItemList = [];

function getOrderUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content");

	return baseUrl + "/api/order";
}

function getOrderItemUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content");

	return baseUrl + "/api/order_item";
}

function getSingleOrderUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content");

	return baseUrl + "/api/singleOrder";
}

function getAllOrdersUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content");

	return baseUrl + "/api/all_orders";
}

function getInvoiceUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content");

	return baseUrl + "/api/invoice";
}

function addOrderItemToList(event) {
	var $form = $("#orderItem-form");
	var json = toJson($form);
	console.log(json);
	var check = validateOrderItem(json);
	if(check) {
		var ind = checkIfAlreadyPresent(JSON.parse(json).barcode);

		if(ind==-1){
			if(parseInt(inventoryMap[JSON.parse(json).barcode])>=parseInt(JSON.parse(json).quantity)) {
				OrderItemList.push(JSON.parse(json));
			}
			else{
			if(!inventoryMap[JSON.parse(json).barcode]){
            					toastr.error("The given Barcode does not exists ");
            					}
            					else
				toastr.error("The product inventory is: " + inventoryMap[JSON.parse(json).barcode] + " order cannot be placed more than that");

			}
		}
		else{
			var qty = parseInt(OrderItemList[ind].quantity) + parseInt(JSON.parse(json).quantity);
			if(parseInt(inventoryMap[JSON.parse(json).barcode])>=qty){
				OrderItemList[ind].quantity = qty;
			}
			else{
				if(!inventoryMap[JSON.parse(json).barcode]){
					toastr.error("The given Barcode does not exists" );

				}
				toastr.error("The product inventory is: " + inventoryMap[JSON.parse(json).barcode] + " order cannot be placed more than that");
				}
		}
	}
	console.log(OrderItemList);
	getOrderItemList();
}

function getOrderItemList() {
	displayOrderItemListFrontend(OrderItemList);
}

function getSingleOrder(id){

}
function addOrderItem(event){

	var $form = $("#orderItem-add-form");
	var json = toJson($form);
	var order_id = $("#orderItem-add-form input[name=order_id]").val();
    console.log(order_id);
	var url = getOrderItemUrl() + "/" + order_id;
	var check = validateOrderItem(json);
	console.log(check);
	if(check) {
	console.log(check);
		ajaxQuery(url,'POST',json,function(response) {
			getOrderList(response);
			$("#add-orderItem-modal").modal('toggle');
			toastr.options.closeButton=false;
                        toastr.options.timeOut=3000;
            	   		toastr.success("Order Item added successfully");
            	   		toastr.options.closeButton=true;
                        toastr.options.timeOut=0;
		},handleAjaxError);
	}
	return false;
}

function addOrder(event) {

	if(OrderItemList.length == 0) {
		toastr.error("Add at least one order item");
		return;
	}

	var json = JSON.stringify(OrderItemList);
	OrderItemList=[];
	var url = getOrderUrl();

	ajaxQuery(url,'POST',json,function (response) {
		getOrderList(response);
		$("#add-order-modal").modal('toggle');
		toastr.options.closeButton=false;
                    toastr.options.timeOut=3000;
        	   		toastr.success("Order added successfully");
        	   		toastr.options.closeButton=true;
                    toastr.options.timeOut=0;
	},handleAjaxError);

	return false;
}

function updateOrder(event){
	$('#edit-orderItem-modal').modal('toggle');
	//Get the ID
	var id = $("#orderItem-edit-form input[name=id]").val();
	var orderId = $("#orderItem-edit-form input[name=order-id]").val();
	console.log(orderId);
	var url = getOrderItemUrl() + "/" + id;


	var $form = $("#orderItem-edit-form");
	var json = toJson($form);

	var check = validateOrderItem(json);
	if(check){
		ajaxQuery(url,'PUT',json,function (response) {
			getOrderList(response);
			var orderitem_row = '.orderItemRows' + orderId;
		  $(orderitem_row).show();
		  toastr.options.closeButton=false;
                      toastr.options.timeOut=3000;
          	   		toastr.success("Order updated successfully");
          	   		toastr.options.closeButton=true;
                      toastr.options.timeOut=0;
			console.log(json);
		},handleAjaxError);
	}

	return false;

}

function deleteOrderItemFromOrderList(id) {
	var url = getOrderItemUrl() + "/" + id;
	ajaxQuery(url,'DELETE','',getOrderList,handleAjaxError);
}

function deleteOrder(id) {
	var url = getOrderUrl() + "/" + id;
	ajaxQuery(url,'DELETE','',getOrderList,handleAjaxError);
}

function deleteOrderItem(id) {
	OrderItemList.splice(id,1);
	getOrderItemList();
}


function getOrderList() {
	var url = getOrderUrl();
	$.ajax({
    		 url: url,
    		 type: 'GET',
    		 headers: {
    				'Content-Type': 'application/json'
    			 },
    		 success: function(response) {
    				displayOrdersList(response);
    		 },
    		 error: function(response){
    				handleAjaxError(response);
    		 }
    	});
}

function getOrderItems(id,myList) {
	var url = getOrderUrl() + "/" + id;
	$.ajax({
		 url: url,
		 type: 'GET',
		 headers: {
				'Content-Type': 'application/json'
			 },
		 success: function(response) {
				createOrderItems(response,id,myList);
		 },
		 error: function(response){
				handleAjaxError(response);
		 }
	});
}


//UI DISPLAY METHODS

function displayOrderItemListFrontend(data){
	console.log('Printing Order items');
	var $tbody = $('#orderItem-table').find('tbody');
	$tbody.empty();
	$("#orderItem-table").hide();
	var srlNo=0;
	for(var i in data){
		var e = data[i];
		if(data.length > 0){
	    $("#orderItem-table").show();
		} 
		else{
	    $("#orderItem-table").hide();
		}
		srlNo++;
		var buttonHtml = '<button class="btn btn-sm btn-primary" onclick="deleteOrderItem(' + i + ')">Remove</button>'
		var row = '<tr>'
		+ '<td>' + srlNo + '</td>'
		+ '<td>' + e.barcode + '</td>'
		+ '<td>'  + e.quantity + '</td>'
		+ '<td>'  + e.sp + '</td>'
		+ '<td>' + buttonHtml + '</td>'
		+ '</tr>';
        $tbody.append(row);

	}
}

function displayOrdersList(tabledata) {
	var $tbody = $('#order-table2').find('tbody');
	$tbody.empty();
	tabledata.reverse();
	var state = {
		'querySet': tabledata,
	
		'page': 1,
		'rows': 5,
		'window': 5,
	}
	
	buildTable()
	
	function pagination(querySet, page, rows) {
	
		var trimStart = (page - 1) * rows
		var trimEnd = trimStart + rows
	
		var trimmedData = querySet.slice(trimStart, trimEnd)
	
		var pages = Math.round(querySet.length / rows);
	
		return {
			'querySet': trimmedData,
			'pages': pages,
		}
	}
	
	function pageButtons(pages) {
		var wrapper = document.getElementById('pagination-wrapper')
	
		wrapper.innerHTML = ``
		console.log('Pages:', pages)
	
		var maxLeft = (state.page - Math.floor(state.window / 2))
		var maxRight = (state.page + Math.floor(state.window / 2))
	
		if (maxLeft < 1) {
			maxLeft = 1
			maxRight = state.window
		}
	
		if (maxRight > pages) {
			maxLeft = pages - (state.window - 1)
			
			if (maxLeft < 1){
				maxLeft = 1
			}
			maxRight = pages
		}
		
		
	
		for (var page = maxLeft; page <= maxRight; page++) {
			wrapper.innerHTML += `<button value=${page} class="page btn btn-md btn-primary" style="margin: 0 2px;" >${page}</button>`
		}
	
		if (state.page != 1) {
			wrapper.innerHTML = `<button value=${1} class="page btn btn-md btn-primary" style="margin: 0 2px;">&#171; First</button>` + wrapper.innerHTML
		}
	
		if (state.page != pages) {
			wrapper.innerHTML += `<button value=${pages} class="page btn btn-md btn-primary" style="margin: 0 2px;">Last &#187;</button>`
		}
	
		$('.page').on('click', function() {
			$tbody.empty()
	
			state.page = Number($(this).val())
	
			buildTable()
		})
	
	}
	
	
	function buildTable() {
		var table = $('#order-table2')
	
		var data = pagination(state.querySet, state.page, state.rows)
		var myList = data.querySet
		for(var i in myList){
			var e = myList[i];
			var buttonHtml = '<button class="btn btn-sm btn-primary" style="margin-left:30px;"  onclick="downloadPDF('+ e.id +')" >Generate Invoice</button>';		
		
			var row = '<tr class="order-header">'
			+ '<td> <button class="btn btn-link" onclick="initializeDropdown(' + e.id + ')">' + e.id + '</button> </td>'
			+ '<td>'  + e.datetime + '</td>'
			+'<td>' +buttonHtml +'</td>'
			+ '</tr>';
			orderitemsHtml = '<td colspan="3"><div class="col-12"><table class="table table-striped table-hover orderItemRows' + e.id +'" style="display: none;" ><thead></thead><tbody></tbody></table></div></td>';
			$tbody.append(row);
			$tbody.append(orderitemsHtml);
			getOrderItems(e.id,myList);
		}
	
		pageButtons(data.pages)
	}
	
}

function displayEditOrderItem(id){
	var url = getOrderItemUrl() + "/" + id;
	ajaxQuery(url,'GET','',displayOrderItem,handleAjaxError);
}

function displayAddOrderModal() {
var $i1 = $('#inputBarcode');
$i1.val('');
var $i2 = $('#inputQuantity');
$i2.val('');
var $i3 = $('#inputSp');
$i3.val('');
$('#orderItem-table').hide();
$("#add-order-modal").modal('toggle');
}

function downloadPDF(id) {
	var url = getInvoiceUrl() + "/" + id;
	// document.getElementById("#addNewItem"+ e.id +"").disabled = true;
	$('#addNewItem'+ id +'').attr('disabled',true) ;
	$.ajax({
	   url: url,
	   type: 'GET',
	    xhrFields: {
        responseType: 'blob'
     },
	   success: function(blob) {

	   	console.log(blob);
		console.log(blob.size);
      	var link=document.createElement('a');
      	link.href=window.URL.createObjectURL(blob);
      	link.download="Invoice_" + new Date() + ".pdf";
      	link.click();
	   },
	   error: function(response){
	   		handleAjaxError(response);
	   }
	});
}

function displayOrderItem(data){
	console.log(data);
	var url = getSingleOrderUrl() + "/" + data.orderId;
	if(data.orderId.isInvoiceGenerated)
	{
	$('#addNewItem'+ data.orderId +'').attr('disabled',true) ;
	}
        	$.ajax({
        		 url: url,
        		 type: 'GET',
        		 headers: {
        				'Content-Type': 'application/json'
        			 },
        		 success: function(response) {
        		 console.log(response);
        				if(response.isInvoiceGenerated)
        				{
						$('#addNewItem'+ data.orderId +'').attr('disabled',true) ;
        				toastr.warning("Invoice is generated");
        				}
        				else
        				{
        				$("#orderItem-edit-form input[name=barcode]").val(data.barcode);
                        	$("#orderItem-edit-form input[name=quantity]").val(data.quantity);
                        	$("#orderItem-edit-form input[name=id]").val(data.id);
                        	$("#orderItem-edit-form input[name=order-id]").val(data.orderId);
                        	$("#orderItem-edit-form input[name=sp]").val(data.sp);
                        	$('#edit-orderItem-modal').modal('toggle');
        				}
        		 },
        		 error: function(response){
        				handleAjaxError(response);
        		 }
        	});
}

function displayAddOrderItemModal(order_id) {
	var $i1 = $('#inputBarcode');
	$i1.val('');
	var $i2 = $('#inputQuantity');
	$i2.val('');
	var $i3 = $('#inputSp');
	$i3.val('');
    var url = getSingleOrderUrl() + "/" + order_id;
    	$.ajax({
    		 url: url,
    		 type: 'GET',
    		 headers: {
    				'Content-Type': 'application/json'
    			 },
    		 success: function(response) {
    		 console.log(response);
    				if(response.isInvoiceGenerated)
    				{
    				toastr.warning("Invoice already generated");
    				}
    				else
    				{
    				$("#orderItem-add-form input[name=order_id]").val(order_id);
                    $('#add-orderItem-modal').modal('toggle');
    				}
    		 },
    		 error: function(response){
    				handleAjaxError(response);
    		 }
    	});
}

function createOrderItems(data,id,myList) {

	var table = $('.orderItemRows' + id).find('tbody');
	var table1 = $('.orderItemRows' + id).find('thead');
	var row1 ='<b>Order Items</b> <button class="btn btn-sm btn-primary btnSend" id="addNewItem'+ id +'" onclick="displayAddOrderItemModal(' + id + ')" style="margin-left:549px;">Add Order Item</button>';
	var row2 = '<tr s>'
	+ '<th colspan="4">'+ row1 + '</th>'
	+ '</tr>';
	table1.append(row2);
	for(var i in myList){
		var e = myList[i];
		if(e.isInvoiceGenerated)
		{
			console.log($('#addNewItem'+ e.id +'')) ;
			$('#addNewItem'+e.id+'').attr('disabled',true);
		}
	}
	var thHtml = '<tr>';
	thHtml += '<th scope="col">Barcode</th>';
	thHtml += '<th scope="col">Quantity</th>';
	thHtml += '<th scope="col">Selling Price</th>';
	thHtml += '<th scope="col">Actions</th>';
	thHtml += '</tr>';
	table.append(thHtml);
	for(var i in data){
		var e = data[i];
		var buttonHtml = '<button class="btn btn-sm btn-primary btnSend" id="editOrder'+e.orderId+'" onclick="displayEditOrderItem(' + e.id + ')">Edit</button>';
		var row = '<tr>'
		+ '<td>' + e.barcode + '</td>'
		+ '<td>'  + e.quantity + '</td>'
		+ '<td>' + e.sp + '</td>'
		+ '<td>' + buttonHtml + '</td>'
		+ '</tr>';
		table.append(row);		
	}
	for(var i in myList){
		var e = myList[i];
	if(e.isInvoiceGenerated)
		{
			console.log($('#editOrder'+e.id+''));
			$('#editOrder'+e.id+'').attr('disabled',true);
		}
	}
}

function initializeDropdown(id) {
	console.log("OrderItems List");
	var orderitem_row = '.orderItemRows' + id;
  	$(orderitem_row).toggle();
    
}

function validateOrderItem(json) {
	json = JSON.parse(json);
	if(isBlank(json.barcode)) {
		toastr.error("Barcode must not be empty");

		return false;
	}
	if(isBlank(json.quantity)) {
            		toastr.error("Quantity field must not be empty");
            		return false;
            	}
            	else if(isNaN(parseInt(json.quantity)) || !isInt(json.quantity)){
            	    toastr.error("Quantity field must be an integer value: "+ json.quantity);
                            		return false;
            	}

	if(parseInt(json.quantity)<=0) {
		toastr.error("Quantity must be positive");

		return false;
	}

	if(isBlank(json.sp) ) {
    		toastr.error("Selling price must not be empty");
    		return false;
    	}
    	else if(isNaN((json.sp))){
    	    toastr.error("Selling price must be a double value: "+json.sp);
                		return false;
    	}

    if(parseFloat(json.sp)<=0) {
    		toastr.error("Selling price must be positive");
    		return false;
    	}
	return true;
}

function checkIfAlreadyPresent(barcode) {
	for(var i in OrderItemList) {
		var e = OrderItemList[i];
		if(e.barcode.localeCompare(barcode) == 0){
			return i;
		}
	}
	return -1;
}


//helper
function ajaxQuery(url, type, data, successFunction,errorFunction) {
	$.ajax({
	   url: url,
	   type: type,
	   data: data,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
	   		successFunction(response);
	   },
	   error: function(response){
	   		errorFunction(response);
	   }
	});
}


function isBlank(str) {
    return (!str || /^\s*$/.test(str));
}

function isInt(n) {
   return n % 1 === 0;
}

//INITIALIZATION CODE
function init(){
	$("#open-add-order").click(displayAddOrderModal);
	$('#add-orderItem').click(addOrderItemToList);
	$('#refresh-data').click(getOrderItemList);
	$('#add-order').click(addOrder);
	$("#add-orderItem-previousOrders").click(addOrderItem);
	$('#update-orderItem').click(updateOrder);
}

$(document).ready(init);
$(document).ready(getOrderItemList);
$(document).ready(getOrderList);
