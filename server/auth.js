const bcrypt = require("bcrypt");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const LocalStrategy = require("passport-local").Strategy;

const { pool } = require("./db");

passport.serializeUser((user, done) => {
  console.log("serializing");
  done(null, user.counter_agent_id);
});

passport.deserializeUser(async (id, done) => {
  console.log("deserializing", id);
  try {
    let { rows: user } = await pool.query(
      `Select counter_agent.*, family.family_name
      FROM counter_agent left JOIN family
      on counter_agent.family_id = family.family_id
      Where counter_agent.counter_agent_id = $1`,
      [id]
    );
    if (user.length) {
      done(null, user[0]);
    } else {
      done(null, false);
    }
  } catch (err) {
    done(err);
  }
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password"
    },
    async (email, password, done) => {
      let { rows: user } = await pool.query(
        `Select * from counter_agent
             Where email = $1`,
        [email]
      );
      if (user.length === 0) {
        done(
          { type: "email", message: "Не найден пользователь с такой почтой" },
          false
        );
        return;
      }
      if (await bcrypt.compare(password, user[0].password)) {
        done(null, user[0]);
      } else {
        done({ type: "password", message: "Неверный пароль" }, false);
      }
    }
  )
);

exports.getLoggedUser = async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const reqUserId = req.user.counter_agent_id;
      let { rows: user } = await pool.query(
        `Select counter_agent.*, family.family_name
        FROM counter_agent left JOIN family
        on counter_agent.family_id = family.family_id
        Where counter_agent.counter_agent_id = $1`,
        [reqUserId]
      );

      if (user.length > 0) {
        let resUser = user[0];
        delete resUser.password;
        res.send(resUser);
      } else {
        res.status(500).send("User doesn't exist");
      }
    } else {
      res.status(401).send("User is not authnticated");
    }
  } catch (err) {
    res.status(500).send("Internal Server error");
  }
};
