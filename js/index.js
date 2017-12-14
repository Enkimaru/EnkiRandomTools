var replaySubSlider = new Slider("#replay-sub-slider", {
    formatter: function(value) {
        return value;
    }
});

var versusSubSlider = new Slider("#versus-sub-slider", {
    formatter: function(value) {
        return value;
    }
});

var characterList = ["Abigail", "Akuma", "Alex", "Balrog", "Birdie", "Blanka", "Cammy", "Chun-Li", "Cody", "Dhalsim", "Ed", "F.A.N.G",
"G", "Guile", "Ibuki", "Juri", "Karin", "Ken", "Kolin", "Laura", "M. Bison", "Menat", "Nash", "Necalli", "R. Mika",
 "Rashid", "Ryu", "Urien", "Vega", "Zangief", "Zeku"]

$(document).ready(function(){
    var characterListSelect = document.getElementById("character-list");
    characterList.forEach(function(item, i){
        characterListSelect.innerHTML += '<option value="'+item+'">'+item+'</option>';

    });
});

$('.add-replay-btn').click(function() {

    var replayString = $("#replay-string").val();
    var playerId = $("#replay-player-id").val();
    var subCheckbox = "";
    var subDelay = replaySubSlider.getValue();
    var tableName = "replay-table";
    var samePlayer = "";
    var rowColor = "success";
    var lastWatchedReplay = lastWatched(tableName);
    var lastSub = lastSubIndex(lastWatchedReplay, tableName);
    if ($('#replay-sub-checkbox').is(':checked')){
        subCheckbox = "checked";
        rowColor = "table-subscriber"
    }

    if ($('#replay-same-player').is(':checked')){
        samePlayer = "checked";
    }

    if (!replayString.replace(/\s+/g, '') || !playerId.replace(/\s+/g, '')) {
            $.notify({icon: 'glyphicon glyphicon-remove',message: 'Empty inputs!',},{
                element: 'body',
                position: null,
                type: "danger",
                allow_dismiss: true,
                placement: {
                    from: "bottom",
                    align: "right"
                },
                delay: 500,
                timer: 500,
            });
            return;
    } 
    var html = '<tr class='+rowColor+'><td>'+
                replayString+'</td><td>'+playerId+'</td><td><input type="checkbox" class="checkbox-sub" disabled '+
                subCheckbox+'></td><td><button type="submit" class="btn btn-primary watched-replay"><span class="glyphicon glyphicon-remove"></span></button></td></tr>';
    
    var table = document.getElementById(tableName);
    var tableCount = table.rows.length - 1;

    if(searchReplay(replayString)){
        $.notify({icon: 'glyphicon glyphicon-remove',message: 'Replay already on table!',},{
                element: 'body',
                position: null,
                type: "danger",
                allow_dismiss: true,
                placement: {
                    from: "bottom",
                    align: "right"
                },
                delay: 500,
                timer: 500,
            });
            return;
    }

    if (samePlayer != 'checked') {
        if(searchPlayer(playerId, lastWatchedReplay, tableName)){
                $.notify({icon: 'glyphicon glyphicon-remove',message: 'Player already on queue!',},{
                element: 'body',
                position: null,
                type: "danger",
                allow_dismiss: true,
                placement: {
                    from: "bottom",
                    align: "right"
                },
                delay: 500,
                timer: 500,
            });
            return;
        }
    }
    if (tableCount < 1 || !subCheckbox) { 
       $('#replay-table > tbody:last-child').append(html);
    } else if (lastSub == -1){
        if (lastWatchedReplay) {
            $('#replay-table > tbody > tr').eq(lastWatchedReplay-1).after(html);
        } else {
            $('#replay-table > tbody > tr').eq(0).before(html);
        } 
    } else {
       var position = Math.min(lastSub+subDelay,tableCount-1);
       $('#replay-table > tbody > tr').eq(position).after(html); 
    }
    $("#replay-string").val('');
    $("#replay-player-id").val('');
    $.notify({
    // options
    icon: ' glyphicon glyphicon-ok',
    message: 'Replay added!',},{
    // settings
    element: 'body',
    position: null,
    type: "info",
    allow_dismiss: true,
    placement: {
        from: "bottom",
        align: "right"
    },
    delay: 500,
    timer: 500,});
});

$('.add-versus-btn').click(function() {

    var versusString = $("#character-list").val();
    var playerId = $("#versus-player-id").val();
    var subCheckbox = "";
    var subDelay = versusSubSlider.getValue();
    var tableName = "versus-table";
    var samePlayer = "";
    var rowColor = "success";
    var lastPlayed = lastWatched(tableName);
    var lastSub = lastSubIndex(lastPlayed, tableName);
    
    if ($('#versus-sub-checkbox').is(':checked')){
        subCheckbox = "checked";
        rowColor = "table-subscriber"
    }

    if ($('#versus-same-player').is(':checked')){
        samePlayer = "checked";
    }

    if (!playerId.replace(/\s+/g, '')) {
            $.notify({icon: 'glyphicon glyphicon-remove',message: 'Empty inputs!',},{
                element: 'body',
                position: null,
                type: "danger",
                allow_dismiss: true,
                placement: {
                    from: "bottom",
                    align: "right"
                },
                delay: 500,
                timer: 500,
            });
            return;
    } 
    var html = '<tr class='+rowColor+'><td>'+
                versusString+'</td><td>'+playerId+'</td><td><input type="checkbox" class="checkbox-sub" disabled '+
                subCheckbox+'></td><td><button type="submit" class="btn btn-primary ended-set"><span class="glyphicon glyphicon-remove"></span></button></td></tr>';
    
    var table = document.getElementById(tableName);
    var tableCount = table.rows.length - 1;

    if (samePlayer != 'checked') {
        if(searchPlayer(playerId, lastPlayed, tableName)){
                $.notify({icon: 'glyphicon glyphicon-remove',message: 'Player already on queue!',},{
                element: 'body',
                position: null,
                type: "danger",
                allow_dismiss: true,
                placement: {
                    from: "bottom",
                    align: "right"
                },
                delay: 500,
                timer: 500,
            });
            return;
        }
    }

    console.log(lastSub)
    if (tableCount < 1 || !subCheckbox) { 
       $('#versus-table > tbody:last-child').append(html);
    } else if (lastSub == -1){
        if (lastPlayed) {
            $('#versus-table > tbody > tr').eq(lastPlayed-1).after(html);
        } else {
            $('#versus-table > tbody > tr').eq(0).before(html);
        }
    } else {
        var position = Math.min(lastSub+subDelay,tableCount-1);
       $('#versus-table > tbody > tr').eq(position).after(html); 
    }
    $("#character-list-div select").val("Any");
    $("#versus-player-id").val('');
    $.notify({
    // options
    icon: ' glyphicon glyphicon-ok',
    message: 'Set added!',},{
    // settings
    element: 'body',
    position: null,
    type: "info",
    allow_dismiss: true,
    placement: {
        from: "bottom",
        align: "right"
    },
    delay: 500,
    timer: 500,});
});

function lastSubIndex(lastAction, tableName) {
    var lastIndex = -1;
    var table = document.getElementById(tableName);

    var rowLength = table.rows.length;
    for(var i=lastAction; i<rowLength; i+=1){
        var row = table.rows[i];
        var cell = row.cells[2].innerHTML;
        if (~cell.indexOf('checked')) {
            lastIndex = i - 1 ;
        }
        
    }
    return lastIndex;
}

function searchPlayer(player, lastAction, tableName){
    var table = document.getElementById(tableName);
    var rowLength = table.rows.length;
    for(var i=lastAction+1; i<rowLength; i+=1){
        var row = table.rows[i];
        var cell = row.cells[1].innerHTML;
        if (player.length == cell.length && ~cell.toLowerCase().indexOf(player.toLowerCase())) {
            return 1;
        }
    }
    return 0;
}

function searchReplay(string){
    var table = document.getElementById('replay-table');
    var rowLength = table.rows.length;
    for(var i=1; i<rowLength; i+=1){
        var row = table.rows[i];
        var cell = row.cells[0].innerHTML;
        if (string.length == cell.length && ~cell.toLowerCase().indexOf(string.toLowerCase())) {
            return 1;
        }
    }
    return 0;
}

function lastWatched(tableName) {
    var lastIndex = 0;
    var table = document.getElementById(tableName);

    var rowLength = table.rows.length;
    for(var i=1; i<rowLength; i+=1){
        if(table.rows[i].classList.contains('table-inactive')){
            lastIndex = i;
        }      
    }
    return lastIndex;
}

$('#replay-table').on('click', '.watched-replay', function() {
    var lastWatchedReplay = lastWatched('replay-table');
    $(this).closest('tr').attr('class', 'table-inactive');
    $(this).closest('button.watched-replay').prop('disabled', true);
    var table = document.getElementById('replay-table').getElementsByTagName('tbody')[0];
    $(this).parents('tr').insertBefore(table.rows[lastWatchedReplay]);
});

$('#versus-table').on('click', '.ended-set', function() {
    var lastPlayed = lastWatched('versus-table');
    $(this).closest('tr').attr('class', 'table-inactive');
    $(this).closest('button.ended-set').prop('disabled', true);
    var table = document.getElementById('versus-table').getElementsByTagName('tbody')[0];
    $(this).parents('tr').insertBefore(table.rows[lastPlayed]);
});


