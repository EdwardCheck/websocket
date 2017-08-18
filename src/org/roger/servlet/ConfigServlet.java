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
		// 初始化log4j日志组件
		initLogConfig(config);
	}

	private void initLogConfig(ServletConfig config) {
		String prifix = getServletContext().getRealPath("/");
		System.out.println("[prifix]" + prifix);

		// 获取log4j配置文件地址
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
			// 设置日志保存地址
			String logFile = prifix + Log4jFileSavePath + File.separator + "log4j.log";
			System.out.println("[logFile]" + logFile);
			props.setProperty("log4j.appender.dailyFile.File", logFile);
			PropertyConfigurator.configure(props); // 装入log4j配置信息
		} catch (IOException e) {
			e.printStackTrace();
		}
		System.out.println("***init log4j success***");
	}
}
