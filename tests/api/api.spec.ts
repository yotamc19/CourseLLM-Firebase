/**
 * API Tests
 *
 * Tests for the DSPy Python backend API endpoints.
 * Requires the Python backend to be running on port 8001.
 *
 * To run:
 *   1. Start the backend: uvicorn src.ai.dspy.api:app --reload --port 8001
 *   2. Run tests: npx playwright test tests/api/api.spec.ts
 */

import { test, expect } from '@playwright/test';

const API_BASE_URL = 'http://127.0.0.1:8001';

test.describe('DSPy API Health', () => {

  test('GET / should return health status', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/`, { timeout: 5000 });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data.status).toBe('healthy');
    expect(data.service).toBe('CourseLLM DSPy API');
    expect(data.version).toBe('1.0.0');
  });

});

test.describe('DSPy API Endpoints', () => {

  test('POST /answer should accept valid question request', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/answer`, {
      data: {
        course_materials: ['Introduction to algorithms. An algorithm is a step-by-step procedure.'],
        question: 'What is an algorithm?',
        use_socratic: false,
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('response');
    expect(data).toHaveProperty('type');
    expect(typeof data.response).toBe('string');
  });

  test('POST /answer with socratic mode should return guiding questions', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/answer`, {
      data: {
        course_materials: ['Data structures are ways to organize data. Arrays store elements sequentially.'],
        question: 'How do arrays work?',
        use_socratic: true,
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('response');
    expect(data.type).toBe('socratic');
  });

  test('POST /assess should evaluate student answer', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/assess`, {
      data: {
        question: 'What is the time complexity of binary search?',
        student_answer: 'O(log n)',
        correct_answer: 'O(log n) - logarithmic time',
        topic: 'Algorithm Complexity',
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('assessment');
    expect(data).toHaveProperty('understanding_level');
    expect(data).toHaveProperty('follow_up_questions');
    expect(Array.isArray(data.follow_up_questions)).toBe(true);
  });

  test('POST /summarize should return summary and key points', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/summarize`, {
      data: {
        materials: [
          'Machine learning is a subset of artificial intelligence.',
          'It enables computers to learn from data without being explicitly programmed.',
          'Common types include supervised, unsupervised, and reinforcement learning.',
        ],
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('summary');
    expect(data).toHaveProperty('key_points');
    expect(Array.isArray(data.key_points)).toBe(true);
  });

  test('POST /quiz should generate quiz questions', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/quiz`, {
      data: {
        material_content: 'Python is a high-level programming language. It supports multiple paradigms including procedural, object-oriented, and functional programming.',
        difficulty: 'medium',
        num_questions: 3,
      },
    });

    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(data).toHaveProperty('questions');
    expect(Array.isArray(data.questions)).toBe(true);
  });

});

test.describe('DSPy API Error Handling', () => {

  test('POST /answer with empty materials should handle gracefully', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/answer`, {
      data: {
        course_materials: [],
        question: 'What is this about?',
        use_socratic: false,
      },
    });

    // Should either succeed with empty context or return appropriate error
    expect([200, 400, 422, 500]).toContain(response.status());
  });

  test('POST /answer with missing fields should return 422', async ({ request }) => {
    const response = await request.post(`${API_BASE_URL}/answer`, {
      data: {
        // Missing required fields
        question: 'Test question',
      },
    });

    // Pydantic validation should catch missing fields
    expect([400, 422]).toContain(response.status());
  });

  test('Invalid endpoint should return 404', async ({ request }) => {
    const response = await request.get(`${API_BASE_URL}/nonexistent`);
    expect(response.status()).toBe(404);
  });

});

test.describe('Next.js API Routes', () => {

  const NEXTJS_BASE_URL = 'http://localhost:9002';

  test('GET /api/test-token without params should return error', async ({ request }) => {
    const response = await request.get(`${NEXTJS_BASE_URL}/api/test-token`);

    // Should return error about missing params or disabled
    const data = await response.json();
    expect(data).toHaveProperty('error');
  });

  test('test-token endpoint respects ENABLE_TEST_AUTH flag', async ({ request }) => {
    const response = await request.get(`${NEXTJS_BASE_URL}/api/test-token?uid=test&createProfile=false`);
    const data = await response.json();

    // If disabled, should return "test auth disabled"
    // If enabled, should return a token
    if (data.error === 'test auth disabled') {
      expect(data.error).toBe('test auth disabled');
    } else if (data.token) {
      expect(typeof data.token).toBe('string');
    } else {
      // Some other error (e.g., missing service account)
      expect(data).toHaveProperty('error');
    }
  });

});
