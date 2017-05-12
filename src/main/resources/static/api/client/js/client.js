
function WhisbiAPIClient(){

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
  var params = {
        'user_id' : this.user_id,
        'branch'  : this.branch
  };
  $.ajax({
      async: false,
      url:  "/token/" + this.api_key,
      timeout: 4000,
      type : 'POST',
      data : params,
      success: function(result) {
        Logger.info("Getting token ... ");
        api.token_landing = result.token;
        /*
          Logger.info("Getting token ... ");
          api.private_key = result
        /**/
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });


}

// ---------------------------
// AGENTS
// ---------------------------

/**
* Requests get_login
*/
WhisbiAPIClient.prototype.request_login = function(callback){
  Logger.info("Perform 'login' ...");
  var api = this;
  $.ajax({
      async: false,
      url:  "/api/agents/" + this.user_id+ "/",
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token" : this.token_landing
      },
      data : {
        "action": "login"
      },
      success: function(result) {
          response = JSON.stringify(result);
          api.login_session = result.session;
          api.token_desktop = result.token;
          // Call callback for login
          callback( result )



          // Store to recover guid
          $.each(result.vateams, function(index, item){
            api.vateam[item.name] = item.guid
          })

          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });

}

/**
* Requests get_vateams
*/
WhisbiAPIClient.prototype.request_get_vateams = function(){
  Logger.info("Perform 'get_vateams' ...");

  var params = {
      "action": "get_vateams",
      "vacenter"  : this.vacenter_id
  }
  $.ajax({
      async: false,
      url: "/api/agents/" + this.user_id + "/",
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token" : this.token_desktop
      },
      data: params,
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });

}

/**
* Requests alive
*/
WhisbiAPIClient.prototype.request_alive = function(){
  Logger.info("Perform 'alive' ...");
  $.ajax({
      async: false,
      url: "/api/agents/" + this.user_id+ "/",
      timeout: 4000,
      type : 'GET',
      headers :{
        "token" : this.token_desktop
      },
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Requests Check VATeam
*/
WhisbiAPIClient.prototype.request_check_vateam = function( action, vateam_name ){
 Logger.info("Perform 'check_vateam' ...");

 var params = {
     "action" : action,
     "vateam"  : this.vateam[vateam_name]
 }
 $.ajax({
     async: false,
     url:  "/api/agents/" + this.user_id+ "/",
     timeout: 4000,
     type : 'PUT',
     headers :{
        "token" : this.token_desktop
     },
     data: params,
     success: function(result) {
         response = JSON.stringify(result);
         Logger.info(response);
     },
     error: function(XMLHttpRequest, textStatus, errorThrown) {
         response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
         Logger.info(response);
     }
 });
}

/**
* Requests Logout
*/
WhisbiAPIClient.prototype.request_logout = function(callback){
Logger.info("Perform 'logout' ...");
  $.ajax({
      async: false,
      url:  "/api/agents/" + this.user_id+ "/",
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token"  : this.token_desktop
      },
      data:{
        "action" : "logout"
      },
      success: function(result) {
          response = JSON.stringify(result);
          callback(result)
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Requests Change Status
*/
WhisbiAPIClient.prototype.request_change_status = function(status){
  Logger.info("Perform 'change_status' ...");
  var params = {
      "action" : "change_status",
      "status"  : status
  }
  $.ajax({
      async: false,
      url:  "/api/agents/" + this.user_id+ "/",
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token"  : this.token_desktop
      },
      data: params,
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

// ---------------------------
// LEADS
// ---------------------------

/**
* Get Queued Leads
*/
WhisbiAPIClient.prototype.request_get_queued_leads = function(vateam_name){
  Logger.info("Perform 'get_queued_leads' ...");
  var api = this;
  $.ajax({
      async: false,
      url:  "/api/leads/?vagroup="+ this.vateam[vateam_name],
      timeout: 4000,
      type : 'GET',
      headers :{
        "token" : this.token_desktop
      },
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

// ---------------------------
// DDIs
// ---------------------------

/**
* Get Inbound DDIs
*/
WhisbiAPIClient.prototype.request_get_inbound_ddis = function(){
  Logger.info("Perform 'get_queued_leads' ...");
  var api = this;
  $.ajax({
      async: false,
      url:  "/api/ddis/?branch="+ this.branch,
      timeout: 4000,
      type : 'GET',
      headers :{
        "token" : this.token_landing
      },
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}


// ---------------------------
// SESSIONS
// ---------------------------


/**
* Get Results
*/
WhisbiAPIClient.prototype.request_get_results = function(locator, beeper){
  Logger.info("Perform 'get_results' ...");
  var api = this;
  $.ajax({
      async: false,
      url:  "/api/sessions/results/?campaign="+ this.campaign,
      timeout: 4000,
      type : 'GET',
      headers :{
        "token" : this.token_desktop
      },
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Open Session
*/
WhisbiAPIClient.prototype.request_open_session = function(locator, beeper, callback){
  Logger.info("Perform 'open_session' ...");

  var params = {
      "action"   : "open_session",
      "locator"  : locator,
      "beeper"   : beeper
  }
  var api = this;
  $.ajax({
      async: false,
      url:  "/api/sessions/",
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token" : this.token_desktop
      },
      data: params,
      success: function(result) {
          response = JSON.stringify(result);
          api.lead_guid = result.lead.lead_guid;
          api.session_guid = result.lead.session;
          callback(result)
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Go alpha
*/
WhisbiAPIClient.prototype.request_go_alpha = function(locator, callback){
  Logger.info("Perform 'go_alpha' ...");

  var params = {
      "action"   : "open_alpha",
      "locator"  : locator
  }
  var api = this;
  $.ajax({
      async: false,
      url:  "/api/sessions/",
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token" : this.token_desktop
      },
      data: params,
      success: function(result) {
          response = JSON.stringify(result);
          api.lead_guid = result.lead.lead_guid;
          api.session_guid = result.lead.session;
          callback(result)
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Free Session Resources
*/
WhisbiAPIClient.prototype.request_free_session_resources = function(){
  Logger.info("Perform 'free_session_resources' ...");
  $.ajax({
      async: false,
      url:  "/api/sessions/" + this.lead_guid + "/",
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token" : this.token_desktop
      },
      data : {
        "action" : "free_session_resources"
      },
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Send Quiz
*/
WhisbiAPIClient.prototype.request_send_quiz = function(){
  Logger.info("Perform 'send_quiz' ...");

  // // For Standard quiz
  // var params = {
  //     "action"  : "quiz",
  //     "quiz"    : [0,1,2,3,4,5],
  // }
  // For NPS quiz
  var params = {
      "action"            : "quiz",
      "nps_quiz_question" : "myquestion",
      "nps_quiz_value"    : 5
  }
  $.ajax({
      async: false,
      url:  "/api/sessions/" + this.lead_guid + "/",
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token" : this.token_landing
      },
      data: params,
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Set Result
*/
WhisbiAPIClient.prototype.request_set_result = function(callback){
  Logger.info("Perform 'set_result' ...");
  var params = {
      "action"         : "set_result",
      "lead_result"    : this.lead_result_default
  }
  $.ajax({
      async: false,
      url:  "/api/sessions/" + this.lead_guid + "/",
      timeout: 4000,
      type : 'DELETE',
      headers :{
        "token" : this.token_desktop
      },
      data : params,
      success: function(result) {
          response = JSON.stringify(result);
          callback(response)
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}


/**
* Requests alive lead
*/
WhisbiAPIClient.prototype.request_alive_lead = function(){
  Logger.info("Perform 'alive_lead' ...");

  $.ajax({
      async: false,
      url: "/api/sessions/O2O/" + this.lead_guid + "/",
      timeout: 4000,
      type : 'GET',
      headers :{
        "token" : this.token_desktop
      },
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
  * Requests alive branchgroup (whisbinar)
  */
WhisbiAPIClient.prototype.request_alive_branchgroup = function(){
  Logger.info("Perform 'alive_lead' ...");

  $.ajax({
      async: false,
      url: "/api/sessions/O2M/" + this.branchgroup_whisbinar + "/",
      timeout: 4000,
      type : 'GET',
      headers :{
        "token" : this.token_desktop
      },
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
  * Request Lead
  */
WhisbiAPIClient.prototype.request_lead = function(type, phone, seed){
  Logger.info("Perform 'request_lead' ...");

  var params = {
      "action": "O2O",
      "type" : type,
      "branch" : this.branch,
      "phone" : phone,
      "country" : "ES",
      "name" : "dummy name"
  }
  if( seed != "" )
    params["seed"] = seed
  $.ajax({
      async: false,
      url:  "/api/sessions/",
      timeout: 4000,
      type : 'POST',
      headers :{
        "token" : this.token_landing
      },
      data: params,
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
  * Create Lead
  */
WhisbiAPIClient.prototype.request_create_lead = function(phone, vateam_name, seed){
  Logger.info("Perform 'create_lead' ...");
  var api = this;
  var params = {
      "action" : "O2O",
      "only_create_lead" : true,
      "seed" : seed,
      "phone" : phone,
      "country" : "ES",
      "name" : "dummy name",
      "campaign" : this.campaign,
      "vagroup" : this.vateam[vateam_name]
  }
  $.ajax({
      async: false,
      url:  "/api/sessions/",
      timeout: 4000,
      type : 'POST',
      headers :{
        "token" : this.token_desktop
      },
      data: params,
      success: function(result) {
          response = JSON.stringify(result);
          api.lead_guid = result.lead.lead_guid;
          api.session_guid = result.lead.session;
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Match KPI Session
*/
WhisbiAPIClient.prototype.request_match_kpi_session = function(kpiguid){
  Logger.info("Perform 'match_kpi_session' ...");

  var params = {
      "action"         : "match_kpi_session",
      "kpiguid"        : kpiguid,
      "phonecountry"   : "ES",
      "phonetype"      : "fixed",
      "session"        : this.session_guid,

      "cookieguid"     : "23290b6d-693b-44c3-9dd1-f4fef0b5c9a3",
      "useragent"      : "23290b6d-693b-44c3-9dd1-f4fef0b5c9a3",
      "clientbrowser"  : "browser",
      "clientdevice"   : "clientdevice",
      "clientos"       : "clientos",
      "clientlanguage" : "es",
      "screenw"        : "2",
      "screenh"        : "3",
      "clientip"       : "clientip",
      "country"        : "country",
      "referrer"       : "referrer",
      "adwords"        : "adwords"
  }
  $.ajax({
      async: false,
      url:  "/api/sessions/" + this.lead_guid + "/",
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token" : this.token_landing
      },
      data: params,
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}


/**
* Request Create Lead Whisbinar
*/
WhisbiAPIClient.prototype.request_create_lead_whisbinar = function(seed, branchgroup, callback){
  Logger.info("Perform 'create_lead' for whisbinar ...");
  var params = {
      "action"        : "O2M",
      "seed"          : seed,
      "branchgroup"   : this.branchgroup_whisbinar,
      "title"         : "O2M title",
      "description"   : "O2M description"
   }
  var api = this;
  $.ajax({
      async: false,
      url:  "/api/sessions/",
      timeout: 4000,
      type : 'POST',
      headers :{
        "token" : this.token_desktop
      },
      data: params,
      success: function(result) {
          response = JSON.stringify(result);
          api.session_guid = result.whisbinar.guid
          api.lead_guid = result.whisbinar.guid
          callback(result)
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Request Close Lead Whisbinar
*/
WhisbiAPIClient.prototype.request_close_lead_whisbinar = function(callback){
  Logger.info("Perform 'close' for whisbinar ...");
   $.ajax({
       async: false,
       url:  "/api/sessions/" + this.lead_guid + "/",
       timeout: 4000,
       type : 'DELETE',
       headers :{
        "token" : this.token_desktop
       },
       data : {
         "action" : "close"
       },
       success: function(result) {
           response = JSON.stringify(result);
           callback(response)
           Logger.info(response);
       },
       error: function(XMLHttpRequest, textStatus, errorThrown) {
           response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
           Logger.info(response);
       }
   });
}


/**
* Request Call Third
*/
WhisbiAPIClient.prototype.request_call_third = function(third_phone){
  Logger.info("Perform 'call_third' ...");

  var params = {
      "action"              : "call_third",
      "third_phone"         : third_phone,
      "third_phone_country" : "ES"
  }
  $.ajax({
      async: false,
      url:  "/api/sessions/" + this.session_guid + "/",
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token" : this.token_desktop
      },
      data : params,
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Request Call Third
*/
WhisbiAPIClient.prototype.request_switch_speaker = function(type){
  Logger.info("Perform 'switch_speaker' ...");

  var params = {
      "action"  : "switch_speaker",
      "type"    : type
  }
  $.ajax({
      async: false,
      url:  "/api/sessions/" + this.session_guid + "/",
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token" : this.token_desktop
      },
      data : params,
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Request Call Third
*/
WhisbiAPIClient.prototype.request_redirect_third = function(){
  Logger.info("Perform 'redirect_third' ...");
  $.ajax({
      async: false,
      url:  "/api/sessions/" + this.session_guid + "/",
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token" : this.token_desktop
      },
      data : {
        "action" : "redirect_third"
      },
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}


/**
* Request IV New Session
*/
WhisbiAPIClient.prototype.request_iv_new_session = function(callback){
  Logger.info("Perform 'iv_new_session' ...");
  var api = this;
  var params = {
      "branch" : this.branch,
  }
  $.ajax({
      async: false,
      url:  "/api/pins/",
      timeout: 4000,
      type : 'POST',
      headers :{
        "token" : this.token_landing
      },
      data: params,
      success: function(result) {
          response = JSON.stringify(result);
          api.pin = result.return.pin
          callback(result)
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Request IV Flag
*/
WhisbiAPIClient.prototype.request_iv_flag = function(){
  Logger.info("Perform 'iv_flag' ...");

  $.ajax({
      async: false,
      url:  "/api/pins/" + this.pin + "/",
      timeout: 4000,
      type : 'GET',
      headers :{
        "token" : this.token_landing
      },
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Request Schedule Session
*/
WhisbiAPIClient.prototype.request_schedule_session = function(sched_datetime, sched_phone){
  Logger.info("Perform 'schedule_session' ...");

  var params = {
      "action"                : "schedule_session",
      "sched_datetime"        : sched_datetime,
      "sched_phone"           : sched_phone,
      "sched_phone_country"   : "ES",
   }
  $.ajax({
      async: false,
      url:  "/api/sessions/" + this.lead_guid + "/",
      timeout: 4000,
      type : 'PUT',
      headers :{
       "token" : this.token_desktop
      },
      data : params,
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });

}

/**
* Request Search DB Leads
*/
WhisbiAPIClient.prototype.request_search_db_lead = function(locator){
  Logger.info("Perform 'search_db_leads' ...");
  var api = this;
  $.ajax({
      async: false,
      url:  "/api/leads/?locator="+ encodeURIComponent(locator),
      timeout: 4000,
      type : 'GET',
      headers :{
        "token" : this.token_desktop
      },
      success: function(result) {
          response = JSON.stringify(result);
          api.lead_guid = result.leads[0].lead_guid;
          api.session_guid = result.leads[0].session;
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Request Load DB Leads
*/
WhisbiAPIClient.prototype.request_load_db_lead = function(callback){
  Logger.info("Perform 'load_db_lead' ...");
  var params = {
      "action"     : "load_db_lead",
      "lead_guid"  : this.lead_guid
  }
  var api = this;
  $.ajax({
      async: false,
      url:  "/api/sessions/",
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token" : this.token_desktop
      },
      data: params,
      success: function(result) {
          response = JSON.stringify(result);
          callback(result)
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

// ---------------------------
// ROOMS
// ---------------------------

/**
* Request Create Seed
*/
WhisbiAPIClient.prototype.request_create_seed = function(room_seed){
  Logger.info("Perform 'create' seed ...");

  var params = {
     "seed": room_seed,
     "room_obj": this.room_obj
   }
  $.ajax({
      async: false,
      url:  "/api/room/seeds/",
      contentType: 'application/json',
      dataType: 'json',
      timeout: 4000,
      type : 'POST',
      headers :{
        "token" : this.token_landing
      },
      data: JSON.stringify(params),
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Request Update Seed
*/
WhisbiAPIClient.prototype.request_update_seed = function(room_seed){
  Logger.info("Perform 'update' seed ...");

  var params = {
     "room_obj": this.room_obj
   }
  $.ajax({
      async: false,
      url:  "/api/room/seeds/" + room_seed + "/",
      contentType: 'application/json',
      dataType: 'json',
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token" : this.token_landing
      },
      data: JSON.stringify(params),
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Request Read Seed
*/
WhisbiAPIClient.prototype.request_read_seed = function(room_seed){
  Logger.info("Perform 'read' seed ...");

  $.ajax({
      async: false,
      url:  "/api/room/seeds/" + room_seed + "/",
      contentType: 'application/json',
      dataType: 'json',
      timeout: 4000,
      type : 'GET',
      headers :{
        "token" : this.token_landing
      },
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Request Delete Seed
*/
WhisbiAPIClient.prototype.request_delete_seed = function(room_seed){
  Logger.info("Perform 'delete' seed ...");

  $.ajax({
      async: false,
      url:  "/api/room/seeds/" + room_seed + "/",
      contentType: 'application/json',
      dataType: 'json',
      timeout: 4000,
      type : 'DELETE',
      headers :{
        "token" : this.token_landing
      },
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}


/**
* Request Create User in Room
*/
WhisbiAPIClient.prototype.request_create_user_in_room = function(type, callback){
  Logger.info("Perform 'read' room to create user ...");
  var api = this;
  $.ajax({
      async: false,
      url:  "/api/room/" + this.session_guid + "/user/?user_type=" + type,
      contentType: 'application/json',
      dataType: 'json',
      timeout: 4000,
      type : 'GET',
      headers :{
        "token" : this.token_landing
      },
      success: function(result) {
          response = JSON.stringify(result);
          switch(type){
            case "user":api.user_gari_id = result.user_id;
            break;
            case "agent":api.agent_gari_id = result.user_id;
            break;
            case "viewer":api.viewer_gari_id = result.user_id;
            break;
            case "presenter":api.presenter_gariid = result.user_id;
            break;
          }
          callback(result)
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Request Update Room
*/
WhisbiAPIClient.prototype.request_update_room = function(user_id){
  Logger.info("Perform 'update' room ...");
  var params = {
     "action"   : "update",
     "pod_obj" : this.update_pod
   }
  $.ajax({
      async: false,
      url:  "/api/room/" + this.session_guid + "/user/" + user_id,
      contentType: 'application/json',
      dataType: 'json',
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token" : this.token_landing
      },
      data: JSON.stringify(params),
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Request Update Room
*/
WhisbiAPIClient.prototype.request_update_user_info = function(user_id){
  Logger.info("Perform 'update_user_info' room ...");


  var params = {
     "action"    : "update_user_info",
     "user_info" : this.user_info
   }
  $.ajax({
      async: false,
      url:  "/api/room/" + this.session_guid + "/user/" + user_id,
      contentType: 'application/json',
      dataType: 'json',
      timeout: 4000,
      type : 'PUT',
      headers :{
        "token" : this.token_landing
      },
      data: JSON.stringify(params),
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

/**
* Request Read Room
*/
WhisbiAPIClient.prototype.request_read_room = function(user_id){
  Logger.info("Perform 'read' room ...");
  $.ajax({
      async: false,
      url:  "/api/room/" + this.session_guid + "/user/" + user_id,
      contentType: 'application/json',
      dataType: 'json',
      timeout: 4000,
      type : 'GET',
      headers :{
        "token" : this.token_landing
      },
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}


/**
* Request Send KPI
*/
WhisbiAPIClient.prototype.request_send_kpi = function(cookieguid, kpiguid){
  Logger.info("Perform 'send_kpi' room ...");

 var guid =  generate_random_guid();
 var params = {
   'cookieguid'    : cookieguid,
   'kpiguid'       : kpiguid,
   'branch'        : this.branch,
   'clientbrowser' : 'foo',
   'computer'      : 'bar',
   'clientos'      : 'os'
 }
 $.ajax({
     async: false,
     url:  "/api/kpis/" + guid,
     contentType: 'application/json',
     dataType: 'json',
     timeout: 4000,
     type : 'POST',
     headers :{
       "token" : this.token_landing
     },
     data: JSON.stringify(params),
     success: function(result) {
         response = JSON.stringify(result);
         Logger.info(response);
     },
     error: function(XMLHttpRequest, textStatus, errorThrown) {
         response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
         Logger.info(response);
     }
 });
}

// ---------------------------
// Teams
// ---------------------------

/**
* Get Availability
*/
WhisbiAPIClient.prototype.request_get_availability = function(){
  Logger.info("Perform 'get_availabity' ...");
  var api = this;
  $.ajax({
      async: false,
      url:  "/api/agents/?branch="+ this.branch + "&include_agent_list=true",
      timeout: 4000,
      type : 'GET',
      headers :{
        "token" : this.token_landing
      },
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}

// ---------------------------
// Alphas
// ---------------------------

/**
* New Alpha
*/
WhisbiAPIClient.prototype.request_new_alpha = function(cookieguid, kpiguid, callback){
  Logger.info("Perform 'new_alpha' ...");
  var api = this;
  var params = {
    'cookieguid'    : cookieguid,
    'kpiguid'       : kpiguid,
    'branch'        : this.branch,
  }
  $.ajax({
      async: false,
      url:  "/api/alphas/",
      timeout: 4000,
      type : 'POST',
      headers :{
        "token" : this.token_landing
      },
      data: params,
      success: function(result) {
          response = JSON.stringify(result);
          api.alpha_pin = result.alpha
          api.alpha_token = result.token
          callback(result)
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}


/**
* New Alpha
*/
WhisbiAPIClient.prototype.request_alpha_status = function(){
  Logger.info("Perform 'alpha_status' ...");
  var api = this;
  $.ajax({
      async: false,
      url:  "/api/alphas/" + this.alpha_pin + "/?token=" + this.alpha_token,
      timeout: 4000,
      type : 'GET',
      headers :{
        "token" : this.token_landing
      },
      success: function(result) {
          response = JSON.stringify(result);
          Logger.info(response);
      },
      error: function(XMLHttpRequest, textStatus, errorThrown) {
          response = "err--" + XMLHttpRequest.status + " -- " + XMLHttpRequest.statusText;
          Logger.info(response);
      }
  });
}
