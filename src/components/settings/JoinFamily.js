import React, { useState, useEffect } from "react";
import Select from "react-select";
import Loader from "react-loader-spinner";

import { useInput } from "../hooks";
import "./Settings.css";
import { parseForDropDown } from "../../services/helpers";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { setFamily } from "../../state/access-actions";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

const JoinFamily = ({ families, setFamily, user, loading }) => {
  const joinFamPlacehold = "Выбрать семью";
  const [errMsg, setErrMsg] = useState(null);
  const [options, setOptions] = useState([]);
  const [dropFamily, setDropFamily] = useState({
    value: null,
    label: joinFamPlacehold
  });
  const [joinPinFamily, joinPinFamilyInput] = useInput(
    "text",
    "Пин код",
    "pin-fam-inp",
    "pin-fam-fil",
    "pin-fam-lab",
    8
  );

  useEffect(() => {
    if (families) {
      setOptions(parseForDropDown(families, "family_name", "family_id"));
      setDropFamily({ value: undefined, label: joinFamPlacehold });
    } else {
      setDropFamily({ value: null, label: "Загрузка..." });
    }
  }, [families]);

  useEffect(() => {
    if (user.info) {
      if (user.info.type === "setFamily") {
        setErrMsg(user.info.text);
      }
    } else {
      setErrMsg(null);
    }
  }, [user.info]);

  const handleDropFamily = selected => {
    setDropFamily(selected);
  };
  const handleForm = async e => {
    e.preventDefault();
    await setFamily(dropFamily.value, dropFamily.label, joinPinFamily);
  };

  return (
    <form className="add-family-wrapper" onSubmit={handleForm}>
      {loading.typeSetFamily ? (
        <div
          className="d-flex justify-content-center align-items-center"
          style={{ height: "88%" }}
        >
          <Loader
            type="BallTriangle"
            color="#f8c83a"
            height={100}
            width={100}
          />
        </div>
      ) : (
        <div>
          <div className="d-flex">
            <div className="add-family-info">Присоединиться к семье</div>
            <div className="add-family-error">{errMsg}</div>
          </div>
          <div className="d-flex">
            <div className="join-fam-select">
              <input
                className="join-fam-input"
                tabIndex={-1}
                autoComplete="off"
                style={{ opacity: 0, height: 0 }}
                defaultValue={
                  dropFamily.label === joinFamPlacehold ||
                  dropFamily.label === "Загрузка..."
                    ? ""
                    : dropFamily.label
                }
                required
              />
              <Select
                noOptionsMessage={() => "Семьи ещё не созданы"}
                isDisabled={dropFamily.value === null}
                options={options}
                onChange={handleDropFamily}
                placeholder={dropFamily.label}
              />
            </div>
            <div className="d-flex">{joinPinFamilyInput}</div>
          </div>
          <button className="btn btn-warning">Вступить</button>
        </div>
      )}
    </form>
  );
};

const mapStateToProps = state => ({
  families: state.access.families,
  user: state.access.user,
  loading: state.access.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      setFamily
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(JoinFamily);
