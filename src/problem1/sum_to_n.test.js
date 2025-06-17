const { sum_to_n_a, sum_to_n_b, sum_to_n_c } = require("./sum-to-n");

describe("Sum to n functions", () => {
  // Test cases for different scenarios
  const testCases = [
    { n: 0, expected: 0, description: "zero" },
    { n: 1, expected: 1, description: "one" },
    { n: 5, expected: 15, description: "small positive" },
    { n: 10, expected: 55, description: "medium positive" },
    { n: 100, expected: 5050, description: "large positive" },
    { n: -1, expected: 0, description: "negative one" },
    { n: -5, expected: 0, description: "small negative" },
    { n: -10, expected: 0, description: "medium negative" },
  ];

  // Test all three implementations
  describe("sum_to_n_a (Iterative)", () => {
    testCases.forEach(({ n, expected, description }) => {
      test(`should return ${expected} for ${description} (n=${n})`, () => {
        expect(sum_to_n_a(n)).toBe(expected);
      });
    });
  });

  describe("sum_to_n_b (Formula)", () => {
    testCases.forEach(({ n, expected, description }) => {
      test(`should return ${expected} for ${description} (n=${n})`, () => {
        expect(sum_to_n_b(n)).toBe(expected);
      });
    });
  });

  describe("sum_to_n_c (Recursive)", () => {
    testCases.forEach(({ n, expected, description }) => {
      test(`should return ${expected} for ${description} (n=${n})`, () => {
        expect(sum_to_n_c(n)).toBe(expected);
      });
    });
  });

  // Performance comparison test
  describe("Performance Comparison", () => {
    test("all methods should return the same result for large numbers", () => {
      const largeN = 1000;
      const result1 = sum_to_n_a(largeN);
      const result2 = sum_to_n_b(largeN);
      const result3 = sum_to_n_c(largeN);

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
      expect(result1).toBe(500500); // Expected result for sum 1 to 1000
    });
  });

  // Edge cases
  describe("Edge Cases", () => {
    test("should handle very large numbers", () => {
      const largeN = 10000;
      expect(sum_to_n_b(largeN)).toBe(50005000);
    });

    test("should handle negative numbers consistently", () => {
      const negativeNumbers = [-1, -5, -10, -100];
      negativeNumbers.forEach((n) => {
        expect(sum_to_n_a(n)).toBe(0);
        expect(sum_to_n_b(n)).toBe(0);
        expect(sum_to_n_c(n)).toBe(0);
      });
    });
  });
});
