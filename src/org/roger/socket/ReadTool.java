package org.roger.socket;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Base64;
import java.util.Base64.Encoder;



public class ReadTool {
	public static String read(File file) {
		FileInputStream fis = null;
		String str = null;
		try {
			fis = new FileInputStream(file);
			
			byte[] b = new byte[fis.available()];
			
			fis.read(b);
			Encoder e = Base64.getEncoder();
			 str = e.encodeToString(b);
			
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
//		System.out.println("data:image/png;base64," + str);
		return "data:image/png;base64," + str;
	}
	
	public static void main(String[] args) {
//		ReadTool t = new ReadTool();
//		File f = new File("E:\\Thinkit\\picturetest\\red.png");
//		t.read(f);
		
		String path = ReadTool.class.getResource("").getFile()+"monitor_0_grey_big.png";
		
		         // The Path is : /D:/workspace/java/target/classes/
	
		         System.out.println("The Path is : " + path);   

	}
}
