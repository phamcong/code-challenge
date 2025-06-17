/**
 * Three different implementations to calculate the sum of numbers from 1 to n
 */

/**
 * Method 1: Iterative approach using a loop
 * Time Complexity: O(n)
 * Space Complexity: O(1)
 * @param {number} n - The upper limit
 * @returns {number} Sum of numbers from 1 to n, or 0 if n is negative
 */
var sum_to_n_a = function (n) {
  if (n < 0) return 0;
  if (n === 0) return 0;

  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};

/**
 * Method 2: Mathematical formula approach
 * Time Complexity: O(1)
 * Space Complexity: O(1)
 * @param {number} n - The upper limit
 * @returns {number} Sum of numbers from 1 to n, or 0 if n is negative
 */
var sum_to_n_b = function (n) {
  if (n < 0) return 0;
  if (n === 0) return 0;

  return (n * (n + 1)) / 2;
};

/**
 * Method 3: Recursive approach
 * Time Complexity: O(n)
 * Space Complexity: O(n) due to call stack
 * @param {number} n - The upper limit
 * @returns {number} Sum of numbers from 1 to n, or 0 if n is negative
 */
var sum_to_n_c = function (n) {
  if (n <= 0) return 0;
  return n + sum_to_n_c(n - 1);
};

module.exports = { sum_to_n_a, sum_to_n_b, sum_to_n_c };
