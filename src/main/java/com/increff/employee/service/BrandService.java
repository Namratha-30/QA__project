package com.increff.employee.service;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.increff.employee.dao.BrandDao;
import com.increff.employee.pojo.BrandPojo;


import com.increff.employee.service.*;

@Service
public class BrandService {

	@Autowired
	private BrandDao dao;
	@Transactional
	public void add(BrandPojo p) {
		normalize(p);
		dao.insert(p);
		
	}
	@Transactional
	public void delete(int id) {
		dao.delete(id);
			
	}
	
	@Transactional(rollbackOn = ApiException.class)
	public void update(int id, BrandPojo p) throws ApiException {
		normalize(p);
		BrandPojo ex = checkId(id);
		ex.setBrand_name(p.getBrand_name());
		ex.setBrand_category(p.getBrand_category());
		dao.update(p);
	}
	
	@Transactional(rollbackOn = ApiException.class)
	public BrandPojo get(int id) throws ApiException {
		return checkId(id);
	}
	
	@Transactional
    public List<BrandPojo> getAll() throws ApiException {
		 return dao.selectAll();
	}
    
	@Transactional(rollbackOn = ApiException.class)
    public BrandPojo checkId(int id) throws ApiException {
    	BrandPojo p=dao.select(id);
    	if(p==null) {
    		throw new ApiException("No entrered id present ");
    	}
    	return p;
    }
	
	//gets a brand from both brand and category
	 @Transactional()
	    public BrandPojo getBrandPojo(String brand, String category) throws ApiException {

	        List<BrandPojo> brandPojoList = dao.selectByBrandAndCategory(brand, category);
	        if (brandPojoList.isEmpty()) {
	            throw new ApiException("The brand and category combination given does not exist:" + brand + " ," + category);
	        }
	        return brandPojoList.get(0);
	    }
	
    private static void normalize(BrandPojo p) {
    	p.setBrand_name(p.getBrand_name().toLowerCase().trim());
    	p.setBrand_category(p.getBrand_category().toLowerCase().trim());

    }
}
