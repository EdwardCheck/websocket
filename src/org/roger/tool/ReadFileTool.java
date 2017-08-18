package org.roger.tool;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.ByteBuffer;
import java.nio.ByteOrder;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import java.util.Base64.Encoder;
import java.util.zip.DataFormatException;
import java.util.zip.Inflater;

import org.roger.model.CisHeaderMessage;
import org.roger.model.CisScreenPlayingFrame;
import org.roger.model.CisScreenPlayingImage;

public class ReadFileTool {
	

	
	

	public ReadFileTool() {
		// TODO Auto-generated constructor stub
	}
	
	public CisHeaderMessage getCisHeader(File file) {
		CisHeaderMessage header = null;
		FileInputStream fis = null;
		int position = 0;
		try {
			header = new CisHeaderMessage();
			byte[] headBuffer = new byte[20];
			fis = new FileInputStream(file);
			fis.read(headBuffer, 0, 20);
			ByteBuffer byteBuffer = ByteBuffer.allocate(20);
			byteBuffer.order(ByteOrder.LITTLE_ENDIAN);
			byteBuffer.put(headBuffer);
			
			int totalTime = byteBuffer.getInt(position += 4);
			int totalFrame = byteBuffer.getInt(position += 4);
			int totalWidth = byteBuffer.getInt(position += 4);
			int totalHeight = byteBuffer.getInt(position += 4);
			header.setTotalFrame(totalFrame);
			header.setTotalHeight(totalHeight);
			header.setTotalTime(totalTime);
			header.setTotalWidth(totalWidth);
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			try {
				fis.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
		return header;
	}

	public List<CisScreenPlayingFrame> readFile(File file) {
		//int receivedLength = 0;
		int position = 0;
		List<CisScreenPlayingFrame> frames = null;
		FileInputStream fis = null;
		try {
			byte[] headBuffer = new byte[20];
			fis = new FileInputStream(file);
			fis.read(headBuffer, 0, 20);
			ByteBuffer byteBuffer = ByteBuffer.allocate(20);
			byteBuffer.order(ByteOrder.LITTLE_ENDIAN);
			byteBuffer.put(headBuffer);
			
			int totalTime = byteBuffer.getInt(position += 4);
			int totalFrame = byteBuffer.getInt(position += 4);
			int totalWidth = byteBuffer.getInt(position += 4);
			int totalHeight = byteBuffer.getInt(position += 4);
			
			byteBuffer.clear();
			CisScreenPlayingFrame lastFrame = new CisScreenPlayingFrame();
			frames = new ArrayList<CisScreenPlayingFrame>();
			int index = 0;
			int frameSize;
			int pictureNum;
			int currentFramTime;
			int deflateSize;
			int inflateSize;
			/**
			 * ¶ÁÈ¡Ã¿Ò»Ö¡µÄ·½·¨
			 */
			while (fis.available() > 0) {
				System.out.println("***********" + index);
				CisScreenPlayingFrame f = new CisScreenPlayingFrame();
				byte[] frameHeadBuffer = new byte[20];
				fis.read(frameHeadBuffer, 0, 20);
				byteBuffer.put(frameHeadBuffer);
				position = 0;

				frameSize = byteBuffer.getInt(position);
				pictureNum = byteBuffer.getInt(position += 4);
				currentFramTime = byteBuffer.getInt(position += 4);
				deflateSize = byteBuffer.getInt(position += 4);
				inflateSize = byteBuffer.getInt(position += 4);

				byte[] b = new byte[deflateSize];
				fis.read(b, 0, deflateSize);
				byte[] inflateData = decompression(b, inflateSize, deflateSize);

				if (index == 0) {
					f.setFullScreenFrame(true);
					f.setBeginningMilliseconds(currentFramTime);
					f.setFrameIdentify(index);
					List<CisScreenPlayingImage> imgs = getSmallPictures(inflateData, inflateSize, 0, totalHeight,
							totalWidth);
					f.setImages(imgs);
					lastFrame.setEndingMilliseconds(currentFramTime);
					lastFrame = f;
				} else {
					if (pictureNum == 0) {

						f.setFullScreenFrame(true);
						f.setBeginningMilliseconds(currentFramTime);
						f.setFrameIdentify(index);
						List<CisScreenPlayingImage> imgs = getSmallPictures(inflateData, inflateSize, 0, totalHeight,
								totalWidth);
						f.setImages(imgs);
						lastFrame.setEndingMilliseconds(currentFramTime);
						frames.add(lastFrame);
						lastFrame = f;
					} else if (pictureNum == -1) {
						f.setFullScreenFrame(false);
						f.setFrameIdentify(index);
						f.setBeginningMilliseconds(currentFramTime);
						f.setImages(null);
						lastFrame.setEndingMilliseconds(currentFramTime);
						frames.add(lastFrame);
						lastFrame = f;
					} else {
						f.setFullScreenFrame(false);
						f.setFrameIdentify(index);
						f.setBeginningMilliseconds(currentFramTime);
						List<CisScreenPlayingImage> imgs = getSmallPictures(inflateData, inflateSize, pictureNum, totalHeight,
								totalWidth);
						f.setImages(imgs);
						lastFrame.setEndingMilliseconds(currentFramTime);
						frames.add(lastFrame);
						lastFrame = f;
					}
				}

				
				position += deflateSize;
				index++;
				byteBuffer.clear();
			}
			frames.add(lastFrame);
			
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} finally {
			try {
				fis.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}

		return frames;
	}

	public byte[] decompression(byte[] data, int inflateSize, int deflateSize) {
		byte[] b = null;
		try {
			b = new byte[inflateSize];

			Inflater decompresser = new Inflater();
			decompresser.setInput(data, 0, deflateSize);
			int resultLength = decompresser.inflate(b);
			// System.out.println("resultLength: " + resultLength);
			decompresser.end();
		} catch (DataFormatException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		return b;
	}

	public List<CisScreenPlayingImage> getSmallPictures(byte[] inflatebyte, int inflateSize, int picNum,
			int screenHeight, int screenWidth) {
		List<CisScreenPlayingImage> imgs = new ArrayList<CisScreenPlayingImage>();

		if (picNum < 0) {
			imgs = null;
		} else if (picNum == 0) {
			CisScreenPlayingImage img = new CisScreenPlayingImage();
			img.setHeight(screenHeight);
			img.setWidth(screenWidth);
			img.setX(0);
			img.setY(0);
			img.setBase64Image(inflateByteToBase64String(inflatebyte));
			imgs.add(img);
		} else {
			int position = 0;
			ByteBuffer byteBuffer = ByteBuffer.allocate(inflateSize);
			byteBuffer.put(inflatebyte);
			byteBuffer.order(ByteOrder.LITTLE_ENDIAN);
			for (int i = 0; i < picNum; i++) {

				CisScreenPlayingImage img = new CisScreenPlayingImage();
				int picturesize = byteBuffer.getInt(position);
				System.out.println("smallpictureSize" + picturesize);
				int x_top_left_layer = byteBuffer.getInt(position += 4);
				int y_top_left_layer = byteBuffer.getInt(position += 4);
				int x_bottom_right_layer = byteBuffer.getInt(position += 4);
				int y_bottom_right_layer = byteBuffer.getInt(position += 4);
				img.setX(x_top_left_layer);
				img.setY(y_top_left_layer);
				position += 4;
				byte[] b = new byte[picturesize];
				System.arraycopy(inflatebyte, position, b, 0, picturesize);
				position += picturesize;
				img.setHeight(y_top_left_layer - y_bottom_right_layer);
				img.setWidth(x_bottom_right_layer - x_top_left_layer);
				img.setBase64Image(inflateByteToBase64String(b));
				imgs.add(img);

			}
		}

		return imgs;
	}

	public String inflateByteToBase64String(byte[] inflatebyte) {

		Encoder e = Base64.getEncoder();
		String str = e.encodeToString(inflatebyte);
		return "data:image/jpg;base64," + str;
	}

	public static void main(String[] args) {
		ReadFileTool p = new ReadFileTool();
		int size = p.readFile(new File("E:\\Test\\hj.cis")).size();
		System.out.println("size: " + size);
	}
}
