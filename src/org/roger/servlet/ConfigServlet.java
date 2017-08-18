package org.roger.servlet;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

import org.apache.log4j.PropertyConfigurator;

public class ConfigServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;

	public void init(ServletConfig config) throws ServletException {
		super.init(config);
		// ��ʼ��log4j��־���
		initLogConfig(config);
	}

	private void initLogConfig(ServletConfig config) {
		String prifix = getServletContext().getRealPath("/");
		System.out.println("[prifix]" + prifix);

		// ��ȡlog4j�����ļ���ַ
		String Log4jFile = config.getInitParameter("Log4jFile");
		System.out.println("[Log4jFile]" + Log4jFile);

		String filePath = prifix + Log4jFile;
		System.out.println("[filePath]" + filePath);

		PropertyConfigurator.configure(filePath);
		Properties props = new Properties();
		try {
			String Log4jFileSavePath = config.getInitParameter("Log4jFileSavePath");
			System.out.println("[Log4jFileSavePath]" + Log4jFileSavePath);
			FileInputStream log4jStream = new FileInputStream(filePath);
			props.load(log4jStream);
			log4jStream.close();
			// ������־�����ַ
			String logFile = prifix + Log4jFileSavePath + File.separator + "log4j.log";
			System.out.println("[logFile]" + logFile);
			props.setProperty("log4j.appender.dailyFile.File", logFile);
			PropertyConfigurator.configure(props); // װ��log4j������Ϣ
		} catch (IOException e) {
			e.printStackTrace();
		}
		System.out.println("***init log4j success***");
	}
}
