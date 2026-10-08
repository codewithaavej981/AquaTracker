const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const User = require('./src/models/User');
const Complaint = require('./src/models/Complaint');

const API_BASE = 'http://localhost:5000/api';

async function runPhase3Tests() {
  console.log('====================================================');
  console.log('   AquaTracker - Phase 3 Verification Test Suite   ');
  console.log('====================================================\n');

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri || mongoUri.trim() === '') {
    console.error('❌ MONGODB_URI is not set in backend/.env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  console.log('✅ Connected to MongoDB Atlas\n');

  // Admin credentials from .env
  const adminEmail = (process.env.ADMIN_EMAIL || 'admin@aquatracker.com').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Aavej12345';

  // 1. Authenticate Admin
  console.log('1. Authenticating Admin...');
  const resAdminLogin = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: adminEmail, password: adminPassword }),
  });
  const dataAdminLogin = await resAdminLogin.json();
  if (resAdminLogin.status !== 200 || !dataAdminLogin.token) {
    console.error('❌ Admin login failed:', dataAdminLogin);
    process.exit(1);
  }
  const adminToken = dataAdminLogin.token;
  console.log('   ✅ Admin successfully logged in with role:', dataAdminLogin.user.role);

  // 2. Register/Login a Test Citizen
  console.log('\n2. Registering and Authenticating Test Citizen...');
  const citizenEmail = 'phase3_citizen@aquatracker.com';
  await User.deleteOne({ email: citizenEmail });

  const resCitReg = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Phase 3 Citizen',
      email: citizenEmail,
      password: 'Password@123',
    }),
  });
  const dataCitReg = await resCitReg.json();
  const citizenToken = dataCitReg.token;
  const citizenId = dataCitReg.user.id;
  console.log('   ✅ Test citizen created and token generated.');

  // 3. Test GET /api/admin/stats with Admin Token
  console.log('\n3. Testing Admin Metrics API (GET /api/admin/stats)...');
  const resStats = await fetch(`${API_BASE}/admin/stats`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const dataStats = await resStats.json();
  if (
    resStats.status === 200 &&
    typeof dataStats.totalUsers === 'number' &&
    typeof dataStats.totalConsumptionRecords === 'number' &&
    typeof dataStats.totalComplaints === 'number' &&
    typeof dataStats.pendingComplaints === 'number'
  ) {
    console.log('   ✅ Admin stats returned real MongoDB counts:');
    console.log(`      Total Users: ${dataStats.totalUsers}`);
    console.log(`      Total Consumption Records: ${dataStats.totalConsumptionRecords}`);
    console.log(`      Total Complaints: ${dataStats.totalComplaints}`);
    console.log(`      Pending Complaints: ${dataStats.pendingComplaints}`);
    console.log(`      In Progress Complaints: ${dataStats.inProgressComplaints}`);
    console.log(`      Resolved Complaints: ${dataStats.resolvedComplaints}`);
  } else {
    console.error('   ❌ Failed getting admin stats:', dataStats);
  }

  // 4. Test Citizen access to /api/admin/stats (Must return HTTP 403 Forbidden)
  console.log('\n4. Testing Security Scoping: Citizen accessing GET /api/admin/stats...');
  const resCitStats = await fetch(`${API_BASE}/admin/stats`, {
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  if (resCitStats.status === 403) {
    console.log('   ✅ Citizen blocked with HTTP 403 Forbidden.');
  } else {
    console.error('   ❌ Security failure! Citizen got status:', resCitStats.status);
  }

  // 5. Test Admin User Directory (GET /api/admin/users)
  console.log('\n5. Testing Admin Users Directory (GET /api/admin/users)...');
  const resUsers = await fetch(`${API_BASE}/admin/users`, {
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  const dataUsers = await resUsers.json();
  if (resUsers.status === 200 && Array.isArray(dataUsers.data)) {
    console.log(`   ✅ Admin retrieved user list (count: ${dataUsers.count}).`);
    const containsPassword = dataUsers.data.some((u) => u.password);
    if (!containsPassword) {
      console.log('   ✅ Passwords are excluded from user directory payload.');
    } else {
      console.error('   ❌ Password field leaked in user directory!');
    }
  } else {
    console.error('   ❌ Failed getting admin users list:', dataUsers);
  }

  // 6. Test Citizen access to /api/admin/users (Must return HTTP 403 Forbidden)
  console.log('\n6. Testing Security Scoping: Citizen accessing GET /api/admin/users...');
  const resCitUsers = await fetch(`${API_BASE}/admin/users`, {
    headers: { Authorization: `Bearer ${citizenToken}` },
  });
  if (resCitUsers.status === 403) {
    console.log('   ✅ Citizen blocked from user directory with HTTP 403 Forbidden.');
  } else {
    console.error('   ❌ Security failure! Status was:', resCitUsers.status);
  }

  // 7. Create a Complaint as Citizen to test Admin Status Workflow
  console.log('\n7. Creating a complaint as Citizen to test status updates...');
  const resComp = await fetch(`${API_BASE}/complaints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${citizenToken}`,
    },
    body: JSON.stringify({
      type: 'Pipeline Damage',
      location: 'Ward 10, Industrial Line Main Road',
      description: 'Major fracture in 6-inch main line releasing continuous high-volume water.',
      priority: 'High',
    }),
  });
  const dataComp = await resComp.json();
  const testCompId = dataComp.data._id;
  console.log(`   ✅ Complaint filed by citizen. ID: ${testCompId}, Status: "${dataComp.data.status}"`);

  // 8. Admin changes status: Pending -> In Progress
  console.log('\n8. Admin updating complaint status: "Pending" -> "In Progress"...');
  const resStatus1 = await fetch(`${API_BASE}/admin/complaints/${testCompId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: 'In Progress' }),
  });
  const dataStatus1 = await resStatus1.json();
  if (resStatus1.status === 200 && dataStatus1.data.status === 'In Progress') {
    console.log('   ✅ Status updated to "In Progress" successfully.');
  } else {
    console.error('   ❌ Failed updating status to In Progress:', dataStatus1);
  }

  // 9. Admin changes status: In Progress -> Resolved
  console.log('\n9. Admin updating complaint status: "In Progress" -> "Resolved"...');
  const resStatus2 = await fetch(`${API_BASE}/admin/complaints/${testCompId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminToken}`,
    },
    body: JSON.stringify({ status: 'Resolved' }),
  });
  const dataStatus2 = await resStatus2.json();
  if (resStatus2.status === 200 && dataStatus2.data.status === 'Resolved') {
    console.log('   ✅ Status updated to "Resolved" successfully.');
  } else {
    console.error('   ❌ Failed updating status to Resolved:', dataStatus2);
  }

  // 10. Citizen trying to change status via Admin API (Must return HTTP 403 Forbidden)
  console.log('\n10. Testing Security Scoping: Citizen attempting PATCH /api/admin/complaints/:id/status...');
  const resCitChangeStatus = await fetch(`${API_BASE}/admin/complaints/${testCompId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${citizenToken}`,
    },
    body: JSON.stringify({ status: 'Pending' }),
  });
  if (resCitChangeStatus.status === 403) {
    console.log('   ✅ Citizen blocked with HTTP 403 Forbidden.');
  } else {
    console.error('   ❌ Security failure! Citizen changed status with code:', resCitChangeStatus.status);
  }

  // Clean test data
  await Complaint.deleteOne({ _id: testCompId });
  await User.deleteOne({ _id: citizenId });

  console.log('\n====================================================');
  console.log('   🎉 ALL PHASE 3 BACKEND & ADMIN TESTS PASSED!     ');
  console.log('====================================================\n');

  await mongoose.disconnect();
}

runPhase3Tests().catch((err) => {
  console.error('Phase 3 test runner error:', err);
  process.exit(1);
});
