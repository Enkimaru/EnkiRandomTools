
// With JQuery
var subSlider = new Slider("#sub-slider", {
    formatter: function(value) {
        return value;
    }
});


$('.add-replay-btn').click(function() {

    var replayString = $("#replay-string").val();
    var playerId = $("#player-id").val();
    var subCheckbox = "";
    var subDelay = subSlider.getValue();
    
    var samePlayer = "";
    var rowColor = "success";
    var lastWatchedReplay = lastWatched();
    var lastSub = lastSubIndex(lastWatchedReplay);
    if ($('#sub-checkbox').is(':checked')){
        subCheckbox = "checked";
        rowColor = "table-subscriber"
    }

    if ($('#same-player').is(':checked')){
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
    
    var table = document.getElementById('replay-table');
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
        if(searchPlayer(playerId,lastWatchedReplay)){
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
       $('#replay-table > tbody > tr').eq(lastWatchedReplay).before(html);
    } else {
        console.log("aqui")
        console.log("lastSub + subDelay = " + (lastSub+subDelay));
        console.log("tableCount -1 = " + (tableCount-1));
        var position = Math.min(lastSub+subDelay,tableCount-1);
        console.log(position)
       $('#replay-table > tbody > tr').eq(position).after(html); 
    }

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

function lastSubIndex(lastWatchedReplay) {
    var lastIndex = -1;
    var table = document.getElementById('replay-table');

    var rowLength = table.rows.length;
    for(var i=lastWatchedReplay; i<rowLength; i+=1){
        var row = table.rows[i];
        var cell = row.cells[2].innerHTML;
        if (~cell.indexOf('checked')) {
            lastIndex = i - 1 ;
        }
        
    }
    return lastIndex;
}

function searchPlayer(player,lastWatchedReplay){
    var table = document.getElementById('replay-table');
    var rowLength = table.rows.length;
    for(var i=lastWatchedReplay+1; i<rowLength; i+=1){
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

function lastWatched() {
    var lastIndex = 0;
    var table = document.getElementById('replay-table');

    var rowLength = table.rows.length;
    for(var i=1; i<rowLength; i+=1){
        if(table.rows[i].classList.contains('table-inactive')){
            lastIndex = i;
        }      
    }
    return lastIndex;
}

$('#replay-table').on('click', '.watched-replay', function() {
    var lastWatchedReplay = lastWatched();
    $(this).closest('tr').attr('class', 'table-inactive');
    $(this).closest('button.watched-replay').prop('disabled', true);
    var table = document.getElementById('replay-table').getElementsByTagName('tbody')[0];
    console.log(lastWatchedReplay)
    $(this).parents('tr').insertBefore(table.rows[lastWatchedReplay]);
});

