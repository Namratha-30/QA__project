package com.increff.employee.model;

public class OrderItemForm {
    private String barcode;
    
	private Integer quantity;
	
    private Double sp;
    public String getBarcode() {
		return barcode;
	}
	public void setBarcode(String barcode) {
		this.barcode = barcode;
	}
	public Integer getQuantity() {
		return quantity;
	}
	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
	public Double getSp() {
		return sp;
	}
	public void setSp(Double sp) {
		this.sp = sp;
	}

}