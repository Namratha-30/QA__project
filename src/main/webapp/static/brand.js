function getBrandUrl(){
	var baseUrl = $("meta[name=baseUrl]").attr("content")
	return baseUrl + "/api/brand";
}

function getBrandUrlList(){
	var baseUrl = $("meta[name=baseUrl]").attr("content");
	console.log(baseUrl);
	return baseUrl + "/api/brand/list";
}

//BUTTON ACTIONS
function addBrand(event){
	//Set the values to update
	
	var $form = $("#brand-add-form");
	var json = toJson($form);
	var check = validateBrand(json);
	if(check){
	var url = getBrandUrl();

    	$.ajax({
    	   url: url,
    	   type: 'POST',
    	   data: json,
    	   headers: {
           	'Content-Type': 'application/json'
           },
    	   success: function(response) {
    	   		getBrandList();
    	   		$('#add-brand-modal').modal('hide');
    	   		toastr.options.closeButton=false;
    	   		toastr.options.timeOut=3000;
    	   		toastr.success("Brand added successfully");
    	   		toastr.options.closeButton=true;
                toastr.options.timeOut=0;
    	   },
    	   error: handleAjaxError
    	});
	}

	return false;
}

function updateBrand(event){
	$('#edit-brand-modal').modal('toggle');
	//Get the ID
	var id = $("#brand-edit-form input[name=id]").val();
	//Set the values to update
	var $form = $("#brand-edit-form");
	var json = toJson($form);
    var check = validateBrand(json);
    	if(check){
    	var url = getBrandUrl() + "/" + id;
	$.ajax({
	   url: url,
	   type: 'PUT',
	   data: json,
	   headers: {
       	'Content-Type': 'application/json'
       },
	   success: function(response) {
	   		getBrandList();
	   		toastr.options.closeButton=false;
            toastr.options.timeOut=3000;
            toastr.success("Brand updated successfully");
            toastr.options.closeButton=true;
            toastr.options.timeOut=0;
	   },
	   error: handleAjaxError
	});
    }
	return false;
}

function getBrandList(){
	var url = getBrandUrl();
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayBrandList(data);
	   },
	   error: handleAjaxError
	});
}

function validateBrand(json) {
	json = JSON.parse(json);
	if(isBlank(json.brand)) {
	    toastr.error("Brand field must not be empty")
		return false;
	}
	if(isBlank(json.category)) {
	toastr.error("Category field must not be empty")
		return false;
	}
	return true;
}
// FILE UPLOAD METHODS
var fileData = [];
var errorData = [];
var processCount = 0;


function processData(){
	var file = $('#brandFile')[0].files[0];
	checkHeader(file,["brand","category"],readFileDataCallback);
}

function readFileDataCallback(results){
	fileData = results.data;
	uploadRows();
}

function uploadRows(){
	//Update progress
	updateUploadDialog();
	var row = fileData;
    	var json = JSON.stringify(row);
    	var url = getBrandUrlList();
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
                getBrandList();
                $('#upload-brand-modal').modal('hide');
    	   		toastr.options.closeButton=false;
                    	   		toastr.options.timeOut=3000;
                    	   		toastr.success("File uploaded successfully");
                    	   		toastr.options.closeButton=true;
                                toastr.options.timeOut=0;
    	   		},
    	   error: function(response){
    	   		row.error=response.responseText
                console.log(response);
                toastr.error("File cannot be uploaded: "+JSON.parse(response.responseText).message);

                }
    	});
}

function downloadErrors(){
	writeFileData(errorData);
}

//UI DISPLAY METHODS

function displayBrandList(tabledata){
	var $tbody = $('#brand-table').find('tbody');
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
		var table = $('#brand-table')
	
		var data = pagination(state.querySet, state.page, state.rows)
		var myList = data.querySet
	
		for(let i in myList){
			let e = myList[i];
			var buttonHtml = ' <button class="btn btn-sm btn-primary" title="Edit brand" onclick="displayEditBrand(' + e.id + ')">Edit</button>';
			var row = '<tr>'
			+ '<td>' + e.brand + '</td>'
			+ '<td>'  + e.category + '</td>'
			+ '<td>' + buttonHtml + '</td>'
			+ '</tr>';
			$tbody.append(row);
		}
	
		pageButtons(data.pages)
	}


	
}

function displayEditBrand(id){
	var url = getBrandUrl() + "/" + id;
	$.ajax({
	   url: url,
	   type: 'GET',
	   success: function(data) {
	   		displayBrand(data);
	   },
	   error: handleAjaxError
	});
}
function resetDialog()
{
var $i1 = $('#inputBrand');
$i1.val('');
var $i2 = $('#inputCategory');
$i2.val('');
}

function resetUploadDialog(){
	//Reset file name
	var $file = $('#brandFile');
	$file.val('');
	$('#brandFileName').html("Choose File");
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
	var $file = $('#brandFile');
	var fileName = $file.val();
	var actualfilename=$file.get(0).files.item(0).name;
	console.log(actualfilename);
	$('#brandFileName').html(actualfilename);

}

function displayUploadData(){
 	resetUploadDialog();
	$('#upload-brand-modal').modal('toggle');
}

function displayBrand(data){
	$("#brand-edit-form input[name=brand]").val(data.brand);
	$("#brand-edit-form input[name=category]").val(data.category);
	$("#brand-edit-form input[name=id]").val(data.id);
	$('#edit-brand-modal').modal('toggle');
}

function displayAddBrand(){
	var $i1 = $('#inputBrand');
	$i1.val('');
	var $i2 = $('#inputCategory');
	$i2.val('');
    $('#add-brand-modal').modal('toggle');
}

//INITIALIZATION CODE
function init(){
	$('#submit-brand').click(addBrand);
	$('#add-brand').click(displayAddBrand);
	$('#update-brand').click(updateBrand);
	$('#refresh-data').click(getBrandList);
	$('#upload-data').click(displayUploadData);
	$('#process-data').click(processData);
	$('#close-upload').click(getBrandList);
    $('#brandFile').on('change', updateFileName);
}

$(document).ready(init);
$(document).ready(getBrandList);
