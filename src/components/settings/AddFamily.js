import React, { useState } from "react";
import { useInput } from "../hooks";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Loader from "react-loader-spinner";

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";

import { createFamily } from "../../state/access-actions";

import "./Settings.css";

const AddFamily = ({ createFamily, loading, families }) => {
  const [errorMsg, setErrorMsg] = useState(null);
  const [nameFamily, nameFamilyInput] = useInput(
    "text",
    "Название",
    "add-fam-inp",
    "add-fam-fil",
    "add-fam-lab"
  );
  const [pinFamily, pinFamilyInput] = useInput(
    "text",
    "Установить пин код",
    "pin-fam-inp",
    "pin-fam-fil",
    "pin-fam-lab",
    8
  );

  const handleSubmit = e => {
    e.preventDefault();
    let uniqueFamName = true;
    if (families) {
      for (let fam of families) {
        const { family_name } = fam;
        if (
          family_name.toLocaleLowerCase() === nameFamily.toLocaleLowerCase()
        ) {
          uniqueFamName = false;
        }
      }
      if (uniqueFamName && families) {
        createFamily(nameFamily, pinFamily);
      } else {
        setErrorMsg("такое имя семьи уже существует");
      }
    }
  };
  return (
    <form className="add-family-wrapper" onSubmit={handleSubmit}>
      {loading.typeCreateFamily ? (
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
            <div className="add-family-info">Создать семью</div>
            <div className="add-family-error">{errorMsg}</div>
          </div>
          <div className="d-flex">
            {nameFamilyInput}
            {pinFamilyInput}
          </div>
          <button className="btn btn-warning">Добавить</button>
        </div>
      )}
    </form>
  );
};

const mapStateToProps = state => ({
  loading: state.access.loading,
  families: state.access.families
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      createFamily
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps)(AddFamily);
