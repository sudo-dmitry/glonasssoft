document.addEventListener('DOMContentLoaded', function(){

    // Delete row function
    function DeleteRow() {
        let DeleteBtn = document.querySelectorAll('.js-Delete');
        DeleteBtn.forEach(elem => elem.addEventListener('click', () => {

            //update data-rows
            let table = elem.parentNode.parentNode;
            if (table) {
                let dataRows = table.getAttribute('data-rows');
                table.setAttribute('data-rows', dataRows - 1);
            }
            //Delete row
            elem.parentNode.remove();

            // update each data-row
            if (table) {
                let rows = table.querySelectorAll('[data-row]');
                for (var i=0; i < rows.length; i++) {
                    rows[i].setAttribute('data-row', i + 1);
                }
            }

        }))
    }
    DeleteRow();


    // Add row function
    let addBtn = document.querySelectorAll('.js-add');
    addBtn.forEach(elem => elem.addEventListener('click', () => {
        let div = document.createElement('div');
        div.className = 'row';
        let dataRows = elem.parentNode.parentNode.getAttribute('data-rows');
        div.setAttribute('data-row', parseInt(dataRows) + 1);
        div.innerHTML = '<input type="number" class="x" value="0"><input type="number" class="y" value="0"><a href="javascript:void(0);" class="btn js-Delete">Delete</a>';
        elem.parentNode.insertAdjacentElement('beforebegin', div);

        //update data-rows
        elem.parentNode.parentNode.setAttribute('data-rows', parseInt(dataRows) + 1);
        DeleteRow();
    }))


    // Calculate button logic
    let calculate = document.querySelector('.js-calculate');
    calculate.addEventListener('click', () => {

        //Generate rows

        // Get smaller table
        let table1Rows = document.querySelector('.js-table1').getAttribute('data-rows');
        let table2Rows = document.querySelector('.js-table2').getAttribute('data-rows');
        let table3Rows = Math.min(table1Rows, table2Rows);

        document.querySelector('.js-table3-rows-area').innerHTML = '';

        var table1xArray = [];
        var table2xArray = [];
        var table3xArray = [];
        var table1yArray = [];
        var table2yArray = [];
        var table3yArray = [];

        // Get coords for chart1
        for(var i = 0; i < table1Rows; i++){
            var table1rows = document.querySelectorAll('.js-table1 [data-row]');
            var table1x = parseFloat(table1rows[i].querySelector('.x').value);
            var table1y = parseFloat(table1rows[i].querySelector('.y').value);
            table1xArray.push(table1x);
            table1yArray.push(table1y);
        }

        // Get coords for chart2
        for(var i = 0; i < table2Rows; i++){
            var table2rows = document.querySelectorAll('.js-table2 [data-row]');
            var table2x = parseFloat(table2rows[i].querySelector('.x').value);
            var table2y = parseFloat(table2rows[i].querySelector('.y').value);
            table2xArray.push(table2x);
            table2yArray.push(table2y);
        }

        // Get values and coords for chart3
        for(var i = 0; i < table3Rows; i++){
            var div = document.createElement('div');
            div.className = 'row';
            div.setAttribute('data-row', i + 1);

            // Calculate values for table3
            var table1rows = document.querySelectorAll('.js-table1 [data-row]');
            var table1x = parseFloat(table1rows[i].querySelector('.x').value);
            var table1y = parseFloat(table1rows[i].querySelector('.y').value);
            var table2rows = document.querySelectorAll('.js-table2 [data-row]');
            var table2x = parseFloat(table2rows[i].querySelector('.x').value);
            var table2y = parseFloat(table2rows[i].querySelector('.y').value);

            div.innerHTML = `<input type="number" value="${(table1x + table2x) / 2}" class="x"><input type="number" value="${(table1y + table2y) / 2}" class="y">`;
            document.querySelector('.js-table3-rows-area').append(div);


            // Get coords for graph3
            var table3rows = document.querySelectorAll('.js-table3 [data-row]');
            var table3x = parseFloat(table3rows[i].querySelector('.x').value);
            var table3y = parseFloat(table3rows[i].querySelector('.y').value);
            table3xArray.push(table3x);
            table3yArray.push(table3y);
            console.log(table3x);
            console.log(table3y);
        }

        // Draw Graphs function
        function drawGraph(){
            var canvas = document.getElementById( id );
            var context = canvas.getContext( "2d" );
            var GRAPH_HEIGHT = 400;
            var GRAPH_WIDTH = 400;
            context.clearRect( 0, 0, 400, 400 );
            context.font = "10px Verdana";
            context.fillStyle = "#a0a0a0";
            // Draw X and Y axis
            context.beginPath();
            context.moveTo( GRAPH_WIDTH/2, 0);
            context.lineTo( GRAPH_WIDTH/2, GRAPH_HEIGHT);
            context.moveTo( 0, GRAPH_HEIGHT/2);
            context.lineTo( GRAPH_WIDTH, GRAPH_HEIGHT/2);
            context.strokeStyle = color;
            context.lineWidth = 3;
            context.stroke();
            // Draw reference lines
            context.beginPath();
            context.strokeStyle = color;
            context.lineWidth = 2;

            var ref = GRAPH_HEIGHT/20 - 20;
            for (var d = 1; d <= 20; d++) {
                ref = ref + 20;
                context.moveTo( GRAPH_WIDTH/2, ref);
                context.lineTo( GRAPH_WIDTH/2 + 10, ref );
                context.fillText( -d + 10, GRAPH_WIDTH/2 + 5, ref - 3);

                context.moveTo( ref, GRAPH_WIDTH/2);
                context.lineTo( ref, GRAPH_WIDTH/2 - 10 );
                context.fillText( d - 10, ref - 12, GRAPH_WIDTH/2 - 5);
            }
            context.stroke();

            // Chart line
            context.beginPath();
            context.lineJoin = "round";
            context.strokeStyle = "#ffffff";
            context.lineWidth = 5;

            var x;
            var y;
            var qx = [];
            var qy = [];
            for (var q = 0; q < graphX.length; q++) {
                x = 200 + graphX[q] * 20;
                qx.push(x);
            }
            for (var r = 0; r < graphY.length; r++) {
                y = 200 + graphY[r] * -20;
                qy.push(y);
            }

            for (var j = 0; j < qx.length; j++) {
                context.moveTo( qx[j], qy[j]);
                (context.lineTo(qx[j + 1], qy[j + 1])) * (j);
            }

            context.stroke();
        }

        // Initiate graph1
        var id = 'chart1';
        var color = 'rgba(229, 141, 46, 1)';
        var graphX = table1xArray;
        var graphY = table1yArray;
        drawGraph(id);

        // Initiate graph2
        id = 'chart2';
        graphX = table2xArray;
        graphY = table2yArray;
        drawGraph(id);

        // Initiate graph3
        id = 'chart3';
        color = 'rgba(25, 133, 200, 1)';
        graphX = table3xArray;
        graphY = table3yArray;
        drawGraph(id);

    });

});