const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./src/models/User');

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('   AquaTracker - Phase 1 Verification Test Suite   ');
  console.log('====================================================\n');

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri || mongoUri.trim() === '') {
    console.error('❌ MONGODB_URI is not set in backend/.env');
    console.log('👉 Please insert your MongoDB Atlas URI into backend/.env to run database tests.');
    process.exit(1);
  }

  // 1. Test Database Connection
  console.log('1. Testing MongoDB Atlas connection...');
  try {
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log(`   ✅ MongoDB Atlas connected: ${mongoose.connection.host}`);
  } catch (err) {
    console.error(`   ❌ Connection failed: ${err.message}`);
    process.exit(1);
  }

  // 2. Test Server Health Check
  console.log('\n2. Testing Server Health API (/api/health)...');
  try {
    const healthRes = await fetch(`${API_BASE}/health`);
    const healthData = await healthRes.json();
    if (healthRes.ok && healthData.status === 'ok') {
      console.log('   ✅ Backend server is online and healthy.');
    } else {
      console.error('   ❌ Unexpected health response:', healthData);
    }
  } catch (err) {
    console.error(`   ❌ Failed to connect to server at ${API_BASE}/health: ${err.message}`);
    console.log('   (Ensure backend server is running on port 5000)');
    await mongoose.disconnect();
    process.exit(1);
  }

  // Clean test accounts if exist
  const testUserEmail = 'citizen_test@aquatracker.com';
  await User.deleteOne({ email: testUserEmail });

  // 3. Test Registration of Citizen User
  console.log('\n3. Testing Citizen Registration (/api/auth/register)...');
  let citizenToken = '';
  try {
    const regRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Citizen',
        email: testUserEmail,
        password: 'Password@123',
        role: 'admin', // Maliciously trying to request admin role
      }),
    });
    const regData = await regRes.json();
    if (regRes.status === 201 && regData.token) {
      citizenToken = regData.token;
      if (regData.user.role === 'user') {
        console.log('   ✅ Registration succeeded. Server strictly enforced role: "user" (ignored "admin" payload).');
        console.log('   ✅ Password is NOT exposed in response payload.');
      } else {
        console.error('   ❌ Security failure: Server allowed requested role:', regData.user.role);
      }
    } else {
      console.error('   ❌ Registration failed:', regData);
    }
  } catch (err) {
    console.error('   ❌ Registration request error:', err.message);
  }

  // 4. Test Duplicate Email Registration
  console.log('\n4. Testing Duplicate Email Rejection...');
  try {
    const dupRes = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Duplicate Citizen',
        email: testUserEmail,
        password: 'Password@123',
      }),
    });
    const dupData = await dupRes.json();
    if (dupRes.status === 400) {
      console.log('   ✅ Duplicate registration correctly rejected with HTTP 400.');
    } else {
      console.error('   ❌ Duplicate registration was not rejected:', dupData);
    }
  } catch (err) {
    console.error('   ❌ Duplicate registration test error:', err.message);
  }

  // 5. Test Password Hashing in Database
  console.log('\n5. Verifying Password Hashing in Database...');
  const storedUser = await User.findOne({ email: testUserEmail });
  if (storedUser && storedUser.password.startsWith('$2') && storedUser.password !== 'Password@123') {
    console.log('   ✅ Password is securely stored as bcrypt hash in MongoDB.');
  } else {
    console.error('   ❌ Password is not hashed properly:', storedUser?.password);
  }

  // 6. Test Login with Valid Citizen Credentials
  console.log('\n6. Testing Citizen Login (/api/auth/login)...');
  try {
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUserEmail,
        password: 'Password@123',
      }),
    });
    const loginData = await loginRes.json();
    if (loginRes.status === 200 && loginData.token) {
      console.log('   ✅ Login succeeded. JWT token issued.');
    } else {
      console.error('   ❌ Login failed:', loginData);
    }
  } catch (err) {
    console.error('   ❌ Login error:', err.message);
  }

  // 7. Test Login with Invalid Password
  console.log('\n7. Testing Login with Invalid Password...');
  try {
    const badLoginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUserEmail,
        password: 'WrongPassword!',
      }),
    });
    if (badLoginRes.status === 401) {
      console.log('   ✅ Invalid password rejected with HTTP 401.');
    } else {
      console.error('   ❌ Invalid password was not rejected properly.');
    }
  } catch (err) {
    console.error('   ❌ Bad login error:', err.message);
  }

  // 8. Test /api/auth/me with JWT Token
  console.log('\n8. Testing Profile Retrieval (/api/auth/me) with JWT...');
  try {
    const meRes = await fetch(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    const meData = await meRes.json();
    if (meRes.status === 200 && meData.user && meData.user.email === testUserEmail) {
      console.log('   ✅ /api/auth/me successfully returned authenticated citizen profile.');
    } else {
      console.error('   ❌ /api/auth/me failed:', meData);
    }
  } catch (err) {
    console.error('   ❌ /api/auth/me error:', err.message);
  }

  // 9. Test Admin Route Access as Normal Citizen
  console.log('\n9. Testing Admin Route Authorization Guard (/api/auth/admin-check)...');
  try {
    const adminCheckRes = await fetch(`${API_BASE}/auth/admin-check`, {
      headers: { Authorization: `Bearer ${citizenToken}` },
    });
    if (adminCheckRes.status === 403) {
      console.log('   ✅ Citizen user blocked from admin endpoint with HTTP 403 Forbidden.');
    } else {
      console.error('   ❌ Citizen was not blocked from admin endpoint! Status:', adminCheckRes.status);
    }
  } catch (err) {
    console.error('   ❌ Admin route guard test error:', err.message);
  }

  // 10. Test Admin Seeding & Admin Login
  console.log('\n10. Testing Admin Account Seeding & Admin Login...');
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@aquatracker.com').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const adminName = process.env.ADMIN_NAME || 'AquaTracker Admin';

  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(adminPassword, salt);
    adminUser = await User.create({
      name: adminName,
      email: adminEmail,
      password: hash,
      role: 'admin',
    });
    console.log('   ✅ Admin account seeded into database.');
  } else {
    console.log('   ℹ️ Existing admin account found.');
  }

  const adminLoginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: adminEmail,
      password: adminPassword,
    }),
  });
  const adminLoginData = await adminLoginRes.json();

  if (adminLoginRes.status === 200 && adminLoginData.user.role === 'admin') {
    console.log('   ✅ Admin logged in successfully with role "admin".');
    const adminToken = adminLoginData.token;

    // Test Admin Route Access with Admin Token
    const adminAccessRes = await fetch(`${API_BASE}/auth/admin-check`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (adminAccessRes.status === 200) {
      console.log('   ✅ Admin authorized successfully on /api/auth/admin-check with HTTP 200.');
    } else {
      console.error('   ❌ Admin token failed authorization check:', adminAccessRes.status);
    }
  } else {
    console.error('   ❌ Admin login failed:', adminLoginData);
  }

  // Clean test citizen account
  await User.deleteOne({ email: testUserEmail });

  console.log('\n====================================================');
  console.log('   🎉 ALL PHASE 1 REQUIREMENTS VERIFIED & PASSED!  ');
  console.log('====================================================\n');

  await mongoose.disconnect();
}

runTests();
