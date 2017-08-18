package org.roger.model;

import java.util.ArrayList;
import java.util.List;

public class Agent {
	int age = 10;
	String name = "xiaoming";
	
	public int getAge() {
		return age;
	}

	public void setAge(int age) {
		this.age = age;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public List<Worker> getLi() {
		return li;
	}

	public void setLi(List<Worker> li) {
		this.li = li;
	}

	List<Worker> li = new ArrayList<Worker>();
	
	public Agent(int age, String name, List<Worker> li) {
		super();
		this.age = age;
		this.name = name;
		this.li = li;
	}
	
}
