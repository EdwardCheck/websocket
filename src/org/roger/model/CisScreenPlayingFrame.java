/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.roger.model;

import java.util.ArrayList;
import java.util.List;


public class CisScreenPlayingFrame {
    private int frameIdentify;
    private boolean isFullScreenFrame;
    private int beginningMilliseconds;
    private int endingMilliseconds;
    private List<CisScreenPlayingImage> images;
    
	public CisScreenPlayingFrame() {
		super();
		images = new ArrayList<CisScreenPlayingImage>();
	}

	public int getFrameIdentify() {
		return frameIdentify;
	}

	public void setFrameIdentify(int frameIdentify) {
		this.frameIdentify = frameIdentify;
	}

	public boolean isFullScreenFrame() {
		return isFullScreenFrame;
	}

	public void setFullScreenFrame(boolean isFullScreenFrame) {
		this.isFullScreenFrame = isFullScreenFrame;
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

	public List<CisScreenPlayingImage> getImages() {
		return images;
	}

	public void setImages(List<CisScreenPlayingImage> images) {
		this.images = images;
	}
    
	
}
