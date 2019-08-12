let cellVisits = 0;
function tour(x, y, chessboardSize) {
    const chessboard = initChessboard(chessboardSize);

    let firstMove = {};
    firstMove['Path'] = [];
    firstMove['NextMove'] = [x, y];

    let moves = move(x, y, chessboard, chessboardSize).reverse();

    for (let move of moves) {
        if (move.Path) {
            var nextMove = move.NextMove;
            nextMove.IsNextMove = true;
            move.Path.push(nextMove);
        }
    }

    moves.unshift(firstMove);
    moves.pop();
    return moves;
}
function optionalMoves(x, y, chessboard, size) {
    const moves = [];

    const knightOptions = [[1, 2], [1, -2], [-1, 2], [-1, -2], [2, 1], [2, -1], [-2, 1], [-2, -1]];
    for (let [optX, optY] of knightOptions) {
        const calcX = x + optX;
        const calcY = y + optY;
        if (calcX < size && calcX >= 0 && calcY < size && calcY >= 0 &&            
            chessboard[calcX][calcY] === false) {

            let currentPathArr = buildSequencePath(x, y, optX, optY);
            const nextMoveObj = {};
            nextMoveObj['Path'] = currentPathArr;
            nextMoveObj['NextMove'] = [calcX, calcY];
            moves.push(nextMoveObj);
        }
    }
    return moves;
}
function move(x, y, chessboard, matrixSize) {
    cellVisits++;

    const newChessboard = getNewChessboard(chessboard);
    newChessboard[x][y] = true;

    let moves = optionalMoves(x, y, newChessboard, matrixSize);
    if (moves.length === 0) {
        if (isTourCompleted(newChessboard))
            return [[x, y]];
        else return false;
    }

    moves = getWeightedMoves(moves, newChessboard, matrixSize);

    for (let moveItem of moves) {
        const [nextX, nextY] = moveItem['NextMove'];
        let sequence = move(nextX, nextY, newChessboard, matrixSize);

        if (!!sequence) {
            sequence.push(moveItem);
            return sequence;
        }
    }
    return false;
}
function getWeightedMoves(moves, chessboard, size) {
    const weightedMoves = [];
    for (const moveItem of moves) {
        const [x, y] = moveItem['NextMove'];
        const weight = optionalMoves(x, y, chessboard, size).length;
        weightedMoves.push({ move: moveItem, weight });
    }
    return weightedMoves
        .sort((a, b) => a.weight - b.weight)
        .map(weighted => weighted.move);
}
function buildSequencePath(x, y, offsetX, offsetY) {
    var sequencePath = [];
    if (Math.abs(offsetX) > Math.abs(offsetY))
        moveX(x, y, offsetX, sequencePath);
    else
        moveY(x, y, offsetY, sequencePath);
    return sequencePath;
}
function moveX(x, y, offsetX, sequencePath) {
    if (offsetX === 1)
        sequencePath.push([x + 1, y]);
    else if (offsetX === -1)
        sequencePath.push([x - 1, y]);
    else if (offsetX === 2) {
        sequencePath.push([x + 1, y]);
        sequencePath.push([x + 2, y]);
    }
    else if (offsetX === -2) {
        sequencePath.push([x - 1, y]);
        sequencePath.push([x - 2, y]);
    }
}
function moveY(x, y, offsetY, sequencePath) {
    if (offsetY === 1)
        sequencePath.push([x, y + 1]);
    else if (offsetY === -1)
        sequencePath.push([x, y - 1]);
    else if (offsetY === 2) {
        sequencePath.push([x, y + 1]);
        sequencePath.push([x, y + 2]);
    }
    else if (offsetY === -2) {
        sequencePath.push([x, y - 1]);
        sequencePath.push([x, y - 2]);
    }
}