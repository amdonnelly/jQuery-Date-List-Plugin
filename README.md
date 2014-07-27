jQuery-Date-List-Plugin
=======================

jQuery plugin for creating day/month/year filtered lists, bound to a text field with the date value.

For an example visit [the demo page](http://http://www.amdonnelly.co.uk/things/date-drop-down-lists.aspx "Date Drop Down List")

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
* ___dateFormat___ Determines the layout of the date, 'dd-mm-yy', 'mm-dd-yy', use MM or DD for 2 digit values.
* ___monthNames___ Array of month labels
* ___yearStart / yearEnd___ Integer value for start and end years.


###Jquery
```javascript
  <script type="text/javascript">  
		$('#fld_id').dateDropDowns({
			dateFormat:'DD-mm-yy',
			monthNames: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
			yearStart:'1979', yearEnd:'2011'
		}); 
  </script>  
```

[Alan Donnelly](http://www.amdonnelly.co.uk)