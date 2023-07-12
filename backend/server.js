const { request } = require("undici");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const app = express();
const db = require("./src/database/index");
const UserTeste = require("./src/database/Schema/User");

db.start();
dotenv.config();

app.use(express.static("build"));
app.use(cors({
  origin: [`${process.env.BASE_URL}`, "https://website-discord-test.vercel.app/"]
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let usert;

app.get("/", (req, res) => {
  console.log("Acessou a rota /");
  res.json({ message: "Hello World" });
});

app.get("/oauth", async (req, res) => {
  console.log(req.query);
  const { code } = req.query;

  if (code) {
    try {
      const tokenResponseData = await request(
        "https://discord.com/api/oauth2/token",
        {
          method: "POST",
          body: new URLSearchParams({
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            code,
            grant_type: "authorization_code",
            redirect_uri: `${process.env.BASE_URL}oauth`,
            scope: "identify",
          }).toString(),
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      const oauthData = await tokenResponseData.body.json();

      const userResult = await request("https://discord.com/api/users/@me", {
        headers: {
          authorization: `${oauthData.token_type} ${oauthData.access_token}`,
        },
      });
      usert = await userResult.body.json();

      const user = await UserTeste.findOne({ userId: usert.id });

      if (!user) {
        await UserTeste.create(
          {
            userId: usert.id,
            messages: [],
            avatarUrl: `https://cdn.discordapp.com/avatars/${usert.id}/${usert.avatar}.png`,
            username: usert.username,
            description: "",
            discriminator: usert.discriminator,
            lastLogin: new Date(),
          },
          {
            new: true,
            upsert: true,
          }
        );
      }
      res.redirect(
        `${process.env.BASE_URL}callback?code=${code}&userId=${usert.id}&username=${usert.username}&avatar=${usert.avatar}&discriminator=${usert.discriminator}`
      );
    } catch (error) {
      console.error(error);
    }
  }
});

app.post("/api/users/:userId/message", async (req, res) => {
  const { userId } = req.params;
  const { message } = req.body;

  const user = await UserTeste.findOne({ userId });

  if (user) {
    user.messages.push({ text: message, timestamp: new Date() });
    await user.save();
  } else {
    const newUser = new UserTeste({
      userId,
      messages: [{ text: message, timestamp: new Date() }],
      lastLogin: new Date(),
    });
    await newUser.save();
  }

  res.json({ message });
});
app.get("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;

  const user = await UserTeste.findOne({ userId });

  if (user) {
    res.json({ user });
  } else {
    res.json({ user: null });
  }
});
app.get("/api/users/:userId/message", async (req, res) => {
  const { userId } = req.params;

  const user = await UserTeste.findOne({ userId });

  if (user) {
    res.json({ messages: user.messages });
  } else {
    res.json({ messages: [] });
  }
});
app.get("/api/users", async (req, res) => {
  try {
    const users = await UserTeste.find();
    console.log("Usuários buscados:", users);
    res.json(users);
  } catch (error) {
    console.error("Erro ao buscar usuários:", error);
    res.status(500).json({ error: "Erro interno" });
  }
});

app.get("*", (req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.listen(process.env.PORT, () =>
  console.log(`App ouvindo na porta ${process.env.PORT}`)
);
