const express = require("express");
const router = express.Router();
const User = require("../database/Schema/User");
let usert;
const request = require("node-fetch");


router.get("/oauth", async (req, res) => {
  const { code } = req.query;
  
  if (code) {
    try {
      const tokenResponse = await request(
        "https://discord.com/api/oauth2/token",
        {
          method: "POST",
          body: new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: `http://localhost:8087/oauth`,
            scope: "identify",
          }).toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const oauthData = await tokenResponse.json();  

      const userResponse = await request("https://discord.com/api/users/@me", {
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
      });
      const user = await userResponse.json(); 

      usert = user;

      const dbUser = await User.findOne({ userId: user.id });

      if (!dbUser) {
        await User.create({
          userId: user.id,
          messages: [],
          avatarUrl: `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.png`,
          username: user.username,
          description: "",
          discriminator: user.discriminator,
          lastLogin: new Date(),
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  if (usert) {
    res.redirect(
      `http://localhost:8087/callback?code=${code}&userId=${usert.id}&username=${usert.username}&avatar=${usert.avatar}&discriminator=${usert.discriminator}`
    );
  } else {
    res.redirect(`http://localhost:8087/callback?code=${code}`);
  }
});


router.post("/api/users/:userId/message", async (req, res) => {
  const { userId } = req.params;
  const { message } = req.body;

  const user = await User.findOne({ userId });

  if (user) {
    user.messages.push({ text: message, timestamp: new Date() });
    await user.save();
  } else {
    const newUser = new User({
      userId,
      messages: [{ text: message, timestamp: new Date() }],
      lastLogin: new Date(),
    });
    await newUser.save();
  }

  res.json({ message });
});

router.get("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;

  const user = await User.findOne({ userId });

  if (user) {
    res.json({ user });
  } else {
    res.json({ user: null });
  }
});

router.get("/api/users/:userId/message", async (req, res) => {
  const { userId } = req.params;

  const user = await User.findOne({ userId });

  if (user) {
    res.json({ messages: user.messages });
  } else {
    res.json({ messages: [] });
  }
});

router.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuarios:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

module.exports = router;
