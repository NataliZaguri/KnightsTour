var chessboardSize = 8;
var currentInterval = null;

function start() {
    var x = parseInt(document.getElementById("x").value);
    var y = parseInt(document.getElementById("y").value);

    if (validateInput(x, y)) {

        //Init in case chessboard is already running another tour
        buildChessboard(true);

        let knightImg = createKnightImg();
        let formatedPathArr = getKnightTourMovesSequence(x, y, chessboardSize);
        let delay = 800;

        drawKnightsTour(0, formatedPathArr, knightImg, undefined, delay);
    }
}
function buildChessboard(isInit) {

    var tableContainer = document.getElementById("tableContainer");

    var table = null;
    if (isInit) {
        document.getElementById('chessboardTbl').remove();
        if (currentInterval !== null) {
            clearTimeout(currentInterval);
        }

        var movesContainerElem = document.getElementById("movesContainer");
        movesContainerElem.innerHTML = '';
    }

    var table = document.createElement('table');
    table.id = "chessboardTbl";
    table.classList.add("chessboard");

    var td = null;
    var tr = null;
    for (let y = 0; y < chessboardSize; y++) {

        tr = document.createElement('tr');
        tr.classList.add("chessboard");

        for (let x = 0; x < chessboardSize; x++) {

            td = document.createElement('td');
            //Each created td is set with x & y coordinates
            td.id = x + ":" + y;
            td.classList.add("chessboard");

            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    tableContainer.appendChild(table);
}
function validateInput(x, y) {
    if (isNaN(x) || isNaN(y)) {
        alert("Invalid input params...");
        return false;
    }
    else if (x < 0 || x > chessboardSize - 1) {
        alert("'X' value must be between zero and " + chessboardSize - 1);
        return false;
    }
    else if (y < 0 || y > chessboardSize - 1) {
        alert("'Y' value must be between zero and " + chessboardSize - 1);
        return false;
    }
    return true;
}
function getKnightTourMovesSequence(x, y, chessboardSize) {
    const moves = tour(x, y, chessboardSize);

    buildMovesSuquence(moves);

    const formatedPathArr = [];
    let formattedItem = {};

    for (let move of moves) {
        if (move.Path.length === 0) {
            //FirstMove
            formattedItem = {
                X: move.NextMove[0],
                Y: move.NextMove[1],
                IsNextMove: true
            };
            formatedPathArr.push(formattedItem);
        }
        else {
            for (let path of move.Path) {
                formattedItem = {
                    X: path[0],
                    Y: path[1],
                    IsNextMove: path[0] === move.NextMove[0] &&
                    path[1] === move.NextMove[1]
                };
                formatedPathArr.push(formattedItem);
            }
        }
    }
    return formatedPathArr;
}
function drawKnightsTour(counter, formatedPathArr, knightImg, previousSquareTD, delay) {

    //console.log(formatedPathArr);

    if (counter < formatedPathArr.length) {
        currentInterval = setTimeout(function () {

            var currItem = formatedPathArr[counter];

            if (counter === 0) {

                //FirstMove
                var firstMoveElemId = currItem.X + ":" + currItem.Y;//Fox ex: 2:2
                var firstMoveSquareTD = document.getElementById(firstMoveElemId);

                //Red Track
                appendVisitedImgToSquare(firstMoveSquareTD);

                //Move Knight
                appendKnightImgToSquare(firstMoveSquareTD, knightImg);
            }
            else {
                var squareElemId = currItem.X + ":" + currItem.Y;//Fox ex: 2:2
                var squareToVisitTD = document.getElementById(squareElemId);

                if (currItem.IsNextMove) {
                    //Red Track
                    appendVisitedImgToSquare(squareToVisitTD);

                    //Move Knight
                    appendKnightImgToSquare(squareToVisitTD, knightImg);
                }
                else {
                    //Red Track
                    appendVisitedImgToSquare(squareToVisitTD);
                }
            }
            counter++;
            drawKnightsTour(counter, formatedPathArr, knightImg, squareToVisitTD, delay);
        }, delay);
    }
}
function appendKnightImgToSquare(square, knightImg) {
    square.appendChild(knightImg);
}
function appendVisitedImgToSquare(prevSquare) {
    if (prevSquare !== undefined && prevSquare !== null) {
        var hasChildNodes = prevSquare.hasChildNodes();
        if (!hasChildNodes) {
            var visitedImg = createVisitedImg();
            prevSquare.appendChild(visitedImg);
        }
    }
}
function createKnightImg() {
    var dv = document.createElement('div');
    dv.id = "knightDv";
    var knightImg = document.createElement('img');
    knightImg.id = "knightImg"
    knightImg.src = "image/knight.png";
    knightImg.classList.add("knightImg");
    dv.appendChild(knightImg);
    return dv;
}
function createVisitedImg() {

    var dv = document.createElement('div');
    dv.id = "visitedDv";
    var visitedImg = document.createElement('img');
    visitedImg.id = "visitedImg"
    visitedImg.src = "image/visited.jpg";
    visitedImg.classList.add("visitedImg");
    dv.appendChild(visitedImg);
    return dv;
}
function buildMovesSuquence(moves) {
    var movesContainerElem = document.getElementById("movesContainer");
    var summary = document.createElement('div');
    summary.innerHTML = "<h1>Summary (Knight moves and it's path sequence):</h1>";
    movesContainerElem.appendChild(summary);

    var mainUL = document.createElement('ul');
    movesContainerElem.appendChild(mainUL);

    for (let i = 0; i < moves.length; i++) {
        let currMove = moves[i];
        var li = document.createElement('li');
        mainUL.appendChild(li);

        li.innerHTML = "<h3>" +
            currMove.NextMove +
            getAdditionalDescription(i, moves.length); +
                "</h3>";

        if (currMove.Path.length > 0) {
            var pathUL = document.createElement('ul');
            mainUL.appendChild(pathUL);
        }
        for (path of currMove.Path) {
            var pathLI = document.createElement('li');
            pathUL.appendChild(pathLI);
            pathLI.innerHTML = "<h3>" + path[0] + "," + path[1] + "</h3>";
        }
    }
}
function getAdditionalDescription(i, length) {
    if (i === 0) {
        return " (Starting position)";
    }
    else if (i === (length - 1)) {
        return " (Ending position)";
    }
    else {
        return "";
    }
}