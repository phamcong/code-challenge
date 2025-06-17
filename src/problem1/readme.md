# Problem 1: Three Ways to Sum to N

This problem demonstrates three different approaches to calculate the sum of numbers from 1 to n. Each implementation showcases different programming paradigms and their trade-offs.

## Problem Statement

Implement three different functions that calculate the sum of numbers from 1 to n (inclusive). Each function should:
- Take a number n as input
- Return the sum of all numbers from 1 to n
- Handle edge cases (negative numbers, zero)

## Implementations

### 1. Iterative Approach (sum_to_n_a)
```javascript
var sum_to_n_a = function (n) {
  if (n <= 0) return 0;

  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
};
```
- **Time Complexity**: O(n)
- **Space Complexity**: O(1)
- **Advantages**: 
  - Simple and straightforward
  - Constant space usage
  - Easy to understand and debug
- **Disadvantages**: 
  - Linear time complexity
  - Not as efficient for large numbers

### 2. Mathematical Formula Approach (sum_to_n_b)
```javascript
var sum_to_n_b = function (n) {
  if (n <= 0) return 0;

  return (n * (n + 1)) / 2;
};
```
- **Time Complexity**: O(1)
- **Space Complexity**: O(1)
- **Advantages**:
  - Most efficient solution
  - Constant time and space complexity
  - Best for large numbers
- **Disadvantages**:
  - May be less intuitive
  - Requires knowledge of the mathematical formula

### 3. Recursive Approach (sum_to_n_c)
```javascript
var sum_to_n_c = function (n) {
  if (n <= 0) return 0;

  return n + sum_to_n_c(n - 1);
};
```
- **Time Complexity**: O(n)
- **Space Complexity**: O(n) due to call stack
- **Advantages**:
  - Elegant and declarative
  - Good for understanding recursion
  - Clear mathematical relationship
- **Disadvantages**:
  - Stack overflow for large n
  - Less efficient than other methods
  - Higher space complexity

## Test Cases

The implementation includes comprehensive tests covering:
- Basic functionality (n = 0, 1, 5, 10, 100)
- Edge cases (negative numbers)
- Performance comparison
- Large numbers
- Consistency across implementations

Example test cases:
```javascript
// Basic cases
sum_to_n_a(5)  // Returns: 15  (1 + 2 + 3 + 4 + 5)
sum_to_n_b(10) // Returns: 55  (1 + 2 + ... + 9 + 10)
sum_to_n_c(3)  // Returns: 6   (1 + 2 + 3)

// Edge cases
sum_to_n_a(0)  // Returns: 0
sum_to_n_b(-5) // Returns: 0
sum_to_n_c(1)  // Returns: 1
```

## Performance Comparison

| Method     | Time Complexity | Space Complexity | Best For                |
|------------|----------------|------------------|------------------------|
| Iterative  | O(n)           | O(1)            | Small to medium n     |
| Formula    | O(1)           | O(1)            | Any n (most efficient)|
| Recursive  | O(n)           | O(n)            | Small n, learning     |

## Running the Tests

To run the tests:
```bash
npm test
```

The test suite verifies:
- Correct results for all input ranges
- Consistent handling of edge cases
- Performance with large numbers
- Identical results across all implementations
