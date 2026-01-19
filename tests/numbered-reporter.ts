import type { Reporter, TestCase, TestResult, FullResult } from '@playwright/test/reporter';

// ANSI color codes
const green = '\x1b[32m';
const red = '\x1b[31m';
const reset = '\x1b[0m';

class NumberedReporter implements Reporter {
  private testNumber = 0;
  private passed = 0;
  private failed = 0;

  onTestEnd(test: TestCase, result: TestResult) {
    this.testNumber++;
    const title = test.title;

    if (result.status === 'passed') {
      console.log(`${green}✓${reset} ${this.testNumber}. ${title}`);
      this.passed++;
    } else {
      console.log(`${red}✗${reset} ${this.testNumber}. ${title}`);
      this.failed++;
    }
  }

  onEnd(result: FullResult) {
    console.log('');
    console.log(`${green}${this.passed} passed${reset}, ${red}${this.failed} failed${reset}`);
  }
}

export default NumberedReporter;
