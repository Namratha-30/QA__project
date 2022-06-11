
function getInventoryUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/inventory";
}

function getInventoryListUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/inventory/list";
}
//BUTTON ACTIONS
function addInventory(event){
	//Set the values to update
	var $form = $("#inventory-add-form");
	var json = toJson($form);
	var url = getInventoryUrl();
    var check = validateInventory(json);
    	if(check){
	$.ajax({
	   url: url,
	   type: 'POST',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
	   		getInventoryList();
	   		$('#add-inventory-modal').modal('hide');
	   		toastr.options.closeButton=false;
            toastr.options.timeOut=3000;
            toastr.success("Product Inventory added successfully");
            toastr.options.closeButton=true;
            toastr.options.timeOut=0;
	   },
	   error: handleAjaxError
	});
    }
	return false;
}

function displayAddInventory(){
var $i1 = $('#inputBarcode');
$i1.val('');
var $i2 = $('#inputQuantity');
$i2.val('');
$('#add-inventory-modal').modal('toggle');
}
function updateInventory(event){
	$('#edit-inventory-modal').modal('toggle');
	//Get the ID
	var id = $("#inventory-edit-form input[name=id]").val();
	var url = getInventoryUrl() + "/" + id;

	//Set the values to update
	var $form = $("#inventory-edit-form");
	var json = toJson($form);
    var check = validateInventory(json);
    	if(check){
	$.ajax({
	   url: url,
	   type: 'PUT',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
	   		getInventoryList();
	   		toastr.options.closeButton=false;
            toastr.options.timeOut=3000;
	   		toastr.success("Product inventory updated successfully");
	   		toastr.options.closeButton=true;
            toastr.options.timeOut=0;
	   },
	   error: handleAjaxError
	});
    }
	return false;
}

function getInventoryList(){
	var url = getInventoryUrl();
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayInventoryList(data);
	   },
	   error: handleAjaxError
	});
}

function validateInventoryUpload(arr) {
	for(var i in arr){
	var json=arr[i];
	    if(isBlank(json.barcode)) {
        		toastr.error("Barcode field must not be empty");
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
        	if(parseInt(json.quantity)<=0){
            	toastr.error("Quantity must be positive");
                return false;
            	}
	}

	return true;
}

function validateInventory(json) {
	json = JSON.parse(json);
	if(isBlank(json.barcode)) {
		toastr.error("Barcode field must not be empty");
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

	if(parseInt(json.quantity)<=0){
    	toastr.error("Quantity must be positive");
        return false;
    	}
	return true;
}

// FILE UPLOAD METHODS
var fileData = [];
var errorData = [];
var processCount = 0;

function processData(){
	var file = $('#inventoryFile')[0].files[0];
	checkHeader(file,["barcode","quantity"],readFileDataCallback);
}

function readFileDataCallback(results){
	fileData = results.data;
	uploadRows();
}

function uploadRows(){
	//Update progress
	updateUploadDialog();
	var row = fileData;
	var check=validateInventoryUpload(row);
            	var json = JSON.stringify(row);
            	var url = getInventoryListUrl();
    if(check)
    {
        //Make ajax call
        	$.ajax({
        	   url: url,
        	   type: 'POST',
        	   data: json,
        	   headers: {
               	'Content-Type': 'application/json'
               },
        	   success: function(response) {
        	   		console.log(response);
        	   		getInventoryList();
        	   		$('#upload-inventory-modal').modal('hide');
                    	   		toastr.options.closeButton=false;
                                    	   		toastr.options.timeOut=3000;
                                    	   		toastr.success("File uploaded successfully");
                                    	   		toastr.options.closeButton=true;
                                                toastr.options.timeOut=0;
        	   },
        	   error: function(response){
        	   		console.log(response);
                    toastr.error("File cannot be uploaded: "+JSON.parse(response.responseText).message);
        	   }
        	});
    }
	return false;
}

function downloadErrors(){
	writeFileData(errorData);
}

//UI DISPLAY METHODS
function displayInventoryList(tabledata){
	var $tbody = $('#inventory-table').find('tbody');
	$tbody.empty();
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
			wrapper.innerHTML += `<button value=${page} class="page btn btn-md btn-primary" style="margin: 0 2px;">${page}</button>`
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
		var table = $('#inventory-table')
	
		var data = pagination(state.querySet, state.page, state.rows)
		var myList = data.querySet
	
		for(var i in myList){
			var e = myList[i];
			var buttonHtml = ' <button class="btn btn-sm btn-primary" onclick="displayEditInventory(' + e.id + ')">Edit</button>';
			var row = '<tr>'
			+ '<td>' + e.barcode + '</td>'
			+ '<td>'  + e.quantity + '</td>'
			+ '<td>' + buttonHtml + '</td>'
			+ '</tr>';
			$tbody.append(row);
		}
	
		pageButtons(data.pages)
	}

	
}

function displayEditInventory(id){
	var url = getInventoryUrl() + "/" + id;
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayInventory(data);
	   },
	   error: handleAjaxError
	});
}

function resetUploadDialog(){
	//Reset file name
	var $file = $('#inventoryFile');
	$file.val('');
	$('#inventoryFileName').html("Choose File");
	//Reset various counts
	processCount = 0;
	fileData = [];
	errorData = [];
	//Update counts
	updateUploadDialog();
}

function updateUploadDialog(){
	$('#rowCount').html("" + fileData.length);
}

function updateFileName(){
	var $file = $('#inventoryFile');
	var fileName = $file.val();
	var actualfilename=$file.get(0).files.item(0).name;
    console.log(actualfilename);
	$('#inventoryFileName').html(actualfilename);
}

function displayUploadData(){
 	resetUploadDialog();
	$('#upload-inventory-modal').modal('toggle');
}

function displayInventory(data){
	$("#inventory-edit-form input[name=barcode]").val(data.barcode);
	$("#inventory-edit-form input[name=quantity]").val(data.quantity);
	$("#inventory-edit-form input[name=id]").val(data.id);
	$('#edit-inventory-modal').modal('toggle');
}

//INITIALIZATION CODE
function init(){
	$('#add-inventory').click(displayAddInventory);
	$('#submit-inventory').click(addInventory);
	$('#update-inventory').click(updateInventory);
	$('#refresh-data').click(getInventoryList);
	$('#close-upload').click(getInventoryList);
	$('#upload-data').click(displayUploadData);
	$('#process-data').click(processData);

    $('#inventoryFile').on('change', updateFileName)
}

$(document).ready(init);
$(document).ready(getInventoryList);

