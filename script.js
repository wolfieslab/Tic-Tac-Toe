function GameBoard() {
    const size = 3;
    const board = [];

    for (let row = 0; row < size; row++) {
        board[row] = [];
        for (let col = 0; col < size; col++) {
            board[row].push("");
        }
    }

    const getBoard = () => board;

    const placeMark = (row, col, mark) => {
        if (board[row][col] !== "") return false;

        board[row][col] = mark;
        return true;
    };

    const printBoard = () => console.log(getBoard());

    const reset = () => {
        for (let row = 0; row < size; row++) {
            for (let col = 0; col < size; col++) {
                board[row][col] = "";
            }
        }
    }


    return { getBoard, placeMark, printBoard, reset };

}

function Player(name, mark) {
    return { name, mark };
}

const GameController = (() => {
    const gameBoard = GameBoard();

    const players = [
        Player("Player 1", "X"),
        Player("Player 2", "O")
    ];

    let activePlayer = players[0];
    let gameOver = false;


    const switchTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const checkWinner = () => {
        const board = gameBoard.getBoard();

        const winCombos = [
            [[0, 0], [0, 1], [0, 2]],
            [[1, 0], [1, 1], [1, 2]],
            [[2, 0], [2, 1], [2, 2]],
            [[0, 0], [1, 0], [2, 0]],
            [[0, 1], [1, 1], [2, 1]],
            [[0, 2], [1, 2], [2, 2]],
            [[0, 0], [1, 1], [2, 2]],
            [[0, 2], [1, 1], [2, 0]]
        ];

        return winCombos.some(combo =>
            combo.every(([row, col]) =>
                board[row][col] === activePlayer.mark
            )
        );

    };

    const checkTie = () => {
        const board = gameBoard.getBoard();
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (board[row][col] === "") {
                    return false;
                }
            }
        }

        return true;
    };

    const playRound = (row, col) => {
        if (gameOver) return;

        const placedMark = gameBoard.placeMark(row, col, activePlayer.mark);
        if (!placedMark) return;

        gameBoard.printBoard();

        if (checkWinner()) {
            console.log(`${activePlayer.name} wins!`);
            gameOver = true;
            return;
        }

        if (checkTie()) {
            console.log("It's a tie!")
            gameOver = true;
            return;
        }

        switchTurn();
    };

    return { playRound, getBoard: gameBoard.getBoard };
})();