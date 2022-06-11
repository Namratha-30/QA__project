package com.increff.employee.pojo;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.SequenceGenerator;

@Entity
public class OrderPojo {

    //Generate id from 1000
    @Id
    @GeneratedValue(strategy= GenerationType.SEQUENCE,generator = "orderIdSequence")
    @SequenceGenerator(name = "orderIdSequence",initialValue = 1000, allocationSize = 1, sequenceName = "orderId")
  
    private Integer id;
    private LocalDateTime datetime;
    private Boolean isInvoiceGenerated;
    
    public Integer getId() {
		return id;
	}
	public void setId(Integer id) {
		this.id = id;
	}
	public LocalDateTime getDatetime() {
		return datetime;
	}
	public void setDatetime(LocalDateTime datetime) {
		this.datetime = datetime;
	}
	public Boolean getIsInvoiceGenerated() {
		return isInvoiceGenerated;
	}
	public void setIsInvoiceGenerated(Boolean isInvoiceGenerated) {
		this.isInvoiceGenerated = isInvoiceGenerated;
	}
	
}
