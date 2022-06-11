package com.increff.employee.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.increff.employee.dao.ProductDao;
import com.increff.employee.pojo.BrandPojo;
import com.increff.employee.pojo.ProductPojo;

import com.increff.employee.service.*;

@Service
public class ProductService {
	
    @Autowired
    private ProductDao productDao;
     	
    // adds a product to productpojo if barcode doesn't exist already
    @Transactional(rollbackOn = ApiException.class)
    public void add(ProductPojo productPojo) throws ApiException{
        normalize(productPojo);
        check(productPojo);
        ProductPojo productPojo1= productDao.selectIdFromBarcode(productPojo.getBarcode());
        if(productPojo1!=null) {
            throw new ApiException("Product with given barcode already exists: " + productPojo.getBarcode());
        }
        productPojo.setMrp(Math.round(productPojo.getMrp()*100.0)/100.0);
        productDao.insert(productPojo);
    }
    
    //gets a product by id
    @Transactional(rollbackOn = ApiException.class)
    public ProductPojo get(int id) throws ApiException {
        return checkId(id);
    }

    //gets product for barcode
    @Transactional
    public ProductPojo getFromBarcode(String barcode) throws ApiException {
        return checkBarcode(barcode);
    }

    //gets list of all product pojo
    @Transactional
    public List<ProductPojo> getAll() {
        return productDao.selectAll();
    }


    //updates product pojo
    @Transactional(rollbackOn  = ApiException.class)
    public void update(int id, ProductPojo productPojo) throws ApiException {
        check(productPojo);
        normalize(productPojo);
        ProductPojo productPojo1 = checkId(id);
        productPojo1.setBarcode(productPojo.getBarcode());
        productPojo1.setProduct_name(productPojo.getProduct_name());
        productPojo1.setMrp(Math.round(productPojo.getMrp()*100.0)/100.0);
        productDao.update( productPojo1);
    }

	
    
    // checks if given barcode and name of product are in crct format or not 
    public void check(ProductPojo productPojo) throws ApiException {
    	String s=productPojo.getBarcode();
    	
        if(s==null ||s.trim().length()==0) {
            throw new ApiException("Barcode cannot be empty");
        }
        
        String str=productPojo.getProduct_name();
        
        if(str==null ||str.trim().length()==0) {
            throw new ApiException("Name cannot be empty");
        }
        
        if(productPojo.getMrp()<=0)
            throw new ApiException("Mrp cannot be negative or zero");

    }

    //checks if Id exists or not
    @Transactional(rollbackOn = ApiException.class)
    public ProductPojo checkId(int id) throws ApiException {
    	ProductPojo p=productDao.select(id);
    	if(p==null) {
    		throw new ApiException("No entrered id present ");
    	}
    	return p;
    }
    
    //checks if barcode is valid or not
    @Transactional(rollbackOn = ApiException.class)
    public ProductPojo checkBarcode(String barcode) throws ApiException {
        if(barcode==null)
            throw new ApiException("Barcode cannot be empty");
        ProductPojo productPojo= productDao.selectIdFromBarcode(barcode);
        if(productPojo==null){
            throw new ApiException("Product with given barcode does not exist: "+ barcode);
        }
        return productPojo;
    }
    
    //maps all the product pojo with their barcode
    @Transactional
    public Map<String, ProductPojo> getAllProductPojosByBarcode() {
        List<ProductPojo> productPojoList = getAll();
        Map<String, ProductPojo> barcodeProduct = new HashMap<>();
        for (ProductPojo productPojo : productPojoList) {
            barcodeProduct.put(productPojo.getBarcode(), productPojo);
        }
        return barcodeProduct;
    }
    
	//normalize product pojo
    @Transactional
    protected static void normalize(ProductPojo productPojo) {
        productPojo.setProduct_name(productPojo.getProduct_name().toLowerCase().trim());
        productPojo.setBarcode(productPojo.getBarcode().toLowerCase().trim());
        
      
    }


}
