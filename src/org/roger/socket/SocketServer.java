package org.roger.socket;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URISyntaxException;
import java.nio.file.Paths;
import java.util.List;
import java.util.Random;
import java.util.concurrent.CopyOnWriteArraySet;

import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import org.apache.log4j.Logger;
import org.roger.model.CisHeaderMessage;
import org.roger.model.CisScreenPlayingBasicRequest;
import org.roger.model.CisScreenPlayingBasicResponse;
import org.roger.model.CisScreenPlayingFrame;
import org.roger.model.CisScreenPlayingFramesRequest;
import org.roger.model.CisScreenPlayingFramesResponse;
import org.roger.model.CisScreenPlayingImage;
import org.roger.model.CisScreenPlayingMonitor;
import org.roger.model.CisScreenPlayingSection;
import org.roger.tool.ReadFileTool;

import net.sf.json.JSONObject;

@ServerEndpoint(value = "/xiaoming")
public class SocketServer {
	private static Logger log = Logger.getLogger(SocketServer.class);

	// ��̬������������¼��ǰ������������Ӧ�ð�����Ƴ��̰߳�ȫ�ġ�
	private static int onlineCount = 0;

	// concurrent�����̰߳�ȫSet���������ÿ���ͻ��˶�Ӧ��MyWebSocket������Ҫʵ�ַ�����뵥һ�ͻ���ͨ�ŵĻ�������ʹ��Map����ţ�����Key����Ϊ�û���ʶ
	private static CopyOnWriteArraySet<SocketServer> webSocketSet = new CopyOnWriteArraySet<SocketServer>();

	// ��ĳ���ͻ��˵����ӻỰ����Ҫͨ���������ͻ��˷�������
	private Session session;

	private int seed1;
	private int seed2;
	private Random path1;
	private Random path2;
	private int snake_0_x;
	private int snake_0_y;
	private int snake_1_x;
	private int snake_1_y;
	private int snake_0_x_pre;
	private int snake_0_y_pre;
	private int snake_1_x_pre;
	private int snake_1_y_pre;
	private int currentStep;
	private String filePath;

	/**
	 * ���ӽ����ɹ����õķ���
	 * 
	 * @param session
	 *            ��ѡ�Ĳ�����sessionΪ��ĳ���ͻ��˵����ӻỰ����Ҫͨ���������ͻ��˷�������
	 */
	@OnOpen
	public void onOpen(Session session) {
		log.info("websocket���ӳɹ�...");
		try {
			filePath = Paths.get(this.getClass().getResource("").toURI()).toString();

			if (filePath.contains("\\")) {
				filePath += "\\";
			} else {
				filePath += "/";
			}
			log.info(filePath);
		} catch (URISyntaxException e) {
			// TODO Auto-generated catch block
			log.error(e.toString());
		}

		this.session = session;
		webSocketSet.add(this); // ����set��
		addOnlineCount(); // ��������1
		Random r = new Random();
		seed1 = r.nextInt(10000);
		seed2 = r.nextInt(5000);
		path1 = new Random(seed1);
		path2 = new Random(seed2);
		snake_0_x = 0;
		snake_0_y = 0;
		snake_1_x = 0;
		snake_1_y = 0;
		snake_0_x_pre = 0;
		snake_0_y_pre = 0;
		snake_1_x_pre = 0;
		snake_1_y_pre = 0;
		currentStep = 0;

		System.out.println("�������Ӽ��룡��ǰ��������Ϊ" + getOnlineCount());
	}

	/**
	 * ���ӹرյ��õķ���
	 */
	@OnClose
	public void onClose() {
		webSocketSet.remove(this); // ��set��ɾ��
		subOnlineCount(); // ��������1
		System.out.println("��һ���ӹرգ���ǰ��������Ϊ" + getOnlineCount());
		log.info("�ͻ������ӹر�...");
	}

	/**
	 * �յ��ͻ�����Ϣ����õķ���
	 * 
	 * @param message
	 *            �ͻ��˷��͹�������Ϣ
	 * @param session
	 *            ��ѡ�Ĳ���
	 */
	@OnMessage
	public void onMessage(String message, Session session) throws FileNotFoundException {
		CisScreenPlayingBasicRequest basicRequest = null;
		CisScreenPlayingFramesRequest framesRequest = null;

		JSONObject jobj = JSONObject.fromObject(message);
		log.info("[***onMessage***]" + message);

		System.out.println("[***onMessage***]" + message);

		try {
			basicRequest = (CisScreenPlayingBasicRequest) JSONObject.toBean(jobj, CisScreenPlayingBasicRequest.class);
			framesRequest = (CisScreenPlayingFramesRequest) JSONObject.toBean(jobj,
					CisScreenPlayingFramesRequest.class);

			if (basicRequest != null && basicRequest.getBasicInvokeNumber() != 0) {
				log.info("[***into BasicRequest***]");
				session.getBasicRemote()
						.sendText(JSONObject.fromObject(SimulateBasicResponse(basicRequest)).toString());
			} else {
				// framesRequest =
				// (CisScreenPlayingFramesRequest)JSONObject.toBean(jobj,
				// CisScreenPlayingFramesRequest.class);

				if (framesRequest != null && framesRequest.getFramesInvokeNumber() != 0) {
					log.info("[***into FrameRequest***]");
					session.getBasicRemote()
							.sendText(JSONObject.fromObject(SimulateFrameResponse(framesRequest)).toString());
				}
			}
		} catch (Exception e) {
			log.error(e);
		}

		// Ⱥ����Ϣ
		/*
		 * for(SocketServer item: webSocketSet){ try { session.getId(); Worker w
		 * = new Worker("worker"); List<Worker> li = new ArrayList<Worker>();
		 * li.add(w); Agent a = new Agent(10, "xiaoming", li); JSONObject jobj =
		 * JSONObject.fromObject(a); System.out.println("**: " +
		 * jobj.toString()); item.sendMessage(jobj.toString());
		 * //item.sendMessage(session.getId() + ": " + message);
		 * 
		 * } catch (Exception e) { e.printStackTrace(); continue; } }
		 */
	}

	/**
	 * ��������ʱ����
	 * 
	 * @param session
	 * @param error
	 */
	@OnError
	public void onError(Session session, Throwable error) {
		log.info("##SocketServer Error -" + error);
	}

	/**
	 * ������������漸��������һ����û����ע�⣬�Ǹ����Լ���Ҫ��ӵķ�����
	 * 
	 * @param message
	 * @throws IOException
	 */
	public void sendMessage(String message) throws IOException {

		this.session.getBasicRemote().sendText(message);
		// this.session.getAsyncRemote().sendText(message);
	}

	public static synchronized int getOnlineCount() {
		return onlineCount;
	}

	public static synchronized void addOnlineCount() {
		SocketServer.onlineCount++;
	}

	public static synchronized void subOnlineCount() {
		SocketServer.onlineCount--;
	}

	private void stepTo(int steps) {
		resetPos();
		while (steps > 0) {
			oneStep();
			steps--;
		}
	}

	private void oneStep() {
		snake_0_x_pre = snake_0_x;
		snake_0_y_pre = snake_0_y;
		snake_1_x_pre = snake_1_x;
		snake_1_y_pre = snake_1_y;

		int d1 = path1.nextInt(100);
		if (d1 >= 0 && d1 < 25) {
			// right
			if (snake_0_x == 9) {
				snake_0_x = 8;
			} else {
				snake_0_x++;
			}
		} else if (d1 >= 25 && d1 < 50) {
			// down
			if (snake_0_y == 9) {
				snake_0_y = 8;
			} else {
				snake_0_y++;
			}
		} else if (d1 >= 50 && d1 < 75) {
			// left
			if (snake_0_x == 0) {
				snake_0_x = 1;
			} else {
				snake_0_x--;
			}
		} else {
			// up
			if (snake_0_y == 0) {
				snake_0_y = 1;
			} else {
				snake_0_y--;
			}
		}

		int d2 = path2.nextInt(100);
		if (d2 >= 0 && d2 < 25) {
			// right
			if (snake_1_x == 9) {
				snake_1_x = 8;
			} else {
				snake_1_x++;
			}
		} else if (d2 >= 25 && d2 < 50) {
			// down
			if (snake_1_y == 9) {
				snake_1_y = 8;
			} else {
				snake_1_y++;
			}
		} else if (d2 >= 50 && d2 < 75) {
			// left
			if (snake_1_x == 0) {
				snake_1_x = 1;
			} else {
				snake_1_x--;
			}
		} else {
			// up
			if (snake_1_y == 0) {
				snake_1_y = 1;
			} else {
				snake_1_y--;
			}
		}

		currentStep++;
	}

	private void resetPos() {
		snake_0_x = 0;
		snake_0_y = 0;
		snake_1_x = 0;
		snake_1_y = 0;
		snake_0_x_pre = 0;
		snake_0_y_pre = 0;
		snake_1_x_pre = 0;
		snake_1_y_pre = 0;
		currentStep = 0;
	}

	public CisScreenPlayingBasicResponse SimulateBasicResponse(CisScreenPlayingBasicRequest basicRequest) {
		CisScreenPlayingBasicResponse basicResponse = new CisScreenPlayingBasicResponse();
		basicResponse.setBasicInvokeNumber(basicRequest.getBasicInvokeNumber());
		basicResponse.setReferenceNumber(basicRequest.getReferenceNumber());
		ReadFileTool tool = new ReadFileTool();
		CisHeaderMessage header = tool.getCisHeader(new File(filePath + "hj.cis"));
		basicResponse.setTotalDurationMilliseconds(header.getTotalTime());
		
		CisScreenPlayingMonitor monitor0 = new CisScreenPlayingMonitor();
		monitor0.setIdentify(0);
		monitor0.setWidth(header.getTotalWidth());
		monitor0.setHeight(header.getTotalHeight());
		monitor0.setX(0);
		monitor0.setY(0);

		CisScreenPlayingMonitor monitor1 = new CisScreenPlayingMonitor();
		monitor1.setIdentify(0);
		monitor1.setWidth(1920);
		monitor1.setHeight(1080);
		monitor1.setX(1300);
		monitor1.setY(0);
		
		basicResponse.getMonitors().add(monitor0);
		//basicResponse.getMonitors().add(monitor1);
		
		CisScreenPlayingSection section0 = new CisScreenPlayingSection();
		section0.setIdentify(0);
		section0.setBeginningMilliseconds(0);
		section0.setEndingMilliseconds(header.getTotalTime());
		section0.setFrameCount(header.getTotalFrame());
		
		CisScreenPlayingSection section1 = new CisScreenPlayingSection();
		section1.setIdentify(0);
		section1.setBeginningMilliseconds(2 * 60 * 1000);
		section1.setEndingMilliseconds(3 * 60 * 1000);
		section1.setFrameCount(60);

		basicResponse.getSections().add(section0);
		//basicResponse.getSections().add(section1);
		
		return basicResponse;
	}

	public CisScreenPlayingFramesResponse SimulateFrameResponse(CisScreenPlayingFramesRequest frameRequest) {
		log.info("[***SimulateFrameResponse start***]");
		CisScreenPlayingFramesResponse frameResponse = new CisScreenPlayingFramesResponse();
		frameResponse.setFramesInvokeNumber(frameRequest.getFramesInvokeNumber());//
		frameResponse.setSectionIdentify(frameRequest.getSectionIdentify());//����ֻ��0
		frameResponse.setStartFrameIdentify(frameRequest.getStartFrameIdentify());//��ʼ��֡
		frameResponse.setRequestMonitorIdentify(frameRequest.getRequestMonitorIdentify());//0/1/-1
		
		/*if (frameRequest.getStartFrameIdentify() != currentStep) {
			stepTo(frameRequest.getStartFrameIdentify());
		}*/
		
		int needFramesCount = frameRequest.getFramesCount();
		log.info("[***needFramesCount:" + needFramesCount + ";SectionIdentify:" + frameRequest.getSectionIdentify()
				+ ";RequestMonitorIdentify:" + frameRequest.getRequestMonitorIdentify() + " ***]");
		try {
			ReadFileTool tool = new ReadFileTool();
	    	List<CisScreenPlayingFrame> frames = tool.readFile(new File(filePath + "hj.cis"));
			while (needFramesCount > 0) {
				frameResponse.getFrames().add(frames.get(currentStep++));
						
//				oneStep();
				needFramesCount--;
			}
		} catch (Exception e) {
			log.error(e);
		}
		log.info("[***SimulateFrameResponse end***]");
		return frameResponse;
    }
    
    public CisScreenPlayingFrame getOneFrame(int sectionIdentify, int monitorIdentify) throws FileNotFoundException{
    	ReadFileTool tool = new ReadFileTool();
    	List<CisScreenPlayingFrame> frames = tool.readFile(new File(filePath + "hj.cis"));
    	return frames.get(currentStep);
    }
}
