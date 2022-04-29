import moment from "moment";

/**
 * Returns a formatted timestamp based on the format type
 * passed as an argument.
 *
 * @param {date} timestamp - just a timestamp.
 * @param {*} type - moment.js format time (E.g. "fromNow")
 * @returns
 */

const formatTimestamp = (timestamp, type) => {
  // Parse timestamp if needed
  if (typeof timestamp === "string") {
    timestamp = parseInt(timestamp);
  }

  // Format time from current time
  const fromNow = () => {
    const CONFIG = {
      future: "in %s",
      past: "%s ago",
      s: (num) => (num < 10 ? "now" : `${num}s`),
      ss: "%ds",
      m: "%dm",
      mm: "%dm",
      h: "1h",
      hh: "%dh",
      d: "1d",
      dd: "%dd",
      M: "1mth",
      MM: "%dmth",
      y: "y",
      yy: "%dy",
    };

    // Update locale
    moment.updateLocale("en", { relativeTime: CONFIG });

    const formattedTimestamp = moment.utc(timestamp).fromNow(true);

    return formattedTimestamp;
  };

  switch (type) {
    case "fromNow":
      return fromNow(timestamp);
  }
};

export { formatTimestamp };
