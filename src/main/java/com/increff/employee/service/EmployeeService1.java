package com.increff.employee.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;

import com.increff.employee.dao.BrandDao;
import com.increff.employee.pojo.BrandPojo;

public class EmployeeService1 {
	@Autowired
	private BrandDao dao;
	
	public void init() {
		
	}
	
	public void addList(List<BrandPojo> list) {
		for(BrandPojo p: list) {
			dao.insert(p);
		}
	}

}
