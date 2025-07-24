import { Gameboard } from "./gameboard.js"

let board = new Gameboard()

test('playship returns sucess when placing a length 2 ship beginning at coordinate (3,4)', () => {
  expect(board.playShip(3, 4, 2, "horizontal")).toBe("success");
});

board.receiveAttack(3, 4);

test('playship returns out of bounds when placing a length 4 ship horizontally at coordinate (8,2)', () => {
  expect(board.playShip(8, 2, 4, "horizontal")).toBe("out of bounds");
});

test('playship returns out of bounds when placing a length 4 ship vertically at coordinate (2,7)', () => {
  expect(board.playShip(2, 7, 4, "vertical")).toBe("out of bounds");
});

test('playship returns collision when placing a ship at coordinate (3,4)', () => {
  expect(board.playShip(3, 4, 4, "vertical")).toBe("collision");
});

test('isGameOver returns false until the last ship square is hit', () => {
  expect(board.receiveAttack(3, 4)).toBe(true);
});

test('recieveAttack returns true for coordinate (3, 4)', () => {
  expect(board.receiveAttack(3, 4)).toBe(true);
});

test('recieveAttack returns false for coordinate (8, 8)', () => {
  expect(board.receiveAttack(8, 8)).toBe(false);
});

test('isGameOver returns true', () => {
  expect(board.isGameOver()).toBe(true);
});