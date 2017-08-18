/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.roger.model;

import java.util.ArrayList;
import java.util.List;

public class CisScreenPlayingBasicResponse {
	private int basicInvokeNumber;
	private String referenceNumber;

	private int totalDurationMilliseconds;
    private List<CisScreenPlayingSection> sections;
    private List<CisScreenPlayingMonitor> monitors;
    
	public CisScreenPlayingBasicResponse() {
		super();
		sections = new ArrayList<CisScreenPlayingSection>();
		monitors = new ArrayList<CisScreenPlayingMonitor>();
	}

	public String getReferenceNumber() {
		return referenceNumber;
	}

	public void setReferenceNumber(String referenceNumber) {
		this.referenceNumber = referenceNumber;
	}

	public int getTotalDurationMilliseconds() {
		return totalDurationMilliseconds;
	}

	public void setTotalDurationMilliseconds(int totalDurationMilliseconds) {
		this.totalDurationMilliseconds = totalDurationMilliseconds;
	}

	public List<CisScreenPlayingSection> getSections() {
		return sections;
	}

	public void setSections(List<CisScreenPlayingSection> sections) {
		this.sections = sections;
	}

	public List<CisScreenPlayingMonitor> getMonitors() {
		return monitors;
	}

	public void setMonitors(List<CisScreenPlayingMonitor> monitors) {
		this.monitors = monitors;
	}

	public int getBasicInvokeNumber() {
		return basicInvokeNumber;
	}

	public void setBasicInvokeNumber(int basicInvokeNumber) {
		this.basicInvokeNumber = basicInvokeNumber;
	}
    
}
