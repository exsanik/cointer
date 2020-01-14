require("dotenv").config({ path: require("find-config")(".env") });
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const schedule = require("node-schedule");
const path = require("path");
const {
  pool,
  createUser,
  checkUser,
  getAccountByID,
  addSpend,
  addIncome,
  getOperationHistory,
  setAvatarHash,
  delAccountById,
  addFamily,
  getAllFamilies,
  getFamilyPin,
  setFamily,
  getAllAccountTypes,
  getAllCurrencies,
  addAccount,
  getCurrencyValue,
  getIncomeByDate,
  getSpendByDate,
  getIncomeByFamDate,
  getSpendByFamDate,
  getFinalReportOnCategory,
  getSpendCategories,
  getIncomeCategories,
  addIncomeCategory,
  addSpendCategory
} = require("./db");
const logger = require("morgan");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(logger("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      pool,
      tableName: "session"
    }),
    secret: process.env.KOA_SESSION_SECRET,
    cookie: {
      path: "/",
      httpOnly: false,
      maxAge: 24 * 60 * 60 * 1000
    },
    resave: false,
    saveUninitialized: false
  })
);
const rule = new schedule.RecurrenceRule();
rule.hour = [0, 12];
rule.minute = 0;

const j = schedule.scheduleJob(rule, () => {
  getCurrencyValue(); //get actual currency value
});

const port = process.env.PORT || 5000;

const authResp = require("./auth");

app.use(passport.initialize());
app.use(passport.session());

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/api", (req, res) => {
  res.send("Hello World!");
});

app.get("/api/logout", (req, res, next) => {
  req.logOut();
  req.session.destroy(function(err) {
    if (!err) {
      res
        .status(200)
        .clearCookie("connect.sid", { path: "/" })
        .json({ status: "Logged out" });
    } else {
      next(err);
    }
  });
});

app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", function(err, user) {
    if (!user) {
      return res.status(401).send(err.message);
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.redirect("/api/admin");
    });
  })(req, res, next);
});

app.get("/api/checkLogin", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({ login: true });
  } else {
    res.json({ login: false });
  }
});

app.post("/api/register", async (req, res, next) => {
  const { email, name, password } = req.body;
  if (!(await checkUser(email))) {
    await createUser(email, name, password);
    return res.status(200).send("Успешно зарегистрирован");
  } else {
    return res.status(200).send("Пользователь уже существует");
  }
});

app.get("/api/allSpendCategories", async (req, res, next) => {
  try {
    const result = await getSpendCategories(req.user.counter_agent_id);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send("Request error");
  }
});

app.get("/api/getAccountById", async (req, res, next) => {
  try {
    const result = await getAccountByID(req.user.counter_agent_id);
    res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.post("/api/addSpend", async (req, res, next) => {
  try {
    const { category_id, account_id, value, name, usefull } = req.body;
    if (
      !(await addSpend(
        req.user.counter_agent_id,
        Number(category_id),
        Number(account_id),
        Number(value),
        name,
        usefull
      ))
    ) {
      throw Error("Database error");
    }
    return res.status(200).send("Успешно добавлено");
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.get("/api/getAllIncomeCategories", async (req, res, next) => {
  try {
    const result = await getIncomeCategories(req.user.counter_agent_id);
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.post("/api/addIncome", async (req, res, next) => {
  try {
    const { account_id, category_id, value } = req.body;
    if (
      !(await addIncome(Number(category_id), Number(account_id), Number(value)))
    ) {
      throw Error("Database error");
    }
    return res.status(200).send("Успешно обновлено");
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.get("/api/getOperationHistory", async (req, res) => {
  try {
    const result = await getOperationHistory(req.user.counter_agent_id);
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.post("/api/setAvatarHash", async (req, res) => {
  try {
    const { hash } = req.body;
    await setAvatarHash(hash, req.user.counter_agent_id);
    return res.status(200).send("Set successfuly");
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.post("/api/delAccount", async (req, res) => {
  try {
    const { id } = req.body;
    await delAccountById(id);
    return res.status(200).send("Deleted successfuly");
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.post("/api/createFamily", async (req, res) => {
  try {
    const { name, code } = req.body;
    await addFamily(req.user.counter_agent_id, name, code);
    return res.status(200).send("Created successfuly");
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.get("/api/getAllFamilies", async (req, res) => {
  try {
    const result = await getAllFamilies();
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.post("/api/setFamily", async (req, res) => {
  try {
    const { family_id, code } = req.body;
    const pinArr = await getFamilyPin(family_id);
    const { family_code } = pinArr[0];
    if (family_code !== code) {
      return res.status(200).send("Не верный пин код");
    }
    await setFamily(req.user.counter_agent_id, family_id);
    return res.status(200).send(true);
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.get("/api/getAllCurrencies", async (req, res) => {
  try {
    const result = await getAllCurrencies();
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.get("/api/getAllAccountTypes", async (req, res) => {
  try {
    const result = await getAllAccountTypes();
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.post("/api/addAccount", async (req, res) => {
  try {
    const { currency_id, name, balance, type_id } = req.body;
    await addAccount(
      req.user.counter_agent_id,
      currency_id,
      type_id,
      name,
      balance
    );
    return res.status(200).send("Added successfully");
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.post("/api/getIncomeByDate", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const result = await getIncomeByDate(
      startDate,
      endDate,
      req.user.counter_agent_id
    );
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.post("/api/getSpendByDate", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const result = await getSpendByDate(
      startDate,
      endDate,
      req.user.counter_agent_id
    );
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.post("/api/getIncomeByFamDate", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const result = await getIncomeByFamDate(
      startDate,
      endDate,
      req.user.counter_agent_id
    );
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.post("/api/getSpendByFamDate", async (req, res) => {
  try {
    const { startDate, endDate } = req.body;
    const result = await getSpendByFamDate(
      startDate,
      endDate,
      req.user.counter_agent_id
    );
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.post("/api/getFinalCategoryReport", async (req, res) => {
  try {
    const { startDate, endDate, categoryId } = req.body;
    const result = await getFinalReportOnCategory(
      categoryId,
      startDate,
      endDate,
      req.user.counter_agent_id
    );
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.get("/api/getSpendCategories", async (req, res) => {
  try {
    const result = await getSpendCategories();
    return res.status(200).send(result);
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.post("/api/addIncomeCategory", async (req, res) => {
  try {
    const { parentId, name } = req.body;
    await addIncomeCategory(name, parentId, req.user.counter_agent_id);
    return res.status(200).send("Success");
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.post("/api/addSpendCategory", async (req, res) => {
  try {
    const { parentId, name } = req.body;
    await addSpendCategory(name, parentId, req.user.counter_agent_id);
    return res.status(200).send("Success");
  } catch (err) {
    return res.status(500).send("Request error");
  }
});

app.get("/api/admin", authResp.getLoggedUser);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(port, () => console.log(`Server listening on port ${port}!`));
