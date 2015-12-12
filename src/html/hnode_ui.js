function formatDate(date, format, utc) {
    var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    function ii(i, len) {
        var s = i + "";
        len = len || 2;
        while (s.length < len) s = "0" + s;
        return s;
    }

    var y = utc ? date.getUTCFullYear() : date.getFullYear();
    format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
    format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
    format = format.replace(/(^|[^\\])y/g, "$1" + y);

    var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
    format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
    format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
    format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
    format = format.replace(/(^|[^\\])M/g, "$1" + M);

    var d = utc ? date.getUTCDate() : date.getDate();
    format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
    format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
    format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
    format = format.replace(/(^|[^\\])d/g, "$1" + d);

    var H = utc ? date.getUTCHours() : date.getHours();
    format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
    format = format.replace(/(^|[^\\])H/g, "$1" + H);

    var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
    format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
    format = format.replace(/(^|[^\\])h/g, "$1" + h);

    var m = utc ? date.getUTCMinutes() : date.getMinutes();
    format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
    format = format.replace(/(^|[^\\])m/g, "$1" + m);

    var s = utc ? date.getUTCSeconds() : date.getSeconds();
    format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
    format = format.replace(/(^|[^\\])s/g, "$1" + s);

    var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
    format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
    f = Math.round(f / 10);
    format = format.replace(/(^|[^\\])f/g, "$1" + f);

    var T = H < 12 ? "AM" : "PM";
    format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
    format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

    var t = T.toLowerCase();
    format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
    format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

    var tz = -date.getTimezoneOffset();
    var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
    if (!utc) {
        tz = Math.abs(tz);
        var tzHrs = Math.floor(tz / 60);
        var tzMin = tz % 60;
        K += ii(tzHrs) + ":" + ii(tzMin);
    }
    format = format.replace(/(^|[^\\])K/g, "$1" + K);

    var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
    format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
    format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

    format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
    format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

    format = format.replace(/\\(.)/g, "$1");

    return format;
};

function formatTriggerRuleOpStr( scope, reftime )
{
    var rtnStr = "";
      
    if( "minute" == scope )
    {
        return formatDate( reftime, "ss", false ) + " sec each minute";
    }
    else if( "hour" == scope )
    {
        return formatDate( reftime, "mm:ss", false ) + " min/sec each hour";
    }
    else if( "day" == scope )
    {
        return formatDate( reftime, "h:mm:ss TT", false ) + " each day";
    }
    else if( "week" == scope )
    {
        return formatDate( reftime, "ddd h:mm:ss TT", false ) + " each week";
    }
    else if( "even_week" == scope )
    {
        return formatDate( reftime, "ddd h:mm:ss TT", false ) + " of EVEN weeks";
    }
    else if( "odd_week" == scope )
    {
        return formatDate( reftime, "ddd h:mm:ss TT", false ) + " of ODD weeks";
    }
    else if( "year" == scope )
    {
        rtnStr = "Need to implement";
    }

    return rtnStr;
}

function pad( number )
{
    var r = String(number);
    if ( r.length === 1 )
    {
        r = '0' + r;
    }
    return r;
}

function formatRestUTCDate( date ) 
{
    return date.getUTCFullYear() 
           + pad( date.getUTCMonth() + 1 ) 
           + pad( date.getUTCDate() )
           + 'T' 
           + pad( date.getUTCHours() )
           + pad( date.getUTCMinutes() )
           + pad( date.getUTCSeconds() );
};

// A simple class for name value pairs.
function SOField( name, value )
{
    this.name  = name;
    this.value = value;
}

function GenObject()
{
    this.typeStr   = "";
    this.fieldList = [];

    this.getField = function( nameStr )
    {
        for( field in this.fieldList )
        {
            if( this.fieldList[ field ].name == nameStr )
            {
                return this.fieldList[ field ].value;
            }
        }

        return "";
    }
}

// Create an object for the schedule rules
function ScheduleRule( clientObj )
{
    this.id        = "";
    this.name      = "";
    this.desc      = "";
    this.enabled   = false;
    this.zgID      = "";
    this.tgID      = "";

    this.clientObj = clientObj;

    this.getObjRootNodeName = function()
    {
        return "schedule-event-rule";
    }

    this.setFromGenObj = function( genObj )
    {   
        console.log( "setFromGenObj" );

        this.id   = genObj.getField('id');
        this.name = genObj.getField('name');
        this.desc = genObj.getField('desc');
        this.zgID = genObj.getField('zone-group-id');
        this.tgID = genObj.getField('trigger-group-id');

        if( genObj.getField('enabled') == 'true' )
            this.enabled = true;
        else
            this.enabled = false;
    }

    this.updateFromGenObj = function( genObj )
    {   
        console.log( "updateFromGenObj" );

        this.id   = genObj.getField('id');
        this.name = genObj.getField('name');
        this.desc = genObj.getField('desc');
        this.zgID = genObj.getField('zone-group-id');
        this.tgID = genObj.getField('trigger-group-id');

        if( genObj.getField('enabled') == 'true' )
            this.enabled = true;
        else
            this.enabled = false;
    }

    this.handleServerRefresh = function( genObj )
    {   
        console.log( "handleServerRefresh" );
        this.updateFromGenObj( genObj );
    }

    this.refreshObjectFromServer = function()
    {   
        console.log( "refreshObjectFromServer" );
        var updateCallback = this.handleServerRefresh.bind(this);
        this.clientObj.getObjectDataForID( "proxy/schedule/rules", "schedule-event-rule", this.id, updateCallback );
    }

    this.debugPrint = function()
    {
        var debugStr = this.id +  ": " + this.name + " (" + (this.enabled ? "enabled" : "disabled") + ") - " + this.desc + " zgID: " + this.zgID + " tgID: " + this.tgID;
        console.log( debugStr );
    }
}

// Define a zone definition object
function ZoneDefinition( clientObj )
{
    this.id     = "";
    this.name   = "";
    this.desc   = "";
    this.pathid = "";

    this.clientObj = clientObj;

    this.getObjRootNodeName = function()
    {
        return "zone";
    }

    this.setFromGenObj = function( genObj )
    {   
        console.log( "setFromGenObj" );

        this.id   = genObj.getField('id');
        this.name = genObj.getField('name');
        this.desc = genObj.getField('desc');
        this.zgID = genObj.getField('map-path-id');
    }

    this.updateFromGenObj = function( genObj )
    {   
        console.log( "updateFromGenObj" );

        this.id   = genObj.getField('id');
        this.name = genObj.getField('name');
        this.desc = genObj.getField('desc');
        this.zgID = genObj.getField('map-path-id');
    }

    this.handleServerRefresh = function( genObj )
    {   
        console.log( "handleServerRefresh" );
        this.updateFromGenObj( genObj );
    }

    this.refreshObjectFromServer = function()
    {   
        console.log( "refreshObjectFromServer" );
        var updateCallback = this.handleServerRefresh.bind(this);
        this.clientObj.getObjectDataForID( "proxy/zones", "zone", this.id, updateCallback );
    }

    this.prepareForRemoval = function()
    {
        console.log("prepareForRemoval");
    }

}

// Create an object for a zone rule
function ZoneRule( parentZG )
{
    this.id        = "";
    this.duration  = 0;
    this.type      = "";
    this.zoneID    = "";

    this.parent    = parentZG;

    this.getObjRootNodeName = function()
    {
        return "schedule-zone-rule";
    }

    this.getRuleDisplayStr = function()
    {
        return this.zoneID + " -- " + this.duration + " sec";
    }

    this.setFromGenObj = function( genObj )
    {   
        console.log( "setFromGenObj" );

        this.id       = genObj.getField('id');
        this.duration = parseInt( genObj.getField('duration') );
        this.type     = genObj.getField('type');
        this.zoneID   = genObj.getField('zoneid');
    }

    this.updateFromGenObj = function( genObj )
    {   
        console.log( "updateFromGenObj" );

        this.id       = genObj.getField('id');
        this.duration = parseInt( genObj.getField('duration') );
        this.type     = genObj.getField('type');
        this.zoneID   = genObj.getField('zoneid');
    }

    this.handleServerRefresh = function( genObj )
    {   
        console.log( "handleServerRefresh" );
        this.updateFromGenObj( genObj );

        this.parent.handleZoneRuleRefresh( this.id );
    }

    this.refreshObjectFromServer = function()
    {   
        console.log( "refreshObjectFromServer" );
        var updateCallback = this.handleServerRefresh.bind(this);
        var url = "proxy/schedule/zone-groups/" + this.parent.id + "/members/";
        this.parent.clientObj.getObjectDataForID( url, "schedule-zone-rule", this.id, updateCallback );
    }

    this.prepareForRemoval = function()
    {
        console.log("prepareForRemoval");
        //this.removeAllUI();
    }
}

// Create an object for a zone group
function ZoneGroup( clientObj )
{
    this.id        = "";
    this.name      = "";
    this.desc      = "";

    this.zrObjList = [];

    this.clientObj = clientObj;

    this.getObjRootNodeName = function()
    {
        return "schedule-zone-group";
    }

    this.getRuleList = function()
    {
        return this.zrObjList;
    }

    this.setFromGenObj = function( genObj )
    {   
        console.log( "setFromGenObj" );

        this.id   = genObj.getField('id');
        this.name = genObj.getField('name');
        this.desc = genObj.getField('desc');
    }

    this.updateFromGenObj = function( genObj )
    {   
        console.log( "updateFromGenObj" );

        this.id   = genObj.getField('id');
        this.name = genObj.getField('name');
        this.desc = genObj.getField('desc');
    }

    this.handleZoneRuleRefresh = function( zrid )
    {
        console.log( "handleZoneRuleRefresh" );
    }

    this.newZoneRuleObjectCallback = function( id )
    {
        console.log( "Add ZR: " + id );

        // Create a new object
        var zrObj  = new ZoneRule( this );
        zrObj.id   = id;
    
        return zrObj;
    }

    this.handleZoneRulesIDUpdate = function( idList )
    {
        console.log("===RULES UPDATE===");
        console.log( idList );
        var newZRCallback = this.newZoneRuleObjectCallback.bind(this);
        this.clientObj.handleRESTObjectListUpdate( this.zrObjList, newZRCallback, idList );
    }

    this.handleServerRefresh = function( genObj )
    {   
        console.log( "handleServerRefresh" );
        this.updateFromGenObj( genObj );

        // Get all of the associated zone rules
        var handleZRIDUpdate = this.handleZoneRulesIDUpdate.bind(this);
        var url = "proxy/schedule/zone-groups/" + this.id + "/members"
        this.clientObj.getObjIDList( url, "zone-rule-list", handleZRIDUpdate );
    }

    this.refreshObjectFromServer = function()
    {   
        console.log( "refreshObjectFromServer" );
        var updateCallback = this.handleServerRefresh.bind(this);
        this.clientObj.getObjectDataForID( "proxy/schedule/zone-groups", "schedule-zone-group", this.id, updateCallback );
    }

    this.debugPrint = function()
    {
        var debugStr = this.id +  ": " + this.name + " - " + this.desc;
        console.log( debugStr );
    }
}

// Create an object for a zone rule
function TriggerRule( parentTG )
{
    this.id       = "";
    this.reftime  = 0;
    this.type     = "";
    this.scope    = "";

    this.parent    = parentTG;

    this.getObjRootNodeName = function()
    {
        return "schedule-trigger-rule";
    }

    this.getRuleDisplayStr = function()
    {
        return this.getTimeString();
    }

    this.setFromGenObj = function( genObj )
    {   
        console.log( "setFromGenObj" );

        this.id       = genObj.getField('id');
        this.type     = genObj.getField('type');
        this.scope    = genObj.getField('scope');

        var refTime = genObj.getField( 'reftime' );

        var expTime = refTime.substring(0, 4) + "-" + refTime.substring(4, 6) + "-" + refTime.substring(6,8);
        expTime += "T";
        expTime += refTime.substring(9, 11) + ":" + refTime.substring(11, 13) + ":" + refTime.substring(13, 15);

        this.reftime  = new Date( Date.parse( expTime ) );
    }

    this.updateFromGenObj = function( genObj )
    {   
        console.log( "updateFromGenObj" );

        this.id       = genObj.getField('id');
        this.type     = genObj.getField('type');
        this.scope    = genObj.getField('scope');

        var refTime = genObj.getField( 'reftime' );

        var expTime = refTime.substring(0, 4) + "-" + refTime.substring(4, 6) + "-" + refTime.substring(6,8);
        expTime += "T";
        expTime += refTime.substring(9, 11) + ":" + refTime.substring(11, 13) + ":" + refTime.substring(13, 15);

        this.reftime  = new Date( Date.parse( expTime ) );
    }

    this.handleServerRefresh = function( genObj )
    {   
        console.log( "handleServerRefresh" );
        this.updateFromGenObj( genObj );

        this.parent.handleTriggerRuleRefresh( this.id );
    }

    this.refreshObjectFromServer = function()
    {   
        console.log( "refreshObjectFromServer" );
        var updateCallback = this.handleServerRefresh.bind(this);
        var url = "proxy/schedule/trigger-groups/" + this.parent.id + "/members/";
        this.parent.clientObj.getObjectDataForID( url, "schedule-trigger-rule", this.id, updateCallback );
    }

    this.getTimeString = function()
    {
        return formatTriggerRuleOpStr( this.scope, this.reftime );
    }

}

// Create an object for a trigger group
function TriggerGroup( clientObj )
{
    this.id        = "";
    this.name      = "";
    this.desc      = "";

    this.trObjList = [];

    this.clientObj = clientObj;

    this.getObjRootNodeName = function()
    {
        return "schedule-trigger-group";
    }

    this.getRuleList = function()
    {
        return this.trObjList;
    }

    this.setFromGenObj = function( genObj )
    {   
        console.log( "setFromGenObj" );

        this.id   = genObj.getField('id');
        this.name = genObj.getField('name');
        this.desc = genObj.getField('desc');
    }

    this.updateFromGenObj = function( genObj )
    {   
        console.log( "updateFromGenObj" );

        this.id   = genObj.getField('id');
        this.name = genObj.getField('name');
        this.desc = genObj.getField('desc');
    }

    this.handleTriggerRuleRefresh = function( trid )
    {
        console.log( "handleTriggerRuleRefresh" );
    }

    this.newTriggerRuleObjectCallback = function( id )
    {
        console.log( "Add TR: " + id );

        // Create a new object
        var trObj  = new TriggerRule( this );
        trObj.id   = id;
    
        return trObj;
    }

    this.handleTriggerRulesIDUpdate = function( idList )
    {
        console.log("===RULES UPDATE===");
        console.log( idList );
        var newTRCallback = this.newTriggerRuleObjectCallback.bind(this);
        this.clientObj.handleRESTObjectListUpdate( this.trObjList, newTRCallback, idList );
    }

    this.handleServerRefresh = function( genObj )
    {   
        console.log( "handleServerRefresh" );
        this.updateFromGenObj( genObj );

        // Get all of the associated zone rules
        var handleTRIDUpdate = this.handleTriggerRulesIDUpdate.bind(this);
        var url = "proxy/schedule/trigger-groups/" + this.id + "/members"
        this.clientObj.getObjIDList( url, "trigger-rule-list", handleTRIDUpdate );
    }

    this.refreshObjectFromServer = function()
    {   
        console.log( "refreshObjectFromServer" );
        var updateCallback = this.handleServerRefresh.bind(this);
        this.clientObj.getObjectDataForID( "proxy/schedule/trigger-groups", "schedule-trigger-group", this.id, updateCallback );
    }

    this.debugPrint = function()
    {
        var debugStr = this.id +  ": " + this.name + " - " + this.desc;
        console.log( debugStr );
    }
}

// Hold the data for a log entry
function PastScheduleLogEntry()
{
    this.id     = "";
    this.msg    = "";
    this.seqnum = 0;
    this.tstamp = new Date();

/*
    this.setFromGenObj = function( genObj )
    {   
        console.log( "setFromGenObj" );

        this.id       = genObj.getField('id');
        this.type     = genObj.getField('type');
        this.scope    = genObj.getField('scope');

        var refTime = genObj.getField( 'reftime' );

        var expTime = refTime.substring(0, 4) + "-" + refTime.substring(4, 6) + "-" + refTime.substring(6,8);
        expTime += "T";
        expTime += refTime.substring(9, 11) + ":" + refTime.substring(11, 13) + ":" + refTime.substring(13, 15);

        this.reftime  = new Date( Date.parse( expTime ) );
    }
*/

}

// Create the base irrigation client object
function IrrigationClient()
{
    this.srObjList = [];
    this.zgObjList = [];
    this.tgObjList = [];
    this.zdObjList = [];

    this.updateCB = null;

    this.getObjIDList = function( url, listName, listCallback )
    {
        var localCB = this.updateCB;

        $.get( url, function( data, status ){
            console.log( "get status: " + status );
            console.log( "get data: " + data );

            var idList = [];

            if( $( data ).is( listName ) == false )
            {
                return;
            }

            $( data ).find('id').each( function( index ){
                console.log("Each Function");
                console.log( index, $(this).text() );

                idList[ index ] = $(this).text();
            });
           
            // Special case zoneid until the server side changes.
            $( data ).find('zoneid').each( function( index ){
                console.log("Each ZoneID Function");
                console.log( index, $(this).text() );

                idList[ index ] = $(this).text();
            });

            // Make a callback with the list
            listCallback( idList );
    
            // Callback for UI Update
            localCB();
        });
    }

    this.getObjectDataForID = function( url, nodeName, id, objCallback )
    {
        var idURL = url + "/" + id;
        var localCB = this.updateCB;

        $.get( idURL, function( data, status )
        {
            console.log( "get status: " + status );
            console.log( "get data: " + data );

            if( $( data ).is( nodeName ) == false )
            {
                return;
            }

            var genObj = new GenObject();
            
            genObj.nodeName = nodeName;

            // Parse attributes of parent element
            console.log( $( data )[0].attributes );
            $.each( $( data )[0].attributes, function() 
            {
                console.log("Attr Each");
                console.log( this.name + " : " + this.value );

                var field = new SOField( this.name, this.value )
                genObj.fieldList.push( field );
            });

            // Parse child elements
            $( data ).children().each( function( index )
            {
                //console.log("Each Function");
                //console.log( index, $(this).prop( "tagName" ).toLowerCase() );
                //console.log( index, $(this).text() );

                var field = new SOField( $(this).prop( "tagName" ).toLowerCase(), $(this).text() )
                genObj.fieldList.push( field );
            });
           
            // Make a callback with the list
            objCallback( genObj );

            // Callback for UI Update
            localCB();
        });
    } 

    this.getObjsForIDList = function( url, nodeName, idList, objCallback )
    {
        for( id in idList )
        {
            this.getObjectDataFromID( url, nodeName, idList[id], objCallback );
        }
    } 

    this.setUIUpdateCallback = function( callback )
    {
        this.updateCB = callback;
        console.log( this.updateCB );
    }

    this.handleRESTObjectListUpdate = function( objectList, newObjectCallback, idList )
    {
        var pruneList = [];

        // Prune the internal list of anything that isn't in the
        // newly returned list
        for( index in objectList )
        {
            var found = false;
            for( id in idList )
            {
                console.log( "Prune - objList: " + index + " " + objectList[ index ].id );
                console.log( "Prune - idList: " + id + " " + idList[ id ] );

                // If we find it then it's still valid and we 
                // move to the next.
                if( objectList[ index ].id == idList[ id ] )
                {
                    found = true;
                    break;
                }
            }

            // If we made it to here then it exists
            // in the internal list but not the updated
            // list, so prune it.
            if( found == false )
            {
                pruneList.push( index );
            }
        }

        // Now do the pruning
        for( index in pruneList )
        {
            console.log( "prune: " + index + " " + pruneList[index] );

            objectList[ pruneList[index] ].prepareForRemoval(); 
            objectList.splice( pruneList[index], 1 );
        }

        // Create any new objects
        for( id in idList )
        {
            var found = false;
            for( index in objectList )
            {
                 if( idList[id] == objectList[index].id )
                 {
                     found = true;
                     break;
                 }
            }
        
            if( found == false )
            {
                var obj = newObjectCallback( idList[id] );
                objectList.push( obj );
            }
        }
     
        // Fire off updates for each of the objects
        for( index in objectList )
        {
            objectList[ index ].refreshObjectFromServer();
        }

    }

    this.deleteRESTObject = function( url, idStr, completeCallback )
    {
        console.log( "Client Delete REST Object: " + url + " " + idStr );

        var fullURL = url + "/" + idStr;

        // Send data to server through the Ajax call
        // action is functionality we want to call and outputJSON is our data
        $.ajax({url: fullURL,
                type: 'delete',                   
                async: 'true',
                dataType: 'xml',
                beforeSend: function()
                {
                    // This callback function will trigger before data is sent
                    $.mobile.loading( 'show' );
                },
                complete: function() 
                {
                    // This callback function will trigger on data sent/received complete
                    $.mobile.loading( 'hide' ); // This will hide ajax spinner
                },
                success: function( data, textStatus, jqXHR ) 
                {
                    console.log( "Delete Done: " + textStatus );
                    completeCallback();                         
                },
                error: function( request, error ) 
                {
                    // This callback function will trigger on unsuccessful action                
                    alert('Network error has occurred please try again!');
                }
        });                   
    }

    this.createRESTObject = function( url, postData, completeCallback )
    {
        console.log( 'Ajax post: ' + postData );

        // Send data to server through the Ajax call
        // action is functionality we want to call and outputJSON is our data
        $.ajax({url: url,
                data: postData,
                type: 'post',                   
                async: 'true',
                contentType: 'application/xml',
                dataType: 'xml',
                beforeSend: function()
                {
                    // This callback function will trigger before data is sent
                    $.mobile.loading( 'show' );
                },
                complete: function() 
                {
                    // This callback function will trigger on data sent/received complete
                    $.mobile.loading( 'hide' ); // This will hide ajax spinner
                },
                success: function( data, textStatus, jqXHR ) 
                {
                    console.log( "Post Done: " + textStatus );
                    console.log( jqXHR.getAllResponseHeaders() );

                    completeCallback();                         
                },
                error: function( request, error ) 
                {
                    // This callback function will trigger on unsuccessful action                
                    alert('Network error has occurred please try again!');
                }
        });                   
    }

    this.handleZoneDefinitionIDUpdate = function( idList )
    {
        var pruneList = [];

        // Prune the internal list of anything that isn't in the
        // newly returned list
        for( zdObj in this.zdObjList )
        {
            var found = false;
            for( id in idList )
            {
                console.log( "Prune - srcObjList: " + zdObj + " " + this.zdObjList[ zdObj ].id );
                console.log( "Prune - idList: " + id + " " + idList[ id ] );

                // If we find it then it's still valid and we 
                // move to the next.
                if( this.zdObjList[ zdObj ].id == idList[ id ] )
                {
                    found = true;
                    break;
                }
            }

            // If we made it to here then it exists
            // in the internal list but not the updated
            // list, so prune it.
            if( found == false )
            {
                pruneList.push( zdObj );
            }
        }

        // Now do the pruning
        for( zdObj in pruneList )
        {
            console.log( "prune: " + zdObj + " " + pruneList[zdObj] );

            this.zdObjList[ pruneList[zdObj] ].prepareForRemoval(); 
            this.zdObjList.splice( pruneList[zdObj], 1 );
        }

        // Create any new objects
        for( id in idList )
        {
            var found = false;
            for( zdObj in this.zdObjList )
            {
                 if( idList[id] == this.zdObjList[zdObj].id )
                 {
                     found = true;
                     break;
                 }
            }
        
            if( found == false )
            {
                console.log( "Add ZD: " + idList[id] );
                // Create a new object
                var zdObj = new ZoneDefinition( this );
                zdObj.id = idList[id];
                this.zdObjList.push( zdObj );
            }
        }
     
        // Fire off updates for each of the objects
        for( zdObj in this.zdObjList )
        {
            this.zdObjList[ zdObj ].refreshObjectFromServer();
        }

    }

    this.updateZoneDefinitions = function()
    {
        var handleZDIDUpdate = this.handleZoneDefinitionIDUpdate.bind(this);
        this.getObjIDList( "proxy/zones", "hnode-zonelist", handleZDIDUpdate );
    }

    this.getZoneDefinitionList = function()
    {
        return this.zdObjList;
    }

    this.handleScheduleRuleIDUpdate = function( idList )
    {
        var pruneList = [];

        // Prune the internal list of anything that isn't in the
        // newly returned list
        for( srObj in this.srObjList )
        {
            var found = false;
            for( id in idList )
            {
                console.log( "Prune - srcObjList: " + srObj + " " + this.srObjList[ srObj ].id );
                console.log( "Prune - idList: " + id + " " + idList[ id ] );

                // If we find it then it's still valid and we 
                // move to the next.
                if( this.srObjList[ srObj ].id == idList[ id ] )
                {
                    found = true;
                    break;
                }
            }

            // If we made it to here then it exists
            // in the internal list but not the updated
            // list, so prune it.
            if( found == false )
            {
                pruneList.push( srObj );
            }
        }

        // Now do the pruning
        for( srObj in pruneList )
        {
            console.log( "prune: " + srObj + " " + pruneList[srObj] );

            this.srObjList[ pruneList[srObj] ].prepareForRemoval(); 
            this.srObjList.splice( pruneList[srObj], 1 );
        }

        // Create any new objects
        for( id in idList )
        {
            var found = false;
            for( srObj in this.srObjList )
            {
                 if( idList[id] == this.srObjList[srObj].id )
                 {
                     found = true;
                     break;
                 }
            }
        
            if( found == false )
            {
                console.log( "Add SR: " + idList[id] );
                // Create a new object
                var srObj = new ScheduleRule( this );
                srObj.id = idList[id];
                this.srObjList.push( srObj );
            }
        }
     
        // Fire off updates for each of the objects
        for( srObj in this.srObjList )
        {
            this.srObjList[ srObj ].refreshObjectFromServer();
        }

    }

    this.updateScheduleRules = function()
    {
        var idList = [];

        var handleSRIDUpdate = this.handleScheduleRuleIDUpdate.bind(this);
        this.getObjIDList( "proxy/schedule/rules", "event-rule-list", handleSRIDUpdate );
    }

    this.deleteScheduleRule = function( idStr )
    {
        console.log( "Client Delete Schedule Rule: " + idStr );

        var completeCallback = this.updateScheduleRules.bind(this);

        // Send data to server through the Ajax call
        // action is functionality we want to call and outputJSON is our data
        $.ajax({url: 'proxy/schedule/rules/' + idStr,
                type: 'delete',                   
                async: 'true',
                dataType: 'xml',
                beforeSend: function()
                {
                    // This callback function will trigger before data is sent
                    $.mobile.loading( 'show' );
                },
                complete: function() 
                {
                    // This callback function will trigger on data sent/received complete
                    $.mobile.loading( 'hide' ); // This will hide ajax spinner
                },
                success: function( data, textStatus, jqXHR ) 
                {
                    console.log( "Delete Done: " + textStatus );
                    completeCallback();                         
                },
                error: function( request, error ) 
                {
                    // This callback function will trigger on unsuccessful action                
                    alert('Network error has occurred please try again!');
                }
        });                   
    }

    this.createNewScheduleRule = function( name, desc )
    {
        var postData = '<schedule-event-rule>';
        postData += '<enabled>false</enabled>';
        postData += '<trigger-group-id></trigger-group-id>';
        postData += '<zone-group-id></zone-group-id>';
        postData += '<name>' + name + '</name>';
        postData += '<desc>' + desc + '</desc>';
        postData += '</schedule-event-rule>';

        var completeCallback = this.updateScheduleRules.bind(this);

        console.log( 'Ajax post: ' + postData );

        // Send data to server through the Ajax call
        // action is functionality we want to call and outputJSON is our data
        $.ajax({url: 'proxy/schedule/rules',
                data: postData,
                type: 'post',                   
                async: 'true',
                contentType: 'application/xml',
                dataType: 'xml',
                beforeSend: function()
                {
                    // This callback function will trigger before data is sent
                    $.mobile.loading( 'show' );
                },
                complete: function() 
                {
                    // This callback function will trigger on data sent/received complete
                    $.mobile.loading( 'hide' ); // This will hide ajax spinner
                },
                success: function( data, textStatus, jqXHR ) 
                {
                    console.log( "Post Done: " + textStatus );
                    console.log( jqXHR.getAllResponseHeaders() );

                    completeCallback();                         
                },
                error: function( request, error ) 
                {
                    // This callback function will trigger on unsuccessful action                
                    alert('Network error has occurred please try again!');
                }
        });                   
    }

    this.updateScheduleRuleName = function( srID, name )
    {
        var putData = '<schedule-event-rule>';
        putData += '<name>'+name+'</name>';
        putData += '</schedule-event-rule>';

        var putURL = 'proxy/schedule/rules/' + srID;

        var completeCallback = this.updateScheduleRules.bind(this);

        console.log( 'Ajax put: ' + putData );

        // Send data to server through the Ajax call
        // action is functionality we want to call and outputJSON is our data
        $.ajax({url: putURL,
                data: putData,
                type: 'put',                   
                async: 'true',
                contentType: 'application/xml',
                dataType: 'xml',
                beforeSend: function()
                {
                    // This callback function will trigger before data is sent
                    $.mobile.loading( 'show' );
                },
                complete: function() 
                {
                    // This callback function will trigger on data sent/received complete
                    $.mobile.loading( 'hide' ); // This will hide ajax spinner
                },
                success: function( data, textStatus, jqXHR ) 
                {
                    console.log( "Put Done: " + textStatus );
                    console.log( jqXHR.getAllResponseHeaders() );

                    completeCallback();                         
                },
                error: function( request, error ) 
                {
                    // This callback function will trigger on unsuccessful action                
                    alert('Network error has occurred please try again!');
                }
        });
    }

    this.updateScheduleRuleDesc = function( srID, desc )
    {
        var putData = '<schedule-event-rule>';
        putData += '<desc>'+desc+'</desc>';
        putData += '</schedule-event-rule>';

        var putURL = 'proxy/schedule/rules/' + srID;

        var completeCallback = this.updateScheduleRules.bind(this);

        console.log( 'Ajax put: ' + putData );

        // Send data to server through the Ajax call
        // action is functionality we want to call and outputJSON is our data
        $.ajax({url: putURL,
                data: putData,
                type: 'put',                   
                async: 'true',
                contentType: 'application/xml',
                dataType: 'xml',
                beforeSend: function()
                {
                    // This callback function will trigger before data is sent
                    $.mobile.loading( 'show' );
                },
                complete: function() 
                {
                    // This callback function will trigger on data sent/received complete
                    $.mobile.loading( 'hide' ); // This will hide ajax spinner
                },
                success: function( data, textStatus, jqXHR ) 
                {
                    console.log( "Put Done: " + textStatus );
                    console.log( jqXHR.getAllResponseHeaders() );

                    completeCallback();                         
                },
                error: function( request, error ) 
                {
                    // This callback function will trigger on unsuccessful action                
                    alert('Network error has occurred please try again!');
                }
        });
    }

    this.updateScheduleRuleZoneGroup = function( srID, zgID )
    {
        var putData = '<schedule-event-rule>';
        putData += '<zone-group-id>'+zgID+'</zone-group-id>';
        putData += '</schedule-event-rule>';

        var putURL = 'proxy/schedule/rules/' + srID;

        var completeCallback = this.updateScheduleRules.bind(this);

        console.log( 'Ajax put: ' + putData );

        // Send data to server through the Ajax call
        // action is functionality we want to call and outputJSON is our data
        $.ajax({url: putURL,
                data: putData,
                type: 'put',                   
                async: 'true',
                contentType: 'application/xml',
                dataType: 'xml',
                beforeSend: function()
                {
                    // This callback function will trigger before data is sent
                    $.mobile.loading( 'show' );
                },
                complete: function() 
                {
                    // This callback function will trigger on data sent/received complete
                    $.mobile.loading( 'hide' ); // This will hide ajax spinner
                },
                success: function( data, textStatus, jqXHR ) 
                {
                    console.log( "Put Done: " + textStatus );
                    console.log( jqXHR.getAllResponseHeaders() );

                    completeCallback();                         
                },
                error: function( request, error ) 
                {
                    // This callback function will trigger on unsuccessful action                
                    alert('Network error has occurred please try again!');
                }
        });
    }

    this.updateScheduleRuleTriggerGroup = function( srID, tgID )
    {
        var putData = '<schedule-event-rule>';
        putData += '<trigger-group-id>'+tgID+'</trigger-group-id>';
        putData += '</schedule-event-rule>';

        var putURL = 'proxy/schedule/rules/' + srID;

        var completeCallback = this.updateScheduleRules.bind(this);

        console.log( 'Ajax put: ' + putData );

        // Send data to server through the Ajax call
        // action is functionality we want to call and outputJSON is our data
        $.ajax({url: putURL,
                data: putData,
                type: 'put',                   
                async: 'true',
                contentType: 'application/xml',
                dataType: 'xml',
                beforeSend: function()
                {
                    // This callback function will trigger before data is sent
                    $.mobile.loading( 'show' );
                },
                complete: function() 
                {
                    // This callback function will trigger on data sent/received complete
                    $.mobile.loading( 'hide' ); // This will hide ajax spinner
                },
                success: function( data, textStatus, jqXHR ) 
                {
                    console.log( "Put Done: " + textStatus );
                    console.log( jqXHR.getAllResponseHeaders() );

                    completeCallback();                         
                },
                error: function( request, error ) 
                {
                    // This callback function will trigger on unsuccessful action                
                    alert('Network error has occurred please try again!');
                }
        });
    }

    this.getScheduleRule = function( srid )
    {
        // Find the referenced zone group
        for( index in this.srObjList )
        {
            if( this.srObjList[index].id == srid )
            {
                return this.srObjList[index];
            }
        }

        return null;
    }

    this.getScheduleRuleList = function()
    {
        return this.srObjList;
    }

    this.newZoneGroupObjectCallback = function( id )
    {
        console.log( "Add ZG: " + id );

        // Create a new object
        var zgObj = new ZoneGroup( this );
        zgObj.id = id;
        //zgObj.addUI( "#zgListview", "#zgContent" );
    
        return zgObj;
    }

    this.handleZoneGroupsIDUpdate = function( idList )
    {
        var newZGCallback = this.newZoneGroupObjectCallback.bind(this);
        this.handleRESTObjectListUpdate( this.zgObjList, newZGCallback, idList );
    }

    this.updateZoneGroups = function()
    {
        var idList = [];

        var handleZGIDUpdate = this.handleZoneGroupsIDUpdate.bind(this);
        this.getObjIDList( "proxy/schedule/zone-groups", "zone-group-list", handleZGIDUpdate );
    }

    this.getZoneGroupList = function()
    {
        return this.zgObjList;
    }

    this.getZoneRuleList = function( zgidStr )
    {
        // Find the referenced zone group
        for( index in this.zgObjList )
        {
            if( this.zgObjList[index].id == zgidStr )
            {
                return this.zgObjList[index].getRuleList();
            }
        }

        return null;
    }

    this.deleteZoneGroup = function( idStr )
    {
        console.log( "Client Delete Zone Group: " + idStr );

        var completeCallback = this.updateZoneGroups.bind(this);
        this.deleteRESTObject( 'proxy/schedule/zone-groups/', idStr, completeCallback );
    }

    this.createNewZoneGroup = function( name, desc )
    {
        var postData = '<schedule-zone-group>';
        postData += '<name>' + name + '</name>';
        postData += '<desc>' + desc + '</desc>';
        postData += '<policy>sequencial</policy>';
        postData += '</schedule-zone-group>';

        var completeCallback = this.updateZoneGroups.bind(this);
        this.createRESTObject( 'proxy/schedule/zone-groups/', postData, completeCallback );
    }

    this.createNewZoneRule = function( zgid, zoneID, onSec, offSec )
    {
        var postData = "<schedule-zone-rule>"
        postData += "<type>" + "fixedduration" + "</type>";
        postData += "<duration>" + onSec + "</duration>";
        postData += "<zoneid>" + zoneID + "</zoneid>";
        postData += "</schedule-zone-rule>";        

        console.log( postData );

        var url = 'proxy/schedule/zone-groups/' + zgid + "/members";
        
        console.log( url );

        var completeCallback = this.updateZoneGroups.bind(this);
        this.createRESTObject( url, postData, completeCallback );
    }

    this.deleteZoneRule = function( zgid, zrid )
    {
        var url = 'proxy/schedule/zone-groups/' + zgid + '/members/';
        
        console.log( url );

        var completeCallback = this.updateZoneGroups.bind(this);
        this.deleteRESTObject( url, zrid, completeCallback );
    }

    this.newTriggerGroupObjectCallback = function( id )
    {
        console.log( "Add TG: " + id );

        // Create a new object
        var tgObj = new TriggerGroup( this );
        tgObj.id = id;
        //tgObj.addUI( "#tgListview", "#tgContent" );
    
        return tgObj;
    }

    this.handleTriggerGroupsIDUpdate = function( idList )
    {
        var newTGCallback = this.newTriggerGroupObjectCallback.bind(this);
        this.handleRESTObjectListUpdate( this.tgObjList, newTGCallback, idList );
    }

    this.updateTriggerGroups = function()
    {
        var idList = [];

        var handleTGIDUpdate = this.handleTriggerGroupsIDUpdate.bind(this);
        this.getObjIDList( "proxy/schedule/trigger-groups", "trigger-group-list", handleTGIDUpdate );
    }

    this.getTriggerGroupList = function()
    {
        return this.tgObjList;
    }

    this.getTriggerRuleList = function( tgidStr )
    {
        // Find the referenced zone group
        for( index in this.tgObjList )
        {
            if( this.tgObjList[index].id == tgidStr )
            {
                return this.tgObjList[index].getRuleList();
            }
        }

        return null;
    }

    this.deleteTriggerGroup = function( idStr )
    {
        console.log( "Client Delete Trigger Group: " + idStr );

        var completeCallback = this.updateTriggerGroups.bind(this);
        this.deleteRESTObject( 'proxy/schedule/trigger-groups/', idStr, completeCallback );
    }

    this.createNewTriggerGroup = function( name, desc )
    {
        var postData = '<schedule-trigger-group>';
        postData += '<name>' + name + '</name>';
        postData += '<desc>' + desc + '</desc>';
        postData += '</schedule-trigger-group>';

        var completeCallback = this.updateTriggerGroups.bind(this);
        this.createRESTObject( 'proxy/schedule/trigger-groups/', postData, completeCallback );
    }

    this.createNewTriggerRule = function( tgid, type, scope, refdate )
    {
        var postData = "<schedule-trigger-rule>"
        postData += "<type>" + "time" + "</type>";
        postData += "<scope>" + scope + "</scope>";
        postData += "<reftime>" + formatRestUTCDate( refdate ) + "</reftime>";
        postData += "</schedule-trigger-rule>";        

        console.log( postData );

        var url = 'proxy/schedule/trigger-groups/' + tgid + "/members";
        
        console.log( url );

        var completeCallback = this.updateTriggerGroups.bind(this);
        this.createRESTObject( url, postData, completeCallback );
    }

    this.deleteTriggerRule = function( tgid, trid )
    {
        var url = 'proxy/schedule/trigger-groups/' + tgid + '/members/';
        
        console.log( url );

        var completeCallback = this.updateTriggerGroups.bind(this);
        this.deleteRESTObject( url, trid, completeCallback );
    }

    this.getPastScheduleLog = function( listCallback )
    {
        var url = 'proxy/schedule/event-log/';

        $.get( url, function( data, status ){
            console.log( "get status: " + status );
            console.log( "get data: " + data );

            var logList = [];

            if( $( data ).is( "schedule-event-log" ) == false )
            {
                return;
            }

            $( data ).find('log-entry').each( function( index ){

                var entry = new PastScheduleLogEntry();

                // Parse child elements
                $( this ).children().each( function( index )
                {

                    switch( $(this).prop( "nodeName" ).toLowerCase() )
                    {
                        case 'event-id':
                            entry.id = $(this).text();
                        break;

                        case 'event-msg':
                            entry.msg = $(this).text();
                        break;

                        case 'seqnum':
                            entry.seqnum = parseInt( $(this).text() );
                        break;

                        case 'timestamp':
                            var refTime = $(this).text();

                            var expTime = refTime.substring(0, 4) + "-" + refTime.substring(4, 6) + "-" + refTime.substring(6,8);
                            expTime += "T";
                            expTime += refTime.substring(9, 11) + ":" + refTime.substring(11, 13) + ":" + refTime.substring(13, 15);

                            entry.tstamp = new Date( Date.parse( expTime ) );
                        break;
                    }

                });

                console.log( entry );

                logList.push( entry );
            });
   
            // Make a callback with the list
            listCallback( logList );
        });
    }

    this.debugPrint = function()
    {
        var debugStr = "Hi";
        console.log( debugStr );
    }
}

// Define the Schedule Rule UI Object
function ScheduleRuleUI( clientObj )
{
    this.clientObj = clientObj;

    this.SRACB_deleteGroup = function()
    {
        var srID = $( "#srActionName" ).attr("srid");

        console.log("sra: " + srID );
        console.log( "SRACB_deleteGroup" );

        $( "#srActionPopup" ).popup('close');

        this.clientObj.deleteScheduleRule( srID );
    }

    this.SRACB_NameBlurCB = function( )
    {
        console.log( "SRACB_NameBlurCB" );

        var srID = $( "#srActionName" ).attr("srid");
        var name = $('#srun').val();

        console.log( "sr: " + srID + "  name: " + name );

        this.clientObj.updateScheduleRuleName( srID, name );
    }

    this.SRACB_DescBlurCB = function( )
    {
        console.log( "SRACB_DescBlurCB" );

        var srID = $( "#srActionName" ).attr("srid");
        var desc = $('#srud').val();

        console.log( "sr: " + srID + "  desc: " + desc );

        this.clientObj.updateScheduleRuleDesc( srID, desc );
    }

    this.SRACB_ZoneGroupChangeCB = function( )
    {
        console.log( "SRACB_ZoneGroupChangeCB" );

        var srID = $( "#srActionName" ).attr("srid");
        var zgID = $( "#srZoneGroupSelect option:selected" ).val();

        console.log( "sr: " + srID + "  zg: " + zgID );

        this.clientObj.updateScheduleRuleZoneGroup( srID, zgID );
    }

    this.SRACB_TriggerGroupChangeCB = function( )
    {
        console.log( "SRACB_TriggerGroupChangeCB" );

        var srID = $( "#srActionName" ).attr("srid");
        var tgID = $( "#srTriggerGroupSelect option:selected" ).val();

        console.log( "sr: " + srID + "  tg: " + tgID );

        this.clientObj.updateScheduleRuleTriggerGroup( srID, tgID );
    }

    this.displaySRA = function( srid )
    {
        console.log( "SRA display: " + srid );

        // Get a copy of the Schedule Rule object
        var srObj = this.clientObj.getScheduleRule( srid );

        // Set the text fields
        $( "#srun" ).val( srObj.name );
        $( "#srud" ).val( srObj.desc );

        // Clear any old rule records
        $( "#srZoneGroupSelect" ).empty();

        // Fill the select element with the list of rules
        var zoneGroupList = this.clientObj.getZoneGroupList();

        console.log( zoneGroupList );

        for( index in zoneGroupList )
        {
            var curid = zoneGroupList[ index ].id;
            var optionStr = '<option value="' + curid + '">' + zoneGroupList[ index ].name + '</option>'; 
            $( "#srZoneGroupSelect" ).append( optionStr );

            console.log( "curid: " + curid + "  zgid: " + srObj.zgID );

            if( curid == srObj.zgID )
            {
                $( "#srZoneGroupSelect" ).val( curid ).attr('selected', true).siblings('options').removeAttr('selected');
            } 
        }

        console.log( "SRACB_changeZoneGroup-2" );

        $( "#srZoneGroupSelect" ).selectmenu( "refresh", true );

        console.log( "SRACB_changeZoneGroup-3" );


        // Clear any old rule records
        $( "#srTriggerGroupSelect" ).empty();

        // Fill the select element with the list of rules
        var triggerGroupList = this.clientObj.getTriggerGroupList();

        console.log( triggerGroupList );

        for( index in triggerGroupList )
        {
            var curid = triggerGroupList[ index ].id;
            var optionStr = '<option value="' + curid + '">' + triggerGroupList[ index ].name + '</option>'; 
            $( "#srTriggerGroupSelect" ).append( optionStr );

            console.log( "curid: " + curid + "  tgid: " + srObj.tgID );

            if( curid == srObj.tgID )
            {
                $( "#srTriggerGroupSelect" ).val( curid ).attr('selected', true).siblings('options').removeAttr('selected');
            }
        }

        $( "#srTriggerGroupSelect" ).selectmenu( "refresh", true );

        // Update the rule identity
        $("#srActionName").attr('srid', srid);
        $("#srActionName").html( srid );

        $( "#srActionPopup" ).popup('open');
    }

    // catch the form's submit event
    this.srAddButton = function() 
    { 
        console.log("sr add Button");

        this.clientObj.createNewScheduleRule( "New SR", "" );
    }

    this.initEventHandlers = function()
    {
        // Schedule Rule Actions
        $( "#srAddButton" ).off( "click" );
        var srAddCB = this.srAddButton.bind(this);
        $( "#srAddButton" ).on( "click", srAddCB );

        $( "#sraDelete" ).off("click");
        var srDeleteCB = this.SRACB_deleteGroup.bind(this);
        $( "#sraDelete" ).on( "click", srDeleteCB );

        $( "#srun" ).off( "blur" );
        var srNameBlurCB = this.SRACB_NameBlurCB.bind(this);
        $( "#srun" ).on( "blur", srNameBlurCB );

        $( "#srud" ).off( "blur" );
        var srDescBlurCB = this.SRACB_DescBlurCB.bind(this);
        $( "#srud" ).on( "blur", srDescBlurCB );

        $( "#srZoneGroupSelect" ).off( 'change' );
        var srZGChangeCB = this.SRACB_ZoneGroupChangeCB.bind(this);
        $( "#srZoneGroupSelect" ).on( 'change', srZGChangeCB );

        $( "#srTriggerGroupSelect" ).off( 'change' );
        var srTGChangeCB = this.SRACB_TriggerGroupChangeCB.bind(this);
        $( "#srTriggerGroupSelect" ).on( 'change', srTGChangeCB );

    }

    this.refreshAll = function()
    {
        this.clientObj.updateZoneDefinitions();
        this.clientObj.updateScheduleRules();
        this.clientObj.updateZoneGroups();
        this.clientObj.updateTriggerGroups();
    }

    this.update = function()
    {
        console.log("SRUI update");

        var srList = clientObj.getScheduleRuleList();

        for( srIndex in srList )
        {
            var srObj = srList[srIndex];

            var idStr       = srObj.id;
            var delClassStr = "deletetag_" + srObj.id;
            var popupIDStr  = idStr + "_popup";

            // Get rid of any existing UI elements related to this item
            $('.' + delClassStr).remove();

            // 
            Item  = '<li class="' + delClassStr + '"><a href="#">';
            Item += '<h3 class="ui-bar ui-bar-a">' + srObj.name + '</h3>';
            Item += '<div class="ui-body">';
            Item += '<table>';
            Item += '<tr><td><p>REST</p></td><td><p>' + idStr + '</p></td></tr>';
            Item += '<tr><td><p>Description</p></td><td><p>'+ srObj.desc +'</p></td></tr>';
            Item += '<tr><td></td><td><h3 class="ui-bar ui-bar-a">Zone Group</h3><p>'+ srObj.zgID +'</p></td></tr>';

            var zrList = clientObj.getZoneRuleList( srObj.zgID );

            console.log("Zone Rule List");
            console.log(zrList);

            for( index in zrList )
            {
                Item += '<tr><td></td><td><p>'+ zrList[ index ].getRuleDisplayStr() +'</p></td></tr>';
            }


            Item += '<tr><td></td><td><h3 class="ui-bar ui-bar-a">Trigger Group</h3><p>'+ srObj.tgID +'</p></td></tr>';

            var trList = clientObj.getTriggerRuleList( srObj.tgID );

            console.log("Trigger Rule List");
            console.log(trList);

            for( index in trList )
            {
                Item += '<tr><td></td><td><p>'+ trList[ index ].getRuleDisplayStr() +'</p></td></tr>';
            }


            Item += '</table>';
            Item += '</div>';
            Item += '</a><a href="#" id="' + idStr + '" >Actions</a></li>';
            $( "#srListview" ).append( Item ).trigger("create");

            $( "#srListview" ).listview( "refresh" );

            var actionCB = this.displaySRA.bind(this);

            // Setup the event for the popup
            $('#'+idStr).attr('srid', srObj.id);
            $('#'+idStr).off('click');
            $('#'+idStr).on('click', function() { console.log( $(this).attr('srid') ); actionCB( $(this).attr('srid') ); } );
        }
    }

    this.clear = function()
    {
        console.log("removeFromUI");
        var delClassStr = "deletetag_" + this.id;

        // Get rid of any existing UI elements related to this item
        $('.' + delClassStr).remove();
    }

}

// Define the UI object for Zone Groups
function ZoneGroupsUI( clientObj )
{
    this.clientObj = clientObj;

    this.ZGACB_deleteGroup = function()
    {
        console.log("zga: " + this.zgid );
        console.log( "ZGACB_deleteGroup" );

        $( "#zoneGroupAction" ).popup('close');


        if( this.clientObj != null )
        {
            this.clientObj.deleteZoneGroup( this.zgid );
        }

    }

    this.ZRACB_AddRuleButton = function() 
    { 
        console.log("zga: " + this.zgid );
        console.log("Create Rule click");

        var zoneID = $( "#azrpZoneSelect option:selected" ).val();
        var onSec   = $( "#azrpOnDuration" ).datebox('getLastDur');
        var offSec   = $( "#azrpOffDuration" ).datebox('getLastDur');

        console.log( "Zone: " + zoneID );
        console.log( "On: " + onSec );
        console.log( "Off: " + offSec );        
      
        this.clientObj.createNewZoneRule( this.zgid, zoneID, onSec, offSec );
    }

    this.ZRACB_ExitButton = function() 
    { 
        console.log("zga: " + this.zgid );
        console.log("Exit click");
        $( "#addZoneRulePopup" ).popup('close');
    }

    this.ZGACB_displayAddRule = function()
    {
        console.log("zga: " + this.zgid );
        console.log( "ZGACB_displayAddZoneRule" );

        // Clear any old rule records
        $( "#azrpZoneSelect" ).empty();

        // Fill the select element with the list of rules
        var zoneDefList = this.clientObj.getZoneDefinitionList();

        console.log( zoneDefList );

        for( index in zoneDefList )
        {
            var optionStr = '<option value="' + zoneDefList[ index ].id + '">' + zoneDefList[ index ].name + '</option>'; 
            $( "#azrpZoneSelect" ).append( optionStr );
        }

        if( zoneDefList.length != 0 )
        {
            $( "#azrpZoneSelect" ).val( zoneDefList[0].id ).attr('selected', true).siblings('options').removeAttr('selected');
        }

        $( "#azrpZoneSelect" ).selectmenu( "refresh", true );

        $( "#addZoneRulePopup" ).popup('open');
        $( "#zoneGroupAction" ).off( 'popupafterclose' );

        //console.log( $( "#" + popupIDStr ) );

    }

    this.ZGACB_deleteRuleChange = function( )
    {
        console.log( "ZGACB_deleteRuleChange" );

    }

    this.ZGACB_deleteRuleButton = function( )
    {
        console.log( "ZGACB_deleteRuleButton" );

        var zgID = this.zgid;

        var zrID = $( "#dzrpRuleSelect option:selected" ).val();

        console.log( "zg: " + zgID + "  zr: " + zrID );

        this.clientObj.deleteZoneRule( zgID, zrID );
    }

    this.ZGACB_deleteRuleExit = function( )
    {
        console.log( "ZGACB_deleteRuleExit" );

        $( "#deleteZoneRulePopup" ).popup('close');
    }

    this.ZGACB_displayDeleteRule = function()
    {
        console.log( "ZGACB_displayDeleteRule: " + this.zgid );

        // Clear any old rule records
        $( "#dzrpRuleSelect" ).empty();

        // Fill the select element with the list of rules
        var zoneRuleList = this.clientObj.getZoneRuleList( this.zgid );

        console.log( zoneRuleList );

        for( index in zoneRuleList )
        {
            var optionStr = '<option value="' + zoneRuleList[ index ].id + '">' + zoneRuleList[ index ].getRuleDisplayStr() + '</option>'; 
            $( "#dzrpRuleSelect" ).append( optionStr );
        }

        if( zoneRuleList.length != 0 )
        {
            $( "#dzrpRuleSelect" ).val( zoneRuleList[0].id ).attr('selected', true).siblings('options').removeAttr('selected');
        }

        $( "#dzrpRuleSelect" ).selectmenu( "refresh", true );

        $( "#deleteZoneRulePopup" ).popup('open');
        $( "#zoneGroupAction" ).off( 'popupafterclose' );
    }

    this.displayZGA = function( zgid )
    {
        console.log( "ZGA display: " + zgid );

        this.zgid = zgid;

        $( "#zoneGroupAction" ).popup('open');
    }

    // catch the form's submit event
    this.handleNewZG = function( e ) 
    { 
        e.preventDefault();

        this.clientObj.createNewZoneGroup( $('#zgn').val(), $('#zgd').val() );

        $( "#popupZGAdd" ).popup( 'close' );

        return false; // cancel original event to prevent form submitting
    }

    this.initEventHandlers = function()
    {
        // Zone Group Actions
        $( "#zgaDelete" ).off("click");

        var zgDeleteCB = this.ZGACB_deleteGroup.bind(this);

        $( "#zgaDelete" ).on( "click", zgDeleteCB );

        var zgNewRuleCB = this.ZGACB_displayAddRule.bind(this);

        $( "#zgaNewRule" ).on("click", function() 
        {
            $( "#zoneGroupAction" ).off( 'popupafterclose' );
            $( "#zoneGroupAction" ).on( 'popupafterclose', function() { zgNewRuleCB(); } );
            $( "#zoneGroupAction" ).popup('close');
        });

        var azrpCreateRuleCB = this.ZRACB_AddRuleButton.bind(this);
        $( "#azrpCreateRule" ).on( "click", azrpCreateRuleCB );

        var azrpExitCB = this.ZRACB_ExitButton.bind(this);
        $( "#azrpDone" ).on( "click", azrpExitCB );


        var zgDeleteRuleCB = this.ZGACB_displayDeleteRule.bind(this);

        $( "#zgaDeleteRule" ).on("click", function() 
        {
            $( "#zoneGroupAction" ).off( 'popupafterclose' );
            $( "#zoneGroupAction" ).on( 'popupafterclose', function() { zgDeleteRuleCB(); } );
            $( "#zoneGroupAction" ).popup('close');
        });

        // Delete Zone Rule Popup
        var zrChangeRuleCB = this.ZGACB_deleteRuleChange.bind(this);
        $( "#dzrpRuleSelect" ).on( 'change', zrChangeRuleCB );

        var zrDeleteRuleButtonCB = this.ZGACB_deleteRuleButton.bind(this);
        $( "#dzrpDeleteRule" ).on( "click", zrDeleteRuleButtonCB );

        var zrExitCB = this.ZGACB_deleteRuleExit.bind(this);
        $( "#dzrpDone" ).on( "click", zrExitCB );

        var submitCB = this.handleNewZG.bind(this);

        $("#zgAddForm").on('submit', submitCB );

    }

    this.refreshAll = function()
    {
        this.clientObj.updateZoneDefinitions();
        this.clientObj.updateScheduleRules();
        this.clientObj.updateZoneGroups();
        this.clientObj.updateTriggerGroups();
    }

    this.update = function()
    {
        console.log("ZGUI update");
        console.log(this.clientObj);

        // Get a list of zone groups
        var zoneGroupList = this.clientObj.getZoneGroupList();

        for( index in zoneGroupList )
        {
            var zgObj = zoneGroupList[ index ];

            var idStr       = zgObj.id;
            var delClassStr = "deletetag_" + zgObj.id;
            var popupIDStr  = idStr + "_popup";


            // Get rid of any existing UI elements related to this item
            $('.' + delClassStr).remove();

            // Add us into the main UI
            Item  = '<li class="' + delClassStr + '"><a href="#">';
            Item += '<h2>' + idStr + ": " + zgObj.name + '</h2>';
            Item += '<p>'  + zgObj.desc + '</p>';
        
            Item += '<table data-role="table" class="ui-responsive">';
            Item += '<thead><tr><th>id</th><th>Zone ID</th><th>Duration(sec)</th></tr></thead>';
            Item += '<tbody>';

            // Get a list of zone groups
            var zoneRuleList = this.clientObj.getZoneRuleList( zgObj.id );
             
            for( zrindex in zoneRuleList )
            {
                var zrObj = zoneRuleList[ zrindex ];
                Item += '<tr><td>' + zrObj.id + '</td><td>' + zrObj.zoneID + '</td><td>' + zrObj.duration + '</td></tr>';
            }

            Item += '</tbody></table>';

            Item += '</a><a href="#" id="' + idStr + '" >Actions</a></li>';

            $( "#zgListview" ).append( Item ).trigger("create");

            $( "#zgListview" ).listview( "refresh" );

            var actionCB = this.displayZGA.bind( this );

            // Setup the event for the popup
            $('#'+idStr).attr('zgid', zgObj.id);
            $('#'+idStr).off('click');
            $('#'+idStr).on('click', function() { console.log( $(this).attr('zgid') ); actionCB( $(this).attr('zgid') ); } );

        }
    }

    this.clear = function()
    {
        console.log("removeFromUI");
        var delClassStr = "deletetag_" + this.id;

        // Get rid of any existing UI elements related to this item
        $('.' + delClassStr).remove();
    }

}

// Define the UI object for Trigger Groups
function TriggerGroupsUI( clientObj )
{
    this.clientObj = clientObj;

    this.TGACB_updateTROpStr = function()
    {
        var date   = $( "#atrpCalBox" ).datebox('getTheDate');
        var time  = $( "#atrpDateBox" ).datebox('getTheDate');
        var scope = $( "#atrpScopeSelect option:selected" ).attr("value");

        date.setHours( time.getHours() );
        date.setMinutes( time.getMinutes() );
        date.setSeconds( time.getSeconds() );

        console.log( date + scope );

        var trOp = formatTriggerRuleOpStr( scope, date );
        $( "#atrpDateStr" ).text( trOp );
    }

    this.TGACB_CalBoxUpdate = function( e, passed ) 
    { 
        if( passed.method == 'set' )
        {
            console.log("CalListen: " + this.tgid );
            this.TGACB_updateTROpStr();
        }
    }

    this.TGACB_TimeBoxUpdate = function( e, passed ) 
    { 
        if( passed.method == 'offset' )
        {
            console.log("TimeListen: " + this.tgid );
            this.TGACB_updateTROpStr();
        }
    }

    this.TGACB_ScopeChange = function( event, ui ) 
    { 
        console.log("tga: " + this.tgid );
        console.log( "ScopeChange" ); 
        console.log( $( "#atrpScopeSelect option:selected" ).attr("value") );
        this.TGACB_updateTROpStr();
    }

    this.TGACB_AddRuleButton = function() 
    { 
        console.log("tga: " + this.tgid );
        console.log("Create Rule click");

        var date   = $( "#atrpCalBox" ).datebox('getTheDate');
        var time  = $( "#atrpDateBox" ).datebox('getTheDate');
        var scope = $( "#atrpScopeSelect option:selected" ).attr("value");

        date.setHours( time.getHours() );
        date.setMinutes( time.getMinutes() );
        date.setSeconds( time.getSeconds() );
        
        this.clientObj.createNewTriggerRule( this.tgid, "time", scope, date );
    }

    this.TGACB_ExitButton = function() 
    { 
        console.log("tga: " + this.tgid );
        console.log("Exit click");
        $( "#addTriggerRulePopup" ).popup('close');
    }

    this.TGACB_deleteGroup = function()
    {
        console.log("tga: " + this.tgid );
        console.log( "TGACB_deleteGroup" );

        $( "#triggerGroupAction" ).popup('close');

/*
        if( this.clientObj != null )
        {
            this.clientObj.deleteTriggerGroup( this.id );
        }
*/
    }

    this.TGACB_displayAddRule = function()
    {
        console.log("tga: " + this.tgid );
        console.log( "TGACB_displayAddTriggerRule" );

        $( "#addTriggerRulePopup" ).popup('open');
        $( "#triggerGroupAction" ).off( 'popupafterclose' );

        //console.log( $( "#" + popupIDStr ) );

    }

    this.displayTGA = function( tgid )
    {
        console.log( "TGA display: " + tgid );

        this.tgid = tgid;

        $( "#triggerGroupAction" ).popup('open');
    }

    this.TGACB_deleteRuleChange = function( )
    {
        console.log( "TGACB_deleteRuleChange" );

    }

    this.TGACB_deleteRuleButton = function( )
    {
        console.log( "TGACB_deleteRuleButton" );

        var tgID = this.tgid;

        var trID = $( "#dtrpRuleSelect option:selected" ).val();

        console.log( "tg: " + tgID + "  tr: " + trID );

        this.clientObj.deleteTriggerRule( tgID, trID );
    }

    this.TGACB_deleteRuleExit = function( )
    {
        console.log( "TGACB_deleteRuleExit" );

        $( "#deleteTriggerRulePopup" ).popup('close');
    }

    this.TGACB_displayDeleteRule = function()
    {
        //console.log("tga: " + this.curTGObj.id );
        console.log( "TGACB_displayDeleteRule" );

        // Clear any old rule records
        $( "#dtrpRuleSelect" ).empty();

        // Fill the select element with the list of rules
        var triggerRuleList = this.clientObj.getTriggerRuleList( this.tgid );

        console.log( triggerRuleList );

        for( index in triggerRuleList )
        {
            var optionStr = '<option value="' + triggerRuleList[ index ].id + '">' + triggerRuleList[ index ].getRuleDisplayStr() + '</option>'; 
            $( "#dtrpRuleSelect" ).append( optionStr );
        }

        if( triggerRuleList.length != 0 )
        {
            $( "#dtrpRuleSelect" ).val( triggerRuleList[0].id ).attr('selected', true).siblings('options').removeAttr('selected');
        }

        $( "#dtrpRuleSelect" ).selectmenu( "refresh", true );

        $( "#deleteTriggerRulePopup" ).popup('open');
        $( "#triggerGroupAction" ).off( 'popupafterclose' );
    }

    // catch the form's submit event
    this.handleNewTG = function( e ) 
    { 
        e.preventDefault();

        this.clientObj.createNewTriggerGroup( $('#tgn').val(), $('#tgd').val() );

        $( "#popupTGAdd" ).popup( 'close' );

        return false; // cancel original event to prevent form submitting
    }

    this.initEventHandlers = function()
    {
        // Trigger Group Actions
        $( "#tgaDelete" ).off("click");
        $( "#tgaNewRule" ).off("click");
        $( "#tgaDeleteRule" ).off("click");

        var tgDeleteCB = this.TGACB_deleteGroup.bind(this);

        $( "#tgaDelete" ).on( "click", tgDeleteCB );

        var newRuleCB = this.TGACB_displayAddRule.bind(this);

        $( "#tgaNewRule" ).on("click", function() 
        {
            $( "#triggerGroupAction" ).off( 'popupafterclose' );
            $( "#triggerGroupAction" ).on( 'popupafterclose', function() { newRuleCB(); } );
            $( "#triggerGroupAction" ).popup('close');
        });

        var deleteRuleCB = this.TGACB_displayDeleteRule.bind(this);


        $( "#tgaDeleteRule" ).on("click", function() 
        {
            $( "#triggerGroupAction" ).off( 'popupafterclose' );
            $( "#triggerGroupAction" ).on( 'popupafterclose', function() { deleteRuleCB(); } );
            $( "#triggerGroupAction" ).popup('close');
        });

        // New Trigger Rule Popup
        $( "#atrpCalBox" ).unbind( 'datebox' );
        $( "#atrpDateBox" ).unbind( 'datebox' );
        //$( "#atrpScopeSelect" ).off( 'change' );
        $( "#atrpCreateRule" ).off( "click" );
        $( "#atrpDone" ).off( "click" );
  
        var calUpdateCB = this.TGACB_CalBoxUpdate.bind(this);
        $( "#atrpCalBox" ).bind( 'datebox', calUpdateCB );

        var timeUpdateCB = this.TGACB_TimeBoxUpdate.bind(this);
        $( "#atrpDateBox" ).bind( 'datebox', timeUpdateCB );

        var scopeChangeCB = this.TGACB_ScopeChange.bind(this);
        $( "#atrpScopeSelect" ).on( 'change', scopeChangeCB );

        var createRuleCB = this.TGACB_AddRuleButton.bind(this);
        $( "#atrpCreateRule" ).on( "click", createRuleCB );

        var exitCB = this.TGACB_ExitButton.bind(this);
        $( "#atrpDone" ).on( "click", exitCB );

        // Delete Trigger Rule Popup
        var changeRuleCB = this.TGACB_deleteRuleChange.bind(this);
        $( "#dtrpRuleSelect" ).on( 'change', changeRuleCB );

        var deleteRuleButtonCB = this.TGACB_deleteRuleButton.bind(this);
        $( "#dtrpDeleteRule" ).on( "click", deleteRuleButtonCB );

        var exitCB = this.TGACB_deleteRuleExit.bind(this);
        $( "#dtrpDone" ).on( "click", exitCB );

        var submitCB = this.handleNewTG.bind(this);

        $("#tgAddForm").on('submit', submitCB );
    }

    this.refreshAll = function()
    {
        this.clientObj.updateZoneDefinitions();
        this.clientObj.updateScheduleRules();
        this.clientObj.updateZoneGroups();
        this.clientObj.updateTriggerGroups();
    }

    this.update = function()
    {
        console.log("TGUI update");
        console.log(this.clientObj);

        // Get a list of zone groups
        var triggerGroupList = this.clientObj.getTriggerGroupList();

        for( index in triggerGroupList )
        {
            var tgObj = triggerGroupList[ index ];

            var idStr       = tgObj.id;
            var delClassStr = "deletetag_" + tgObj.id;
            var popupIDStr  = idStr + "_popup";

            // Get rid of any existing UI elements related to this item
            $('.' + delClassStr).remove();

            // Add us into the main UI
            Item  = '<li class="' + delClassStr + '"><a href="#">';
            Item += '<h2>' + idStr + ": " + tgObj.name + '</h2>';
            Item += '<p>'  + tgObj.desc + '</p>';

            Item += '<table data-role="table" class="ui-responsive">';
            Item += '<thead><tr><th>id</th><th>type</th><th>scope</th><th>time</th></tr></thead>';
            Item += '<tbody>';

            // Get a list of zone groups
            var triggerRuleList = this.clientObj.getTriggerRuleList( tgObj.id );
             
            for( trindex in triggerRuleList )
            {
                var trObj = triggerRuleList[ trindex ];
                Item += '<tr><td>' + trObj.id + '</td><td>' + trObj.type + '</td><td>' + trObj.scope + '</td><td>' + trObj.getTimeString() + '</td></tr>';
            }

            Item += '</tbody></table>';

            Item += '</a><a href="#" id="' + idStr + '" >Actions</a></li>';

            $( "#tgListview" ).append( Item ).trigger("create");

            $( "#tgListview" ).listview( "refresh" );

            var actionCB = this.displayTGA.bind(this);

            // Setup the event for the popup
            $('#'+idStr).attr('tgid', tgObj.id)
            $('#'+idStr).off('click');
            $('#'+idStr).on('click', function() { actionCB( $(this).attr('tgid') ); } );
        }
    }

    this.clear = function()
    {
        console.log("removeFromUI");
        var delClassStr = "deletetag_" + this.id;

        // Get rid of any existing UI elements related to this item
        $('.' + delClassStr).remove();
    }

}

// The log display UI
function PastScheduleUI( clientObj )
{
    this.clientObj = clientObj;

    this.initEventHandlers = function()
    {

    }

    this.pastScheduleUpdateCallback = function( logList )
    {
        console.log( logList );
        
        for( var i = 0; i < logList.length; i++ )
        {
            var trHtml = '<tr><td>' + logList[i].tstamp + '</td><td>' + logList[i].seqnum + '</td><td>' + logList[i].id + '</td><td>' + logList[i].msg + '</td></tr>';
            $( "#past-schedule-entry-table-body" ).append( trHtml );
        }

        $( "#past-schedule-entry-table" ).table( "rebuild" );
    }

    this.refreshAll = function()
    {
        var updateCB = this.pastScheduleUpdateCallback.bind(this);
        this.clientObj.getPastScheduleLog( updateCB );
    }

}

// Create all of the management objects
irrClient = new IrrigationClient();

SRUI = new ScheduleRuleUI( irrClient );
ZGUI = new ZoneGroupsUI( irrClient );
TGUI = new TriggerGroupsUI( irrClient );
PSUI = new PastScheduleUI( irrClient );

    function parseHNodeDetail( data, status ){
        if( status != 'success' )
            return;

        console.log( data );

        //xmlDoc = $.parseXML(data);
        //$xml = $( xmlDoc );
        
        //console.log( $xml );

        $hnodeID  = $( data ).find( 'hnode' ).attr('id');
        $address  = $( data ).find( 'hnode' ).children( 'address' ).text();
        $version  = $( data ).find( 'hnode' ).children( 'version' ).text();
        $epCount  = $( data ).find( 'endpoint-count' ).text();
        $endPoint = $( data ).find( 'endpoint' );

        console.log( $hnodeID );
        console.log( $epCount );
        console.log( $endPoint );

        //liSelector = "#" + $hnodeID;

        //console.log( liSelector );

        //$( liSelector ).empty();

        Item = '<li>';
        Item = Item + '<a href="index.html">';

        Item = Item + '<h3>' + $hnodeID + '</h3>';
        Item = Item + '<p>' + $hnodeID + '</p>';
        Item = Item + '<p>' + $address + '</p>';
        Item = Item + '<p>' + $version + '</p>';

        for( var i = 0; i < $endPoint.length; i++ )
        {
            console.log( $endPoint[i] );

            $type    = $endPoint[i].getElementsByTagName( 'type' ).item(0).textContent;
            $address = $endPoint[i].getElementsByTagName( 'address' ).item(0).textContent;
            $version = $endPoint[i].getElementsByTagName( 'version' ).item(0).textContent;

            Item = Item + '<div data-role="collapsible" id="' + $hnodeID + '_' + $type + '">';
            Item = Item + '<h4>' + $type + '</h4>';
            Item = Item + '<p>' + $address + '</p>';
            Item = Item + '<p>' + $version + '</p>';
            Item = Item + '</div>';
        }

        Item = Item + '</a>';

        uiURL = "/hnode/" + $hnodeID + "/ui/";
        Item = Item + '<a href="' + uiURL + '"  data-ajax="false" rel="external" data-transition="pop">Open UI</a>';
        Item = Item + '</li>';

        console.log( Item )

        $( "#hnodeList" ).append( Item ).trigger("create");
        $( "#hnodeList" ).listview( "refresh" );
    }

    function getHNodeDetails( hnodeID ){
        url = "/hnode/" + hnodeID;
        console.log( url );
        $.get( url, function(data, status){
            parseHNodeDetail(data, status);
        });
    }

    function parseHNodeList( data, status ){
        console.log( "parseHNodeList: " + status );

        if( status != 'success' )
            return;

        console.log( data );

        $( data ).find( 'hnodeid' ).each( function( index ){
            console.log( index, $(this).text() );

            hnodeid = $(this).text();
            //Item = '<div data-role="collapsible" id="' + hnodeid + '" hnodeid="' + hnodeid +'"><h4>' + hnodeid + '</h4></div>';

            //console.log( Item )

            //$("#hnodeForm").append( Item ).trigger("create");

            getHNodeDetails( hnodeid );
        });
    }    

    function getHNodeList(){
        // Clear any existing data
        $( "#hnodeList" ).empty();

        // Get the updated data
        $.get("hnode", function(data, status){
            parseHNodeList(data, status);
        });
    }


    function parseSwitchActivityLog( data, status ){
        if( status != 'success' )
            return;

        console.log( data );

        xmlDoc = $.parseXML(data);
        $xml = $( xmlDoc );
        
        console.log( $xml );

        $swID = $xml.find( 'switch-log' ).attr('id');

        logSelector = "#activitylogdata_" + $swID;
        eventListID = "eventList" + $swID;
        eventListSelector = "#" + eventListID;

        console.log( logSelector );

        $( logSelector ).empty();
      
        Item = '<ul data-role="listview" data-inset="true" id="' + eventListID + '">';
        $swName = $xml.find( 'event' ).each(function( index ){
            console.log('Event #: ', index) ;
            tStamp = $(this).find( 'tStamp' ).text();
            rStamp = $(this).find( 'rStamp' ).text();
            msg    = $(this).find( 'msg' ).text();
            origin = $(this).find( 'origin' ).text();
            oState = $(this).find( 'old-state' ).text();
            nState = $(this).find( 'new-state' ).text();

            console.log( $swID );
            console.log( tStamp );
            console.log( rStamp );
            console.log( msg );
            console.log( origin );
            console.log( oState );
            console.log( nState );

            var d = new Date(0);
            d.setUTCSeconds( tStamp );

            console.log( d.toLocaleString() );   

            if( rStamp != 0 )
                dateString = d.toLocaleString() + " (+" + rStamp + " ms)";
            else
                dateString = d.toLocaleString();
            
            Item = Item + '<li data-role="list-divider">' + dateString + '</li>';
            Item = Item + '<li>';
            Item = Item + '<h2>' + msg + '</h2>';
            Item = Item + '<p>' + origin + '</p>';
            Item = Item + '<p class="ui-li-aside">' + oState + ' &rArr; <strong>' + nState + '</strong></p>';
            Item = Item + '</li>';
        });
        Item = Item + '</ul>';

        $( logSelector ).append( Item ).trigger("create");
        //$(eventListSelector).listview( "refresh" );
    }

    function getSwitchActivityLog( switchID ){
        //url = "get_switch_activity_log.php?switchid=" + switchID;
        url = "proxy/switches/" + switchID + "/activity";

        console.log( url );
        $.get( url, function(data, status){
            parseSwitchActivityLog(data, status);
        });
    }

    function parseZoneDetail( data, status ){
        if( status != 'success' )
            return;

        console.log( data );

        xmlDoc = $.parseXML(data);
        $xml = $( xmlDoc );
        
        console.log( $xml );

        zoneID = $xml.find( 'zone' ).attr('id');
        zoneName = $xml.find( 'name' ).text();
        zoneDesc = $xml.find( 'desc' ).text();
        //$zoneState = $xml.find( 'state' ).text();

        console.log( zoneID );
        console.log( zoneName );
        console.log( zoneDesc );
        //console.log( $zoneState );

        Item = '<div data-role="collapsible" id="' + zoneid + '" zoneid="' + zoneid +'">';
        Item = Item + '<h4>' + zoneName + '</h4>';
        Item = Item + '<div class="ui-grid-a">';
        Item = Item + '<div class="ui-block-a">';
        Item = Item + '<div class="ui-bar ui-bar-c" style="height:500px">';
        Item = Item + '<div id="' + zoneID + '_diagram" class="size1">';
        Item = Item + '</div>';
        Item = Item + '</div>';
        Item = Item + '</div>';
        Item = Item + '<div class="ui-block-b"><div class="ui-bar ui-bar-c" style="height:500px">';
        Item = Item + '<p>' + zoneName + '</p>';
        Item = Item + '<p>' + zoneDesc + '</p>';
        Item = Item + '</div></div>';
        Item = Item + '</div><!-- /grid-a -->';
        Item = Item + '</div>';

        $( "#zoneForm" ).append( Item ).trigger("create");
    }

    function getZoneDetails( zoneID ){
        //url = "get_zone_detail.php?zoneid=" + zoneID;
        url = "proxy/zones/" + zoneID;
        console.log( url );
        $.get( url, function(data, status){
            parseZoneDetail(data, status);
        });
    }

    function parseZoneList( data, status ){
        if( status != 'success' )
            return;

        console.log( data );

        xmlDoc = $.parseXML(data);
        $xml = $( xmlDoc );
        
        console.log( $xml );

        $("#zoneForm").empty();

        $xml.find( 'zoneid' ).each( function( index ){
            console.log( index, $(this).text() );

            zoneid = $(this).text();
            //Item = '<div data-role="collapsible" id="' + zoneid + '" zoneid="' + zoneid +'"><h4>Test</h4></div>';

            //$("#zoneForm").append( Item ).trigger("create");

            getZoneDetails( zoneid );
        });
    }    

    function getZoneList(){
        $.get("proxy/zones", function(data, status){
            parseZoneList(data, status);
        });
    }
 
    function turnSwitchOn($swID){
        console.log("switch on: " + $swID);
        $.ajax({
            url: 'get_switch_on.php',
            type: 'PUT',
            data: 'switchid=' + $swID,
            success: function(data) {
                console.log("switch on success");
            }
        });
    }

    function setZoneDiagram( zoneID, data ){
        console.log( data );

        $("#zone1_diagram").empty();
        $("#zone1_diagram").append(data);
    }

    function getZoneDiagram( zoneID ){
        console.log("get_zone_diagram: " + zoneID);
        $.ajax({
            url: 'proxy/maps/zone',
            type: 'GET',
            success: function(data) {
                console.log("got zone diagram");
                setZoneDiagram( zoneID, data );
            }
        });
    }

    // Define a zone function
    function zoneObj( zoneid, name, desc, pathid )
    {
        this.zoneid     = zoneid;
        this.zonename   = name;
        this.desc       = desc;
        this.pathid     = pathid;
        this.isActive   = false;
        this.isSelected = false;
        this.isFocused  = false;

        function setSelected() 
        {
            console.log("setSelected() - " + this.zonename);
            this.isSelected = true;
        }
        this.setSelected = setSelected;

        function clearSelected() 
        {
            this.isSelected = false;
        }
        this.clearSelected = clearSelected;

        function setActive()
        {
            this.isActive = true;
        }
        this.setActive = setActive;

        this.clearActive = clearActive;
        function clearActive()
        {
            this.isActive = false;
        }

        function setFocused()
        {
            this.isFocused = true;
        }
        this.setFocused = setFocused;

        function clearFocused()
        {
            this.isFocused = false;
        }        
        this.clearFocused = clearFocused;

    }

    var zoneArray = new Array();

    function irui_updateUI()
    {
        var _idleFill    = "#888";
        var _focusedFill = "#0f0"; // green
        var _activeFill  = "#f00"; // red
        var _activeAndFocusedFill = "#ff0"; // purple

        $svg = $("#svg2");

        for(var index = 0; index < zoneArray.length; index++) 
        {
            var zone = zoneArray[ index ];
            //console.log( index );

            var styleStr = "";

            if( zone.isSelected == true )
            {
                styleStr += "stroke:#000000;stroke-width:4px;";  
            }
            else
            {
                styleStr += "";  
            }

            if( zone.isFocused == true )
            {
                if( zone.isActive == true )
                {
                    styleStr += "fill:"+ _activeAndFocusedFill + ";";  
                }
                else
                {
                    styleStr += "fill:" + _focusedFill + ";";  
                }
            }
            else
            {
                if( zone.isActive == true )
                {
                    styleStr += "fill:" + _activeFill + ";";  
                }
                else
                {
                    styleStr += "fill:" + _idleFill + ";";  
                }
            }

            //console.log(styleStr);

            $("#" + zone.pathid, $svg).attr('style', styleStr);  

        }
    }

    function irui_radioMouseover( index )
    {
        console.log("RadioMouseover");
        console.log(index);
        var zone = zoneArray[ index ]
        zone.setSelected();
        irui_updateUI();
    }

    function irui_radioMouseout( index )
    {
        console.log("RadioMouseout");
        console.log(index);
        var zone = zoneArray[ index ]
        zone.clearSelected();
        irui_updateUI();
    }

    function irui_radioSelect( index )
    {
        console.log("RadioSelect");
        console.log(index);
        var zone = zoneArray[ index ]
        zone.setFocused();
    }

    function irui_radioDeselect( index )
    {
        console.log("RadioDeselect");
        console.log(index);
        var zone = zoneArray[ index ]
        zone.clearFocused();
    }

    function irui_buildUI()
    {
        $( "#zone-radio-group" ).empty();

        var groupName = "radio-choice-v-2";
        for(var index = 0; index < zoneArray.length; index++) 
        {
            var zone = zoneArray[ index ];
            console.log( index );
            console.log( zone.desc );
            console.log( zone.pathid );

            var id = groupName + (index);
            var label = zone.zonename;
            var labelID = zone.pathid + "-label";

            Item = '<input type="radio" name="' + groupName + '" id="' + id + '" zoneindex="' + index + '" value="off"/>';
            Item = Item + '<label for="' + id + '" id="' + labelID + '" zoneindex="' + index + '">' + label +'</label>';

            console.log( Item );

            $( "#zone-radio-group" ).append( Item );
            $( "#"+id ).bind( "change", function(){ $('input[name="' + $(this).attr('name') + '"]').not($(this)).trigger('deselect'); // Every member of the current radio group except the clicked one...
                                                    irui_radioSelect( $(this).attr('zoneindex') ); 
                                                    irui_updateUI();});
            $( "#"+id ).bind( "deselect", function(){ irui_radioDeselect( $(this).attr('zoneindex') ); });

            $( document ).on( "vmouseover", "#"+labelID, function(){ irui_radioMouseover( $(this).attr('zoneindex') ); });
            $( document ).on( "vmouseout", "#"+labelID, function(){ irui_radioMouseout( $(this).attr('zoneindex') ); });

        }

        $( "#zone-radio-group" ).trigger("create");

    }

    function irui_getZoneMap(){
        $("#zone-map-svg").load("proxy/maps/zone" + " svg", function() {        

           irui_buildUI();
           irui_updateUI(); 

           $("#zone-content-grid").trigger("create");
        });  
    }

    function irui_parseZoneDetail( data, status ){
        if( status != 'success' )
            return;

        console.log( data );

        xmlDoc = $.parseXML(data);
        $xml = $( xmlDoc );
        
        console.log( $xml );

        zoneID = $xml.find( 'zone' ).attr('id');
        zoneName = $xml.find( 'name' ).text();
        zoneDesc = $xml.find( 'desc' ).text();
        zoneMapPathID = $xml.find( 'map-path-id' ).text();

        console.log( zoneID );
        console.log( zoneName );
        console.log( zoneDesc );
        console.log( zoneMapPathID );

        // Find the previously created zone entry and 
        // update its fields
        for(var index = 0; index < zoneArray.length; index++) 
        {
            //console.log( index );
            if( zoneArray[ index ].zoneid == zoneID )
            {
                console.log( "Updating: " + index );
                zoneArray[ index ].zonename = zoneName;
                zoneArray[ index ].desc = zoneDesc;
                zoneArray[ index ].pathid = zoneMapPathID;
                break;
            }
        }        

        irui_buildUI();
    }

    function irui_getZoneDetails( zoneID ){
        url = "proxy/zones/" + zoneID;
        console.log( url );
        $.get( url, function(data, status){
            irui_parseZoneDetail(data, status);
        });
    }

    function irui_parseZoneList( data, status ){
        if( status != 'success' )
            return;

        console.log( data );

        xmlDoc = $.parseXML(data);
        $xml = $( xmlDoc );
        
        console.log( $xml );

        // Clear existing zone entries
        zoneArray.length = 0;

        $xml.find( 'zoneid' ).each( function( index ){
            console.log( index, $(this).text() );

            zoneid = $(this).text();

            zoneArray.push( new zoneObj( zoneid, "", "", "" ) );

            irui_getZoneDetails( zoneid );
        });
    }    

    function irui_getZoneList(){
        $.get("proxy/zones", function(data, status){
            irui_parseZoneList(data, status);
        });
    }




    function valveui_parseSwitchActivityLog( data, status ){
        if( status != 'success' )
            return;

        console.log( data );

        xmlDoc = $.parseXML(data);
        $xml = $( xmlDoc );
        
        console.log( $xml );

        $swID = $xml.find( 'switch-log' ).attr('id');

        logSelector = "#activitylogdata_" + $swID;
        eventListID = "eventList" + $swID;
        eventListSelector = "#" + eventListID;

        console.log( logSelector );

        $( logSelector ).empty();
      
        Item = '<ul data-role="listview" data-inset="true" id="' + eventListID + '">';
        $swName = $xml.find( 'event' ).each(function( index ){
            console.log('Event #: ', index) ;
            tStamp = $(this).find( 'tStamp' ).text();
            rStamp = $(this).find( 'rStamp' ).text();
            msg    = $(this).find( 'msg' ).text();
            origin = $(this).find( 'origin' ).text();
            oState = $(this).find( 'old-state' ).text();
            nState = $(this).find( 'new-state' ).text();

            console.log( $swID );
            console.log( tStamp );
            console.log( rStamp );
            console.log( msg );
            console.log( origin );
            console.log( oState );
            console.log( nState );

            var d = new Date(0);
            d.setUTCSeconds( tStamp );

            console.log( d.toLocaleString() );   

            if( rStamp != 0 )
                dateString = d.toLocaleString() + " (+" + rStamp + " ms)";
            else
                dateString = d.toLocaleString();
            
            Item = Item + '<li data-role="list-divider">' + dateString + '</li>';
            Item = Item + '<li>';
            Item = Item + '<h2>' + msg + '</h2>';
            Item = Item + '<p>' + origin + '</p>';
            Item = Item + '<p class="ui-li-aside">' + oState + ' &rArr; <strong>' + nState + '</strong></p>';
            Item = Item + '</li>';
        });
        Item = Item + '</ul>';

        $( logSelector ).append( Item ).trigger("create");
        //$(eventListSelector).listview( "refresh" );
    }

    function valveui_getSwitchActivityLog( switchID ){
        url = "proxy/switches/" + switchID + "/activity";
        console.log( url );
        $.get( url, function(data, status){
            valveui_parseSwitchActivityLog(data, status);
        });
    }

    function valveui_parseSwitchDetail( data, status ){
        if( status != 'success' )
            return;

        console.log( data );

        xmlDoc = $.parseXML(data);
        $xml = $( xmlDoc );
        
        console.log( $xml );

        $swID = $xml.find( 'switch' ).attr('id');
        $swName = $xml.find( 'name' ).text();
        $swDesc = $xml.find( 'desc' ).text();
        $swState = $xml.find( 'state' ).text();

        console.log( $swID );
        console.log( $swName );
        console.log( $swDesc );
        console.log( $swState );

        liSelector = "#swListItem_" + $swID;

        console.log( liSelector );

        $( liSelector ).empty();

        Item = '<div class="ui-grid-a">';
        Item = Item + '<div class="ui-block-a">';
        Item = Item + '<h2>' + $swName + '</h2>';
        Item = Item + '<p>' + $swDesc + '</p>';
        Item = Item + '</div>';
        Item = Item + '<div class="ui-block-b">';
        Item = Item + '<label for="' + $swID + '" class="ui-hidden-accessible">' + $swID + ':</label>';
        Item = Item + '<select name="' + $swID + '" id="' + $swID + '" data-role="slider">';
        Item = Item + '<option value="off">Off</option>';
        Item = Item + '<option value="on">On</option>';
        Item = Item + '</select>';
        Item = Item + '</div>';
        Item = Item + '</div>';
        actLogID = 'activitylog_' + $swID;
        actLogDataID = 'activitylogdata_' + $swID;
        Item = Item + '<div data-role="collapsible" id="' + actLogID + '" switchid="' + $swID + '">';
        Item = Item + '<h4>Activity Log</h4>';
        Item = Item + '<p id="' + actLogDataID + '">Events</p>';
        Item = Item + '</div>';

        $( liSelector ).append( Item ).trigger("create");
        $("#" + $swID).slider();

        $("#" + $swID).on( 'slidestop', function( event ) { 
            console.log("Slider Stop: " + $(this).val() );
            console.log("SwitchID: " + $(this).attr('id') ); 
            if( $(this).val() == 'on' )
                valveui_turnSwitchOn( $(this).attr('id') );
            else
                valveui_turnSwitchOff( $(this).attr('id') );
        });

        actLogSelector = '#' + actLogID;
        console.log( actLogSelector );

        $( actLogSelector ).bind('expand', function () {
            console.log("Expand SwitchID: " + $(this).attr('switchid') );
            valveui_getSwitchActivityLog( $(this).attr('switchid') );
        }).bind('collapse', function () {
            console.log("Collapse SwitchID: " + $(this).attr('switchid') );
        });

        $("#switchList").listview( "refresh" );
        $("#switchList").appendTo( "#switchForm" ).trigger( "create" );

    }

    function valveui_getSwitchDetails( switchID ){
        url = "proxy/switches/" + switchID;
        console.log( url );
        $.get( url, function(data, status){
            valveui_parseSwitchDetail(data, status);
        });
    }

    function valveui_parseSwitchList( data, status ){
        if( status != 'success' )
            return;

        console.log( data );

        xmlDoc = $.parseXML(data);
        $xml = $( xmlDoc );
        
        console.log( $xml );

        $("#switchList").empty();

        $xml.find( 'swid' ).each( function( index ){
            console.log( index, $(this).text() );

            Item = '<li data-role="fieldcontain" id="swListItem_' + $(this).text() + '"></li>';
            $("#switchList").append( Item );

            valveui_getSwitchDetails( $(this).text() );

        });

    }    

    function valveui_getSwitchList(){
        $.get("proxy/switches", function(data, status){
            valveui_parseSwitchList(data, status);
        });
    }
 
    function valveui_turnSwitchOn($swID){
        url = "proxy/switches/" + $swID + "?state=on";
        console.log("switch on: " + url);
        $.ajax({
            url: url,
            type: 'PUT',
            success: function(data) {
                console.log("switch on success");
            }
        });
    }

    function valveui_turnSwitchOff($swID){
        url = "proxy/switches/" + $swID + "?state=off";
        console.log("switch off: " + url);
        $.ajax({
            url: url,
            type: 'PUT',
            success: function(data) {
                console.log("switch off success");
            }
        });
    }

    function schedule_parseEventList( data, status ){
        if( status != 'success' )
            return;

        console.log( "Data dump:" );
        console.log( $( data ).find( "id" ) );
/*
        var txml = "<rss version='2.0'><channel><title>RSS Title</title></channel></rss>";
        var xmlDoc = $.parseXML( txml );
        var $xml = $( xmlDoc );
        var $id = $xml.find( "title" );
        console.log( $id.text() );
        console.log( $xml );
*/
        //$("#switchList").empty();
        //console.log( $xml.find( '*' ) );

        var eventArray = [];

        $( data ).find( 'schedule-event' ).each( function( index ){
            console.log("Each Function");
            console.log( index, $(this).find('id').text() );
            console.log( index, $(this).find('title').text() );
            console.log( index, $(this).find('start-time').text() );
            console.log( index, $(this).find('end-time').text() );

            var event = {title: $(this).find('title').text(), start: $(this).find('start-time').text(), end: $(this).find('end-time').text()};
            //var event = {title: "Title" + index, start: "2014-06-0" + (index+2) + "T16:32:00"};

            eventArray[ index ] = event;

            //Item = '<li data-role="fieldcontain" id="swListItem_' + $(this).text() + '"></li>';
            //$("#switchList").append( Item );

            //valveui_getSwitchDetails( $(this).text() );

        });

        console.log( eventArray );

        $('#calendar').fullCalendar( 'addEventSource', eventArray );
        $('#calendar').fullCalendar( 'rerenderEvents' );

    }

    function schedule_getEventList(){
        url = "schedule/events";
        console.log( url );
        $.get( url, function(data, status){
            console.log( "get status: " + status );
            console.log( "get data: " + data );
            schedule_parseEventList(data, status);
        });
    }


    function schedule_parseRuleList( data, status ){
        if( status != 'success' )
            return;

        console.log( "Data dump:" );
        console.log( $( data ).find( "id" ) );
/*
        var txml = "<rss version='2.0'><channel><title>RSS Title</title></channel></rss>";
        var xmlDoc = $.parseXML( txml );
        var $xml = $( xmlDoc );
        var $id = $xml.find( "title" );
        console.log( $id.text() );
        console.log( $xml );

        //$("#switchList").empty();
        //console.log( $xml.find( '*' ) );

        var eventArray = [];

        $( data ).find( 'schedule-event' ).each( function( index ){
            console.log("Each Function");
            console.log( index, $(this).find('id').text() );
            console.log( index, $(this).find('title').text() );
            console.log( index, $(this).find('start-time').text() );
            console.log( index, $(this).find('end-time').text() );

            var event = {title: $(this).find('title').text(), start: $(this).find('start-time').text(), end: $(this).find('end-time').text()};
            //var event = {title: "Title" + index, start: "2014-06-0" + (index+2) + "T16:32:00"};

            eventArray[ index ] = event;

            //Item = '<li data-role="fieldcontain" id="swListItem_' + $(this).text() + '"></li>';
            //$("#switchList").append( Item );

            //valveui_getSwitchDetails( $(this).text() );

        });

        console.log( eventArray );

        $('#calendar').fullCalendar( 'addEventSource', eventArray );
        $('#calendar').fullCalendar( 'rerenderEvents' );
*/
    }

    function schedule_getRuleList(){
        url = "proxy/schedule/rules";
        console.log( url );
        $.get( url, function(data, status){
            console.log( "get status: " + status );
            console.log( "get data: " + data );
            schedule_parseScheduleRules(data, status);
        });
    }


    console.log( "init calls" );

    $( document ).on( "pageinit", "#schedule", function( event ) 
    {
        console.log( "pageinit schedule" );

        // page is now ready, initialize the calendar...
        $('#calendar').fullCalendar({			
            header: {
				left: 'prev,next today',
				center: 'title',
				right: 'month,basicWeek,basicDay'
			},
        });
    });

    $( document ).on( "pageshow", "#schedule", function( event ) 
    {
        console.log( "pageshow schedule" );
        $('#calendar').fullCalendar('today');

        schedule_getEventList();
    });

    $( document ).on( "pageshow", "#home", function( event ) 
    {
        console.log( "pageshow home" );
        getHNodeList();
    });

    $( document ).on( "pageshow", "#zoneui", function( event ) 
    {
        console.log( "pageshow zoneui" );
        getZoneList();
    });

    $( document ).on( "pageshow", "#irrigationui", function( event ) 
    {
        console.log("pageshow irrigationui");

        irrClient.updateZoneDefinitions();

        //irui_getZoneList();

        //irui_getZoneMap();

    });

    $( document ).on( "pageshow", "#valveui", function( event ) 
    {
        console.log("pageshow valveui");

        valveui_getSwitchList();

    });

    $( document ).on( "pageshow", "#scheduleui", function( event ) 
    {
        console.log("pageshow scheduleui");

//        irrUI.initUpcomingScheduleEventHandlers();

//        irrUI.refreshUpcomingSchedule();
    });

    $( document ).on( "pageshow", "#logui", function( event ) 
    {
        console.log("pageshow logui");

        PSUI.initEventHandlers();

        PSUI.refreshAll();
    });

function updateScheduleRulesUI()
{
    console.log("updateScheduleRulesUI");
}

    $( document ).on( "pageshow", "#schedule_rules_ui", function( event ) 
    {
        console.log("pageshow schedule_rules");

        var uiCB = SRUI.update.bind( SRUI );
        irrClient.setUIUpdateCallback( uiCB ); 

        SRUI.initEventHandlers();

        console.log( irrClient.updateCB );

        SRUI.refreshAll();
    });

    $( document ).on( "pageshow", "#zone_rules_ui", function( event ) 
    {
        console.log("pageshow zone_rules");

        var uiCB = ZGUI.update.bind( ZGUI );
        irrClient.setUIUpdateCallback( uiCB ); 

        ZGUI.initEventHandlers();

        ZGUI.refreshAll();

    });

    $( document ).on( "pageshow", "#trigger_rules_ui", function( event ) 
    {
        console.log("pageshow trigger_rules");

        var uiCB = TGUI.update.bind( TGUI );
        irrClient.setUIUpdateCallback( uiCB ); 

        TGUI.initEventHandlers();

        TGUI.refreshAll();

    });


