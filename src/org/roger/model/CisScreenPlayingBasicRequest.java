package org.roger.model;

public class CisScreenPlayingBasicRequest {
	public CisScreenPlayingBasicRequest() {
		super();
	}
	
	private int basicInvokeNumber;
	private String referenceNumber;

	public void setReferenceNumber(String referenceNumber) {
		this.referenceNumber = referenceNumber;
	}

	public String getReferenceNumber() {
		return referenceNumber;
	}

	public int getBasicInvokeNumber() {
		return basicInvokeNumber;
	}

	public void setBasicInvokeNumber(int basicInvokeNumber) {
		this.basicInvokeNumber = basicInvokeNumber;
	}
}
