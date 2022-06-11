package com.increff.employee.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.increff.employee.model.InventoryData;
import com.increff.employee.model.InventoryForm;
import com.increff.employee.pojo.InventoryPojo;
import com.increff.employee.pojo.ProductPojo;
import com.increff.employee.service.ApiException;
import com.increff.employee.service.InventoryService;
import com.increff.employee.service.ProductService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;



@Api
@RestController
@RequestMapping(path="/api/inventory")
public class InventoryController {
	

    @Autowired
    private InventoryService inventoryService;

    @Autowired
    private ProductService productService;
    
    //Adds a product to the inventory
    @ApiOperation(value = "Adds a product to inventory")
    @RequestMapping(path = "", method = RequestMethod.POST)
    public void add(@RequestBody InventoryForm inventoryForm) throws ApiException {
        ProductPojo productPojo= productService.getFromBarcode(inventoryForm.getBarcode());
        InventoryPojo inventoryPojo= convert(inventoryForm,productPojo);
        inventoryService.add(inventoryPojo);
    }

   

    //Retrieves a product by id
    @ApiOperation(value = "Get a product inventory by Id")
    @RequestMapping(path = "/{id}", method = RequestMethod.GET)
    public InventoryData get(@PathVariable int id) throws ApiException {
        InventoryPojo inventoryPojo = inventoryService.get(id);
        ProductPojo productPojo=productService.get(inventoryPojo.getProductId());
        return convert(inventoryPojo,productPojo);
    }

    //Retrieves the total list of products in the inventory
    @ApiOperation(value = "Gets list inventory")
    @RequestMapping(path = "", method = RequestMethod.GET)
    public List<InventoryData> getAll() throws ApiException {
        List<InventoryPojo> inventoryPojoList = inventoryService.getAll();
        List<InventoryData> inventoryDataList = new ArrayList<>();
        for (InventoryPojo inventoryPojo : inventoryPojoList){
            ProductPojo productPojo=productService.get(inventoryPojo.getProductId());
            inventoryDataList.add(convert(inventoryPojo,productPojo));
        }
        return inventoryDataList;
    }

    //Updates an inventory of a product
    @ApiOperation(value = "Updates an inventory")
    @RequestMapping(path = "/{id}", method = RequestMethod.PUT)
    public void update(@PathVariable int id, @RequestBody InventoryForm inventoryForm) throws ApiException {
        inventoryForm.setBarcode(inventoryForm.getBarcode().toLowerCase().trim());
        ProductPojo productPojo= productService.getFromBarcode(inventoryForm.getBarcode());
        InventoryPojo inventoryPojo= convert(inventoryForm,productPojo);
        inventoryService.update(id, inventoryPojo);
    }
	
    //converts inventory pojo into inventory data
    public static InventoryData convert(InventoryPojo inventoryPojo, ProductPojo productPojo) {
        InventoryData inventoryData =new InventoryData();
        inventoryData.setId(inventoryPojo.getId());
        inventoryData.setQuantity(inventoryPojo.getQuantity());
        inventoryData.setBarcode(productPojo.getBarcode());
        return inventoryData;
    }
    
  //converts inventory form into inventory pojo
    public static InventoryPojo convert(InventoryForm inventoryForm, ProductPojo productPojo) throws ApiException {
        InventoryPojo inventoryPojo=new InventoryPojo();
        inventoryPojo.setProductId(productPojo.getId());
        inventoryPojo.setQuantity(inventoryForm.getQuantity());
        return inventoryPojo;
    }


}
