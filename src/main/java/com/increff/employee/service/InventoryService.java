package com.increff.employee.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.increff.employee.dao.BrandDao;
import com.increff.employee.dao.InventoryDao;
import com.increff.employee.dao.ProductDao;
import com.increff.employee.pojo.InventoryPojo;

import com.increff.employee.service.ApiException;


@Service
public class InventoryService {

	  @Autowired
	    private InventoryDao inventoryDao;
	    @Autowired
	    private ProductDao productDao;
	    @Autowired
	    private BrandDao brandDao;

	    @Autowired
	    private ProductService productService;
	    
	  //Adds a product inventory
	    @Transactional(rollbackOn = ApiException.class)
	    public void add(InventoryPojo inventoryPojo) throws ApiException{
	        check(inventoryPojo);
	        InventoryPojo inventoryPojo1=inventoryDao.selectByProductId(inventoryPojo.getProductId());
	        if(inventoryPojo1!=null)
	        {
	            inventoryPojo.setQuantity(inventoryPojo.getQuantity()+inventoryPojo1.getQuantity());
	            update(inventoryPojo1.getId(),inventoryPojo );
	        }
	        else
	        inventoryDao.insert(inventoryPojo);
	    }
	    
	    
	    //retrieves a product inventory by id
	    @Transactional(rollbackOn = ApiException.class)
	    public InventoryPojo get(int id) throws ApiException {
	        return getCheck(id);
	    }

	    //retrieves all product inventories
	    @Transactional
	    public List<InventoryPojo> getAll() throws ApiException {
	        return inventoryDao.selectAll();
	    }
	    

	    //updates existing inventory
	    @Transactional(rollbackOn  = ApiException.class)
	    public void update(int id, InventoryPojo inventoryPojo) throws ApiException {
	        check(inventoryPojo);
	        InventoryPojo inventoryPojo1 = getCheck(id);
	        inventoryPojo1.setQuantity(inventoryPojo.getQuantity());
	        inventoryDao.update(id, inventoryPojo1);
	    }

	    
	  //checks whether quantity is positive or not
	    @Transactional
	    public void check(InventoryPojo inventoryPojo) throws ApiException {
	        if(inventoryPojo.getQuantity()<0){
	            throw new ApiException("Quantity cannot be negative");
	        }
	    }

	    
	    
	    //checks whether inventory exists or not
	    @Transactional
	    public InventoryPojo getCheck(int id) throws ApiException {
	        InventoryPojo inventoryPojo = inventoryDao.select(id);
	        if (inventoryPojo == null) {
	            throw new ApiException("Inventory with given ID does not exist, id: " + id);
	        }
	        return inventoryPojo;
	    }
	    
	  //retrieves inventory from product id
	    @Transactional
	    public InventoryPojo getFromProductId(int productId) throws ApiException {
	        InventoryPojo inventoryPojo = inventoryDao.selectByProductId(productId);
	        if(inventoryPojo == null){
	            throw new ApiException("Inventory with given productId does not exist, productId: " + productId);
	        }
	        return inventoryPojo;
	    }

}
