import React from "react";

const SingleBook = ({ data, reverse }) => {
  let tableTh = ["Amount", "Count", "Price"];
  if (reverse) tableTh.reverse();

  return (
    <div style={{ padding: "10px" }}>
      <table>
        <thead>
          <tr>
            {tableTh.map((column, index) => (
              <th key={index}>{column}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map(({ price, cnt, amount }, index) => {
            let tableTd = [amount, cnt, price];
            if (reverse) tableTd.reverse();

            return (
              <tr key={index}>
                {tableTd.map((column, index) => (
                  <th key={index}>{column}</th>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SingleBook;
