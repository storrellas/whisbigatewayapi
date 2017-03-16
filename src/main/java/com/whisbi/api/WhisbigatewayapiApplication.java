package com.whisbi.api;

import java.io.BufferedReader;
import java.io.IOException;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

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
    
    @RequestMapping(value="/api/login/", method=RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.OK)
    public String login(HttpServletRequest request) 
    {
    	log.info("Request URL: " + request.getRequestURL().toString() + " " + request.getQueryString());
    	log.info("Request URL: " + request.getRequestURL().toString() + " " + getBody(request));
    	//log.info("Request URL: " + request.getRequestURL().toString() + " " + agent_id.toString());
   	
    	
    	
    	// Login request to LM
    	ObjectMapper mapper = new ObjectMapper();
    	ObjectNode login_event = mapper.createObjectNode();
    	login_event.put("event", "login");
    	login_event.put("agent_id", "587A179B-7097-46EC-B2E8-89D435975252");
        RestTemplate restTemplate = new RestTemplate();      
        String str = restTemplate.postForObject("http://localhost:8011/", login_event, String.class);
        //log.info(str);
          	    	
    	return str;
    }
    

    
	public static void main(String[] args) {
		SpringApplication.run(WhisbigatewayapiApplication.class, args);
	}
}
