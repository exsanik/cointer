import React from "react";

const Menu = ({ data, header }) => {
  return (
    <div className="menu-list">
      {header && <span>{header}</span>}
      <ul className="list-group">
        {data.map((m, idx) => {
          let optsFlag = false;
          if (m.options) {
            if (m.options.length > 0) {
              optsFlag = true;
            }
          }
          return (
            <li key={idx} className="list-group-item">
              {m.label}
              {optsFlag && <Menu data={m.options} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Menu;
