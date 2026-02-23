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

    let players = [];
    let activePlayer;
    let gameOver = false;

    const init = (p1name, p2name) => {
        players = [
            Player(p1name, "X"),
            Player(p2name, "O")
        ]

        activePlayer = players[0];
        gameOver = false;
        gameBoard.reset;
    };

    const switchTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };

    const getActivePlayer = () => activePlayer;

    const getPlayers = () => players;

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

    return { playRound, getBoard: gameBoard.getBoard, getActivePlayer, getPlayers, init };
})();

const screenController = (() => {
    const boardDiv = document.querySelector(".board");
    const startDialog = document.querySelector(".startDialog");
    const startBtn = document.querySelector(".startBtn");
    const player1Card = document.querySelector(".player1");
    const player2Card = document.querySelector(".player2");
    const player1Name = document.querySelector(".player1 > .name");
    const player2Name = document.querySelector(".player2 > .name");
    const player1Mark = document.querySelector(".player1 > .mark");
    const player2Mark = document.querySelector(".player2 > .mark");

    const render = () => {
        boardDiv.innerHTML = "";
        const board = GameController.getBoard();
        const activePlayer = GameController.getActivePlayer();
        const players = GameController.getPlayers();
        player1Name.textContent = players[0].name;
        player1Mark.textContent = players[0].mark;
        player2Name.textContent = players[1].name;
        player2Mark.textContent = players[1].mark;

        player1Card.classList.remove("active");
        player2Card.classList.remove("active");

        // Add active to current
        if (activePlayer === players[0]) {
            player1Card.classList.add("active");
        } else {
            player2Card.classList.add("active");
        }

        player1Mark.classList.add("mark-x");
        player2Mark.classList.add("mark-o");

        board.forEach((row, r) => {
            row.forEach((cell, c) => {
                const btn = document.createElement("button");
                btn.textContent = cell;

                if (cell === "X") {
                    btn.classList.add("cell-x");
                }
                if (cell === "O") {
                    btn.classList.add("cell-o");
                }

                btn.dataset.row = r;
                btn.dataset.col = c;
                boardDiv.appendChild(btn);
            });
        });
    }

    boardDiv.addEventListener("click", (e) => {
        const row = e.target.dataset.row;
        const col = e.target.dataset.col;

        if (row === undefined) return;

        GameController.playRound(Number(row), Number(col));
        render();
    });

    startBtn.addEventListener("click", (e) => {
        e.preventDefault();

        const p1name = document.getElementById("p1-name").value || "Player 1";
        const p2name = document.getElementById("p2-name").value || "Player 2";

        GameController.init(p1name, p2name);
        startDialog.close();
        render();
    });

    startDialog.showModal();

})();