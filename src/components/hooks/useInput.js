import React, { useState, useRef } from "react";

export default function useInput(
  type,
  placeholder,
  classInp = "",
  classFil = "",
  classLab = "",
  maxLength = "240",
  min = "-9999999999",
  max = "9999999999"
) {
  const labRef = useRef(null);
  const [value, setValue] = useState("");
  const handleClick = () => {
    labRef.current.focus();
  };
  const input = (
    <div className={`form__group field ${classFil}`}>
      <input
        className={`form__field ${classInp}`}
        autoComplete="off"
        placeholder={placeholder}
        onChange={e => setValue(e.target.value)}
        type={type}
        maxLength={maxLength}
        min={min}
        max={max}
        step="0.01"
        ref={labRef}
        required
      />
      <label
        htmlFor={type}
        className={`form__label ${classLab}`}
        onClick={handleClick}
      >
        {placeholder}
      </label>
    </div>
  );
  return [value, input];
}
