import CRC from "crc-32";
import _ from "lodash";

const SOCKET_URL = "wss://api-pub.bitfinex.com/ws/2";

class BookStreamService {
  constructor({ onBookUpdate, onChecksumFail }) {
    this.onBookUpdate = onBookUpdate;
    this.onChecksumFail = onChecksumFail;
  }

  init({ pair = "tBTCUSD", prec = "P0" } = {}) {
    this.ws = new WebSocket(SOCKET_URL);

    // handle connect
    this.ws.onopen = () => {
      this.book = {};
      this.book.bids = {};
      this.book.asks = {};
      this.book.psnap = {};
      this.book.mcnt = 0;

      // send websocket conf event with checksum flag
      this.ws.send(JSON.stringify({ event: "conf", flags: 131072 }));

      // send subscribe to get desired book updates
      this.ws.send(
        JSON.stringify({
          pair,
          prec,
          event: "subscribe",
          channel: "book",
        })
      );
    };

    this.ws.onclose = () => {
      this.book = {};
      this.book.bids = {};
      this.book.asks = {};
      this.book.psnap = {};
      this.book.mcnt = 0;

      this.onBookUpdate?.({
        bids: [],
        asks: [],
      });
    };

    // handle incoming messages
    this.ws.onmessage = (event) => {
      let msg = event.data;
      msg = JSON.parse(msg);
      if (msg.event) return;
      if (msg[1] === "hb") return;

      // if msg contains checksum, perform checksum
      if (msg[1] === "cs") {
        const checksum = msg[2];
        const csdata = [];
        const bidsKeys = this.book.psnap["bids"];
        const asksKeys = this.book.psnap["asks"];

        // collect all bids and asks into an array
        for (let i = 0; i < 25; i++) {
          if (bidsKeys[i]) {
            const price = bidsKeys[i];
            const pp = this.book.bids[price];
            csdata.push(pp.price, pp.amount);
          }
          if (asksKeys[i]) {
            const price = asksKeys[i];
            const pp = this.book.asks[price];
            csdata.push(pp.price, -pp.amount);
          }
        }

        // create string of array to compare with checksum
        const csStr = csdata.join(":");
        const csCalc = CRC.str(csStr);
        if (csCalc !== checksum) {
          this.onChecksumFail?.();
        }
        return;
      }

      // handle book. create book or update/delete price points
      if (this.book.mcnt === 0) {
        _.each(msg[1], (pp) => {
          pp = { price: pp[0], cnt: pp[1], amount: pp[2] };
          const side = pp.amount >= 0 ? "bids" : "asks";
          pp.amount = Math.abs(pp.amount);
          this.book[side][pp.price] = pp;
        });
      } else {
        msg = msg[1];
        const pp = { price: msg[0], cnt: msg[1], amount: msg[2] };

        // if count is zero, then delete price point
        if (!pp.cnt) {
          let found = true;

          if (pp.amount > 0) {
            if (this.book["bids"][pp.price]) {
              delete this.book["bids"][pp.price];
            } else {
              found = false;
            }
          } else if (pp.amount < 0) {
            if (this.book["asks"][pp.price]) {
              delete this.book["asks"][pp.price];
            } else {
              found = false;
            }
          }

          if (!found) {
            console.error("Book delete failed. Price point not found");
          }
        } else {
          // else update price point
          const side = pp.amount >= 0 ? "bids" : "asks";
          pp.amount = Math.abs(pp.amount);
          this.book[side][pp.price] = pp;
        }

        // save price snapshots. Checksum relies on psnaps!
        _.each(["bids", "asks"], (side) => {
          const sbook = this.book[side];
          const bprices = Object.keys(sbook);
          const prices = bprices.sort((a, b) => {
            if (side === "bids") {
              return +a >= +b ? -1 : 1;
            } else {
              return +a <= +b ? -1 : 1;
            }
          });
          this.book.psnap[side] = prices;
        });
      }
      this.book.mcnt++;

      // send the new data to subscriber
      this.onBookUpdate?.({
        bids: Object.values(this.book.bids),
        asks: Object.values(this.book.asks),
      });
    };
  }

  closeConnection() {
    this.ws.close();
  }
}

export default BookStreamService;
