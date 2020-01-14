import { put, call, takeLatest } from "redux-saga/effects";
import Cookies from "js-cookie";
import * as ActionTypes from "../state/actionTypes";
import { get, post } from "../services/api";
import lGet from "lodash/get";

const cookieName = "connect.sid";

function* login(action) {
  try {
    const { payload } = action;
    yield put({ type: ActionTypes.LOGIN_LOADING, payload: undefined });
    const response = yield call(post, "/api/login", payload);
    yield put({ type: ActionTypes.LOGIN_SUCCEEDED, user: response.data });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({ type: ActionTypes.LOGIN_FAILED, error: error.response.data });
    } else {
      yield put({ type: ActionTypes.LOGIN_FAILED, error });
    }
  }
}

export function* watchLogin() {
  yield takeLatest(ActionTypes.LOGIN_REQUESTED, login);
}

function* logout() {
  try {
    yield put({ type: ActionTypes.LOGOUT_LOADING, payload: undefined });
    yield call(get, "/api/logout");
    Cookies.remove(cookieName);
    yield put({ type: ActionTypes.LOGOUT_SUCCEEDED });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.LOGOUT_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.LOGOUT_FAILED, error: error.response });
    }
  }
}

export function* watchLogout() {
  yield takeLatest(ActionTypes.LOGOUT_REQUESTED, logout);
}

function* getProfile() {
  try {
    yield put({ type: ActionTypes.PROFILE_LOADING, payload: undefined });
    const response = yield call(get, "/api/admin");
    yield put({ type: ActionTypes.PROFILE_SUCCEEDED, user: response });
  } catch (error) {
    yield put({ type: ActionTypes.PROFILE_FAILED, error: error.response });
  }
}

export function* watchGetProfile() {
  yield takeLatest(ActionTypes.PROFILE_REQUESTED, getProfile);
}

function* checkLogin() {
  try {
    yield put({ type: ActionTypes.CHECK_LOGIN_PENDING, payload: undefined });
    const { login } = yield call(get, "/api/checkLogin");
    if (login) {
      yield put({ type: ActionTypes.CHECK_LOGIN_TRUE, payload: true });
    } else {
      yield put({ type: ActionTypes.CHECK_LOGIN_FALSE, payload: false });
    }
  } catch (error) {
    yield put({ type: ActionTypes.CHECK_LOGIN_FALSE, payload: false });
  }
}

export function* watchCheckLogin() {
  yield takeLatest(ActionTypes.CHECK_LOGIN, checkLogin);
}

function* register(action) {
  try {
    const { payload } = action;
    yield put({ type: ActionTypes.REGISTER_LOADING, payload: undefined });
    const responce = yield call(post, "/api/register", payload);
    yield put({ type: ActionTypes.REGISTER_SUCCEEDED, payload: responce });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.REGISTER_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.REGISTER_FAILED, error });
    }
  }
}

export function* watchRegister() {
  yield takeLatest(ActionTypes.REGISTER_REQUESTED, register);
}

function* getSpendCategories() {
  try {
    const response = yield call(get, "/api/allSpendCategories");
    yield put({
      type: ActionTypes.SPEND_CATEGORIES_SUCCESS,
      payload: response
    });
  } catch (error) {
    yield put({
      type: ActionTypes.SPEND_CATEGORIES_FAILED,
      payload: error.responce
    });
  }
}

export function* watchGetSpendCategories() {
  yield takeLatest(ActionTypes.SPEND_CATEGORIES_REQUESTED, getSpendCategories);
}

function* getAccountById() {
  try {
    yield put({ type: ActionTypes.ACCOUNTS_LOADING, payload: true });
    const response = yield call(get, "/api/getAccountById");
    yield put({
      type: ActionTypes.ACCOUNTS_SUCCESS,
      payload: response
    });
  } catch (error) {
    yield put({
      type: ActionTypes.ACCOUNTS_FAILED,
      payload: error.responce
    });
  }
}

export function* watchGetAccountById() {
  yield takeLatest(ActionTypes.ACCOUNTS_REQUESTED, getAccountById);
}

function* setSpend(action) {
  try {
    const { payload } = action;
    yield put({ type: ActionTypes.SPEND_LOADING, payload: true });
    yield call(post, "/api/addSpend", payload);
    yield put({ type: ActionTypes.SPEND_SUCCEEDED, payload: false });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.SPEND_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.SPEND_FAILED, error });
    }
  }
}

export function* watchSetSpend() {
  yield takeLatest(ActionTypes.SPEND_REQUESTED, setSpend);
}

function* getIncomeCategories() {
  try {
    const response = yield call(get, "/api/getAllIncomeCategories");
    yield put({
      type: ActionTypes.INCOME_CATEGORIES_SUCCESS,
      payload: response
    });
  } catch (error) {
    yield put({
      type: ActionTypes.INCOME_CATEGORIES_FAILED,
      payload: error.responce
    });
  }
}

export function* watchGetIncomeCategories() {
  yield takeLatest(
    ActionTypes.INCOME_CATEGORIES_REQUESTED,
    getIncomeCategories
  );
}

function* setIncome(action) {
  try {
    const { payload } = action;
    yield put({ type: ActionTypes.INCOME_LOADING, payload: true });
    yield call(post, "/api/addIncome", payload);
    yield put({ type: ActionTypes.INCOME_SUCCEEDED, payload: false });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.INCOME_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.INCOME_FAILED, error });
    }
  }
}

export function* watchSetIncome() {
  yield takeLatest(ActionTypes.INCOME_REQUESTED, setIncome);
}

function* getOpHistory() {
  try {
    yield put({ type: ActionTypes.OP_HISTORY_LOADING, payload: true });
    const response = yield call(get, "/api/getOperationHistory");
    yield put({
      type: ActionTypes.OP_HISTORY_SUCCEEDED,
      payload: response
    });
  } catch (error) {
    yield put({
      type: ActionTypes.OP_HISTORY_FAILED,
      payload: error.responce
    });
  }
}

export function* watchGetOpHistory() {
  yield takeLatest(ActionTypes.OP_HISTORY_REQUESTED, getOpHistory);
}

function* setAvatar(action) {
  try {
    const { payload } = action;
    yield call(post, "/api/setAvatarHash", { hash: payload });
    yield put({ type: ActionTypes.SET_AVATAR_SUCCEEDED, payload });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.SET_AVATAR_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.SET_AVATAR_FAILED, error });
    }
  }
}

export function* watchSetAvatar() {
  yield takeLatest(ActionTypes.SET_AVATAR_REQUESTED, setAvatar);
}

function* delAccount(action) {
  try {
    const { payload } = action;
    yield call(post, "/api/delAccount", { id: payload });
    yield put({ type: ActionTypes.DEL_ACCOUNT_SUCCEEDED, payload });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.DEL_ACCOUNT_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.DEL_ACCOUNT_FAILED, error });
    }
  }
}

export function* watchDelAccount() {
  yield takeLatest(ActionTypes.DEL_ACCOUNT_REQUESTED, delAccount);
}

function* createFamily(action) {
  try {
    const { payload } = action;
    yield put({ type: ActionTypes.CREATE_FAMILY_LOADING, payload: true });
    yield call(post, "/api/createFamily", payload);
    yield put({ type: ActionTypes.CREATE_FAMILY_SUCCEEDED, payload });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.CREATE_FAMILY_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.CREATE_FAMILY_FAILED, error });
    }
  }
}

export function* watchCreateFamily() {
  yield takeLatest(ActionTypes.CREATE_FAMILY_REQUESTED, createFamily);
}

function* getFamilies() {
  try {
    yield put({ type: ActionTypes.GET_FAMILIES_LOADING, payload: true });
    const response = yield call(get, "/api/getAllFamilies");
    yield put({
      type: ActionTypes.GET_FAMILIES_SUCCEEDED,
      payload: response
    });
  } catch (error) {
    yield put({
      type: ActionTypes.GET_FAMILIES_FAILED,
      payload: error.responce
    });
  }
}

export function* watchGetFamilies() {
  yield takeLatest(ActionTypes.GET_FAMILIES_REQUESTED, getFamilies);
}

function* setFamily(action) {
  try {
    const { payload } = action;
    yield put({ type: ActionTypes.SET_FAMILY_LOADING, payload: true });
    const resp = yield call(post, "/api/setFamily", payload);
    yield put({
      type: ActionTypes.SET_FAMILY_SUCCEEDED,
      payload: { ...payload, resp: resp.data }
    });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.SET_FAMILY_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.SET_FAMILY_FAILED, error });
    }
  }
}

export function* watchSetFamily() {
  yield takeLatest(ActionTypes.SET_FAMILY_REQUESTED, setFamily);
}

function* getCurrencies() {
  try {
    yield put({ type: ActionTypes.GET_CURRENCIES_LOADING, payload: true });
    const response = yield call(get, "/api/getAllCurrencies");
    yield put({
      type: ActionTypes.GET_CURRENCIES_SUCCEEDED,
      payload: response
    });
  } catch (error) {
    yield put({
      type: ActionTypes.GET_CURRENCIES_FAILED,
      payload: error.responce
    });
  }
}

export function* watchGetCurrencies() {
  yield takeLatest(ActionTypes.GET_CURRENCIES_REQUESTED, getCurrencies);
}

function* getAccountTypes() {
  try {
    yield put({ type: ActionTypes.GET_ACCOUNT_TYPES_LOADING, payload: true });
    const response = yield call(get, "/api/getAllAccountTypes");
    yield put({
      type: ActionTypes.GET_ACCOUNT_TYPES_SUCCEEDED,
      payload: response
    });
  } catch (error) {
    yield put({
      type: ActionTypes.GET_ACCOUNT_TYPES_FAILED,
      payload: error.responce
    });
  }
}

export function* watchGetAccountTypes() {
  yield takeLatest(ActionTypes.GET_ACCOUNT_TYPES_REQUESTED, getAccountTypes);
}

function* addAccount(action) {
  try {
    const { payload } = action;
    yield put({ type: ActionTypes.ADD_ACCOUNT_LOADING, payload: true });
    yield call(post, "/api/addAccount", payload);
    yield put({ type: ActionTypes.ADD_ACCOUNT_SUCCEEDED, payload });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.ADD_ACCOUNT_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.ADD_ACCOUNT_FAILED, error });
    }
  }
}

export function* watchAddAccount() {
  yield takeLatest(ActionTypes.ADD_ACCOUNT_REQUESTED, addAccount);
}

function* getSpendByDate(action) {
  try {
    const { payload } = action;
    yield put({ type: ActionTypes.GET_SPEND_BY_DATE_LOADING, payload: true });
    const result = yield call(post, "/api/getSpendByDate", payload);
    yield put({
      type: ActionTypes.GET_SPEND_BY_DATE_SUCCEEDED,
      payload: result
    });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.GET_SPEND_BY_DATE_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.GET_SPEND_BY_DATE_FAILED, error });
    }
  }
}

export function* watchGetSpendByDate() {
  yield takeLatest(ActionTypes.GET_SPEND_BY_DATE_REQUESTED, getSpendByDate);
}

function* getIncomeByDate(action) {
  try {
    const { payload } = action;
    yield put({ type: ActionTypes.GET_INCOME_BY_DATE_LOADING, payload: true });
    const result = yield call(post, "/api/getIncomeByDate", payload);
    yield put({
      type: ActionTypes.GET_INCOME_BY_DATE_SUCCEEDED,
      payload: result
    });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.GET_INCOME_BY_DATE_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.GET_INCOME_BY_DATE_FAILED, error });
    }
  }
}

export function* watchGetIncomeByDate() {
  yield takeLatest(ActionTypes.GET_INCOME_BY_DATE_REQUESTED, getIncomeByDate);
}

function* getSpendByFamDate(action) {
  try {
    const { payload } = action;
    yield put({
      type: ActionTypes.GET_SPEND_BY_FAM_DATE_LOADING,
      payload: true
    });
    const result = yield call(post, "/api/getSpendByFamDate", payload);
    yield put({
      type: ActionTypes.GET_SPEND_BY_FAM_DATE_SUCCEEDED,
      payload: result
    });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.GET_SPEND_BY_FAM_DATE_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.GET_SPEND_BY_FAM_DATE_FAILED, error });
    }
  }
}

export function* watchGetSpendByFamDate() {
  yield takeLatest(
    ActionTypes.GET_SPEND_BY_FAM_DATE_REQUESTED,
    getSpendByFamDate
  );
}

function* getIncomeByFamDate(action) {
  try {
    const { payload } = action;
    yield put({
      type: ActionTypes.GET_INCOME_BY_FAM_DATE_LOADING,
      payload: true
    });
    const result = yield call(post, "/api/getIncomeByFamDate", payload);
    yield put({
      type: ActionTypes.GET_INCOME_BY_FAM_DATE_SUCCEEDED,
      payload: result
    });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.GET_INCOME_BY_FAM_DATE_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.GET_INCOME_BY_FAM_DATE_FAILED, error });
    }
  }
}

export function* watchGetIncomeByFamDate() {
  yield takeLatest(
    ActionTypes.GET_INCOME_BY_FAM_DATE_REQUESTED,
    getIncomeByFamDate
  );
}

function* getCategoryReport(action) {
  try {
    const { payload } = action;
    yield put({
      type: ActionTypes.GET_CATEGORY_REPORT_LOADING,
      payload: true
    });
    const result = yield call(post, "/api/getFinalCategoryReport", payload);
    yield put({
      type: ActionTypes.GET_CATEGORY_REPORT_SUCCEEDED,
      payload: result
    });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.GET_CATEGORY_REPORT_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.GET_CATEGORY_REPORT_FAILED, error });
    }
  }
}

export function* watchGetCategoryReport() {
  yield takeLatest(
    ActionTypes.GET_CATEGORY_REPORT_REQUESTED,
    getCategoryReport
  );
}

function* addIncomeCategory(action) {
  try {
    const { payload } = action;
    yield put({
      type: ActionTypes.ADD_INCOME_CATEGORY_LOADING,
      payload: true
    });
    yield call(post, "/api/addIncomeCategory", payload);
    yield put({
      type: ActionTypes.ADD_INCOME_CATEGORY_SUCCEEDED
    });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.ADD_INCOME_CATEGORY_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.ADD_INCOME_CATEGORY_FAILED, error });
    }
  }
}

export function* watchAddIncomeCategory() {
  yield takeLatest(
    ActionTypes.ADD_INCOME_CATEGORY_REQUESTED,
    addIncomeCategory
  );
}

function* addSpendCategory(action) {
  try {
    const { payload } = action;
    yield put({
      type: ActionTypes.ADD_SPEND_CATEGORY_LOADING,
      payload: true
    });
    yield call(post, "/api/addSpendCategory", payload);
    yield put({
      type: ActionTypes.ADD_SPEND_CATEGORY_SUCCEEDED
    });
  } catch (error) {
    if (lGet(error.response, "data")) {
      yield put({
        type: ActionTypes.ADD_SPEND_CATEGORY_FAILED,
        error: error.response.data
      });
    } else {
      yield put({ type: ActionTypes.ADD_SPEND_CATEGORY_FAILED, error });
    }
  }
}

export function* watchAddSpendCategory() {
  yield takeLatest(ActionTypes.ADD_SPEND_CATEGORY_REQUESTED, addSpendCategory);
}
