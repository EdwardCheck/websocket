package org.roger.model;

public class Worker {
	String workname = "worker";
	

	public String getWorkname() {
		return workname;
	}


	public void setWorkname(String workname) {
		this.workname = workname;
	}


	public Worker(String workname) {
		super();
		this.workname = workname;
	}
	
}
