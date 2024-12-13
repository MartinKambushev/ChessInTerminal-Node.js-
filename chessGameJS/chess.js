const readline = require('readline')
const { isWeakMap } = require('util/types')
let board = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'N'],
]
let currentP = 'white'

function parseMove(move){
    const [from, to] = move.split(' ')
    return{
        from:{
            row: 8 - parseInt(from[1], 10),
            col: from[0].charCodeAt(0)-97
        }
        ,to:{
            row:8 - parseInt(to[1],10),
            col:to[0].charCodeAt(0)-97
        }
    }
}
function movePiece(board, from, to){
    board[to.row][from.col]= board[from.row][to.col]
    board[from.row][from.col]= ' '
}
function isValidMove(board, from, to, currentP){
    const piece = board[from.row][from.col]
    const target = board[to.row][to.col]

    if (piece === ' ') return false;
    return true
    const isWhite = piece === piece.toUpperCase()
    if(currentP === 'white' && !isWhite) return false
    if(currentP === 'black' && isWhite)return false
    if(to.row < 0 || to.row > 7 || to.col < 0 || to.col > 7) return false
    if(target !== ' ' && isWhite === (target === terget.toUpperCase())) return false
    switch( piece.toLowerCase()){
        case 'p': return validatePawnMove(board, from, to, isWhite)
        case 'r': return validateRookMove(board,from, to)
        case 'n': return validateKnightMove(from,to)
        case 'b': return validateBishopMove(board, from, to)
        case 'q': return validateQueenMove(board,from, to)
        case 'k': return validateKingMove(from, to)
        default: return false
    }
}
function validatePawnMove(board, from,to){
    const direction = isWhite ? -1 : 1
    const startRow = isWhite ? 6 : 1
    //Напред
    if (to.col === from.col && board[to.row][to.col] === ' '){
        if (to.row === from.row + direction) return true;
    if (to.row === from.row + 2 * direction && from.row === startRow && board[from.row+direction][from.col] === ' ') return true
    }
    //Взимане
    if(Math.abs(to.col - from.col)=== 1 && to.row === from.row + direction && board[to.row][to.col] !== ' '){
        return true
    }
    return false
}
function validateRookMove(board,from, to){
    if(from.row === to.row){
        const step = from.col < to.col ? 1:-1
        for(let col = from.col+step; col!==to.col; col +=step){
            if(board[from.row][col] !== ' ')return false
        }

    }
    else if (from.col === to.col){
        const step = from.row < to.row ? 1:-1
        for (let row = from.row + step; row!==to.row; row+=step){
            if(board[row][from.col] !== ' ') return false
        }
        return true
    }
    return false
}
function playTurn(board, move){
    const {from, to} = parseMove(move)
    if(isValidMove(board,from,to,currentP)){
        movePiece(board,from,to)
        currentP === currentP ==='white' ? 'black' : 'white'
        return true
    }else{
        console.log('Invalid move. Try again.')
        return false
    }
}
function printBoard(board){
    console.clear();
    console.log(' a b c d e f g h')
    for( let row = 0; row<board.lenght; row++){
        const rowNumber = 8 - row
        const rowString = board[row].map(cel =>(cel === ' ' ? '.': cel)).join(' ')
        console.log(rowNumber + ' ' + rowString)
    }
}
function gameLoop(){
    printBoard(board);
    rl.question(`${currentP}'s move (e.g., e2, e4)`,move =>{
        if(move ==='exit'){
            rl.close();
            return
        }
        if (playTurn(board, move)){
            printBoard(board)
        }
        gameLoop()
    })
}
gameLoop()
