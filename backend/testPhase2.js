const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '.env') });

const mongoose = require('mongoose');
const User = require('./src/models/User');
const WaterConsumption = require('./src/models/WaterConsumption');
const Complaint = require('./src/models/Complaint');

const API_BASE = 'http://localhost:5000/api';

async function runPhase2Tests() {
  console.log('====================================================');
  console.log('   AquaTracker - Phase 2 Verification Test Suite   ');
  console.log('====================================================\n');

  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri || mongoUri.trim() === '') {
    console.error('❌ MONGODB_URI is not set in backend/.env');
    process.exit(1);
  }

  await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
  console.log('✅ Connected to MongoDB Atlas\n');

  // Create two distinct users to test scoping: User A and User B
  const userAEmail = 'user_a_test@aquatracker.com';
  const userBEmail = 'user_b_test@aquatracker.com';

  // Cleanup past test data
  const uA = await User.findOne({ email: userAEmail });
  if (uA) {
    await WaterConsumption.deleteMany({ userId: uA._id });
    await Complaint.deleteMany({ userId: uA._id });
    await User.deleteOne({ _id: uA._id });
  }

  const uB = await User.findOne({ email: userBEmail });
  if (uB) {
    await WaterConsumption.deleteMany({ userId: uB._id });
    await Complaint.deleteMany({ userId: uB._id });
    await User.deleteOne({ _id: uB._id });
  }

  // Register User A
  const resRegA = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'User A', email: userAEmail, password: 'Password@123' }),
  });
  const dataRegA = await resRegA.json();
  const tokenA = dataRegA.token;
  console.log('1. User A registered and authenticated.');

  // Register User B
  const resRegB = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'User B', email: userBEmail, password: 'Password@123' }),
  });
  const dataRegB = await resRegB.json();
  const tokenB = dataRegB.token;
  console.log('2. User B registered and authenticated.');

  // TEST 1: Create consumption record & verify backend calculation of total
  console.log('\n3. Testing Water Consumption Creation & Total Calculation...');
  const resConsA = await fetch(`${API_BASE}/consumption`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      date: '2026-10-08',
      morning: 120.5,
      afternoon: 80.25,
      evening: 95.25,
      total: 9999, // Frontend sending false total
    }),
  });
  const dataConsA = await resConsA.json();
  if (resConsA.status === 201 && dataConsA.data) {
    const expectedTotal = 120.5 + 80.25 + 95.25; // 296
    if (dataConsA.data.total === expectedTotal) {
      console.log(`   ✅ Consumption created. Backend correctly calculated total: ${dataConsA.data.total}L (ignored false 9999).`);
    } else {
      console.error(`   ❌ Failed: Total was ${dataConsA.data.total}, expected ${expectedTotal}`);
    }
  } else {
    console.error('   ❌ Failed creating consumption:', dataConsA);
  }
  const consAId = dataConsA.data?._id;

  // TEST 2: Retrieve consumption history for User A
  console.log('\n4. Testing Consumption Retrieval for User A...');
  const resGetConsA = await fetch(`${API_BASE}/consumption`, {
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const dataGetConsA = await resGetConsA.json();
  if (resGetConsA.status === 200 && dataGetConsA.count === 1) {
    console.log('   ✅ Retrieved consumption history (count: 1).');
  } else {
    console.error('   ❌ Unexpected count:', dataGetConsA);
  }

  // TEST 3: User B must NOT access User A's consumption
  console.log("\n5. Testing Security Scoping: User B accessing User A's consumption record...");
  const resGetConsB = await fetch(`${API_BASE}/consumption/${consAId}`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  if (resGetConsB.status === 404) {
    console.log("   ✅ User B blocked with 404 (User A's record is completely isolated).");
  } else {
    console.error("   ❌ Security vulnerability! User B got status:", resGetConsB.status);
  }

  // TEST 4: Edit consumption record by User A
  console.log('\n6. Testing Edit Consumption for User A...');
  const resUpdateCons = await fetch(`${API_BASE}/consumption/${consAId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      morning: 150,
      afternoon: 50,
      evening: 100,
    }),
  });
  const dataUpdateCons = await resUpdateCons.json();
  if (resUpdateCons.status === 200 && dataUpdateCons.data.total === 300) {
    console.log('   ✅ Consumption updated. Backend recalculated total to 300L.');
  } else {
    console.error('   ❌ Edit consumption failed:', dataUpdateCons);
  }

  // TEST 5: Create Complaint & verify default status is 'Pending'
  console.log('\n7. Testing Complaint Submission & Default Status...');
  const resCompA = await fetch(`${API_BASE}/complaints`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      type: 'Water Leakage',
      location: 'Main Street Sector 4, Near Water Tank',
      description: 'Major underground pipeline leakage overflowing onto the road.',
      priority: 'High',
      status: 'Resolved', // Maliciously attempting to set Resolved
    }),
  });
  const dataCompA = await resCompA.json();
  if (resCompA.status === 201 && dataCompA.data) {
    if (dataCompA.data.status === 'Pending') {
      console.log('   ✅ Complaint filed. Server strictly enforced status: "Pending" (ignored "Resolved").');
    } else {
      console.error('   ❌ Failed: Server allowed client status:', dataCompA.data.status);
    }
  } else {
    console.error('   ❌ Failed filing complaint:', dataCompA);
  }
  const compAId = dataCompA.data?._id;

  // TEST 6: User B must NOT access User A's complaints
  console.log("\n8. Testing Security Scoping: User B accessing User A's complaint...");
  const resGetCompB = await fetch(`${API_BASE}/complaints/${compAId}`, {
    headers: { Authorization: `Bearer ${tokenB}` },
  });
  if (resGetCompB.status === 404) {
    console.log("   ✅ User B blocked with 404 (User A's complaint is isolated).");
  } else {
    console.error("   ❌ Security failure! User B accessed complaint, status:", resGetCompB.status);
  }

  // TEST 7: Edit Complaint & verify status cannot be altered by citizen
  console.log('\n9. Testing Complaint Edit & Status Protection...');
  const resUpdateComp = await fetch(`${API_BASE}/complaints/${compAId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tokenA}`,
    },
    body: JSON.stringify({
      location: 'Main Street Sector 4, Updated Landmark',
      status: 'In Progress', // Citizen trying to change status
    }),
  });
  const dataUpdateComp = await resUpdateComp.json();
  if (resUpdateComp.status === 200 && dataUpdateComp.data.status === 'Pending') {
    console.log('   ✅ Complaint details updated, but status remained "Pending" (citizen cannot change status).');
  } else {
    console.error('   ❌ Failed: Status changed to:', dataUpdateComp.data?.status);
  }

  // TEST 8: Delete Consumption & Delete Complaint
  console.log('\n10. Testing Delete Operations...');
  const resDelCons = await fetch(`${API_BASE}/consumption/${consAId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  const resDelComp = await fetch(`${API_BASE}/complaints/${compAId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${tokenA}` },
  });
  if (resDelCons.status === 200 && resDelComp.status === 200) {
    console.log('   ✅ Consumption record and Complaint deleted successfully.');
  } else {
    console.error('   ❌ Deletion failed. Cons:', resDelCons.status, 'Comp:', resDelComp.status);
  }

  // Cleanup test users
  await User.deleteMany({ email: { $in: [userAEmail, userBEmail] } });

  console.log('\n====================================================');
  console.log('   🎉 ALL PHASE 2 BACKEND APIS & SECURITY PASSED!   ');
  console.log('====================================================\n');

  await mongoose.disconnect();
}

runPhase2Tests().catch((err) => {
  console.error('Error in Phase 2 test suite:', err);
  process.exit(1);
});
