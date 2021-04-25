fetch('http://127.0.0.1:7001/auth/login', { headers: { 'content-type': 'application/json' }, method: 'POST', body: JSON.stringify({ phone: '13112345678', password: '123456' }) });
fetch('http://127.0.0.1:7001/auth/getInfo', {
  headers: {
    authorization:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDdmZjRkYmM2NzdkNjRkMjQ1MjU1ZjgiLCJwaG9uZSI6IjEzMTEyMzQ1Njc4IiwidXNlcm5hbWUiOiIxMzExMjM0NTY3OCIsInN0YXR1cyI6MCwiaWF0IjoxNjE5MzE3NzMwLCJleHAiOjE2MTk0MDQxMzB9.FXhAQjmzNafMCohPwoBfyH3rhESFsQQ8x9kTBXuoRQA',
  },
});
fetch('http://127.0.0.1:7001/auth/logout', {
  headers: {
    'content-type': 'application/json',
    'authorization':
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MDdmZjRkYmM2NzdkNjRkMjQ1MjU1ZjgiLCJwaG9uZSI6IjEzMTEyMzQ1Njc4IiwidXNlcm5hbWUiOiIxMzExMjM0NTY3OCIsInN0YXR1cyI6MCwiaWF0IjoxNjE5MzE3NzMwLCJleHAiOjE2MTk0MDQxMzB9.FXhAQjmzNafMCohPwoBfyH3rhESFsQQ8x9kTBXuoRQA',
  },
  method: 'POST',
});
