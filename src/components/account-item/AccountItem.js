import React, { useState } from "react";
import Modal from "react-modal";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { delAccount } from "../../state/access-actions";

import "./AccountItem.css";

const customStyles = {
  content: {
    top: "40%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "530px",
    height: "200px",
    padding: "30px",
    borderRadius: "10px"
  }
};

Modal.setAppElement("#root");
const AccountItem = ({ balance, currency, name, type, id, delAccount }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  let emoji = "💳";
  if (type === "наличные" || type === "накопления") {
    emoji = "💰";
  }

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const delClickHandle = () => {
    openModal();
  };

  const deleteHandle = id => {
    delAccount(id);
    closeModal();
  };

  return (
    <div className="account-item d-flex justify-content-between">
      <div>
        <div className="account-item-balance">
          {balance}
          <span>{currency}</span>
          {emoji}
        </div>
        <div className="accont-item-trash">
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
          >
            <div className="modal-div">
              Удаление этого счёта приведёт к удалению истории всех доходов и
              расходов связанных с ним
            </div>
            <div className="modal-buttons d-flex justify-content-center">
              <button className="modal-cancel" onClick={closeModal}>
                Отмена
              </button>
              <button className="modal-ok" onClick={() => deleteHandle(id)}>
                Удалить
              </button>
            </div>
          </Modal>
          <i className="fa fa-trash" onClick={delClickHandle} />
        </div>
      </div>

      <div className="account-item-desc">
        <div className="account-item-name">{name}</div>
        <div className="account-item-type">{type}</div>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch =>
  bindActionCreators({ delAccount }, dispatch);

export default connect(null, mapDispatchToProps)(AccountItem);
