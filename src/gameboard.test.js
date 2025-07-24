import { Gameboard } from "./gameboard.js"

let board = new Gameboard()

test('playship returns sucess when placing a length 4 ship beginning at coordinate (3,4)', () => {
  expect(board.playShip(3, 4, 4, "horizontal")).toBe("success");
});

test('playship returns out of bounds when placing a length 4 ship horizontally at coordinate (8,2)', () => {
  expect(board.playShip(8, 2, 4, "horizontal")).toBe("out of bounds");
});

test('playship returns out of bounds when placing a length 4 ship vertically at coordinate (2,7)', () => {
  expect(board.playShip(2, 7, 4, "vertical")).toBe("out of bounds");
});

test('playship returns collision when placing a ship at coordinate (3,4)', () => {
  expect(board.playShip(3, 4, 4, "vertical")).toBe("collision");
});