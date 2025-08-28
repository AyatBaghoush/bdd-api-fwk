
import { htmlReport } from 'https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js';
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend, Counter, Rate } from 'k6/metrics';

// Custom metrics
const responseTimeTrend = new Trend('response_time');
const requestCounter = new Counter('request_count');
const successRate = new Rate('success_rate');

export const options = {
  vus: 10, // virtual users
  duration: '10s', // test duration
  thresholds: {
    'response_time': ['p(95)<50'], // 95% of responses must be <50ms
    'success_rate': ['rate>0.95'],  // At least 95% must succeed
  },
};

export default function () {

  const url = 'https://reqres.in/api/users';
const params = {
  headers: {
    'Accept': '*/*',
    'x-api-key': 'reqres-free-v1' // Replace with your actual token if needed
  },
  params: {
    page: 2,
    per_page: 6
  }
};

const res = http.get(url, params);
//  const res = http.get('https://reqres.in/api/users', { params: { page: 2, per_page: 6 } });

 // Record metrics
  responseTimeTrend.add(res.timings.duration);
  requestCounter.add(1);
  successRate.add(res.status === 200);

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response has data': (r) => JSON.parse(r.body).data.length > 0,
    'response time < 50ms': (r) => r.timings.duration < 50,
  });

  sleep(1); // simulate user think time
}

export function handleSummary(data) {
  return {
    'k6-report.html': htmlReport(data), // Generate HTML report
    'k6-summary.json': JSON.stringify(data, null, 2), // This file will be used by the HTML reporter
  };
}
