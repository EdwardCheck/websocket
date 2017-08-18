/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.roger.model;

import java.util.ArrayList;
import java.util.List;


public class CisScreenPlayingSection {
    private int identify;
    private int beginningMilliseconds;
    private int endingMilliseconds;
    private int frameCount;
    private List<Integer> fullScreenFrameIDs;
    
	public CisScreenPlayingSection() {
		super();
		fullScreenFrameIDs = new ArrayList<Integer>();
	}

	public int getIdentify() {
		return identify;
	}

	public void setIdentify(int identify) {
		this.identify = identify;
	}

	public int getBeginningMilliseconds() {
		return beginningMilliseconds;
	}

	public void setBeginningMilliseconds(int beginningMilliseconds) {
		this.beginningMilliseconds = beginningMilliseconds;
	}

	public int getEndingMilliseconds() {
		return endingMilliseconds;
	}

	public void setEndingMilliseconds(int endingMilliseconds) {
		this.endingMilliseconds = endingMilliseconds;
	}

	public int getFrameCount() {
		return frameCount;
	}

	public void setFrameCount(int frameCount) {
		this.frameCount = frameCount;
	}

	public List<Integer> getFullScreenFrameIDs() {
		return fullScreenFrameIDs;
	}

	public void setFullScreenFrameIDs(List<Integer> fullScreenFrameIDs) {
		this.fullScreenFrameIDs = fullScreenFrameIDs;
	}
    
    
}
