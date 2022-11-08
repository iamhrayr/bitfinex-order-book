import React from "react";

import BookStreamService from "./BookStreamService";
import Header, { precOptions } from "./Header";
import SingleBook from "./SingleBook";

const App = () => {
  const [asks, setAsks] = React.useState([]);
  const [bids, setBids] = React.useState([]);
  const [prec, setPrec] = React.useState(precOptions[0].value);

  const onBookUpdate = React.useCallback((book) => {
    setAsks(book.asks);
    setBids(book.bids);
  }, []);

  React.useEffect(() => {
    const bookStream = new BookStreamService({ onBookUpdate });

    bookStream.init({ prec });

    return () => {
      bookStream.closeConnection();
    };
  }, [prec]);

  return (
    <div className="App">
      <Header onPrecChange={setPrec} />

      <div style={{ display: "flex", flexDirection: "row" }}>
        <SingleBook data={asks} />
        <SingleBook data={bids} reverse />
      </div>
    </div>
  );
};

export default App;
