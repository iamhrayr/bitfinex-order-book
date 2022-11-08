import React from "react";

const SingleBook = ({ data, reverse }) => {
  let tableTh = ["Amount", "Count", "Price"];
  if (reverse) tableTh.reverse();

  return (
    <div style={{ padding: "10px" }}>
      <table>
        <thead>
          {tableTh.map((column) => (
            <th>{column}</th>
          ))}
        </thead>

        <tbody>
          {data.map(({ price, cnt, amount }) => {
            let tableTd = [amount, cnt, price];
            if (reverse) tableTd.reverse();

            return (
              <tr>
                {tableTd.map((column) => (
                  <th>{column}</th>
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
