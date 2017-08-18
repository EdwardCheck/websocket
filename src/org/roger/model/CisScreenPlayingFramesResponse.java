/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.roger.model;

import java.util.ArrayList;
import java.util.List;


public class CisScreenPlayingFramesResponse {
    private int framesInvokeNumber;
    private int requestMonitorIdentify;
    private int sectionIdentify;
    private int startFrameIdentify;
    private int returnFramesCount;

    private List<CisScreenPlayingFrame> frames;

	public CisScreenPlayingFramesResponse() {
		super();
		frames = new ArrayList<CisScreenPlayingFrame>();
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

	public int getReturnFramesCount() {
		return returnFramesCount;
	}

	public void setReturnFramesCount(int returnFramesCount) {
		this.returnFramesCount = returnFramesCount;
	}

	public List<CisScreenPlayingFrame> getFrames() {
		return frames;
	}

	public void setFrames(List<CisScreenPlayingFrame> frames) {
		this.frames = frames;
	}
    
    
}
