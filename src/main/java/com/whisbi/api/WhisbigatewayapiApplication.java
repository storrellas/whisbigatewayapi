package com.whisbi.api;

import java.io.BufferedReader;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;


@RestController
@SpringBootApplication
public class WhisbigatewayapiApplication {

    private static final Logger log = LoggerFactory.getLogger(WhisbigatewayapiApplication.class);
	
    
    private String getBody(HttpServletRequest request) {
	  String body = "";
	  if (request.getMethod().equals("POST") )
	  {
	    StringBuilder sb = new StringBuilder();
	    BufferedReader bufferedReader = null;
	
	    try {
	      bufferedReader =  request.getReader();
	      char[] charBuffer = new char[128];
	      int bytesRead;
	      while ((bytesRead = bufferedReader.read(charBuffer)) != -1) {
	        sb.append(charBuffer, 0, bytesRead);
	      }
	    } catch (IOException ex) {
	      // swallow silently -- can't get body, won't
	    } finally {
	      if (bufferedReader != null) {
	        try {
	          bufferedReader.close();
	        } catch (IOException ex) {
	          // swallow silently -- can't get body, won't
	        }
	      }
	    }
	    body = sb.toString();
	  }
	  return body;
	}
    
    /*
    curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST 
    -d '{"agent_id":"587A179B-7097-46EC-B2E8-89D435975252"}' 
    http://localhost:8080/api/login/
    */
    public static class EventLogin{
		public String event = "login";
		public String agent_id;
    }   
	@RequestMapping(value = "/api/login/", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.OK)
	public String login(@RequestBody EventLogin event_login, HttpServletRequest request) {
		log.info("Body: " + event_login.agent_id);
		
		// Login request to LM 
		RestTemplate restTemplate = new RestTemplate(); 
		String str = restTemplate.postForObject("http://localhost:8011/", event_login, String.class); 
		log.info(str);
		return str;
	}
    

    /*
	curl -i -H "Accept: application/json" -H "Content-Type: application/json" -X POST 
	-d '{"agent_id":"587A179B-7097-46EC-B2E8-89D435975252", "session":"3a7773a8-3a13-489d-adac-561057e922cb"}' 
	http://localhost:8080/api/logout/
    */
    public static class EventLogout{
		public String event = "logout";
		public String agent_id;
		public String session;
    }
	@RequestMapping(value = "/api/logout/", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.OK)
	public String logout(@RequestBody EventLogout event_logout, HttpServletRequest request) {
		log.info("Body: " + event_logout.agent_id + " " + event_logout.session);
				
		// Login request to LM 
		RestTemplate restTemplate = new RestTemplate(); 
		String str = restTemplate.postForObject("http://localhost:8011/", event_logout, String.class); 
		log.info(str);
		return str;
	}

    
	public static void main(String[] args) {
		SpringApplication.run(WhisbigatewayapiApplication.class, args);
	}
}
