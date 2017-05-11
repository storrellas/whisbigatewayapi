
function WhisbiAPIClientJSONP(){

  // Default value for lead result
  this.lead_result_default = 1007;

  // // For MySQL
  // this.user_id = "C2729F6D-8A4F-49A6-8ED5-819A617AA7E4"
  // this.vacenter_id = "A311DC47-FC05-4856-B850-54F15EC8F40F"
  //this.branch = "23290b6d-693b-44c3-9dd1-f4fef0b5c9a3"
  //this.phone = "+34910800161"

  // For Pre
  this.user_id = "587A179B-7097-46EC-B2E8-89D435975252"
  this.vacenter_id = "23290b6d-693b-44c3-9dd1-f4fef0b5c9a3"
  this.branch = "23290b6d-693b-44c3-9dd1-f4fef0b5c9a3"
  this.campaign = "23290b6d-693b-44c3-9dd1-f4fef0b5c9a3"
  this.branchgroup_whisbinar = "7B0B914F-2A90-4472-B336-1CB65D78CF23"

  this.room_obj = {
    "room_content":[
      {
        "id":0,
        "type":2,
        "chat":[
        ]
      },
      {
        "id":1,
        "type":1,
        "camera_on":true
      },
      {
        "id":2,
        "type":0,
        "mode":0,
        "slide_position":[
          0],
        "current_cam":0,
        "glass_streaming":"",
        "file_tree":{
          "255e1ffd-ea00-4432-b358-3581e5af09ec":{
            "url":"//static.whisbi.com/PrivateResources/255e1ffd-ea00-4432-b358-3581e5af09ec.jpg",
            "ext":"jpg",
            "name":"Porsche Pr",
            "children":{
            },
            "tree_key":[
            ]
          }
        },
        "total_cams":0
      }],
    "viewers":{
      "count":0,
      "elements":[
      ]
    },
    "max_viewers":1000,
    "chat_blocked_words":{
      "chat_blocked_words":{
        "content":[
        ],
        "customer_guid":""
      }
    }
  }

  this.update_pod = {
    "id":0,
    "type":2,
    "chat":[
      {
        "type":0,
        "source":0,
        "source_id":1649760492,
        "source_name":"",
        "content":"mycontent",
        "file_content":{
          "name":"",
          "url":""
        }
      }],
    "chat_blocked_words":{
      "content":[
      ],
      "customer_guid":""
    }
  }

  this.user_info = {
    "name"           :  "test",
    "like"           :  true,
    "ban"            :  false,
    "writing"        :  true,
    "session_rate"   :  2,
    "presenter_rate" :  2
  }

  // Retrieved variables from responses
  this.pin;
  this.login_session;
  this.vateam = {}
  this.lead_guid;
  this.session_guid;

  this.user_gari_id = "";
  this.agent_gari_id = "";
  this.viewer_gari_id = "";
  this.presenter_gari_id = "";
  this.alpha_pin;
  this.alpha_token;

  // Getting private key
  this.private_key;
  this.api_key = "123";
  this.token_landing;
  this.token_desktop;
  var api = this;
  $.ajax("/token/jsonp/" + this.api_key + "/", {
      jsonp: 'callback',
      dataType: 'jsonp',
      data: {
          branch : this.branch
      }
  }).then(function(response) {
      Logger.info("Getting token ... ");
      api.token_landing = response.token;
      Logger.info(JSON.stringify(response));
  });


}

// ---------------------------
// AGENTS
// ---------------------------

/**
* Requests get_login
*/
WhisbiAPIClientJSONP.prototype.request_login = function(callback){
  Logger.info("Perform 'login' ...");
  var api = this;
  $.ajax("/api/jsonp/agents/" + this.user_id+ "/", {
      jsonp: 'callback',
      dataType: 'jsonp',
      data: {
          action: 'login'
      }
  }).then(function(response) {
      api.login_session = response.session;
      api.token_desktop = response.token;

      // Call callback for login
      callback( response )

      // Store to recover guid
      $.each(response.vateams, function(index, item){
        api.vateam[item.name] = item.guid
      })
      Logger.info(JSON.stringify(response));
  });
}

/**
* Requests get_vateams
*/
WhisbiAPIClientJSONP.prototype.request_get_vateams = function(){
  Logger.info("Perform 'get_vateams' ...");
  $.ajax("/api/jsonp/agents/" + this.user_id+ "/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
         'jwt_token' : this.token_desktop,
         'action'   : 'get_vateams',
         'vacenter' : this.vacenter_id
     },
  }).then(function(response) {
     Logger.info(JSON.stringify(response));
  });
}

/**
* Requests alive
*/
WhisbiAPIClientJSONP.prototype.request_alive = function(){
  Logger.info("Perform 'alive' ...");
  $.ajax("/api/jsonp/agents/" + this.user_id+ "/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
         'jwt_token' : this.token_desktop,
         'action'  : 'alive'
     },
  }).then(function(response) {
     Logger.info(JSON.stringify(response));
  });
}

/**
* Requests Check VATeam
*/
WhisbiAPIClientJSONP.prototype.request_check_vateam = function( action, vateam_name ){
  Logger.info("Perform 'check_vateam' ...");

  $.ajax("/api/jsonp/agents/" + this.user_id+ "/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
         'jwt_token' : this.token_desktop,
         'action'  : action,
         'vateam'  : this.vateam[vateam_name]
     },
  }).then(function(response) {
     Logger.info(JSON.stringify(response));
  });

}

/**
* Requests Logout
*/
WhisbiAPIClientJSONP.prototype.request_logout = function(callback){
  Logger.info("Perform 'logout' ..." +  this.token_desktop);
  $.ajax("/api/jsonp/agents/" + this.user_id+ "/", {
      jsonp: 'callback',
      dataType: 'jsonp',
      data: {
         'jwt_token' : this.token_desktop,
         'action'    : 'logout'
      },
  }).then(function(response) {
      // Call callback for login
      callback( response )
      Logger.info(JSON.stringify(response));
  });
}

/**
* Requests Change Status
*/
WhisbiAPIClientJSONP.prototype.request_change_status = function(status){
  Logger.info("Perform 'change_status' ...");

  $.ajax("/api/jsonp/agents/" + this.user_id+ "/", {
      jsonp: 'callback',
      dataType: 'jsonp',
      data: {
          'jwt_token' : this.token_desktop,
          'action'  : 'change_status',
          'status'  : status
      },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });

}

// ---------------------------
// LEADS
// ---------------------------

/**
* Get Queued Leads
*/
WhisbiAPIClientJSONP.prototype.request_get_queued_leads = function(vateam_name){
  Logger.info("Perform 'get_queued_leads' ...");
  var api = this;
  $.ajax("/api/jsonp/leads/", {
      jsonp: 'callback',
      dataType: 'jsonp',
      data: {
          'jwt_token' : this.token_desktop,
          'vagroup'  : this.vateam[vateam_name],
          'agent'    : this.user_id
      },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });

}

// ---------------------------
// DDIs
// ---------------------------

/**
* Get Inbound DDIs
*/
WhisbiAPIClientJSONP.prototype.request_get_inbound_ddis = function(){
  Logger.info("Perform 'get_queued_leads' with JSONP ...");
  var api = this;
  $.ajax("/api/jsonp/ddis/", {
      jsonp: 'callback',
      dataType: 'jsonp',
      data: {
          'jwt_token' : this.token_landing,
          'branch'    : this.branch
      },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });
}


// ---------------------------
// SESSIONS
// ---------------------------


/**
* Get Results
*/
WhisbiAPIClientJSONP.prototype.request_get_results = function(locator, beeper){
  Logger.info("Perform 'get_results' ...");
  var api = this;
  $.ajax("/api/jsonp/sessions/results/", {
      jsonp: 'callback',
      dataType: 'jsonp',
      data: {
          'jwt_token' : this.token_desktop,
          'campaign'  : this.campaign
      },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });
}

/**
* Open Session
*/
WhisbiAPIClientJSONP.prototype.request_open_session = function(locator, beeper, callback){
  Logger.info("Perform 'open_session' ...");

  var params = {
      "locator"  : locator,
      "beeper"   : beeper
  }
  var api = this;
  $.ajax("/api/jsonp/sessions/", {
      jsonp: 'callback',
      dataType: 'jsonp',
      data: {
          'jwt_token' : this.token_desktop,
          'action'  : 'open_session',
          'locator' : locator,
          'beeper'  : beeper
      },
  }).then(function(response) {
      api.lead_guid = response.lead.lead_guid;
      api.session_guid = response.lead.session;
      callback(response)
      Logger.info(JSON.stringify(response));
  });

}

/**
* Go alpha
*/
WhisbiAPIClientJSONP.prototype.request_go_alpha = function(locator, callback){
  Logger.info("Perform 'go_alpha' ...");
  var api = this;
  $.ajax("/api/jsonp/sessions/", {
      jsonp: 'callback',
      dataType: 'jsonp',
      data: {
          'jwt_token' : this.token_desktop,
          'action'  : 'open_alpha',
          'locator' : locator
      },
  }).then(function(response) {
      api.lead_guid = response.lead.lead_guid;
      api.session_guid = response.lead.session;
      callback(response)
      Logger.info(JSON.stringify(response));
  });

}

/**
* Free Session Resources
*/
WhisbiAPIClientJSONP.prototype.request_free_session_resources = function(){
  Logger.info("Perform 'free_session_resources' ...");
  $.ajax("/api/jsonp/sessions/" + this.lead_guid + "/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
         'jwt_token' : this.token_desktop,
         'action'     : 'free_session_resources'
     },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });

}

/**
* Send Quiz
*/
WhisbiAPIClientJSONP.prototype.request_send_quiz = function(){
  Logger.info("Perform 'send_quiz' ...");
  var params = {
      'jwt_token' : this.token_landing,
      'action'  : 'quiz',
      'quiz'    : [0,1,2,3,4,5]
  }

  $.ajax("/api/jsonp/sessions/" + this.lead_guid + "/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: params,
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });
}

/**
* Set Result
*/
WhisbiAPIClientJSONP.prototype.request_set_result = function(callback){
  Logger.info("Perform 'set_result' ...");
  $.ajax("/api/jsonp/sessions/" + this.lead_guid + "/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
         'jwt_token' : this.token_desktop,
         'action'     : 'set_result',
         'lead_result': this.lead_result_default
     },
  }).then(function(response) {
      callback(response)
      Logger.info(JSON.stringify(response));
  });
}


/**
* Requests alive lead
*/
WhisbiAPIClientJSONP.prototype.request_alive_lead = function(){
  Logger.info("Perform 'alive_lead' ...");
  $.ajax("/api/jsonp/sessions/" + this.lead_guid + "/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
         'jwt_token' : this.token_desktop,
         'action'     : 'alive'
     },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });

}

/**
  * Requests alive branchgroup (whisbinar)
  */
WhisbiAPIClientJSONP.prototype.request_alive_branchgroup = function(){
  Logger.info("Perform 'alive_lead' ...");
  $.ajax("/api/jsonp/sessions/O2M/" + this.branchgroup_whisbinar + "/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
       'jwt_token' : this.token_desktop,
     },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });


}

/**
* Request Lead
*/
WhisbiAPIClientJSONP.prototype.request_lead = function(type, phone, seed){
  Logger.info("Perform 'request_lead' ...");
  var params = {
      'jwt_token' : this.token_landing,
      'action'  : 'requestlead',
      'type' : type,
      'branch' : this.branch,
      'phone' : phone,
      'country' : 'ES',
      'name' : 'dummy name'
  }
  if( seed != "" )
    params['seed'] = seed
  $.ajax("/api/jsonp/sessions/", {
      jsonp: 'callback',
      dataType: 'jsonp',
      data: params,
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });
}

/**
  * Create Lead
  */
WhisbiAPIClientJSONP.prototype.request_create_lead = function(phone, vateam_name, seed){
  Logger.info("Perform 'create_lead' ...");
  var api = this;
  var params = {
      "jwt_token" : this.token_desktop,
      "action" : "requestlead",
      "only_create_lead" : true,
      "seed" : seed,
      "phone" : phone,
      "country" : "ES",
      "name" : "dummy name",
      "campaign" : this.campaign,
      "vagroup" : this.vateam[vateam_name]
  }
  $.ajax("/api/jsonp/sessions/", {
      jsonp: 'callback',
      dataType: 'jsonp',
      data: params,
  }).then(function(response) {
      api.lead_guid = response.lead.lead_guid;
      api.session_guid = response.lead.session;
      Logger.info(JSON.stringify(response));
  });

}


/**
* Request Lead
*/
WhisbiAPIClientJSONP.prototype.request_match_kpi_session = function(kpiguid){
  Logger.info("Perform 'match_kpi_session' ...");

  var params = {
      "jwt_token" : this.token_desktop,
      "action"  : "match_kpi_session",
      "kpiguid" : kpiguid,
      "phonecountry" : "ES",
      "phonetype" : "fixed",
      "session" : this.session_guid,

      "cookieguid" : "23290b6d-693b-44c3-9dd1-f4fef0b5c9a3",
      "useragent" : "23290b6d-693b-44c3-9dd1-f4fef0b5c9a3",
      "clientbrowser" : "browser",
      "clientdevice" : "clientdevice",
      "clientos" : "clientos",
      "clientlanguage" : "es",
      "screenw"  : "2",
      "screenh"  : "3",
      "clientip" : "clientip",
      "country"  : "country",
      "referrer" : "referrer",
      "adwords"  : "adwords"
  }

  $.ajax("/api/jsonp/sessions/" + this.lead_guid + "/", {
      jsonp: 'callback',
      dataType: 'jsonp',
      data: params,
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });
}


/**
* Request Create Lead Whisbinar
*/
WhisbiAPIClientJSONP.prototype.request_create_lead_whisbinar = function(seed, branchgroup, callback){
  Logger.info("Perform 'create_lead' for whisbinar ...");
  var api = this;
  $.ajax("/api/jsonp/sessions/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
         'jwt_token'     : this.token_desktop,
         'action'        : 'create_whisbinar',
         "seed"          : seed,
         "branchgroup"   : this.branchgroup_whisbinar,
         "title"         : "O2M title",
         "description"   : "O2M description"
     },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
      api.session_guid = response.whisbinar.guid
      api.lead_guid = response.whisbinar.guid
      callback(response)
  });

}

/**
* Request Close Lead Whisbinar
*/
WhisbiAPIClientJSONP.prototype.request_close_lead_whisbinar = function(callback){
   Logger.info("Perform 'close' for whisbinar ...");
   $.ajax("/api/jsonp/sessions/" + this.lead_guid  + "/", {
      jsonp: 'callback',
      dataType: 'jsonp',
      data: {
          'jwt_token'     : this.token_desktop,
          'action'        : 'close',
      },
   }).then(function(response) {
       Logger.info(JSON.stringify(response));
       callback(response)
   });
}

/**
* Request Call Third
*/
WhisbiAPIClientJSONP.prototype.request_call_third = function(third_phone){
  Logger.info("Perform 'call_third' ...");
  $.ajax("/api/jsonp/sessions/" + this.lead_guid + "/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
         'jwt_token'     : this.token_desktop,
         'action'        : 'call_third',
         'third_phone'   : third_phone,
         'third_phone_country'   : 'ES'
     },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });

}

/**
* Request Switch Speaker
*/
WhisbiAPIClientJSONP.prototype.request_switch_speaker = function(type){
  Logger.info("Perform 'switch_speaker' ...");
  $.ajax("/api/jsonp/sessions/" + this.lead_guid + "/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
         'jwt_token'     : this.token_desktop,
         'action'        : 'switch_speaker',
         'type'          : type
     },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });


}

/**
* Request Redirect Third
*/
WhisbiAPIClientJSONP.prototype.request_redirect_third = function(){
  Logger.info("Perform 'redirect_third' ...");
  $.ajax("/api/jsonp/sessions/" + this.lead_guid + "/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
         'jwt_token'     : this.token_desktop,
         'action'        : 'redirect_third',
     },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });

}

/**
* Request IV New Session
*/
WhisbiAPIClientJSONP.prototype.request_iv_new_session = function(callback){
  Logger.info("Perform 'iv_new_session' ...");
  var api = this;
  $.ajax("/api/jsonp/pins/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
         'jwt_token'     : this.token_landing,
         'action'     : 'new',
         'branch'     : this.branch
     },
  }).then(function(response) {
      api.pin = response.return.pin
      callback(response)
      Logger.info(JSON.stringify(response));
  });
}

/**
* Request IV Flag
*/
WhisbiAPIClientJSONP.prototype.request_iv_flag = function(){
  Logger.info("Perform 'iv_flag' ...");


  $.ajax("/api/jsonp/pins/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
         'jwt_token'     : this.token_landing,
         'action'     : 'alive',
         'pin'        : this.pin
     },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });
}

/**
* Request Schedule Session
*/
WhisbiAPIClientJSONP.prototype.request_schedule_session = function(sched_datetime, sched_phone){
  Logger.info("Perform 'schedule_session' ...");

  var params = {
      "jwt_token"             : this.token_desktop,
      "action"                : "schedule_session",
      "sched_datetime"        : sched_datetime,
      "sched_phone"           : sched_phone,
      "sched_phone_country"   : "ES",
   }
  $.ajax("/api/jsonp/sessions/" + this.lead_guid + "/" , {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: params,
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });

}


/**
* Request Search DB Leads
*/
WhisbiAPIClientJSONP.prototype.request_search_db_lead = function(locator){
  Logger.info("Perform 'search_db_leads' ...");
  var api = this;

  $.ajax("/api/jsonp/leads/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
       "jwt_token" : this.token_desktop,
       "locator"   : locator
     },
  }).then(function(response) {
      api.lead_guid = response.leads[0].lead_guid;
      api.session_guid = response.leads[0].session;
      Logger.info(JSON.stringify(response));
  });
}

/**
* Request Load DB Leads
*/
WhisbiAPIClientJSONP.prototype.request_load_db_lead = function(callback){
  Logger.info("Perform 'load_db_lead' ...");
  var params = {
      "action"     : "load_db_lead",
      "lead_guid"  : this.lead_guid
  }
  var api = this;
  $.ajax("/api/jsonp/sessions/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
       "jwt_token" : this.token_desktop,
       "action"     : "load_db_lead",
       "lead_guid"  : this.lead_guid
     },
  }).then(function(response) {
      callback(result)
      Logger.info(JSON.stringify(response));
  });
}

// ---------------------------
// ROOMS
// ---------------------------

/**
* Request Create Seed
*/
WhisbiAPIClientJSONP.prototype.request_create_seed = function(room_seed){
  Logger.info("Perform 'create' seed ...");
  $.ajax("/api/jsonp/room/seeds/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
       'jwt_token'     : this.token_landing,
        "action": "create",
        "seed": room_seed,
        "room_obj": JSON.stringify(this.room_obj)
      },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });
}

/**
* Request Update Seed
*/
WhisbiAPIClientJSONP.prototype.request_update_seed = function(room_seed){
  Logger.info("Perform 'update' seed ...");
  $.ajax("/api/jsonp/room/seeds/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
       'jwt_token'     : this.token_landing,
        "action": "update",
        "seed": room_seed,
        "room_obj": JSON.stringify(this.room_obj)
      },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });

}

/**
* Request Read Seed
*/
WhisbiAPIClientJSONP.prototype.request_read_seed = function(room_seed){
  Logger.info("Perform 'read' seed ...");
  $.ajax("/api/jsonp/room/seeds/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
       'jwt_token'     : this.token_landing,
        "action": "read",
        "seed": room_seed
      },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });
}

/**
* Request Delete Seed
*/
WhisbiAPIClientJSONP.prototype.request_delete_seed = function(room_seed){
  Logger.info("Perform 'delete' seed ...");
  $.ajax("/api/jsonp/room/seeds/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
       'jwt_token'     : this.token_landing,
        "action": "delete",
        "seed": room_seed
      },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });

}


/**
* Request Create User in Room
*/
WhisbiAPIClientJSONP.prototype.request_create_user_in_room = function(type, callback){
  Logger.info("Perform 'read' room to create user ...");
  var api = this;
  $.ajax("/api/jsonp/room/" + this.session_guid + "/user/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
       'jwt_token'     : this.token_landing,
        "action": "create_user",
        "user_type": type
      },
  }).then(function(response) {
      switch(type){
        case "user":api.user_gari_id = response.user_id;
        break;
        case "agent":api.agent_gari_id = response.user_id;
        break;
        case "viewer":api.viewer_gari_id = response.user_id;
        break;
        case "presenter":api.presenter_gari_id = response.user_id;
        break;
      }
      callback(response)
      Logger.info(JSON.stringify(response));
  });
}

/**
* Request Update Room
*/
WhisbiAPIClientJSONP.prototype.request_update_room = function(user_id){
  Logger.info("Perform 'update' room ...");
  $.ajax("/api/jsonp/room/" + this.session_guid + "/user/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
       'jwt_token'     : this.token_landing,
        "action": "update",
        "user"   : user_id,
        "pod_obj": JSON.stringify(this.update_pod)
      },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });

}

/**
* Request Update Room
*/
WhisbiAPIClientJSONP.prototype.request_update_user_info = function(user_id){
  Logger.info("Perform 'update_user_info' room ...");
  $.ajax("/api/jsonp/room/" + this.session_guid + "/user/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
       'jwt_token'  : this.token_landing,
        "action"    : "update_user_info",
        "user"      : user_id,
        "user_info"   : JSON.stringify(this.user_info)
      },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });

}

/**
* Request Read Room
*/
WhisbiAPIClientJSONP.prototype.request_read_room = function(user_id){
  Logger.info("Perform 'read' room ...");
  $.ajax("/api/jsonp/room/" + this.session_guid + "/user/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
       'jwt_token'     : this.token_landing,
        "action": "read",
        "user": user_id
      },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });
}


/**
* Request Send KPI
*/
WhisbiAPIClientJSONP.prototype.request_send_kpi = function(cookieguid, kpiguid){
  Logger.info("Perform 'send_kpi' room ...");

 var guid =  generate_random_guid();
 $.ajax("/api/jsonp/kpis/", {
    jsonp: 'callback',
    dataType: 'jsonp',
    data: {
        'jwt_token'     : this.token_landing,
        'guid'       : guid,
        'cookieguid' : cookieguid,
        'kpiguid'    : kpiguid,
        'branch'        : this.branch,
        'clientbrowser' : 'foo',
        'computer'      : 'bar',
        'clientos'      : 'os'
    },
 }).then(function(response) {
     Logger.info(JSON.stringify(response));
 });



}

// ---------------------------
// Teams
// ---------------------------

/**
* Get Availability
*/
WhisbiAPIClientJSONP.prototype.request_get_availability = function(){
  Logger.info("Perform 'get_availability' ...");
  var api = this;
  $.ajax("/api/jsonp/agents/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
         'jwt_token'     : this.token_landing,
         'branch'     : this.branch
     },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });

}

// ---------------------------
// Alphas
// ---------------------------

/**
* New Alpha
*/
WhisbiAPIClientJSONP.prototype.request_new_alpha = function(cookieguid, kpiguid, callback){
  Logger.info("Perform 'new_alpha' ...");
  var api = this;
  $.ajax("/api/jsonp/alphas/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
         'jwt_token'     : this.token_landing,
         'action'     : 'new',
         'cookieguid' : cookieguid,
         'kpiguid'    : kpiguid,
         'branch'     : this.branch
     },
  }).then(function(response) {
      api.alpha_pin = response.alpha
      api.alpha_token = response.token
      callback(response)
      Logger.info(JSON.stringify(response));
  });

}


/**
* Alpha Status
*/
WhisbiAPIClientJSONP.prototype.request_alpha_status = function(){
  Logger.info("Perform 'alpha_status' ...");
  var api = this;
  $.ajax("/api/jsonp/alphas/", {
     jsonp: 'callback',
     dataType: 'jsonp',
     data: {
         'jwt_token'     : this.token_landing,
         'action'     : 'alive',
         'alpha'      : this.alpha_pin,
         'token'      : this.alpha_token,
     },
  }).then(function(response) {
      Logger.info(JSON.stringify(response));
  });
}
