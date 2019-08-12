function initChessboard(chessboardSize) {
    return new Array(chessboardSize).fill(false).map(() => new Array(chessboardSize).fill(false));
}
function getNewChessboard(chessboard) {
    return chessboard.map(function (arr) {
        return arr.slice();
    });
}
function isTourCompleted(chessboard) {
    for (var i = 0; i < chessboard.length; i++) {
        if (chessboard[i].some(function (square) {
            return square === false;
        })) {
            return false;
        }
    }
    return true;
}