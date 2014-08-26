jQuery-Date-List-Plugin
=======================

jQuery plugin for creating day/month/year filtered lists, bound to a text field with the date value.

For an example visit [the demo page](http://www.amdonnelly.co.uk/things/date-drop-down-lists.aspx "Date Drop Down List")

##Installation

```html
<link rel="stylesheet" type="text/css" href="/css/jquery.dateLists.css">
<script type="text/javascript" src="/js/jquery.dateLists.min.js"></script>
```

##Basic Example

###HTML
```html
<input type="text" id="test_fld" value="5-2-2000"/>
```

###Jquery
```javascript
  <script type="text/javascript">  
   $().ready(function() {  
        $('#test_fld').dateDropDowns({dateFormat:'dd-mm-yy'});  
   });  
  </script>  
```


##Paramaters
* ___dateFormat___ Determines the layout of the date, e.g., 'dd.mm.yy', 'mm/dd/yy', 'MM-DD-yy'. Since mm and dd produce 1-digit values, use MM and DD for 2-digit values.
* ___monthNames___ Array of month labels.
* ___yearStart / yearEnd___ Integer value for start and end years. By default, yearStart is 1900 and yearEnd is current year.


###Jquery
```javascript
  <script type="text/javascript">  
		$('#fld_id').dateDropDowns({
			dateFormat:'DD-mm-yy',
			monthNames: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],			
			yearEnd:new Date().getFullYear()-18 //allow registration only for adult users
		}); 
  </script>  
```

[Alan Donnelly](http://www.amdonnelly.co.uk)