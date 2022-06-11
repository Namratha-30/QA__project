
function getProductUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/product";
}
function getProductListUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content");
	console.log(baseUrl);
	return baseUrl + "/api/product/list";
}
//BUTTON ACTIONS
function displayAddProduct(){

var $i1 = $('#inputBarcode');
$i1.val('');
var $i2 = $('#inputBrand');
$i2.val('');
var $i3 = $('#inputCategory');
$i3.val('');
var $i4 = $('#inputName');
$i4.val('');
var $i5 = $('#inputMrp');
$i5.val('');
$('#add-product-modal').modal('toggle');
}


function addProduct(event){
	//Set the values to update
	var $form = $("#add-product-form");
	var json = toJson($form);
	var check = validateProduct(json);
    	if(check) {
	var url = getProductUrl();

	$.ajax({
	   url: url,
	   type: 'POST',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
	   		getProductList();
	   		$('#add-product-modal').modal('hide');
	   		toastr.options.closeButton=false;
            toastr.options.timeOut=3000;
	   		toastr.success("Product added successfully");
	   		toastr.options.closeButton=true;
            toastr.options.timeOut=0;
	   },
	   error: handleAjaxError
	});
   }
	return false;
}

function updateProduct(event){
	$('#edit-product-modal').modal('toggle');
	//Get the ID
	var id = $("#product-edit-form input[name=id]").val();
	var url = getProductUrl() + "/" + id;

	//Set the values to update
	var $form = $("#product-edit-form");
	var json = toJson($form);
	var check = validateProduct(json);
        	if(check) {

	$.ajax({
	   url: url,
	   type: 'PUT',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
	   		getProductList();
	   		toastr.options.closeButton=false;
                        toastr.options.timeOut=3000;
            	   		toastr.success("Product updated successfully");
            	   		toastr.options.closeButton=true;
                        toastr.options.timeOut=0;
	   },
	   error: handleAjaxError
	});
    }
	return false;
}

function getProductList(){
	var url = getProductUrl();
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayProductList(data);
	   },
	   error: handleAjaxError
	});
}

function validateProduct(json) {
	json = JSON.parse(json);
	if(isBlank(json.brand)) {
		toastr.error("Brand field must not be empty");
		return false;
	}
	if(isBlank(json.category)) {
		toastr.error("Category field must not be empty");
		return false;
	}
	if(isBlank(json.barcode)) {
		toastr.error("Barcode field must not be empty");
		return false;
	}
	if(isBlank(json.name)) {
		toastr.error("Name field must not be empty");
		return false;
	}
	if(isBlank(json.mrp)) {
		toastr.error("Mrp field must not be empty");
		return false;
	}
	else if(isNaN(json.mrp)){
           	    toastr.error("Mrp field must be a float value: "+ json.mrp);
                       		return false;
           	}
	return true;
}

function validateProductUpload(arr){
    for(var i in arr){
        var row=arr[i];
        console.log(row);
       if(isBlank(row.brand)) {
       		toastr.error("Brand field must not be empty");
       		return false;
       	}
       	if(isBlank(row.category)) {
       		toastr.error("Category field must not be empty");
       		return false;
       	}
       	if(isBlank(row.barcode)) {
       		toastr.error("Barcode field must not be empty");
       		return false;
       	}
       	if(isBlank(row.name)) {
       		toastr.error("Name field must not be empty");
       		return false;
       	}
       	if(isBlank(row.mrp)) {
       		toastr.error("Mrp field must not be empty");
       		return false;
       	}
       	else if(isNaN((row.mrp))){
       	    toastr.error("Mrp field must be a float value: "+ row.mrp);
                   		return false;
       	}

    }
    return true;
}
// FILE UPLOAD METHODS
var fileData = [];
var errorData = [];
var processCount = 0;

function processData(){
	var file = $('#productFile')[0].files[0];
	checkHeader(file,["barcode","brand","category","name","mrp"],readFileDataCallback);
}

function readFileDataCallback(results){
	fileData = results.data;
	uploadRows();
}

function uploadRows(){
	//Update progress
	updateUploadDialog();
	var row = fileData;
	console.log(row);
	var check=validateProductUpload(row);
        	var json = JSON.stringify(row);
        	var url = getProductListUrl();
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
    	   getProductList();
    	   $('#upload-product-modal').modal('hide');
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
function displayProductList(tabledata){
	var $tbody = $('#product-table').find('tbody');
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
		
		for (var page = maxLeft; page <= maxRight; page++) {
		if(page==state.page)
		{
			console.log(state.page);
			$('#'+(state.page)).attr('disabled',true);
		}
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
		var table = $('#product-table')
	
		var data = pagination(state.querySet, state.page, state.rows)
		var myList = data.querySet
	
		for(var i in myList){
			var e = myList[i];
			var buttonHtml = ' <button class="btn btn-sm btn-primary" onclick="displayEditProduct(' + e.id + ')">Edit</button>';
			var row = '<tr>'
			+ '<td>' + e.barcode + '</td>'
			+ '<td>'  + e.brand + '</td>'
			+ '<td>'  + e.category + '</td>'
			+ '<td>'  + e.name + '</td>'
			+ '<td>'  + e.mrp + '</td>'
			+ '<td>' + buttonHtml + '</td>'
			+ '</tr>';
			$tbody.append(row);
		}
		pageButtons(data.pages)
	}
	
		
	}


function displayEditProduct(id){
	var url = getProductUrl() + "/" + id;
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayProduct(data);
	   },
	   error: handleAjaxError
	});
}

function resetUploadDialog(){
	//Reset file name
	var $file = $('#productFile');
	$file.val('');
	$('#productFileName').html("Choose File");
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
	var $file = $('#productFile');
	var fileName = $file.val();
	var actualfilename=$file.get(0).files.item(0).name;
    console.log(actualfilename);
	$('#productFileName').html(actualfilename);
}

function displayUploadData(){
 	resetUploadDialog();
	$('#upload-product-modal').modal('toggle');
}

function displayProduct(data){
    $("#product-edit-form input[name=brand]").val(data.brand);
    $("#product-edit-form input[name=category]").val(data.category);
	$("#product-edit-form input[name=barcode]").val(data.barcode);
	$("#product-edit-form input[name=name]").val(data.name);
	$("#product-edit-form input[name=mrp]").val(data.mrp);
	$("#product-edit-form input[name=id]").val(data.id);
	$('#edit-product-modal').modal('toggle');
}

//INITIALIZATION CODE
function init(){
	$('#add-product').click(displayAddProduct);
	$('#submit-product').click(addProduct);
	$('#update-product').click(updateProduct);
	$('#refresh-data').click(getProductList);
	$('#close-upload').click(getProductList);
	$('#upload-data').click(displayUploadData);
	$('#process-data').click(processData);
    $('#productFile').on('change', updateFileName)
}

$(document).ready(init);
$(document).ready(getProductList);

