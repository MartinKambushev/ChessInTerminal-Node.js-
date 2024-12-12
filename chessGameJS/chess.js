const readline = require('readline')
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
    if (piece === ' ') return false;
    return true
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