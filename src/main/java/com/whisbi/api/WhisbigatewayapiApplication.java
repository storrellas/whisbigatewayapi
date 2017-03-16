package com.whisbi.api;


import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;


@RestController
@SpringBootApplication
public class WhisbigatewayapiApplication {

    private static final Logger log = LoggerFactory.getLogger(WhisbigatewayapiApplication.class);
	
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
