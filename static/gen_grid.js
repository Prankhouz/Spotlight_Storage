let clickedCells = [];
let selectedCells = []
let isEventListened = false;
function drawGrid(mode, rows, columns, startX, startY, serpentineDirection) {
    console.log("Draw grid running in mode: \"" + mode + "\"")
    // Convert string values to lowercase
    if (typeof startX === 'string') {
        startX = startX.toLowerCase();
    }
    if (typeof startY === 'string') {
        startY = startY.toLowerCase();
    }
    if (typeof serpentineDirection === 'string') {
        serpentineDirection = serpentineDirection.toLowerCase();
    }

    const canvasContainer = document.getElementById(mode + '-canvas-container');
    const responsiveCanvas = document.getElementById(mode + '-responsive-canvas');
    // Get the actual pixel width of the canvas container
    let containerStyle = window.getComputedStyle(canvasContainer);
    let containerPadding = parseFloat(containerStyle.paddingLeft) + parseFloat(containerStyle.paddingRight);
    let containerWidth = canvasContainer.clientWidth - containerPadding;
    let containerHeight = canvasContainer.clientHeight;
    responsiveCanvas.width = containerWidth;
    responsiveCanvas.height = containerHeight;
    if (mode === "esp") {
        rows = parseInt(document.getElementById('esp_rows').value);
        columns = parseInt(document.getElementById('esp_columns').value);
        startX = document.getElementById('esp_startx').options[document.getElementById('esp_startx').selectedIndex].getAttribute("data-startx").toLowerCase();
        startY = document.getElementById('esp_starty').options[document.getElementById('esp_starty').selectedIndex].getAttribute("data-starty").toLowerCase();
        serpentineDirection = document.getElementById('esp_serpentine').options[document.getElementById('esp_serpentine').selectedIndex].getAttribute("data-serpentine").toLowerCase();

    }else {
        // Map values for startX and serpentineDirection
        startX = (startX === "1") ? "right" : (startX === "0") ? "left" : startX;
        serpentineDirection = (serpentineDirection === "1") ? "vertical" : (serpentineDirection === "0") ? "horizontal" : serpentineDirection;
    }
    columns = parseInt(columns);
    rows = parseInt(rows);
    console.log("startX: " + startX + ", " + "startY: " + startY + ", " + "serpentineDirection: " + serpentineDirection)
    let canvas = document.getElementById(mode + '-responsive-canvas');
    let ctx = canvas.getContext('2d');
    let lineWidth = 2;
    let boxWidth = (canvas.width - lineWidth) / columns;

    canvas.height = (boxWidth * rows) + lineWidth;
    let lineColour = "#0d6efd";
    let gridColour = "#6c757d";
    let offset = 0;
    let startIndicatorX = 0
    let startIndicatorY = 0
    let endIndicatorX = 0
    let endIndicatorY = 0
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = lineWidth;
    let halfLineWidth = lineWidth / 2;
    // Draw grid
    ctx.strokeStyle = gridColour;
    for (let i = 0; i <= rows; i++) {
        ctx.beginPath();
        let y = i * boxWidth + halfLineWidth; // Add half of the line width
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
    for (let j = 0; j <= columns; j++) {
        ctx.beginPath();
        let x = j * boxWidth + halfLineWidth; // Add half of the line width
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    // Draw line
    ctx.strokeStyle = lineColour;
    if (serpentineDirection === "horizontal") {
        // Draw horizontal lines
        for (let i = 0; i <= rows - 1; i++) {
            ctx.beginPath();
            const y = (i * boxWidth + halfLineWidth) + (boxWidth / 2); // Add half of the line width
            ctx.moveTo(boxWidth / 2, y);
            ctx.lineTo(canvas.width - (boxWidth / 2), y);
            ctx.stroke();
        }
        // Draw vertical lines
        if (columns > 1) {
            ctx.setLineDash([boxWidth]);
        }
        if (startY === "top") {
            startIndicatorY = 0;
            endIndicatorY = rows - 1;
        } else if (startY === "bottom") {
            startIndicatorY = rows - 1;
            endIndicatorY = 0;
        }
        if (startX === "left") {
            offset = startY === "top" ? boxWidth : (boxWidth * (rows % 2)) + boxWidth;
            startIndicatorX = 0;
            endIndicatorX = rows % 2 ? columns - 1 : 0;
        } else if (startX === "right") {
            offset = startY === "top" ? 0 : boxWidth * (rows % 2);
            startIndicatorX = columns - 1;
            endIndicatorX = rows % 2 ? 0 : columns - 1;
        }
        for (let i = 0; i <= columns - 1; i++) {
            if (i === 0) {
                ctx.lineDashOffset = offset;
            } else if (i === columns - 1) {
                ctx.lineDashOffset = offset + boxWidth;
            }
            if (i === 0 || i === columns - 1) {
                ctx.beginPath();
                let x = (i * boxWidth + halfLineWidth) + (boxWidth / 2); // Add half of the line width
                ctx.moveTo(x, boxWidth / 2);
                ctx.lineTo(x, canvas.height - (boxWidth / 2));
                ctx.stroke();
            }
        }
    } else {
        // Draw vertical lines
        for (let i = 0; i <= columns - 1; i++) {
            ctx.beginPath();
            let x = (i * boxWidth + halfLineWidth) + (boxWidth / 2); // Add half of the line width
            ctx.moveTo(x, boxWidth / 2);
            ctx.lineTo(x, canvas.height - (boxWidth / 2));
            ctx.stroke();
        }
        // Draw horizontal lines
        if (rows > 1) {
            ctx.setLineDash([boxWidth]);
        }
        if (startX === "left" && startY === "top") {
            offset = boxWidth;
            startIndicatorX = 0;
            startIndicatorY = 0;
            endIndicatorX = columns - 1;
            if (columns % 2) {
                endIndicatorY = rows - 1;
            } else {
                endIndicatorY = 0;
            }
        } else if (startX === "right" && startY === "top") {
            offset = (boxWidth * (columns % 2)) + boxWidth;
            startIndicatorX = columns - 1;
            startIndicatorY = 0;
            endIndicatorX = 0;
            if (columns % 2) {
                endIndicatorY = rows - 1;
            } else {
                endIndicatorY = 0;
            }
        }
        if (startX === "left" && startY === "bottom") {
            offset = 0;
            startIndicatorY = rows - 1;
            startIndicatorX = 0;
            endIndicatorX = columns - 1;
            if (columns % 2) {
                endIndicatorY = 0;
            } else {
                endIndicatorY = rows - 1;
            }
        } else if (startX === "right" && startY === "bottom") {
            offset = boxWidth * (columns % 2);
            startIndicatorY = rows - 1;
            startIndicatorX = columns - 1;
            endIndicatorX = 0;
            if (columns % 2) {
                endIndicatorY = 0;
            } else {
                endIndicatorY = rows - 1;
            }
        }
        for (let i = 0; i <= rows - 1; i++) {
            if (i === 0) {
                ctx.lineDashOffset = offset;
            } else if (i === rows - 1) {
                ctx.lineDashOffset = offset + boxWidth;
            }
            if (i === 0 || i === rows - 1) {
                ctx.beginPath();
                let y = (i * boxWidth + halfLineWidth) + (boxWidth / 2); // Add half of the line width
                ctx.moveTo(boxWidth / 2, y);
                ctx.lineTo(canvas.width - (boxWidth / 2), y);
                ctx.stroke();
            }
        }
    }
    // Draw circles in the middle of each grid square
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            let circleCenterX = j * boxWidth + boxWidth / 2 + halfLineWidth;
            let circleCenterY = i * boxWidth + boxWidth / 2 + halfLineWidth;
            let circleRadius = Math.min(boxWidth, boxWidth) / 15;
            ctx.beginPath();
            ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2);
            ctx.fillStyle = '#ffc107';
            ctx.fill();
        }
    }
    let indicatorCircleRadius = Math.min(boxWidth, boxWidth) / 8;
    let startCircleCenterX = startIndicatorX * boxWidth + boxWidth / 2 + halfLineWidth;
    let startCircleCenterY = startIndicatorY * boxWidth + boxWidth / 2 + halfLineWidth;
    console.log(startCircleCenterX + ", " + startCircleCenterY);
    ctx.beginPath();
    ctx.arc(startCircleCenterX, startCircleCenterY, indicatorCircleRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#198754';
    ctx.fill();
    let endCircleCenterX = endIndicatorX * boxWidth + boxWidth / 2 + halfLineWidth;
    let endCircleCenterY = endIndicatorY * boxWidth + boxWidth / 2 + halfLineWidth;
    console.log(endCircleCenterX + ", " + endCircleCenterY);
    ctx.beginPath();
    ctx.arc(endCircleCenterX, endCircleCenterY, indicatorCircleRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#dc3545';
    ctx.fill();


    if (mode === "item") {
        canvas.removeEventListener('click', handleCellClick);
        if (!isEventListened) {
            canvas.addEventListener('click', function (event) {
                handleCellClick(event, rows, columns, startX, startY, serpentineDirection, mode);
            });

            isEventListened = true;
        }


    }
}
function handleCellClick(event, rows, columns, startX, startY, serpentineDirection, mode) {
        console.log("Canvas clicked");
        let canvas = document.getElementById(mode + '-responsive-canvas');
        let lineWidth = 2;
        let boxWidth = (canvas.width - lineWidth) / columns;
        // Get the size and position of the canvas
        let rect = canvas.getBoundingClientRect();
        // Calculate the x and y coordinates of the click relative to the canvas
        let x = event.clientX - rect.left;
        let y = event.clientY - rect.top;
        // Calculate which row and column was clicked based on the click coordinates
        let clickedRow = Math.floor(y / boxWidth);
        let clickedColumn = Math.floor(x / boxWidth);
        let clickedCell = {
            row: clickedRow,
            column: clickedColumn
        }; // Store clicked cell info
        const ledNumber = calculateLedNumber(clickedRow, clickedColumn, startX, startY, serpentineDirection, rows, columns);
        console.log("clickedCell:", clickedCell);
        console.log("ledNumber:", ledNumber);
        // Find if the clicked cell is already in the clickedCells array
        let cellIndex = selectedCells.findIndex(cell => cell.row === clickedRow && cell.column === clickedColumn);
        console.log(cellIndex);
        // If the clicked cell is not in the array, add it; otherwise, remove it
        if (cellIndex === -1) {
            clickedCells.push(ledNumber);
            selectedCells.push(clickedCell);
        } else {
            clickedCells.splice(cellIndex, 1);
            selectedCells.splice(cellIndex, 1);
        }
        console.log(clickedCells);
        redrawGrid(rows, columns, "item")
}
function calculateLedNumber(row, column, startX, startY, serpentineDirection, rows, columns) {
        if (startX === "right") {
            column = columns - column;
        }
        if (startY === "bottom") {
            row = rows - row;
        }

        if (serpentineDirection === "horizontal") {
            row = startY !== "bottom" ? row + 1 : row;
            column = startX !== "left" ? column - 1 : column;

            const isEvenRow = row % 2 === 0;
            return isEvenRow ? row * columns - (columns - (columns - column)) : row * columns - (columns - column) + 1;
        } else {
            column = startX !== "right" ? column + 1 : column;
            row = startY !== "top" ? row - 1 : row;

            const isEvenColumn = column % 2 === 0;
            return isEvenColumn ? column * rows - (rows - (rows - row)) : column * rows - (rows - row) + 1;
        }
}
function redrawGrid(rows, columns, mode) {
    let canvas = document.getElementById(mode + '-responsive-canvas');
    let ctx = canvas.getContext('2d');
    let lineWidth = 2;
    let boxWidth = (canvas.width - lineWidth) / columns;
    ctx.lineWidth = lineWidth;
    let halfLineWidth = lineWidth / 2;
        // Loop through rows and columns of the grid
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < columns; j++) {
                // Check if the current cell is clicked (present in clickedCells)
                let isClicked = selectedCells.some(cell => cell.row === i && cell.column === j);
                // Calculate the center and radius of the circle to be drawn for each cell
                let circleCenterX = j * boxWidth + boxWidth / 2 + halfLineWidth;
                let circleCenterY = i * boxWidth + boxWidth / 2 + halfLineWidth;
                let circleRadius = Math.min(boxWidth, boxWidth) / 15;
                ctx.beginPath();
                ctx.arc(circleCenterX, circleCenterY, circleRadius, 0, Math.PI * 2);
                ctx.fillStyle = isClicked ? '#17a2b8' : '#ffc107';
                ctx.fill();
            }
        }
}


function TestLights() {
    const selectedEspIndex = selectEspDropdown.selectedIndex;
    const selectedEsp = selectEspDropdown.options[selectedEspIndex];
    if (selectedEsp.disabled) {
        // Nothing is selected or "Please add an ESP device first..." is selected, so we can't proceed
        alert("Please select an ESP to Test.");
        return;
    }
    const ip = selectedEsp.dataset.espIp;
    const data = {};
    data[ip] = clickedCells;
    console.log(data);
    fetch('/test_lights', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
            // Removed alert for success message
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


function clearAll() {
    let canvas = document.getElementById("item" + '-responsive-canvas');
    canvas.removeEventListener('click', handleCellClick);
    clickedCells.length = 0;
    selectedCells.length = 0;
    // Clear the stored data in the 'led_positions' key
    localStorage.removeItem('led_positions');
    const rows = document.getElementById('item_esp_select').options[0].getAttribute("data-esp-rows");
    const columns = document.getElementById('item_esp_select').options[0].getAttribute("data-esp-columns");

    redrawGrid(rows, columns, "item");
}

function submitLights() {
    localStorage.removeItem('led_positions');
    // Retrieve existing LED positions from localStorage
    let savedData = JSON.parse(localStorage.getItem('led_positions')) || [];

    // Save LED positions to localStorage
    savedData = savedData.concat(clickedCells);
    console.log("savedData LEDS:", savedData); // Get the selected value from the dropdown
    // Save updated data back to localStorage
    localStorage.setItem('led_positions', JSON.stringify(savedData));
}

document.getElementById('test_led_button').addEventListener('click',TestLights);
document.getElementById('clear_led_button').addEventListener('click',clearAll);