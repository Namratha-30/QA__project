package com.increff.employee.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.increff.employee.model.UserData;
import com.increff.employee.model.UserForm;
import com.increff.employee.pojo.BrandPojo;
import com.increff.employee.service.ApiException;
import com.increff.employee.service.BrandService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@Api
@RestController
public class BrandController {
	
	@Autowired
    private BrandService service;
	
	@ApiOperation(value="adds an employee")
	@RequestMapping(path = "/api" , method = RequestMethod.POST)
	public void insert(@RequestBody UserForm userform) {
		BrandPojo p=convert(userform);
		service.add(p);
	}
	
	

	@ApiOperation(value="deleting an employee")
	@RequestMapping(path = "/api/{id}" , method = RequestMethod.DELETE)
	public void delete(@PathVariable int id) {
		service.delete(id);
		
	}
	
	@ApiOperation(value="selecting a brand by id")
	@RequestMapping(path = "/api/{id}" , method = RequestMethod.GET)
	public UserData select(@PathVariable int id) throws ApiException {
		BrandPojo p=service.get(id);
		UserData data=convert(p);
		return data;
		
		
	}
	

	

	@ApiOperation(value="getting all brands")
	@RequestMapping(path = "/api" , method = RequestMethod.GET)
	public List<UserData> selectAll() throws ApiException {
		ArrayList<UserData> list=new ArrayList<UserData>();
		List<BrandPojo> list1=service.getAll();
		for(BrandPojo p:list1) {
			list.add(convert(p));
			
		}
		return list;
		
		
	}
	
	@ApiOperation(value="updating a brand by id")
	@RequestMapping(path = "/api/{id}" , method = RequestMethod.PUT)
	public void update(@PathVariable int id,@RequestBody UserForm userform) throws ApiException {
		BrandPojo p=convert(userform);
				 service.update(id, p);

	}
	
	private static BrandPojo convert(UserForm userform) {
		BrandPojo p=new BrandPojo();
		p.setBrand_category(userform.getBrand_category());
		p.setBrand_name(userform.getBrand_name());
		
		
			
			return p;
		}

	private static UserData convert(BrandPojo p) {
		UserData userform=new UserData();
		userform.setBrand_name(p.getBrand_name());
		userform.setBrand_category(p.getBrand_category());
		userform.setId(p.getId());
		
			
			return userform;
		
	}
}
