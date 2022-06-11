package com.increff.employee.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Repository;

import com.increff.employee.pojo.BrandPojo;

@Repository
public class EmployeeInMemDao {
	 
	HashMap<Integer,BrandPojo> rows;
	private int lastid;
	@PostConstruct
	public void init() {
		rows=new HashMap<Integer, BrandPojo>();
	}

	public void insert(BrandPojo p) {
		lastid++;
		p.setId(lastid);
		rows.put(lastid, p);
		
	}
	public void delete(int id) {
		rows.remove(id);
	}
	public BrandPojo select(int id) {
		return rows.get(id);
	}
	public void update(int id, BrandPojo p) {
		rows.put(id, p);
	}
	public List<BrandPojo> selectAll() {
		ArrayList<BrandPojo> list=new ArrayList<BrandPojo>();
		list.addAll(rows.values());
		return list;
	}
	    
	
}
