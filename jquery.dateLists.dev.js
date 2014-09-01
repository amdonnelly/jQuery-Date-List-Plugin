/*
 * jQuery dateDropDowns
 *
 * url		http://http://www.amdonnelly.co.uk/things/date-drop-down-lists.aspx
 * author	Alan Donnelly 2011
 * version	1.0.2
 * license	MIT and GPL licenses
 */
 
    (function($){
        $.fn.dateDropDowns = function(options) {

            var defaults = {
                dateFormat: 'dd-mm-yy', 
                monthNames: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
                yearStart:'1900', yearEnd:new Date().getFullYear(),
				defaultCurrentDate: false
            };
            var options = $.extend(defaults, options);

            return this.each(function() {
                var obj = $(this);  
                var body = obj.html();
                
                var _container_name             = obj.attr('id') + "_dateLists";
                var _container_name_day         = _container_name + "_day";
                var _container_name_month       = _container_name + "_month";
                var _container_name_year        = _container_name + "_year";
                                    
                var _startDate = obj.val();
                var _date = new Date();
                var _separator = (defaults.dateFormat.indexOf("/")>-1) ? "/" : ((defaults.dateFormat.indexOf(".")>-1) ? "." : "-");
                
                GetStartDate();
                AddLists();
                PopulateLists();
                SetupChangeHandlers();
                
                //=========================================================================
                function GetStartDate(){
                    if(_startDate.length>0){
                        var _dateSections = defaults.dateFormat.split(_separator);
                        var _dateParts = _startDate.split(_separator);
                        var _newDate = new Date();

                        for(_x=0; _x<_dateParts.length; _x++){
                            if(_dateSections[_x].toLowerCase().indexOf("d")>-1){
                                _newDate.setDate(_dateParts[_x]);
                            }
                            else if(_dateSections[_x].toLowerCase().indexOf("m")>-1){
                                _newDate.setMonth(_dateParts[_x]-1);
                            }
                            else if(_dateSections[_x].toLowerCase().indexOf("y")>-1){
                                _newDate.setYear(_dateParts[_x]);
                            }                                                        
                        }
                        
                        _date = _newDate;
                    }
                }
                
                //=========================================================================
                function AddLists(){
                    var _dateSections   = defaults.dateFormat.split(_separator);
                    
                    var _obj = obj;
                    
                    obj.replaceWith("<div id='" + _container_name + "' class='dateLists_container'></div>");
                    

                    for(_x=0; _x<_dateSections.length; _x++){

                        if(_dateSections[_x].toLowerCase().indexOf("d")>-1){
                            $('#' + _container_name).append("<div id='" + _container_name_day + "' class='day_container'>");
                            $('#' + _container_name_day).append("<select id='" + _container_name_day + "_list' name='" + _container_name_day + "_list' class='list'></select>");
                            $('#' + _container_name).append("</div>");
                        }
                        else if(_dateSections[_x].toLowerCase().indexOf("m")>-1){
                            $('#' + _container_name).append("<div id='" + _container_name_month + "' class='month_container'>");
                            $('#' + _container_name_month).append("<select id='" + _container_name_month + "_list' name='" + _container_name_month + "_list' class='list'></select>");
                            $('#' + _container_name).append("</div>");                           
                        }
                        else if(_dateSections[_x].toLowerCase().indexOf("y")>-1){
                            $('#' + _container_name).append("<div id='" + _container_name_year + "' class='year_container'>");
                            $('#' + _container_name_year).append("<select id='" + _container_name_year + "_list' name='" + _container_name_year + "_list' class='list'></select>");
                            $('#' + _container_name).append("</div>");                            
                        }                                                        
                    }                

                    $('#' + _container_name).append(_obj);
                    obj.hide();
                }
                

                
                //=========================================================================
                function PopulateLists(){
                    PopulateDayList();
                    PopulateMonthList();
                    PopulateYearList();
                }
                
                function PopulateDayList(){
                    var _currentMonth = _date.getMonth()+1;
                    var _options = "";
                    var _start=1;
                    _daysInMonth = GetMonthDays(_currentMonth, _date.getFullYear())+1;
                    
                    
                    if($("#"+_container_name_day + "_list").children().length<_daysInMonth){
                        _start = $("#"+_container_name_day + "_list").children().length+1;
                    }
                    else{
                        $("#"+_container_name_day + "_list").children().remove();
                    }
                    
                                        
                    for(_x=_start;_x<_daysInMonth; _x++){
                        var _selected = (defaults.defaultCurrentDate && (_date.getDate()==_x)) ?  "selected='true'" : "";
                        _options+="<option value='" + _x + "' " + _selected + ">" + _x + "</option>";
                    }
                    

                    
                    
                    $("#"+_container_name_day + "_list").append(_options);
                }
                
                //Get the number of days for a given month
                function GetMonthDays(prmMonth, prmYear){
                    var _daysInMonth = 31;
                    
                    if(prmMonth==4 || prmMonth==6 || prmMonth==9 || prmMonth==11){
                        _daysInMonth = 30;
                    }
                    else if(prmMonth==2){
                        if((prmYear % 4)==0){
                            _daysInMonth=29;
                        }
                        else{
                            _daysInMonth = 28;
                        }
                    }
                    
                    return _daysInMonth;                
                }
                
                
                function PopulateMonthList(){
                     $("#"+_container_name_month + "_list").children().remove();
                     
                    for(_x=0;_x<12; _x++){
                        var _selected = (defaults.defaultCurrentDate && (_date.getMonth()==_x)) ? "selected='true'" : "";

                        $("#"+_container_name_month + "_list").append("<option value='" + _x + "' " + _selected + ">" + defaults.monthNames[_x] + "</option>");
                    }
                }
                function PopulateYearList(){
                    $("#"+_container_name_year + "_list").children().remove();
                    
                    var _yStart = parseInt(defaults.yearStart);
                    var _yEnd = parseInt(defaults.yearEnd);
                    
                    if(_yEnd>_yStart){
                        for(_x=_yStart;_x<_yEnd+1; _x++){
                            var _selected = (defaults.defaultCurrentDate && (_date.getFullYear()==_x)) ? "selected='true'" : "";

                            $("#"+_container_name_year + "_list").append("<option value='" + _x + "' " + _selected + ">" + _x + "</option>");
                        } 
                    }
                    else{
                    //alert(_yEnd)
                        for(_y=_yStart;_y>2005; _y--){
                            var _selected = ((_date.getFullYear())==_y) ? "selected='true'" : "";

                            $("#"+_container_name_year + "_list").append("<option value='" + _y + "' " + _selected + ">" + _y + "</option>");
                        }                     
                    }                   
                }          
                
                
                //=========================================================================       
                function SetupChangeHandlers(){

                    $("#"+_container_name_day + "_list").change(function() {
                        _date.setDate($("#"+_container_name_day + "_list").val());
                        CreateDate();   
						
                    });
                    $("#"+_container_name_month + "_list").change(function() {
                        var _newMonth = parseInt($("#"+_container_name_month + "_list").val());
                        var _days = _date.getDate();
                        
                        _daysInMonth = GetMonthDays(_newMonth+1, _date.getFullYear());
                                                
                        if(_days>_daysInMonth) {
                           _days = _daysInMonth;                           
                        }

                        var _newDate = new Date( _date.getFullYear(), _newMonth, _days, 0, 0, 0, 0)
                        _date = _newDate;

                        PopulateDayList();
                        CreateDate(); 
                    });   
                    $("#"+_container_name_year + "_list").change(function() {
                        var _newYear = $("#"+_container_name_year + "_list").val();
                        var _days = _date.getDate();
                        var _month = _date.getMonth();
                        
                        _daysInMonth = GetMonthDays( _month+1, _newYear);
                        

                        if(_days>_daysInMonth) {
                           _days = _daysInMonth;                          
                        }
                       
                        var _newDate = new Date(_newYear, _month, _days, 0, 0, 0, 0)
                        
                        _date = _newDate;
                        
                        PopulateDayList(); 
                        CreateDate();  
                    });                                                           
                }          
                
                function CreateDate(){
				
				
                    var _days = _date.getDate();
                    var _month = _date.getMonth()+1;
                    var _year = _date.getFullYear();
                    
                    var _dateFormat = defaults.dateFormat;
                    
                    if(_dateFormat.indexOf("DD")>-1 && _days.toString().length<2){
                        _days = "0" + _days;
                    }
                    if(_dateFormat.indexOf("MM")>-1 && _month.toString().length<2){
                        _month = "0" + _month;
                    }                    
                    
                    var _newDate = defaults.dateFormat.toLowerCase();
                    _newDate = _newDate.replace("dd", _days);
                    _newDate = _newDate.replace("mm", _month);
                    _newDate = _newDate.replace("yy", _year);
                    
                    obj.val(_newDate);
                }     
            });
        };
    })(jQuery);