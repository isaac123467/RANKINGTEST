require('dotenv').config();
const express = require('express');
const axios = require('axios');
const app = express();
app.use(express.json());

const ROBLOX_COOKIE = process.env.ROBLOX_COOKIE;

// 🔍 Resolve username to UserId
async function getUserId(username) {
  const res = await axios.post('https://users.roblox.com/v1/usernames/users', {
    usernames: [username],
    excludeBannedUsers: true
  });
  if (!res.data.data.length) throw new Error(`User ${username} not found`);
  return res.data.data[0].id;
}

// 🚀 Promote user to new rank
async function promoteUser(userId, groupId, roleId) {
  const res = await axios.patch(
    `https://groups.roblox.com/v1/groups/${groupId}/users/${userId}`,
    { roleId },
    {
      headers: {
        'Cookie': `.ROBLOSECURITY=${ROBLOX_COOKIE}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Roblox/WinInet'
      }
    }
  );
  return res.data;
}

// 🎯 Main route
app.post('/promote', async (req, res) => {
  const { issuer, target, groupId, roleId } = req.body;

  if (!issuer || !target || !groupId || !roleId) {
    return res.status(400).json({ success: false, error: 'Missing required fields' });
  }

  try {
    const userId = await getUserId(target);
    const result = await promoteUser(userId, groupId, roleId);

    console.log(`[${new Date().toISOString()}] ${issuer} promoted ${target} (UserId: ${userId}) to roleId ${roleId} in group ${groupId}`);
    res.json({ success: true, message: `Promoted ${target}`, result });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Promotion failed for ${target}: ${err.message}`);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(3000, () => console.log('✅ Promotion API running on port 3000'));
