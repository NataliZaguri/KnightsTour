let cellVisits = 0;
function knightsTour(x, y, boardSize) {
    const board = initializeBoard(boardSize);

    let firstMove = {};
    firstMove['Path'] = [];
    firstMove['NextMove'] = [x, y];

    let moves = visitNextPosition(x, y, board, boardSize).reverse();  

    for (var i = 0; i < moves.length; i++) {
        if (moves[i].Path) {
            var nextMove = moves[i].NextMove;
            nextMove.IsNextMove = true;
            moves[i].Path.push(nextMove);
        }
    }
    moves.unshift(firstMove);
    moves.pop();
    return moves;
}

function initializeBoard(boardSize) {
    return [...Array(boardSize)].map(v =>
        [...Array(boardSize)].map(v => false));
}

function copyBoard(board) {
    return board.map(column => column.slice());
}

function entireBoardVisited(board) {
    return board.every(column => column.every(square => square));
}

function possibleMoves(x, y, board, size) {
    const moves = [];

    const possibilities = [[1, 2], [1, -2], [-1, 2], [-1, -2],
    [2, 1], [2, -1], [-2, 1], [-2, -1]]
    for (let [offsetX, offsetY] of possibilities) {
        const newX = x + offsetX;
        const newY = y + offsetY;
        if (newX < size && newX >= 0
            && newY < size && newY >= 0
            && !board[newX][newY]) {

            let currentPathArr = buildPath(x, y, offsetX, offsetY);
            const nextMoveObj = {};
            nextMoveObj['Path'] = currentPathArr
            nextMoveObj['NextMove'] = [newX, newY]
            moves.push(nextMoveObj);
        }
    }
    return moves;
}

function visitNextPosition(x, y, board, boardSize) {
    cellVisits++;

    const copiedBoard = copyBoard(board);
    copiedBoard[x][y] = true;

    let moves = possibleMoves(x, y, copiedBoard, boardSize);
    if (moves.length === 0) {
        if (entireBoardVisited(copiedBoard))
            return [[x, y]];
        else return false;
    }

    moves = warnsdorff(moves, copiedBoard, boardSize);
    
    for (let moveItem of moves) {
        const [nextX, nextY] = moveItem['NextMove'];
        let path = visitNextPosition(nextX, nextY, copiedBoard, boardSize);

        if (!!path) {
            path.push(moveItem);    
            return path;
        }
    }
    return false;
}

function warnsdorff(moves, board, size) {
    const weightedMoves = [];
    for (const moveItem of moves) {
        const [x, y] = moveItem['NextMove']
        const weight = possibleMoves(x, y, board, size).length;
        weightedMoves.push({ move: moveItem, weight });
    }
    return weightedMoves
        .sort((a, b) => a.weight - b.weight)
        .map(weighted => weighted.move);
}
function buildPath(x, y, offsetX, offsetY) {
    var path = [];
    if (Math.abs(offsetX) > Math.abs(offsetY))
        moveX(x, y, offsetX, path)
    else
        moveY(x, y, offsetY, path)

    return path;
}

function moveX(x, y, offsetX, path) {
    if (offsetX == 1)
        path.push([x + 1, y]);
    else if (offsetX == -1)
        path.push([x - 1, y]);
    else if (offsetX == 2) {
        path.push([x + 1, y]);
        path.push([x + 2, y]);
    }
    else if (offsetX == -2) {
        path.push([x - 1, y]);
        path.push([x - 2, y]);
    }
}

function moveY(x, y, offsetY, path) {
    if (offsetY == 1)
        path.push([x, y + 1]);
    else if (offsetY == -1)
        path.push([x, y - 1]);
    else if (offsetY == 2) {
        path.push([x, y + 1]);
        path.push([x, y + 2]);
    }
    else if (offsetY == -2) {
        path.push([x, y - 1]);
        path.push([x, y - 2]);
    }
}