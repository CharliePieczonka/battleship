import { Ship } from "./ship.js"

let ship = new Ship(0, 5)
ship.hit()
ship.hit()

test('ship numHits equals 2', () => {
  expect(ship.numHits).toBe(2);
});

test('isSunk is false when hits = 2 and length = 5', () => {
  expect(ship.isSunk()).toBeFalsy();
});

let ship2 = new Ship(0, 3)
ship2.hit()
ship2.hit()
ship2.hit()

test('isSunk is true when hits >= length', () => {
  expect(ship2.isSunk()).toBeTruthy();
});
