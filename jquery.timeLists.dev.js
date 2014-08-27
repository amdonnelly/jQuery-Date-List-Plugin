/*
 * jQuery timeDropdowns
 *
 * Inspired by: http://www.amdonnelly.co.uk/things/date-drop-down-lists.aspx
 * Author:      https://github.com/toepoke
 * Date:        26-Aug-14
 * Version      Change
 * -------      --------------------
 * 0.1          Initial version
 *
 * ToDo:
 * Suggestions?
*/

(function($){

	$.fn.timeDropdowns = function(options) {
		// input is _always_ 24 hour clock
		
		var defaults = {
			// Input/output format of the input the dropdowns are tied to
			// ... - no idea why you'd want to put minutes at the front, but you can !!!??
				timeFormat: "hh:mm:ss",
			
			// Flags the dropdowns should be based on 12 hour clock (AM/PM dropdown) or 24 hour clock (military)
			// ... default is 12 hour clock
				useMilitaryTime: false,

			// Whether the seconds dropdown is displayed (if not, seconds amount will be zero)
				showSeconds: true,

			// Increments of the minute dropdown, so if 15 minute intervals are used 00, 15, 30 & 45 are displayed
			// ... default is 1, so all minutes are shown
				minuteInterval: 1,
				
			// Tries to find an associated label for the TEXT input to wire the "for" attribute
			// ... upto the first dropdown (usually the "hour" dropdown)
			// ... This allows us to remain semantically correct (targeting the underling TEXT control)
				rerouteLabel: true,
				
			// Keeps the underlying input visible, useful for development
				inDebug: false
			                          
		};
		var options = $.extend(defaults, options);
		
		
		return this.each(function() {
			var obj = $(this);
			var body = obj.html();
			
			var _containerName = obj.attr("id") + "_timeList";
			var _startTime = obj.val();
			var _time = new Date();
			var _separator = ":";

			GetStartTime();
			BuildLists();
			SetupChangeHandlers();
			RerouteLabel();

			
			/*
			 * GetStartTime
			 * ------------
			 * Establishes the time of the control we're tied to (if initialised).
			*/
			function GetStartTime() {
				if (_startTime.length === 0)
					// nothing to see here
					return;
			
				var startTime = _startTime;
				var newTime = new Date();
				
				var timeParts = startTime.split(_separator);
				var timeSections = defaults.timeFormat.split(_separator);
				
				for (var x=0; x < timeParts.length; x++) {
					var timePart = parseInt(timeParts[x]);
					var timeSection = timeSections[x].toLowerCase();
					
					if (timeSection.indexOf("h") >= 0) {
						newTime.setHours(timePart);
					} else if (timeSection.indexOf("m") >= 0) {
						newTime.setMinutes(timePart);
					} else if (timeSection.indexOf("s") >= 0) {
						if (defaults.showSeconds)
							newTime.setSeconds(timePart);
						else 
							newTime.setSeconds(0);
					}
					
				} // for
				
				_time = newTime;
				
			} // GetStartTime
			

			/*
			 * BuildLists
			 * ----------
			 * Builds up each time component dropdown, adding them next to the input control.
			*/
			function BuildLists() {
				var tmpObj = obj;
				
				obj.replaceWith( "<div id='" + _containerName + "' class='timeLists_container'></div>" );
			
				var containerId = "#" + _containerName;
				
				$(containerId)
					.append( BuildHoursList() ) 
					.append( BuildMinutesList() )
				;
				
				if (defaults.showSeconds) {
					$(containerId)
						.append( BuildSecondsList() ) 
					;
				}
					
				if (!defaults.useMilitaryTime) {
					$(containerId)
						.append( BuildPeriodList() )
					;
				}

				$(containerId).append(obj);
				
				if (!defaults.inDebug) {
					obj.hide();
				}
			
			} // BuildLists
			
			
			/*
			 * BuildPeriodList
			 * ---------------
			 * Creates a SELECT for the period dropdown (AM/PM)
			*/
			function BuildPeriodList() {
				var html = "";
				var selected = "";
				var id = _containerName + "_period";
				
				html += "<select id='" + id + "' name='" + id + "' class='time-list period'>\n";
				html +=   "<option value='am' " + (_time.getHours() < 12 ? " selected='selected'" : "") + ">AM</option>\n";
				html +=   "<option value='pm' " + (_time.getHours() >= 12 ? " selected='selected'" : "") + ">PM</option>\n";
				html += "</select>";
				
				return html;
			
			} // BuildPeriodList


			/*
			 * BuildHoursList
			 * --------------
			 * Creates a SELECT for the hours dropdown (1-12 or 0-23 if "useMilitaryTime" flag is enabled)
			*/
			function BuildHoursList() {
				var from = 0;
				var to = 23;
				var selectedValue = _time.getHours();
				var interval = 1;
				
				if (!defaults.useMilitaryTime) {
					// convert to 12 hour clock
					from = 1;
					to = 12;
					selectedValue = (selectedValue > 12) ? selectedValue-12 : selectedValue;				
				}

				return BuildList( "hour", selectedValue, from, to, interval, function(item) {
					// need a sensible prefix?
					if (item.toString().length == 1) {
						item = (defaults.useMilitaryTime ? "0" : " ") + item.toString();
					}
					return item;
				});
			
			} // BuildHoursList
			

			/*
			 * BuildMinutesList
			 * ----------------
			 * Creates a SELECT for the minutes dropdown (items are zero prefixed as appropriate)
			 * (0-59 unless "minuteInterval" is enabled, in which case it's 0,15,30,45 or whatever depending on the interval)
			*/
			function BuildMinutesList() {
				var from = 0;
				var to = 59;
				var interval = defaults.minuteInterval;
				return BuildList( "minute", _time.getMinutes(), from, to, defaults.minuteInterval, function(item) {
					return LZ(item);
				});
			
			} // BuildMinutesList


			/*
			 * BuildSecondsList
			 * ----------------
			 * Creates a SELECT for the seconds dropdown (items are zero prefixed as appropriate)
			*/
			function BuildSecondsList() {
				var from = 0;
				var to = 59;
				var interval = 1;
				return BuildList( "second", _time.getSeconds(), from, to, interval, function(item) {
					return LZ(item);
				});
			
			} // BuildSecondsList
			
			
			/*
			 * BuildList
			 * ---------
			 * Helper method to generated a SELECT dropdown with a given range of values.
			 * listType - Type of dropdown being created - hour, minute, etc - used to generate IDs and Classes
			 * selectedValue - Number of the currently selected item in the dropdown (derived from the underlying TEXT input data)
			 * from - Starting number of the list
			 * to - Final number of the list
			 * interval - Rather than add items in consecutive order, they can be added every "interval", so 15 minutes would produce 0, 15, 30 & 45 
			 * prerender - Callback to allow the callee to add some formatting if desired (e.g. leading zeros)
			*/
			function BuildList(listType, selectedValue, from, to, interval, prerender) {
				var html = "";
				var listId = _containerName + "_" + listType;
				
				html += "<select id='" + listId + "' name='" + listId + "' class='time-list " + listType + "'>\n";
				
				for (var n=from; n <= to; n += interval) {
					var item = n;
					var selected = "";
					
					// selected value?
					if (item === selectedValue || selectedValue >= item/*interval != 1, so pick one that's near it*/) {
						selected = " selected='selected'";
					}
					
					if (prerender) 
						item = prerender(item);
					
					html += "<option value='" + n + "'" + selected + ">" + item + "</option>\n";
				}
				
				html += "</select>\n";
				
				return html;
			
			} // BuildList
			
			
			/*
			 * SetupChangeHandlers
			 * -------------------
			 * Wires up the "onchange" event handlers for each dropdown.
			 * - also triggers the handlers to force the data in the TEXT input syncs up with the dropdowns correctly
			*/
			function SetupChangeHandlers() {
				var containerId = "#" + _containerName;
				var container = $(containerId);
				
				container.on("change", "select", function (evt) {
					// The parent DIV of the SELECT tells us reliably what was actually clicked on
					var dropdown = $(evt.target);
					var selectedValue = dropdown.val().toLowerCase();
					var value = parseInt(selectedValue);
					var newTime = new Date( _time.getFullYear(), _time.getMonth(), _time.getDate(), _time.getHours(), _time.getMinutes(), _time.getSeconds(), 0/*ms*/ );
					
					if (dropdown.hasClass("hour")) {

					if (!defaults.useMilitaryTime) {
							var period = $(containerId + "_period").val().toLowerCase();

							if (period === "pm") {
								value += 12;
								if (value > 23) value = 0;
							}
						}
						
						newTime.setHours(value);
						
					} else if (dropdown.hasClass("minute")) {
						newTime.setMinutes(value);
						
					} else if (dropdown.hasClass("second")) {
						newTime.setSeconds(value);
					
					} else if (dropdown.hasClass("period")) {
						newTime.period = selectedValue;
						if (selectedValue === "pm") {
							if (newTime.getHours() < 12)
								newTime.setHours( newTime.getHours()+12 );
						} else {
							if (newTime.getHours() > 12)
								newTime.setHours( newTime.getHours()-12 );
						}
						
					}
					
					_time = newTime;
					CreateTime();
										
				});
				
				// Force change events for each dropdown to sync the data representation up
				// ... e.g. if we have minuteInterval to "15 minutes" the underlying data might say "16", but the UI now says "15"
				// ... so we sync them up so both hold the same truth				
				$(containerId + "_hour").trigger("change");
				$(containerId + "_minute").trigger("change");
				$(containerId + "_second").trigger("change");
				$(containerId + "_period").trigger("change");
				
			} // SetupChangeHandlers
			
			
			
			/*
			 * RerouteLabel
			 * ------------
			 * Updates the underlying TEXT input with the time selected in the dropdowns, according to the given
			 * format (in the options - though why you'd want anything other than hh:mm:ss is beyond me!)
			*/
			function RerouteLabel() {
				if (!defaults.rerouteLabel) 
					// nothing to see here
					return;
		
				var objId = obj.attr("id");
				var sibs = obj.parent().siblings("label[for=" + objId + "]");	// parent() as we've moved the TEXT into our container
				if (sibs) {
					var newForId = _containerName + "_hour";
					sibs.first().attr("for", newForId );
				}
				
			} // RerouteLabel
			
			
			/*
			 * CreateTime
			 * ----------
			 * Updates the underlying TEXT input with the time selected in the dropdowns, according to the given
			 * format (in the options - though why you'd want anything other than hh:mm:ss is beyond me!)
			*/
			function CreateTime() {
				var hours = _time.getHours();
				var mins = _time.getMinutes();
				var secs = _time.getSeconds();
				var timeFormat = defaults.timeFormat;
				
				var newTime = defaults.timeFormat.toLowerCase();
				
				newTime = newTime.replace("hh", LZ(hours));
				newTime = newTime.replace("mm", LZ(mins));
				newTime = newTime.replace("ss", LZ(secs));
				
				obj.val( newTime );
				
			} // CreateTime
			
			
			/*
			 * LZ
			 * --
			 * Helper to simply return a number with a leading zero if the given value is under 10 
			 * (so everything lines up nice and even!)
			*/
			function LZ(value) {
				// ensure we're dealing with a number
				var s = value;
				if (parseInt(value) < 10)
					s = "0" + value;
				return s;
			}
			
		}); // this.each(...)
	
	}; // $.fn.timeDropdowns

})(jQuery);
