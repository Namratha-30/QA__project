package com.increff.employee.model;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class InfoData {

    private String message;

    public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public InfoData() {
        message = "Activity time: " + LocalDateTime.now().toString();
    }
}
