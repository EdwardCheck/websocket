/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.roger.model;



public class CisScreenPlayingFramesRequest {
    private int framesInvokeNumber;
    private int requestMonitorIdentify;
    private int sectionIdentify;
    private int startFrameIdentify;
    private int framesCount;
    
	public CisScreenPlayingFramesRequest() {
		super();
	}

	public int getFramesInvokeNumber() {
		return framesInvokeNumber;
	}

	public void setFramesInvokeNumber(int framesInvokeNumber) {
		this.framesInvokeNumber = framesInvokeNumber;
	}

	public int getRequestMonitorIdentify() {
		return requestMonitorIdentify;
	}

	public void setRequestMonitorIdentify(int requestMonitorIdentify) {
		this.requestMonitorIdentify = requestMonitorIdentify;
	}

	public int getSectionIdentify() {
		return sectionIdentify;
	}

	public void setSectionIdentify(int sectionIdentify) {
		this.sectionIdentify = sectionIdentify;
	}

	public int getStartFrameIdentify() {
		return startFrameIdentify;
	}

	public void setStartFrameIdentify(int startFrameIdentify) {
		this.startFrameIdentify = startFrameIdentify;
	}

	public int getFramesCount() {
		return framesCount;
	}

	public void setFramesCount(int framesCount) {
		this.framesCount = framesCount;
	}
    

}
