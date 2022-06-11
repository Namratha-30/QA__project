package com.increff.employee.model;

public class OrderData {
    private Integer id;
    private String datetime;
    private Boolean isInvoiceGenerated;
	public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public String getDatetime() {
		return datetime;
	}
	public void setDatetime(String datetime) {
		this.datetime = datetime;
	}
	public Boolean getIsInvoiceGenerated() {
		return isInvoiceGenerated;
	}
	public void setIsInvoiceGenerated(Boolean isInvoiceGenerated) {
		this.isInvoiceGenerated = isInvoiceGenerated;
	}
}
