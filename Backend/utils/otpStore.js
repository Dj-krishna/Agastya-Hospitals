// utils/otpStore.js
// Simple in-memory OTP store with TTL. Replace with Redis for production.
const store = new Map();

function set(key, value, ttlSeconds = 300) {
  const expiresAt = Date.now() + ttlSeconds * 1000;
  store.set(key, { value: String(value), expiresAt });

  // schedule a cleanup
  setTimeout(() => {
    const item = store.get(key);
    if (item && item.expiresAt <= Date.now()) store.delete(key);
  }, ttlSeconds * 1000 + 1000);

  return Promise.resolve(true);
}

function get(key) {
  const item = store.get(key);
  if (!item) return Promise.resolve(null);
  if (item.expiresAt <= Date.now()) {
    store.delete(key);
    return Promise.resolve(null);
  }
  return Promise.resolve(item.value);
}

async function verify(key, value) {
  const actual = await get(key);
  return actual !== null && actual === String(value);
}

function del(key) {
  store.delete(key);
  return Promise.resolve(true);
}

module.exports = { set, get, verify, delete: del };

/*
PROD NOTE:
Replace this file with a Redis implementation:
- Use ioredis or redis client
- Use setex(key, ttl, value) and get, del
- Keys: `otp:${to}:${purpose}`
*/
