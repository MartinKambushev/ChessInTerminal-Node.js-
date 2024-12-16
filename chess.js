const readline = require('readline');

let board = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];

let currentPlayer = 'white';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function parseMove(move) {
    const parts = move.split(' ');
    if (parts.length !== 2) return null;

    const [from, to] = parts;
    if (!/^[a-h][1-8]$/.test(from) || !/^[a-h][1-8]$/.test(to)) return null;

    return {
        from: { row: 8 - parseInt(from[1], 10), col: from[0].charCodeAt(0) - 97 },
        to: { row: 8 - parseInt(to[1], 10), col: to[0].charCodeAt(0) - 97 }
    };
}

function movePiece(board, from, to) {
    board[to.row][to.col] = board[from.row][from.col];
    board[from.row][from.col] = ' ';
}

function findKing(board, isWhite) {
    const king = isWhite ? 'K' : 'k';
    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            if (board[row][col] === king) return { row, col };
        }
    }
    return null;
}

function isKingInCheck(board, isWhite) {
    const kingPos = findKing(board, isWhite);
    if (!kingPos) return false;

    for (let row = 0; row < 8; row++) {
        for (let col = 0; col < 8; col++) {
            const piece = board[row][col];
            if (piece !== ' ' && isWhite !== (piece === piece.toUpperCase())) {
                if (isValidMove(board, { row, col }, kingPos, isWhite ? 'black' : 'white')) {
                    return true;
                }
            }
        }
    }
    return false;
}

function canMove(board, isWhite) {
    for (let fromRow = 0; fromRow < 8; fromRow++) {
        for (let fromCol = 0; fromCol < 8; fromCol++) {
            const piece = board[fromRow][fromCol];
            if (piece !== ' ' && isWhite === (piece === piece.toUpperCase())) {
                for (let toRow = 0; toRow < 8; toRow++) {
                    for (let toCol = 0; toCol < 8; toCol++) {
                        if (isValidMove(board, { row: fromRow, col: fromCol }, { row: toRow, col: toCol }, isWhite ? 'white' : 'black')) {
                            const testBoard = JSON.parse(JSON.stringify(board));
                            movePiece(testBoard, { row: fromRow, col: fromCol }, { row: toRow, col: toCol });
                            if (!isKingInCheck(testBoard, isWhite)) return true;
                        }
                    }
                }
            }
        }
    }
    return false;
}

function isValidMove(board, from, to, currentPlayer) {
    const piece = board[from.row][from.col];
    const target = board[to.row][to.col];

    if (piece === ' ') return false;

    const isWhite = piece === piece.toUpperCase();
    if (currentPlayer === 'white' && !isWhite) return false;
    if (currentPlayer === 'black' && isWhite) return false;

    if (to.row < 0 || to.row > 7 || to.col < 0 || to.col > 7) return false;

    if (target !== ' ' && isWhite === (target === target.toUpperCase())) return false;

    switch (piece.toLowerCase()) {
        case 'p':
            return validatePawnMove(board, from, to, isWhite);
        case 'r':
            return validateRookMove(board, from, to);
        case 'n':
            return validateKnightMove(from, to);
        case 'b':
            return validateBishopMove(board, from, to);
        case 'q':
            return validateQueenMove(board, from, to);
        case 'k':
            return validateKingMove(from, to);
        default:
            return false;
    }
}

function validatePawnMove(board, from, to, isWhite) {
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;

    if (to.col === from.col && board[to.row][to.col] === ' ') {
        if (to.row === from.row + direction) return true;
        if (to.row === from.row + 2 * direction && from.row === startRow && board[from.row + direction][from.col] === ' ') return true;
    }
    if (Math.abs(to.col - from.col) === 1 && to.row === from.row + direction && board[to.row][to.col] !== ' ') {
        return true;
    }
    return false;
}

function validateRookMove(board, from, to) {
    if (from.row !== to.row && from.col !== to.col) return false;

    const rowDirection = to.row === from.row ? 0 : (to.row - from.row > 0 ? 1 : -1);
    const colDirection = to.col === from.col ? 0 : (to.col - from.col > 0 ? 1 : -1);

    let row = from.row + rowDirection;
    let col = from.col + colDirection;

    while (row !== to.row || col !== to.col) {
        if (board[row][col] !== ' ') return false;
        row += rowDirection;
        col += colDirection;
    }
    return true;
}

function validateKnightMove(from, to) {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
}

function validateBishopMove(board, from, to) {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);

    if (rowDiff !== colDiff) return false;

    const rowDirection = to.row - from.row > 0 ? 1 : -1;
    const colDirection = to.col - from.col > 0 ? 1 : -1;

    let row = from.row + rowDirection;
    let col = from.col + colDirection;

    while (row !== to.row) {
        if (board[row][col] !== ' ') return false;
        row += rowDirection;
        col += colDirection;
    }
    return true;
}

function validateQueenMove(board, from, to) {
    return validateRookMove(board, from, to) || validateBishopMove(board, from, to);
}

function validateKingMove(from, to) {
    const rowDiff = Math.abs(from.row - to.row);
    const colDiff = Math.abs(from.col - to.col);
    return rowDiff <= 1 && colDiff <= 1;
}

function printBoard(board) {
    console.clear();
    console.log('    a   b   c   d   e   f   g   h  ');
    console.log('  +---+---+---+---+---+---+---+---+');
    for (let row = 0; row < board.length; row++) {
        let rowString = `${8 - row} |`;
        for (let col = 0; col < board[row].length; col++) {
            rowString += ` ${board[row][col] === ' ' ? '.' : board[row][col]} |`;
        }
        console.log(rowString);
        console.log('  +---+---+---+---+---+---+---+---+');
    }
    console.log('    a   b   c   d   e   f   g   h  ');
}

function gameLoop() {
    printBoard(board);
    console.log(`It's ${currentPlayer}'s turn.`);

    if (isKingInCheck(board, currentPlayer === 'white')) {
        if (!canMove(board, currentPlayer === 'white')) {
            console.log(`${currentPlayer} is in checkmate! Game over.`);
            rl.close();
            return;
        }
        console.log(`${currentPlayer} is in check.`);
    } else if (!canMove(board, currentPlayer === 'white')) {
        console.log("Stalemate! Game over.");
        rl.close();
        return;
    }

    rl.question(`${currentPlayer}'s move (e.g., e2 e4): `, move => {
        if (move === 'exit') {
            rl.close();
            return;
        }

        const parsedMove = parseMove(move);
        if (!parsedMove) {
            console.log("Invalid move. Try again.");
            return gameLoop();
        }

        const { from, to } = parsedMove;
        if (isValidMove(board, from, to, currentPlayer)) {
            const testBoard = JSON.parse(JSON.stringify(board));
            movePiece(testBoard, from, to);

            if (isKingInCheck(testBoard, currentPlayer === 'white')) {
                console.log("You cannot move into check. Try again.");
                return gameLoop();
            }

            movePiece(board, from, to);
            currentPlayer = currentPlayer === 'white' ? 'black' : 'white';
        } else {
            console.log("Invalid move. Try again.");
        }
        gameLoop();
    });
}

gameLoop();