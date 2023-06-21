import test from "ava";
import {TicTacToe} from "../src/game";

test('can make an legal move', t => {
    const game = new TicTacToe();

    game.setMove("X", 2, 0);

    t.is(game.hasWinner, false);

})
test('cannot make an illegal move', t => {
    const game = new TicTacToe();

    t.throws(() => {
        game.setMove("X", 3, 0);
    })

})

test('can play a basic game - horizontal', t => {
    const game = new TicTacToe();

    game.setMove("X", 0, 1);
    game.setMove("O", 1, 1);
    game.setMove("X", 0, 2);
    game.setMove("O", 2, 1);
    game.setMove("X", 0, 0);

    t.is(game.hasWinner, true);
})

test('can play a basic game - vertical', t => {
    const game = new TicTacToe();

    game.setMove("X", 0, 0);
    game.setMove("O", 0, 2);
    game.setMove("X", 1, 0);
    game.setMove("O", 2, 2);
    game.setMove("X", 2, 0);

    t.is(game.hasWinner, true);
})

test('can play a basic game - diagonals', t => {
    const game = new TicTacToe();

    game.setMove("X", 0, 0);
    game.setMove("O", 0, 2);
    game.setMove("X", 1, 1);
    game.setMove("O", 0, 1);
    game.setMove("X", 2, 2);

    t.is(game.hasWinner, true);
})


test('can play a basic game - no winner', t => {
    const game = new TicTacToe();

    game.setMove("X", 0, 0);
    game.setMove("O", 0, 1);
    game.setMove("X", 1, 1);
    game.setMove("O", 0, 2);
    game.setMove("X", 2, 0);
    game.setMove("O", 1, 0);
    game.setMove("X", 2, 1);
    game.setMove("O", 2, 2);
    game.setMove("X", 1, 2);

    t.is(game.hasWinner, false);
    t.is(game.isOver, true);
})


test('can count number of moves made', t => {
    const game = new TicTacToe();

    game.setMove("X", 0, 0);
    game.setMove("O", 0, 1);
    game.setMove("X", 1, 1);
    game.setMove("O", 0, 2);
    game.setMove("X", 2, 0);
    game.setMove("O", 1, 0);
    game.setMove("X", 2, 1);
    game.setMove("O", 2, 2);

    t.is(game.movesMade, 8)
})
