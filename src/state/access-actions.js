import * as ActionTypes from "./actionTypes";

export const login = (email, password) => ({
  type: ActionTypes.LOGIN_REQUESTED,
  payload: {
    email,
    password
  }
});

export const logout = () => ({
  type: ActionTypes.LOGOUT_REQUESTED
});

export const getProfile = () => ({
  type: ActionTypes.PROFILE_REQUESTED
});

export const checkLogin = () => ({
  type: ActionTypes.CHECK_LOGIN
});

export const register = (email, password, name) => ({
  type: ActionTypes.REGISTER_REQUESTED,
  payload: { email, password, name }
});

export const getSpendCategories = () => ({
  type: ActionTypes.SPEND_CATEGORIES_REQUESTED
});

export const getAccountByID = () => ({
  type: ActionTypes.ACCOUNTS_REQUESTED
});

export const setSpend = (category_id, account_id, value, name, usefull) => ({
  type: ActionTypes.SPEND_REQUESTED,
  payload: { category_id, account_id, value, name, usefull }
});

export const getIncomeCategories = () => ({
  type: ActionTypes.INCOME_CATEGORIES_REQUESTED
});

export const setIncome = (category_id, account_id, value) => ({
  type: ActionTypes.INCOME_REQUESTED,
  payload: { category_id, account_id, value }
});

export const getOpHistory = () => ({
  type: ActionTypes.OP_HISTORY_REQUESTED
});

export const setAvatar = hash => ({
  type: ActionTypes.SET_AVATAR_REQUESTED,
  payload: hash
});

export const delAccount = id => ({
  type: ActionTypes.DEL_ACCOUNT_REQUESTED,
  payload: id
});

export const createFamily = (name, code) => ({
  type: ActionTypes.CREATE_FAMILY_REQUESTED,
  payload: { name, code }
});

export const getAllFamilies = () => ({
  type: ActionTypes.GET_FAMILIES_REQUESTED
});

export const setFamily = (family_id, name, code) => ({
  type: ActionTypes.SET_FAMILY_REQUESTED,
  payload: { family_id, name, code }
});

export const getAllCurrencies = () => ({
  type: ActionTypes.GET_CURRENCIES_REQUESTED
});

export const getAllAccountTypes = () => ({
  type: ActionTypes.GET_ACCOUNT_TYPES_REQUESTED
});

export const addAccount = (balance, name, currency_id, type_id) => ({
  type: ActionTypes.ADD_ACCOUNT_REQUESTED,
  payload: { balance, name, currency_id, type_id }
});

export const getSpendByDate = (startDate, endDate) => ({
  type: ActionTypes.GET_SPEND_BY_DATE_REQUESTED,
  payload: { startDate, endDate }
});

export const getIncomeByDate = (startDate, endDate) => ({
  type: ActionTypes.GET_INCOME_BY_DATE_REQUESTED,
  payload: { startDate, endDate }
});

export const getSpendByFamDate = (startDate, endDate) => ({
  type: ActionTypes.GET_SPEND_BY_FAM_DATE_REQUESTED,
  payload: { startDate, endDate }
});

export const getIncomeByFamDate = (startDate, endDate) => ({
  type: ActionTypes.GET_INCOME_BY_FAM_DATE_REQUESTED,
  payload: { startDate, endDate }
});

export const getCategoryReport = (startDate, endDate, categoryId) => ({
  type: ActionTypes.GET_CATEGORY_REPORT_REQUESTED,
  payload: { startDate, endDate, categoryId }
});

export const setDate = startDateArr => ({
  type: ActionTypes.SET_DATE,
  payload: startDateArr
});

export const addIncomeCategory = (parentId, name) => ({
  type: ActionTypes.ADD_INCOME_CATEGORY_REQUESTED,
  payload: { parentId, name }
});

export const addSpendCategory = (parentId, name) => ({
  type: ActionTypes.ADD_SPEND_CATEGORY_REQUESTED,
  payload: { parentId, name }
});
