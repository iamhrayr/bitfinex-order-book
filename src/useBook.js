import React from "react";
import { useSelector, useDispatch } from "react-redux";

import {
  selectPrec,
  selectAsks,
  selectBids,
  updatePrec,
  updateAsks,
  updateBids,
} from "./store/book";

export default function useBook() {
  const dispatch = useDispatch();

  const prec = useSelector(selectPrec);
  const asks = useSelector(selectAsks);
  const bids = useSelector(selectBids);

  const setPrec = React.useCallback(
    (value) => {
      dispatch(updatePrec(value));
    },
    [dispatch]
  );

  const setBids = React.useCallback(
    (bidsData) => {
      dispatch(updateBids(bidsData));
    },
    [dispatch]
  );

  const setAsks = React.useCallback(
    (asksData) => {
      dispatch(updateAsks(asksData));
    },
    [dispatch]
  );

  return { prec, bids, asks, setPrec, setBids, setAsks };
}
