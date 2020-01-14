const { Pool } = require("pg");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const axios = require("axios");

const salt = 10;

const pool = new Pool({
  ssl: true
});

const createUser = async (email, name, password) => {
  try {
    const hashPass = await bcrypt.hash(password, salt);
    await pool.query(
      "Insert into counter_agent(agent_name, email, password, avatar_hash) Values($1, $2, $3, $4)",
      [name, email, hashPass, randomstring.generate(10)]
    );
    return true;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const checkUser = async email => {
  try {
    const user = await pool.query(
      `Select * from counter_agent
      Where email = $1`,
      [email]
    );
    if (user.rows.length !== 0) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error.message);
    return false;
  }
};

const getAllSpendCategories = async user_id => {
  try {
    const queryAll = `
      Select spend_category_id as id, spend_category_name as child, parent_id
        From spend_categories inner join closuretable
        on spend_categories.spend_category_id = closuretable.child_id
        Where parent_id IS NOT NULL and (spend_categories.counter_agent_id IS NULL OR spend_categories.counter_agent_id = $1)
        order by parent_id;`;

    const queryParent = `
      Select DISTINCT spend_categories.spend_category_id as id, spend_categories.spend_category_name as parent
        FROM (closuretable left join spend_categories
        on closuretable.parent_id = spend_categories.spend_category_id) left join spend_categories T1 ON
        closuretable.child_id = T1.spend_category_id
        Where spend_categories.spend_category_name IS NOT NULL and (spend_categories.counter_agent_id IS NULL OR spend_categories.counter_agent_id = $1)
    `;

    const queryParentWithoutChild = `
      Select spend_category_id as id, spend_category_name as parent
      From spend_categories inner join closuretable
      on spend_category_id = closuretable.child_id
      where spend_category_id not in (
        Select DISTINCT spend_categories.spend_category_id
        FROM (closuretable left join spend_categories
        on closuretable.parent_id = spend_categories.spend_category_id) left join spend_categories T1 ON
        closuretable.child_id = T1.spend_category_id
        Where spend_categories.spend_category_name IS NOT NULL
      ) and depth = 1 and (spend_categories.counter_agent_id IS NULL OR spend_categories.counter_agent_id = $1)
    `;

    const resultAll = await pool.query(queryAll, [user_id]);
    const resultParent = await pool.query(queryParent, [user_id]);
    const resultParentWithoutChild = await pool.query(queryParentWithoutChild, [
      user_id
    ]);
    return {
      resultAll: resultAll.rows,
      resultParent: resultParent.rows,
      resultParentWithoutChild: resultParentWithoutChild.rows
    };
  } catch (error) {
    console.log(error.message);
    return {};
  }
};

const getAccountByID = async id => {
  try {
    const query = `
      Select counter_agent_account.agent_account_id as account_id, currency_type, account_type, counter_agent_account.account_name, cast(balance as decimal)
        from (counter_agent_account INNER join currency 
        on counter_agent_account.currency_id = currency.currency_id) inner join account_types
        on counter_agent_account.account_type_id = account_types.account_type_id
        Where counter_agent_id = $1;`;
    const result = await pool.query(query, [id]);
    return result.rows;
  } catch (error) {
    console.log(error);
    return [];
  }
};

const updateAccount = async (id, value) => {
  try {
    const updateQuery = `
      Update counter_agent_account Set balance = balance + cast($1 as money) 
      where counter_agent_account.agent_account_id = $2
    `;
    await pool.query(updateQuery, [value, id]);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const addSpend = async (
  counter_agent_id,
  spend_category_id,
  agent_account_id,
  spend_value,
  spend_name,
  usefull
) => {
  try {
    const query = `
    Insert into spend (counter_agent_id, spend_category_id, agent_account_id, spend_date, spend_value, spend_name, usefull) 
    VALUES($1, $2, $3, CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Kiev', $4, $5, $6)
    `;
    await pool.query(query, [
      counter_agent_id,
      spend_category_id,
      agent_account_id,
      spend_value,
      spend_name,
      usefull
    ]);

    await updateAccount(agent_account_id, -spend_value);
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getAllIncomeCategories = async () => {
  try {
    const query = `select * from income_categories`;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const addIncome = async (
  income_category_id,
  agent_account_id,
  income_value
) => {
  try {
    const query = `
    Insert into income (agent_account_id, income_category_id, income_date, income_value) 
    VALUES($1, $2, CURRENT_TIMESTAMP AT TIME ZONE 'Europe/Kiev', $3)
    `;
    await pool.query(query, [
      agent_account_id,
      income_category_id,
      income_value
    ]);

    await updateAccount(agent_account_id, income_value);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getOperationHistory = async id => {
  try {
    const query = `
      Select cast(spend_value*-1 as decimal) as value, spend_category_name as name, TO_CHAR(spend_date, 'dd.mm.yyyy hh24:mi') as date, currency_type as currency, usefull
      from ((spend inner join spend_categories
      on spend.spend_category_id = spend_categories.spend_category_id) inner join counter_agent_account
      on counter_agent_account.agent_account_id = spend.agent_account_id) inner join currency 
      on currency.currency_id = counter_agent_account.currency_id
      WHERE counter_agent_account.counter_agent_id = $1
    union all
    Select cast(income_value as decimal), income_categories.income_category_name, TO_CHAR(income_date, 'dd.mm.yyyy hh24:mi'), currency_type, true
      from ((income INNER join income_categories
      on income.income_category_id = income_categories.income_category_id) inner join counter_agent_account
      on counter_agent_account.agent_account_id = income.agent_account_id) inner join currency 
      on currency.currency_id = counter_agent_account.currency_id
      WHERE counter_agent_account.counter_agent_id = $1
      order by date desc
    `;
    const result = await pool.query(query, [id]);
    return result.rows;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const setAvatarHash = async (hash, id) => {
  try {
    const query = `
      Update counter_agent set avatar_hash = $1
      Where counter_agent_id = $2
    `;
    await pool.query(query, [hash, id]);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const setFamily = async (id, family_id) => {
  try {
    const query = `
     Update counter_agent set family_id = $1
     Where counter_agent_id = $2
    `;
    await pool.query(query, [family_id, id]);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getFamilyPin = async family_id => {
  try {
    const query = `
      Select family_code
      from family
      where family_id = $1
    `;
    const result = await pool.query(query, [family_id]);
    return result.rows;
  } catch (err) {
    console.log(err);
    return null;
  }
};

const addFamily = async (user_id, name, code) => {
  try {
    const query = `
      Insert into family(family_name, family_code)
      Values($1, $2) 
    `;
    await pool.query(query, [name, code]);

    const selResult = await pool.query(
      `
      Select family_id
      From family
      where family_name = $1 and family_code = $2
    `,
      [name, code]
    );
    await setFamily(user_id, selResult.rows[0].family_id);

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const removeNoLinkFamilies = async () => {
  try {
    const rubbishDelQuery = `
      delete from family 
      where family_id IN (Select family_id
						from (Select family.family_id, family_name, counter_agent_id
						from family left join counter_agent
						on counter_agent.family_id = family.family_id
            WHERE counter_agent_id IS NULL) as T1)`;
    await pool.query(rubbishDelQuery);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getAllFamilies = async () => {
  try {
    await removeNoLinkFamilies();

    const query = `
    Select family_id, family_name 
    From family `;
    const result = await pool.query(query);
    return result.rows;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const delAccountById = async account_id => {
  try {
    const query = `
      Delete from counter_agent_account
      Where agent_account_id = $1
    `;
    await pool.query(query, [account_id]);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getAllCurrencies = async () => {
  try {
    const result = await pool.query("Select * from currency");
    return result.rows;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getAllAccountTypes = async () => {
  try {
    const result = await pool.query("Select * from account_types");
    return result.rows;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const addAccount = async (user_id, currency_id, type_id, name, balance) => {
  try {
    const query = `
      Insert into counter_agent_account(balance, account_type_id, counter_agent_id, currency_id, account_name)
      Values($1, $2, $3, $4, $5) 
    `;
    await pool.query(query, [balance, type_id, user_id, currency_id, name]);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const getIncomeByDate = async (startDate, endDate, userId) => {
  try {
    const query = `
      Select income_category_name as label, sum(income_value::decimal*value_to_uah::decimal) as value
      from ((income inner join income_categories 
      on income_categories.income_category_id = income.income_category_id) inner join counter_agent_account
      on counter_agent_account.agent_account_id = income.agent_account_id) INNER join currency
      on counter_agent_account.currency_id = currency.currency_id
      WHERE income_date::TIMESTAMP::DATE >= $1 and income_date::TIMESTAMP::DATE <= $2 and counter_agent_account.counter_agent_id = $3
      GROUP by income_category_name
    `;
    const result = await pool.query(query, [startDate, endDate, userId]);
    return result.rows;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getSpendByDate = async (startDate, endDate, userId) => {
  try {
    const query = `
      Select spend_categories.spend_category_id as id, spend_category_name as label, sum(spend_value::decimal*value_to_uah::decimal) as value
      from ((spend inner join spend_categories 
      on spend_categories.spend_category_id = spend.spend_category_id) inner join counter_agent_account
      on counter_agent_account.agent_account_id = spend.agent_account_id) INNER join currency
      on counter_agent_account.currency_id = currency.currency_id
      WHERE spend_date::TIMESTAMP::DATE >= $1 and spend_date::TIMESTAMP::DATE <= $2 and counter_agent_account.counter_agent_id = $3
      GROUP by spend_categories.spend_category_name, spend_categories.spend_category_id
    `;
    const result = await pool.query(query, [startDate, endDate, userId]);
    return result.rows;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getSpendByFamDate = async (startDate, endDate, userId) => {
  try {
    const query = `
      Select sum(spend_value::DECIMAL*value_to_uah::DECIMAL) as value, counter_agent.agent_name as label
      from ((spend inner join counter_agent_account
      on spend.agent_account_id = counter_agent_account.agent_account_id) INNER join counter_agent
      on counter_agent.counter_agent_id = counter_agent_account.counter_agent_id) INNER join currency
      on currency.currency_id = counter_agent_account.currency_id
      where family_id = (Select family_id FROM counter_agent where counter_agent_id = $1) and spend_date::TIMESTAMP::DATE >= $2 and spend_date::TIMESTAMP::DATE <= $3
      group by counter_agent.agent_name
    `;
    const result = await pool.query(query, [userId, startDate, endDate]);
    return result.rows;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getIncomeByFamDate = async (startDate, endDate, userId) => {
  try {
    const query = `
      Select sum(income_value::DECIMAL*value_to_uah::DECIMAL) as value, counter_agent.agent_name as label
      from ((income inner join counter_agent_account
      on income.agent_account_id = counter_agent_account.agent_account_id) INNER join counter_agent
      on counter_agent.counter_agent_id = counter_agent_account.counter_agent_id) INNER join currency
      on currency.currency_id = counter_agent_account.currency_id
      where family_id = (Select family_id FROM counter_agent where counter_agent_id = $1) and income_date::TIMESTAMP::DATE >= $2 and income_date::TIMESTAMP::DATE <= $3
      group by counter_agent.agent_name
    `;
    const result = await pool.query(query, [userId, startDate, endDate]);
    return result.rows;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getCurrencyValue = async () => {
  try {
    console.log("requesting currency value");
    const res = await axios.get(
      "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11"
    );
    const value = res.data.map(e => e.buy);
    value[value.length - 1] = 1;
    console.log(value);
    const query = `
      update currency
      set value_to_UAH = middle.value
      from   (
        select currency_id, ($1::money[])[rn] as value
        from   (select currency_id, row_number() over (order by currency_id) as rn from currency) as base
        where  rn < 5
      ) as middle
      WHERE middle.currency_id = currency.currency_id
    `;
    await pool.query(query, [value]);
  } catch (err) {
    console.log(err);
  }
};

const getFinalReportOnCategory = async (
  categoryId,
  startDate,
  endDate,
  userId
) => {
  try {
    const query = `
    Select TO_CHAR(spend_date, 'dd.mm.yyyy hh24:mi') as date, (-1*spend_value::DECIMAL*value_to_uah::decimal) as spend, spend_name, usefull, spend_categories.spend_category_name,
    account_name, 'UAH' as currency_type, account_type, sum(spend_value::DECIMAL*value_to_uah::decimal) over(PARTITION by usefull) as usefull_sum
      from (((spend inner join counter_agent_account
      on spend.agent_account_id = counter_agent_account.agent_account_id) inner join currency
      on currency.currency_id = counter_agent_account.currency_id) inner join account_types
      on account_types.account_type_id = counter_agent_account.account_type_id) inner join spend_categories
      on spend_categories.spend_category_id = spend.spend_category_id
      where counter_agent_account.counter_agent_id = $4 and 
      spend_date::TIMESTAMP::DATE >= $2 and spend_date::TIMESTAMP::DATE <= $3
      and spend.spend_category_id=$1
    `;
    const result = await pool.query(query, [
      categoryId,
      startDate,
      endDate,
      userId
    ]);
    return result.rows;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getSpendCategories = async user_id => {
  try {
    const query = `
      WITH RECURSIVE pops(child_id, parent_id, name, depth, name_path, user_id) AS (
        Select child_id, parent_id, spend_categories.spend_category_name, depth, ARRAY[parent_id], spend_categories.counter_agent_id
        from closuretable INNER join spend_categories
        on closuretable.child_id = spend_categories.spend_category_id
        WHERE parent_id is null

        UNION ALL

        Select c.child_id, c.parent_id, sc.spend_category_name, c.depth, ARRAY_APPEND(t0.name_path, c.parent_id), sc.counter_agent_id
        from (closuretable as c INNER join spend_categories as sc
        on c.child_id = sc.spend_category_id)
                INNER JOIN pops t0 ON t0.child_id = c.parent_id
      )
      
      SELECT  child_id, name_path[2], name, depth, name_path, user_id
      FROM    pops
      Where user_id is NULL or user_id = $1
      order by array_length(name_path, 1)
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const getIncomeCategories = async user_id => {
  try {
    const query = `
      WITH RECURSIVE pops(child_id, parent_id, name, depth, name_path, user_id) AS (
        Select child_id, parent_id, income_categories.income_category_name, depth, ARRAY[NULL]::INT[], income_categories.counter_agent_id
        from closuretable_income INNER join income_categories
        on closuretable_income.child_id = income_categories.income_category_id
        WHERE parent_id is null

        UNION ALL

        Select c.child_id, c.parent_id, ic.income_category_name, c.depth, ARRAY_APPEND(t0.name_path, coalesce(c.parent_id, c.child_id)), ic.counter_agent_id
        from (closuretable_income as c INNER join income_categories as ic
        on c.child_id = ic.income_category_id)
                INNER JOIN pops t0 ON t0.child_id = c.parent_id
      )
      
      SELECT  child_id, name_path[2], name, depth, name_path, user_id
      FROM    pops
      Where user_id is NULL or user_id = $1
      order by array_length(name_path, 1)
    `;
    const result = await pool.query(query, [user_id]);
    return result.rows;
  } catch (err) {
    console.log(err);
    return [];
  }
};

const addIncomeCategory = async (name, parent_id, user_id) => {
  try {
    const idQuery = `Select Max(income_category_id) from income_categories`;
    const result = await pool.query(idQuery);
    const id = Number(result.rows[0].max) + 1;
    const query = `INSERT into income_categories(income_category_id, income_category_name, counter_agent_id) Values($1, $2, $3)`;
    await pool.query(query, [id, name, user_id]);
    let parentQuery;
    if (!parent_id) {
      parentQuery = `INSERT into closuretable_income(child_id, depth) VALUES($1, 1)`;
      await pool.query(parentQuery, [id]);
    } else {
      parentQuery = `INSERT into closuretable_income(parent_id, child_id, depth) VALUES($1, $2, (Select Min(depth) as depth 
                                                                                      from closuretable_income
                                                                                      WHERE closuretable_income.child_id = $1) + 1)`;
      await pool.query(parentQuery, [parent_id, id]);
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

const addSpendCategory = async (name, parent_id, user_id) => {
  try {
    const idQuery = `Select Max(spend_category_id) from spend_categories`;
    const result = await pool.query(idQuery);
    const id = Number(result.rows[0].max) + 1;
    const query = `INSERT into spend_categories(spend_category_id, spend_category_name, counter_agent_id) Values($1, $2, $3)`;
    await pool.query(query, [id, name, user_id]);
    let parentQuery;
    if (!parent_id) {
      parentQuery = `INSERT into closuretable(child_id, depth) VALUES($1, 1)`;
      await pool.query(parentQuery, [id]);
    } else {
      parentQuery = `INSERT into closuretable(parent_id, child_id, depth) VALUES($1, $2, (Select Min(depth) as depth 
                                                                                      from closuretable
                                                                                      WHERE closuretable.child_id = $1) + 1)`;
      await pool.query(parentQuery, [parent_id, id]);
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = {
  pool,
  createUser,
  checkUser,
  getAllSpendCategories,
  getAccountByID,
  addSpend,
  addIncome,
  getAllIncomeCategories,
  updateAccount,
  getOperationHistory,
  setAvatarHash,
  setFamily,
  addFamily,
  getAllFamilies,
  delAccountById,
  getFamilyPin,
  getAllCurrencies,
  getAllAccountTypes,
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
};
