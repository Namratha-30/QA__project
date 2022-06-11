package com.increff.employee.pojo;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

@Entity
//@Table(uniqueConstraints = {@UniqueConstraint(columnNames = {"barcode"})})
public class ProductPojo {
	
	 @Id
	 @GeneratedValue(strategy= GenerationType.IDENTITY)
	private int id;
	
	private String product_name;
	private String barcode;
	private double mrp;
	private int brand_category;
	
	public int getId() {
		return id;
	}
	public void setId(int id) {
		this.id = id;
	}
	public String getProduct_name() {
		return product_name;
	}
	public void setProduct_name(String product_name) {
		this.product_name = product_name;
	}
	public String getBarcode() {
		return barcode;
	}
	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}
	public double getMrp() {
		return mrp;
	}
	public void setMrp(double mrp) {
		this.mrp = mrp;
	}
	public int getBrand_category() {
		return brand_category;
	}
	public void setBrand_category(int brand_category) {
		this.brand_category = brand_category;
	}

}
