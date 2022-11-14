import React from "react";

import BookStreamService from "./BookStreamService";
import Header from "./Header";
import SingleBook from "./SingleBook";

import useBook from "./useBook";

const App = () => {
  const { prec, bids, asks, setPrec, setBids, setAsks } = useBook();

  const onBookUpdate = React.useCallback(
    (book) => {
      setAsks(book.asks);
      setBids(book.bids);
    },
    [setAsks, setBids]
  );

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
