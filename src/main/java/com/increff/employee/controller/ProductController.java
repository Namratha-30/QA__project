package com.increff.employee.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.increff.employee.model.ProductData;
import com.increff.employee.model.ProductForm;
import com.increff.employee.pojo.BrandPojo;
import com.increff.employee.pojo.ProductPojo;
import com.increff.employee.service.ApiException;
import com.increff.employee.service.BrandService;
import com.increff.employee.service.ProductService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;



@Api
@RestController
public class ProductController {
	
	@Autowired
    private ProductService productService;
	
	@Autowired
    private BrandService employeeService;
	
	// adds a product if brand and category are valid/exist.
	@ApiOperation(value="adds a product")
	@RequestMapping(path = "/api/product" , method = RequestMethod.POST)
	public void insert(@RequestBody ProductForm productform) throws ApiException {
		
		 BrandPojo brandPojo=employeeService.getBrandPojo(productform.getBrand(), productform.getCategory());
		ProductPojo p=convert(productform,brandPojo);
		System.out.println(brandPojo.getBrand_name());
		productService.add(p);
	}

	
	 //Retrieves a product by productId
    @ApiOperation(value = "Get a product by Id")
    @RequestMapping(path = "/api/product/{id}", method = RequestMethod.GET)
    public ProductData get(@PathVariable int id) throws ApiException {
        ProductPojo productPojo = productService.get(id);
        BrandPojo brandPojo= employeeService.get(productPojo.getBrand_category());
        return convert(productPojo,brandPojo);
    }

   
	//Retrieves list of all products
    @ApiOperation(value = "Get list of all products")
    @RequestMapping(path = "/api/product", method = RequestMethod.GET)
    public List<ProductData> getAll() throws ApiException {
        List<ProductPojo> productPojoList = productService.getAll();
        List<ProductData> productDataList = new ArrayList<>();
        for (ProductPojo productPojo : productPojoList){
            BrandPojo brandPojo= employeeService.get(productPojo.getBrand_category());
            productDataList.add(convert(productPojo,brandPojo));
        }
        return productDataList;
    }

    //Updates a product
    @ApiOperation(value = "Updates a product")
    @RequestMapping(path = "/api/product/{id}", method = RequestMethod.PUT)
    public void update(@PathVariable int id, @RequestBody ProductForm productform) throws ApiException {
        ProductPojo productPojo= productService.get(id);
        productform.setBrand(employeeService.get(productPojo.getBrand_category()).getBrand_name());
        productform.setCategory(employeeService.get(productPojo.getBrand_category()).getBrand_category());
        BrandPojo brandPojo=employeeService.getBrandPojo(productform.getBrand(), productform.getCategory());
        productService.update(id, convert(productform,brandPojo));
    }
    
	
	//converts productform to productpojo
	  public static ProductPojo convert(ProductForm productForm, BrandPojo brandPojo) throws ApiException {
	        ProductPojo productPojo = new ProductPojo();
	        productPojo.setBarcode(productForm.getBarcode());
	        productPojo.setProduct_name(productForm.getProduct_name());
	        productPojo.setMrp(productForm.getMrp());
	        productPojo.setBrand_category(brandPojo.getId());
	        return productPojo;
	    }
	  
	//converts product pojo into product data
	    public static ProductData convert(ProductPojo productPojo, BrandPojo brandPojo) throws ApiException {
	        ProductData productData = new ProductData();
	        productData.setBarcode(productPojo.getBarcode());
	        productData.setProduct_name(productPojo.getProduct_name());
	        productData.setMrp(productPojo.getMrp());
	        productData.setId(productPojo.getId());
	        productData.setBrand(brandPojo.getBrand_name());
	        productData.setCategory(brandPojo.getBrand_category());
	        productData.setBrand_category(brandPojo.getId());
	        return productData;
	    }
	
	
	
	

}
