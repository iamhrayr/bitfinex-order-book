import React from "react";

export const precOptions = [
  { title: 5, value: "P0" },
  { title: 4, value: "P1" },
  { title: 3, value: "P2" },
  { title: 2, value: "P3" },
  { title: 1, value: "P4" },
];

const Header = ({ onPrecChange }) => {
  return (
    <div>
      <label>Choose Precision: </label>
      <select onChange={(e) => onPrecChange(e.currentTarget.value)}>
        {precOptions.map(({ title, value }) => (
          <option key={value} value={value}>
            {title}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Header;
