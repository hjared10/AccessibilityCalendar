require("date-format-lite"); // add date format
var xssFilters = require('xss-filters');
// var Sequelize = require("sequelize");
// var env = process.env.NODE_ENV || "development";
// var config = require(__dirname + "/../config/config.json")[env];
var db = {};

class Storage {
	constructor(connection) {
		this._db = connection;
		this.table = "events";
	}

	// get events from the table, use dynamic loading if parameters sent
	async getAll(params) {
		let query = "SELECT * FROM ?? ";
		let queryParams = [
			this.table
		];

		if (params.from && params.to) {
			query += " WHERE `end_date` >= ? AND `start_date` < ?";
			queryParams.push(params.from);
			queryParams.push(params.to);
		}

		let result = await this._db.query(query, queryParams);

		result.forEach((entry) => {
			// format date and time
			entry.id = xssFilters.inHTMLData(entry.id);
			entry.text = xssFilters.inHTMLData(entry.text);
			entry.event_pid = xssFilters.inHTMLData(entry.event_pid);
			entry.event_length = xssFilters.inHTMLData(entry.event_length);
			entry.rec_type = xssFilters.inHTMLData(entry.rec_type);
			entry.start_date = entry.start_date.format("YYYY-MM-DD hh:mm");
			entry.end_date = entry.end_date.format("YYYY-MM-DD hh:mm");
		});

		return result;
	}

	// create new event
	async insert(data) {
		let sql = "INSERT INTO ?? " +
			"(`start_date`, `end_date`, `text`, `event_pid`, `event_length`, `rec_type`) " +
			"VALUES (?, ?, ?, ?, ?, ?)";

		const result = await this._db.query(
			sql,
			[
				this.table,
				data.start_date,
				data.end_date,
				data.text,
				data.event_pid || 0,
				data.event_length || 0,
				data.rec_type
      ]);
      
      var dateTime = data.start_date;
      var text = data.text;

      "use strict";
      var VoiceRSS={
      speech:function(e){
        this._validate(e),
        this._request(e)},
        _validate:function(e){
          if(!e)throw"The settings are undefined";
          if(!e.key)throw"The API key is undefined";
          if(!e.src)throw"The text is undefined";
          if(!e.hl)throw"The language is undefined";
          if(e.c&&"auto"!=e.c.toLowerCase()){
            var a=!1;
            switch(e.c.toLowerCase()){
              case"mp3":a=(new Audio).canPlayType("audio/mpeg").replace("no","");
              break;
              case"wav":a=(new Audio).canPlayType("audio/wav").replace("no","");
              break;
              case"aac":a=(new Audio).canPlayType("audio/aac").replace("no","");
              break;
              case"ogg":a=(new Audio).canPlayType("audio/ogg").replace("no","");
              break;
              case"caf":a=(new Audio).canPlayType("audio/x-caf").replace("no","")
            }
            if(!a)throw"The browser does not support the audio codec "+e.c
          }
        },
        _request:function(e){
          var a=this._buildRequest(e),
          t=this._getXHR();
          t.onreadystatechange=function(){
            if(4==t.readyState&&200==t.status){
              if(0==t.responseText.indexOf("ERROR"))throw t.responseText;
              new Audio(t.responseText).play()
            }
          },
          t.open("POST","https://api.voicerss.org/",!0),
          t.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8"),
          t.send(a)},
          _buildRequest:function(e){
            var a=e.c&&"auto"!=e.c.toLowerCase()?e.c:this._detectCodec();
            return"key="+(e.key||"")+"&src="+(e.src||"")+"&hl="+(e.hl||"")+"&r="+(e.r||"")+"&c="+(a||"")+"&f="+(e.f||"")+"&ssml="+(e.ssml||"")+"&b64=true"
          },
          _detectCodec:function(){
            var e=new Audio;return e.canPlayType("audio/mpeg").replace("no","")?"mp3":e.canPlayType("audio/wav").replace("no","")?"wav":e.canPlayType("audio/aac").replace("no","")?"aac":e.canPlayType("audio/ogg").replace("no","")?"ogg":e.canPlayType("audio/x-caf").replace("no","")?"caf":""
          },
          _getXHR:function(){
            try{
              return new XMLHttpRequest
            }catch(e){}try{
              return new ActiveXObject("Msxml3.XMLHTTP")
            }catch(e){}try{
              return new ActiveXObject("Msxml2.XMLHTTP.6.0")
            }catch(e){}try{
              return new ActiveXObject("Msxml2.XMLHTTP.3.0")
            }catch(e){}try{
              return new ActiveXObject("Msxml2.XMLHTTP")
            }catch(e){}try{
              return new ActiveXObject("Microsoft.XMLHTTP")
            }catch(e){}throw"The browser does not support HTTP request"
          }
        };

      var agrippa = new Date();

      if(dateTime === agrippa){
        VoiceRSS.speech({
          key: '19c292543c504128ad82211c8e11a187',
          src: 'You have a' + text + 'right now',
          hl: 'en-us',
          r: -1,
          c: 'mp3',
          f: '44khz_16bit_stereo',
          ssml: false,
          b64: true
        });
      }

		// delete a single occurrence from recurring series
		let action = "inserted";
		if (data.rec_type == "none") {
			action = "deleted";
		}

		return {
			action: action,
			tid: result.insertId
		};
	}

	// update event
	async update(id, data) {
		if (data.rec_type && data.rec_type != "none") {
			// all modified occurrences must be deleted when we update recurring series
			// https://docs.dhtmlx.com/scheduler/server_integration.html#savingrecurringevents
			await this._db.query(
				"DELETE FROM ?? WHERE `event_pid`= ?;",
				[this.table, id]);
		}

		await this._db.query(
			"UPDATE ?? SET " +
			"`start_date` = ?, `end_date` = ?, `text` = ?, `event_pid` = ?, `event_length`= ?, `rec_type` = ? "+
			"WHERE id = ?",
			[
				this.table,
				data.start_date,
				data.end_date,
				data.text,
				data.event_pid || 0,
				data.event_length || 0,
				data.rec_type,
				id
			]);

		return {
			action: "updated"
		};
	}

	// delete event
	async delete(id) {

		// some logic specific to recurring events support
		// https://docs.dhtmlx.com/scheduler/server_integration.html#savingrecurringevents
		let event = await this._db.query(
			"SELECT * FROM ?? WHERE id=? LIMIT 1;",
			[this.table, id]);

		if (event.event_pid) {
			// deleting modified occurrence from recurring series
			// If an event with the event_pid value was deleted - it needs updating with rec_type==none instead of deleting.
			event.rec_type = "none";
			return await this.update(id, event);
		}

		if (event.rec_type && event.rec_type != "none") {
			// if a recurring series was deleted - delete all modified occurrences of the series
			await this._db.query(
				"DELETE FROM ?? WHERE `event_pid`=? ;",
				[this.table, id]);
		}

		await this._db.query(
			"DELETE FROM ?? WHERE `id`= ?;",
			[this.table, id]);

		return {
			action: "deleted"
		}
	}
}

module.exports = Storage;
