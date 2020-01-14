import * as ActionTypes from "./actionTypes";

const initialState = {
  user: {
    isAuthenticated: undefined,
    loggedUserObj: undefined,
    accounts: null,
    info: null
  },
  error: null,
  registerResult: null,
  spendCategories: null,
  incomeCategories: null,
  opHistory: null,
  families: null,
  accountTypes: null,
  currencies: null,
  spendByDate: null,
  incomeByDate: null,
  spendByFamDate: null,
  incomeByFamDate: null,
  categoryReport: null,
  spendStatisticDate: null,
  loading: {
    typeSpend: false,
    typeAccounts: false,
    typeIncome: false,
    typeOpHistory: false,
    typeCreateFamily: false,
    typeGetFamilies: false,
    typeSetFamily: false,
    typeGetCurrencies: false,
    typeGetAccountTypes: false,
    typeAddAccount: false,
    typeGetSpendByDate: false,
    typeGetIncomeByDate: false,
    typeGetSpendByFamDate: false,
    typeGetIncomeByFamDate: false,
    typeGetCategoryReport: false,
    typeAddIncomeCategory: false,
    typeAddSpendCategory: false
  }
};

export default function access(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.LOGOUT_LOADING:
    case ActionTypes.PROFILE_LOADING:
    case ActionTypes.LOGIN_LOADING: {
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: action.payload
        }
      };
    }
    case ActionTypes.LOGIN_SUCCEEDED:
    case ActionTypes.PROFILE_SUCCEEDED: {
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: true,
          loggedUserObj: action.user
        },
        error: null
      };
    }
    case ActionTypes.LOGIN_FAILED: {
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: false
        },
        error: {
          type: "login",
          info: action.error
        }
      };
    }
    case ActionTypes.PROFILE_FAILED:
    case ActionTypes.LOGOUT_SUCCEEDED: {
      return {
        ...initialState,
        user: {
          isAuthenticated: false
        }
      };
    }
    case ActionTypes.CHECK_LOGIN_PENDING:
    case ActionTypes.CHECK_LOGIN_TRUE:
    case ActionTypes.CHECK_LOGIN_FALSE: {
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: action.payload
        }
      };
    }

    case ActionTypes.REGISTER_LOADING: {
      return {
        ...state,
        registerResult: action.payload
      };
    }
    case ActionTypes.REGISTER_SUCCEEDED:
    case ActionTypes.REGISTER_FAILED: {
      return {
        ...state,
        registerResult: action.payload
      };
    }
    case ActionTypes.SPEND_CATEGORIES_FAILED:
    case ActionTypes.SPEND_CATEGORIES_SUCCESS: {
      return {
        ...state,
        spendCategories: action.payload
      };
    }
    case ActionTypes.ACCOUNTS_FAILED:
    case ActionTypes.ACCOUNTS_SUCCESS: {
      return {
        ...state,
        user: {
          ...state.user,
          accounts: action.payload
        },
        loading: {
          ...state.loading,
          typeAccounts: false
        }
      };
    }
    case ActionTypes.ACCOUNTS_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeAccounts: action.payload
        }
      };
    }
    case ActionTypes.SPEND_LOADING:
    case ActionTypes.SPEND_SUCCEEDED: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeSpend: action.payload
        }
      };
    }
    case ActionTypes.SPEND_FAILED: {
      return {
        ...state,
        error: action.error,
        loading: {
          ...state.loading,
          typeSpend: false
        }
      };
    }
    case ActionTypes.INCOME_CATEGORIES_FAILED:
    case ActionTypes.INCOME_CATEGORIES_SUCCESS: {
      return {
        ...state,
        incomeCategories: action.payload
      };
    }
    case ActionTypes.INCOME_LOADING:
    case ActionTypes.INCOME_SUCCEEDED: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeIncome: action.payload
        }
      };
    }
    case ActionTypes.INCOME_FAILED: {
      return {
        ...state,
        error: action.error,
        loading: {
          ...state.loading,
          typeIncome: false
        }
      };
    }
    case ActionTypes.OP_HISTORY_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeOpHistory: true
        }
      };
    }
    case ActionTypes.OP_HISTORY_SUCCEEDED: {
      return {
        ...state,
        opHistory: action.payload,
        loading: {
          ...state.loading,
          typeOpHistory: false
        }
      };
    }
    case ActionTypes.OP_HISTORY_FAILED: {
      return {
        ...state,
        error: action.payload,
        loading: {
          ...state.loading,
          typeOpHistory: false
        }
      };
    }
    case ActionTypes.SET_AVATAR_SUCCEEDED: {
      return {
        ...state,
        user: {
          ...state.user,
          loggedUserObj: {
            ...state.user.loggedUserObj,
            avatar_hash: action.payload
          }
        }
      };
    }
    case ActionTypes.SET_AVATAR_FAILED: {
      return {
        ...state,
        error: { type: "avatar", info: action.error }
      };
    }
    case ActionTypes.DEL_ACCOUNT_SUCCEEDED: {
      const id = action.payload;
      const index = state.user.accounts.findIndex(e => e.account_id === id);
      return {
        ...state,
        user: {
          ...state.user,
          accounts: [
            ...state.user.accounts.slice(0, index),
            ...state.user.accounts.slice(index + 1)
          ]
        }
      };
    }
    case ActionTypes.DEL_ACCOUNT_FAILED: {
      return {
        ...state,
        error: { type: "delAccount", info: action.error }
      };
    }
    case ActionTypes.CREATE_FAMILY_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeCreateFamily: action.payload
        }
      };
    }
    case ActionTypes.CREATE_FAMILY_SUCCEEDED: {
      return {
        ...state,
        user: {
          ...state.user,
          loggedUserObj: {
            ...state.user.loggedUserObj,
            family_name: action.payload.name
          }
        },
        loading: {
          ...state.loading,
          typeCreateFamily: false
        }
      };
    }
    case ActionTypes.CREATE_FAMILY_FAILED: {
      return {
        ...state,
        error: { type: "createFamily", info: action.error },
        loading: {
          ...state.loading,
          typeCreateFamily: false
        }
      };
    }
    case ActionTypes.GET_FAMILIES_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeGetFamilies: action.payload
        }
      };
    }
    case ActionTypes.GET_FAMILIES_SUCCEEDED: {
      return {
        ...state,
        families: action.payload,
        loading: {
          ...state.loading,
          typeGetFamilies: false
        }
      };
    }
    case ActionTypes.GET_FAMILIES_FAILED: {
      return {
        ...state,
        error: { type: "getAllFamily", info: action.payload },
        loading: {
          ...state.loading,
          typeGetFamilies: false
        }
      };
    }
    case ActionTypes.SET_FAMILY_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeSetFamily: action.payload
        }
      };
    }
    case ActionTypes.SET_FAMILY_SUCCEEDED: {
      let user = {
        ...state.user,
        info: null,
        loggedUserObj: {
          ...state.user.loggedUserObj,
          family_name: action.payload.name
        }
      };
      if (action.payload.resp !== true) {
        user = {
          ...state.user,
          info: { type: "setFamily", text: action.payload.resp }
        };
      }
      return {
        ...state,
        user,
        loading: {
          ...state.loading,
          typeSetFamily: false
        }
      };
    }
    case ActionTypes.SET_FAMILY_FAILED: {
      return {
        ...state,
        error: { type: "setFamily", info: action.error },
        loading: {
          ...state.loading,
          typeSetFamily: false
        }
      };
    }
    case ActionTypes.GET_ACCOUNT_TYPES_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeGetFamilies: action.payload
        }
      };
    }
    case ActionTypes.GET_ACCOUNT_TYPES_SUCCEEDED: {
      return {
        ...state,
        accountTypes: action.payload,
        loading: {
          ...state.loading,
          typeGetAccountTypes: false
        }
      };
    }
    case ActionTypes.GET_ACCOUNT_TYPES_FAILED: {
      return {
        ...state,
        error: { type: "getAllAccountTypes", info: action.payload },
        loading: {
          ...state.loading,
          typeGetAccountTypes: false
        }
      };
    }
    case ActionTypes.GET_CURRENCIES_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeGetCurrencies: action.payload
        }
      };
    }
    case ActionTypes.GET_CURRENCIES_SUCCEEDED: {
      return {
        ...state,
        currencies: action.payload,
        loading: {
          ...state.loading,
          typeGetCurrencies: false
        }
      };
    }
    case ActionTypes.GET_CURRENCIES_FAILED: {
      return {
        ...state,
        error: { type: "getAllCurrencies", info: action.payload },
        loading: {
          ...state.loading,
          typeGetCurrencies: false
        }
      };
    }
    case ActionTypes.ADD_ACCOUNT_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeAddAccount: action.payload
        }
      };
    }
    case ActionTypes.ADD_ACCOUNT_SUCCEEDED: {
      return {
        ...state,
        user: {
          ...state.user
        },
        loading: {
          ...state.loading,
          typeAddAccount: false
        }
      };
    }
    case ActionTypes.ADD_ACCOUNT_FAILED: {
      return {
        ...state,
        error: { type: "addAccount", info: action.error },
        loading: {
          ...state.loading,
          typeAddAccount: false
        }
      };
    }
    case ActionTypes.GET_SPEND_BY_DATE_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeGetSpendByDate: true
        }
      };
    }
    case ActionTypes.GET_SPEND_BY_DATE_FAILED:
    case ActionTypes.GET_SPEND_BY_DATE_SUCCEEDED: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeGetSpendByDate: false
        },
        spendByDate: action.payload.data
      };
    }
    case ActionTypes.GET_INCOME_BY_DATE_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeGetIncomeByDate: true
        }
      };
    }
    case ActionTypes.GET_INCOME_BY_DATE_FAILED:
    case ActionTypes.GET_INCOME_BY_DATE_SUCCEEDED: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeGetIncomeByDate: false
        },
        incomeByDate: action.payload.data
      };
    }
    case ActionTypes.GET_INCOME_BY_FAM_DATE_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeGetIncomeByFamDate: true
        }
      };
    }
    case ActionTypes.GET_INCOME_BY_FAM_DATE_FAILED:
    case ActionTypes.GET_INCOME_BY_FAM_DATE_SUCCEEDED: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeGetIncomeByFamDate: false
        },
        incomeByFamDate: action.payload.data
      };
    }
    case ActionTypes.GET_SPEND_BY_FAM_DATE_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeGetSpendByFamDate: true
        }
      };
    }
    case ActionTypes.GET_SPEND_BY_FAM_DATE_FAILED:
    case ActionTypes.GET_SPEND_BY_FAM_DATE_SUCCEEDED: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeGetSpendByFamDate: false
        },
        spendByFamDate: action.payload.data
      };
    }
    case ActionTypes.GET_CATEGORY_REPORT_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeGetCategoryReport: true
        }
      };
    }
    case ActionTypes.GET_CATEGORY_REPORT_FAILED: {
      return {
        ...state,
        error: { type: "getCategoryReport", info: action.error },
        loading: {
          ...state.loading,
          typeGetCategoryReport: false
        }
      };
    }
    case ActionTypes.GET_CATEGORY_REPORT_SUCCEEDED: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeGetCategoryReport: false
        },
        categoryReport: action.payload.data
      };
    }
    case ActionTypes.SET_DATE: {
      return {
        ...state,
        spendStatisticDate: action.payload
      };
    }
    case ActionTypes.SET_DATE_FAIL: {
      return {
        ...state,
        spendStatisticDate: null
      };
    }
    case ActionTypes.ADD_INCOME_CATEGORY_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeAddIncomeCategory: true
        }
      };
    }
    case ActionTypes.ADD_INCOME_CATEGORY_SUCCEEDED: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeAddIncomeCategory: false
        },
        incomeCategories: null
      };
    }
    case ActionTypes.ADD_SPEND_CATEGORY_LOADING: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeAddSpendCategory: true
        }
      };
    }
    case ActionTypes.ADD_SPEND_CATEGORY_SUCCEEDED: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeAddSpendCategory: false
        },
        spendCategories: null
      };
    }
    case ActionTypes.ADD_SPEND_CATEGORY_FAILED: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeAddSpendCategory: false
        }
      };
    }
    case ActionTypes.ADD_INCOME_CATEGORY_FAILED: {
      return {
        ...state,
        loading: {
          ...state.loading,
          typeAddIncomeCategory: false
        }
      };
    }
    default:
      return state;
  }
}
