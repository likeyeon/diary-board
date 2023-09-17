import { useState, useCallback } from "react";

const InputField = ({ name, type, label }) => {
  const [value, setValue] = useState("");

  const onChangeValue = useCallback((e) => {
    const newValue = e.target.value;
    setValue(newValue);
  }, []);

  return (
    <div className="">
      <label for={name}>{label}</label>
      <input
        className=""
        type={type}
        name={name}
        id={name}
        onChange={onChangeValue}
        value={value}
      />
    </div>
  );
};

export default InputField;
