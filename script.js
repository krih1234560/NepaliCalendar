(() => {
  // node_modules/@grahan/core/dist/time/julian.js
  function julianDayFromCalendar({ year, month, day }) {
    let y = year;
    let m = month;
    if (m <= 2) {
      y -= 1;
      m += 12;
    }
    const isGregorian = year > 1582 || year === 1582 && (month > 10 || month === 10 && day >= 15);
    let b = 0;
    if (isGregorian) {
      const a = Math.floor(y / 100);
      b = 2 - a + Math.floor(a / 4);
    }
    return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + b - 1524.5;
  }
  function calendarFromJulianDay(jd) {
    const z = Math.floor(jd + 0.5);
    const f = jd + 0.5 - z;
    let a = z;
    if (z >= 2299161) {
      const alpha = Math.floor((z - 186721625e-2) / 36524.25);
      a = z + 1 + alpha - Math.floor(alpha / 4);
    }
    const b = a + 1524;
    const c = Math.floor((b - 122.1) / 365.25);
    const d = Math.floor(365.25 * c);
    const e = Math.floor((b - d) / 30.6001);
    const day = b - d - Math.floor(30.6001 * e) + f;
    const month = e < 14 ? e - 1 : e - 13;
    const year = month > 2 ? c - 4716 : c - 4715;
    return { year, month, day };
  }

  // node_modules/@grahan/core/dist/time/timezone.js
  var formatters = /* @__PURE__ */ new Map();
  function formatterFor(timeZone) {
    let f = formatters.get(timeZone);
    if (!f) {
      f = new Intl.DateTimeFormat("en-US", {
        timeZone,
        hourCycle: "h23",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      });
      formatters.set(timeZone, f);
    }
    return f;
  }
  function zonedTimeFromDate(date, timeZone) {
    const parts = formatterFor(timeZone).formatToParts(date);
    const read = (type) => {
      const part = parts.find((p) => p.type === type);
      if (!part) {
        throw new Error(`Intl returned no "${type}" part for zone ${timeZone}`);
      }
      return Number(part.value);
    };
    return {
      year: read("year"),
      month: read("month"),
      day: read("day"),
      hour: read("hour"),
      minute: read("minute"),
      second: read("second")
    };
  }

  // node_modules/@grahan/calendars/dist/bs.data.js
  var BS_MIN_YEAR = 1975;
  var BS_MAX_YEAR = 2200;
  var BS_VERIFIED_THROUGH = 2083;
  var BS_EPOCH_AD = { year: 1918, month: 4, day: 13 };
  var BS_MONTH_LENGTHS = [
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 1975
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 1976
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 1977
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 1978
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 1979
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 1980
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 1981
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 1982
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 1983
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 1984
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 1985
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 1986
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 1987
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 1988
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 1989
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 1990
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    // 1991
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 1992
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 1993
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 1994
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    // 1995
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 1996
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 1997
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 1998
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 1999
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2000
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2001
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2002
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2003
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2004
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2005
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2006
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2007
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    // 2008
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2009
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2010
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2011
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 2012
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2013
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2014
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2015
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 2016
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2017
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2018
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2019
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2020
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2021
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    // 2022
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2023
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2024
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2025
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2026
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2027
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2028
    [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
    // 2029
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2030
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2031
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2032
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2033
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2034
    [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    // 2035
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2036
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2037
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2038
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 2039
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2040
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2041
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2042
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 2043
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2044
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2045
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2046
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2047
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2048
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    // 2049
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2050
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2051
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2052
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    // 2053
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2054
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2055
    [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
    // 2056
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2057
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2058
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2059
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2060
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2061
    [31, 31, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
    // 2062
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2063
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2064
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2065
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    // 2066
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2067
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2068
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2069
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 2070
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2071
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2072
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2073
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2074
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2075
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    // 2076
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2077
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2078
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2079
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    // 2080
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2081
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2082
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2083
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2084 (projected)
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2085 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2086 (projected)
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2087 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2088 (projected)
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2089 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2090 (projected)
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2091 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2092 (projected)
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 2093 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2094 (projected)
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2095 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2096 (projected)
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 2097 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2098 (projected)
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2099 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2100 (projected)
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 2101 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2102 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    // 2103 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2104 (projected)
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2105 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2106 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    // 2107 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2108 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2109 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2110 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2111 (projected)
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2112 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2113 (projected)
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2114 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2115 (projected)
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2116 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2117 (projected)
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2118 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2119 (projected)
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    // 2120 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2121 (projected)
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2122 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2123 (projected)
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 2124 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2125 (projected)
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2126 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2127 (projected)
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 2128 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2129 (projected)
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2130 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2131 (projected)
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2132 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2133 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    // 2134 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2135 (projected)
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2136 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2137 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    // 2138 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2139 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2140 (projected)
    [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
    // 2141 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2142 (projected)
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2143 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2144 (projected)
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2145 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2146 (projected)
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2147 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2148 (projected)
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2149 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2150 (projected)
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 2151 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2152 (projected)
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2153 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2154 (projected)
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 2155 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2156 (projected)
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2157 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2158 (projected)
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 2159 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2160 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    // 2161 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2162 (projected)
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2163 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2164 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    // 2165 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2166 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2167 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2168 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2169 (projected)
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2170 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2171 (projected)
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2172 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2173 (projected)
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2174 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2175 (projected)
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2176 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2177 (projected)
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    // 2178 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2179 (projected)
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2180 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2181 (projected)
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 2182 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2183 (projected)
    [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2184 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2185 (projected)
    [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    // 2186 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2187 (projected)
    [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    // 2188 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2189 (projected)
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2190 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2191 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    // 2192 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2193 (projected)
    [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2194 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2195 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    // 2196 (projected)
    [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // 2197 (projected)
    [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    // 2198 (projected)
    [31, 31, 32, 31, 32, 30, 30, 29, 30, 29, 30, 30],
    // 2199 (projected)
    [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31]
    // 2200 (projected)
  ];

  // node_modules/@grahan/calendars/dist/names.js
  var BS_MONTH_NAMES = [
    { roman: "Baisakh", nepali: "\u0935\u0948\u0936\u093E\u0916" },
    { roman: "Jestha", nepali: "\u091C\u0947\u0920" },
    { roman: "Asar", nepali: "\u0905\u0938\u093E\u0930" },
    { roman: "Shrawan", nepali: "\u0938\u093E\u0909\u0928" },
    { roman: "Bhadra", nepali: "\u092D\u0926\u094C" },
    { roman: "Ashwin", nepali: "\u0905\u0938\u094B\u091C" },
    { roman: "Kartik", nepali: "\u0915\u093E\u0924\u094D\u0924\u093F\u0915" },
    { roman: "Mangsir", nepali: "\u092E\u0902\u0938\u093F\u0930" },
    { roman: "Poush", nepali: "\u092A\u0941\u0938" },
    { roman: "Magh", nepali: "\u092E\u093E\u0918" },
    { roman: "Falgun", nepali: "\u092B\u093E\u0917\u0941\u0928" },
    { roman: "Chaitra", nepali: "\u091A\u0948\u0924" }
  ];
  var BS_WEEKDAY_NAMES = [
    { name: "Sunday", roman: "Aaitabar", nepali: "\u0906\u0907\u0924\u092C\u093E\u0930" },
    { name: "Monday", roman: "Sombar", nepali: "\u0938\u094B\u092E\u092C\u093E\u0930" },
    { name: "Tuesday", roman: "Mangalbar", nepali: "\u092E\u0919\u094D\u0917\u0932\u092C\u093E\u0930" },
    { name: "Wednesday", roman: "Budhabar", nepali: "\u092C\u0941\u0927\u092C\u093E\u0930" },
    { name: "Thursday", roman: "Bihibar", nepali: "\u092C\u093F\u0939\u0940\u092C\u093E\u0930" },
    { name: "Friday", roman: "Shukrabar", nepali: "\u0936\u0941\u0915\u094D\u0930\u092C\u093E\u0930" },
    { name: "Saturday", roman: "Shanibar", nepali: "\u0936\u0928\u093F\u092C\u093E\u0930" }
  ];

  // node_modules/@grahan/calendars/dist/bs.js
  var YEAR_LENGTHS = BS_MONTH_LENGTHS.map((months) => months.reduce((a, b) => a + b, 0));
  var TOTAL_DAYS = YEAR_LENGTHS.reduce((a, b) => a + b, 0);
  function dayNumberFromAd({ year, month, day }) {
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
      throw new RangeError(`AD date parts must be integers, got ${year}-${month}-${day}`);
    }
    const jd = julianDayFromCalendar({ year, month, day });
    const back = calendarFromJulianDay(jd);
    if (back.year !== year || back.month !== month || back.day !== day) {
      throw new RangeError(`${year}-${month}-${day} is not a real AD date`);
    }
    return jd + 0.5;
  }
  var EPOCH_DAY_NUMBER = dayNumberFromAd(BS_EPOCH_AD);
  function weekdayFromDayNumber(dayNumber) {
    const index = (dayNumber + 1) % 7;
    const names = BS_WEEKDAY_NAMES[index];
    if (!names) {
      throw new RangeError(`no weekday at index ${index}`);
    }
    return { index, ...names };
  }
  function toBsDateInfo(bs, dayNumber) {
    const monthName = BS_MONTH_NAMES[bs.month - 1];
    if (!monthName) {
      throw new RangeError(`no BS month ${bs.month}`);
    }
    return {
      ...bs,
      monthName,
      weekday: weekdayFromDayNumber(dayNumber),
      projected: bs.year > BS_VERIFIED_THROUGH
    };
  }
  function bsFromDate(ad) {
    const dayNumber = dayNumberFromAd(ad);
    let rest = dayNumber - EPOCH_DAY_NUMBER;
    if (rest < 0 || rest >= TOTAL_DAYS) {
      throw new RangeError(`${ad.year}-${ad.month}-${ad.day} is outside the BS table (${BS_MIN_YEAR}\u2013${BS_MAX_YEAR} BS \u2248 1918-04-13 onward)`);
    }
    let year = BS_MIN_YEAR;
    for (const [i, yearLength] of YEAR_LENGTHS.entries()) {
      if (rest < yearLength) {
        year = BS_MIN_YEAR + i;
        break;
      }
      rest -= yearLength;
    }
    const months = BS_MONTH_LENGTHS[year - BS_MIN_YEAR];
    if (!months) {
      throw new RangeError(`no month table for BS ${year}`);
    }
    for (const [i, monthLength] of months.entries()) {
      if (rest < monthLength) {
        return toBsDateInfo({ year, month: i + 1, day: rest + 1 }, dayNumber);
      }
      rest -= monthLength;
    }
    throw new RangeError(`day offset left over in BS ${year} \u2014 corrupt table`);
  }
  function dateFromBs(bs) {
    if (!Number.isInteger(bs.year) || !Number.isInteger(bs.month) || !Number.isInteger(bs.day)) {
      throw new RangeError(`BS date parts must be integers, got ${bs.year}-${bs.month}-${bs.day}`);
    }
    const months = BS_MONTH_LENGTHS[bs.year - BS_MIN_YEAR];
    if (!months) {
      throw new RangeError(`BS year ${bs.year} is outside the table (${BS_MIN_YEAR}\u2013${BS_MAX_YEAR})`);
    }
    const monthLength = months[bs.month - 1];
    if (bs.month < 1 || bs.month > 12 || monthLength === void 0) {
      throw new RangeError(`BS month must be 1\u201312, got ${bs.month}`);
    }
    if (bs.day < 1 || bs.day > monthLength) {
      const name = BS_MONTH_NAMES[bs.month - 1]?.roman ?? String(bs.month);
      throw new RangeError(`${name} ${bs.year} has ${monthLength} days, got day ${bs.day}`);
    }
    let offset = bs.day - 1;
    for (let i = 0; i < bs.month - 1; i++) {
      offset += months[i] ?? 0;
    }
    for (let y = BS_MIN_YEAR; y < bs.year; y++) {
      offset += YEAR_LENGTHS[y - BS_MIN_YEAR] ?? 0;
    }
    const dayNumber = EPOCH_DAY_NUMBER + offset;
    const cal = calendarFromJulianDay(dayNumber - 0.5);
    return {
      year: cal.year,
      month: cal.month,
      day: cal.day,
      weekday: weekdayFromDayNumber(dayNumber)
    };
  }
  function todayBs(options) {
    const now = zonedTimeFromDate(/* @__PURE__ */ new Date(), options.timezone);
    return bsFromDate({ year: now.year, month: now.month, day: now.day });
  }

  // festivals.json
  var festivals_default = {
    "2083-01-01": [
      {
        name: "\u0928\u0935 \u0935\u0930\u094D\u0937 \u0968\u0966\u096E\u0969",
        nameEn: "Nepali New Year",
        type: "festival"
      }
    ],
    "2083-01-11": [
      {
        name: "\u0932\u094B\u0915\u0924\u0928\u094D\u0924\u094D\u0930 \u0926\u093F\u0935\u0938",
        nameEn: "Loktantra Diwas",
        type: "festival"
      }
    ],
    "2083-01-14": [
      {
        name: "\u092E\u094B\u0939\u093F\u0928\u0940 \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Mohini Ekadashi",
        type: "festival"
      }
    ],
    "2083-01-18": [
      {
        name: "\u092C\u0941\u0926\u094D\u0927 \u091C\u092F\u0928\u094D\u0924\u0940",
        nameEn: "Buddha Jayanti",
        type: "festival"
      },
      {
        name: "\u0909\u092D\u094C\u0932\u0940 \u092A\u0930\u094D\u0935",
        nameEn: "Ubhauli Parva",
        type: "festival"
      },
      {
        name: "\u0936\u094D\u0930\u092E\u093F\u0915 \u0926\u093F\u0935\u0938",
        nameEn: "International Workers' Day",
        type: "festival"
      }
    ],
    "2083-01-30": [
      {
        name: "\u0905\u092A\u0930\u093E \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Apara Ekadashi",
        type: "festival"
      }
    ],
    "2083-02-01": [
      {
        name: "\u0935\u0943\u0937 \u0938\u0902\u0915\u094D\u0930\u093E\u0928\u094D\u0924\u093F",
        nameEn: "Brish Sankranti",
        type: "festival"
      }
    ],
    "2083-02-15": [
      {
        name: "\u0917\u0923\u0924\u0928\u094D\u0924\u094D\u0930 \u0926\u093F\u0935\u0938",
        nameEn: "Republic Day",
        type: "festival"
      }
    ],
    "2083-03-01": [
      {
        name: "\u092E\u093F\u0925\u0941\u0928 \u0938\u0902\u0915\u094D\u0930\u093E\u0928\u094D\u0924\u093F",
        nameEn: "Mithun Sankranti",
        type: "festival"
      }
    ],
    "2083-03-11": [
      {
        name: "\u0928\u093F\u0930\u094D\u091C\u0932\u093E \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Nirjala Ekadashi",
        type: "festival"
      }
    ],
    "2083-03-26": [
      {
        name: "\u092F\u094B\u0917\u093F\u0928\u0940 \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Yogini Ekadashi",
        type: "festival"
      }
    ],
    "2083-03-29": [
      {
        name: "\u092D\u093E\u0928\u0941 \u091C\u092F\u0928\u094D\u0924\u0940",
        nameEn: "Bhanu Jayanti",
        type: "festival"
      }
    ],
    "2083-04-01": [
      {
        name: "\u0915\u0930\u094D\u0915\u091F \u0938\u0902\u0915\u094D\u0930\u093E\u0928\u094D\u0924\u093F",
        nameEn: "Karkat Sankranti",
        type: "festival"
      }
    ],
    "2083-04-10": [
      {
        name: "\u0939\u0930\u093F\u0936\u092F\u0928\u0940 \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Devshayani Ekadashi",
        type: "festival"
      }
    ],
    "2083-04-25": [
      {
        name: "\u0915\u093E\u092E\u093F\u0915\u093E \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Kamika Ekadashi",
        type: "festival"
      }
    ],
    "2083-05-01": [
      {
        name: "\u0938\u093F\u0902\u0939 \u0938\u0902\u0915\u094D\u0930\u093E\u0928\u094D\u0924\u093F",
        nameEn: "Singha Sankranti",
        type: "festival"
      }
    ],
    "2083-05-07": [
      {
        name: "\u092A\u0935\u093F\u0924\u094D\u0930\u093E \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Pavitra Putrada Ekadashi",
        type: "festival"
      }
    ],
    "2083-05-12": [
      {
        name: "\u091C\u0928\u0948 \u092A\u0942\u0930\u094D\u0923\u093F\u092E\u093E",
        nameEn: "Janai Purnima / Raksha Bandhan",
        type: "festival"
      }
    ],
    "2083-05-19": [
      {
        name: "\u0936\u094D\u0930\u0940\u0915\u0943\u0937\u094D\u0923 \u091C\u0928\u094D\u092E\u093E\u0937\u094D\u091F\u092E\u0940",
        nameEn: "Krishna Janmashtami",
        type: "festival"
      }
    ],
    "2083-05-22": [
      {
        name: "\u0905\u091C\u093E \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Aja Ekadashi",
        type: "festival"
      }
    ],
    "2083-05-29": [
      {
        name: "\u0939\u0930\u093F\u0924\u093E\u0932\u093F\u0915\u093E \u0924\u0940\u091C",
        nameEn: "Haritalika Teej",
        type: "festival"
      }
    ],
    "2083-05-30": [
      {
        name: "\u090B\u0937\u093F \u092A\u091E\u094D\u091A\u092E\u0940",
        nameEn: "Rishi Panchami",
        type: "festival"
      }
    ],
    "2083-06-01": [
      {
        name: "\u0915\u0928\u094D\u092F\u093E \u0938\u0902\u0915\u094D\u0930\u093E\u0928\u094D\u0924\u093F",
        nameEn: "Kanya Sankranti",
        type: "festival"
      }
    ],
    "2083-06-03": [
      {
        name: "\u0938\u0902\u0935\u093F\u0927\u093E\u0928 \u0926\u093F\u0935\u0938",
        nameEn: "Constitution Day",
        type: "festival"
      }
    ],
    "2083-06-06": [
      {
        name: "\u092A\u093E\u0930\u094D\u0936\u094D\u0935 \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Haripariwartini Ekadashi",
        type: "festival"
      }
    ],
    "2083-06-09": [
      {
        name: "\u0907\u0928\u094D\u0926\u094D\u0930\u091C\u093E\u0924\u094D\u0930\u093E",
        nameEn: "Indra Jatra",
        type: "festival"
      }
    ],
    "2083-06-20": [
      {
        name: "\u0907\u0928\u094D\u0926\u093F\u0930\u093E \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Indira Ekadashi",
        type: "festival"
      }
    ],
    "2083-06-25": [
      {
        name: "\u0918\u091F\u0938\u094D\u0925\u093E\u092A\u0928\u093E",
        nameEn: "Ghatasthapana",
        type: "festival"
      }
    ],
    "2083-07-01": [
      {
        name: "\u092B\u0942\u0932\u092A\u093E\u0924\u0940",
        nameEn: "Phulpati",
        type: "festival"
      }
    ],
    "2083-07-02": [
      {
        name: "\u092E\u0939\u093E\u0905\u0937\u094D\u091F\u092E\u0940",
        nameEn: "Maha Ashtami",
        type: "festival"
      }
    ],
    "2083-07-04": [
      {
        name: "\u092E\u0939\u093E\u0928\u0935\u092E\u0940",
        nameEn: "Maha Navami",
        type: "festival"
      }
    ],
    "2083-07-05": [
      {
        name: "\u0935\u093F\u091C\u092F\u093E \u0926\u0936\u092E\u0940",
        nameEn: "Vijaya Dashami / Dashain",
        type: "festival"
      }
    ],
    "2083-07-06": [
      {
        name: "\u092A\u093E\u092A\u093E\u0919\u094D\u0915\u0941\u0936\u093E \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Papankusha Ekadashi",
        type: "festival"
      }
    ],
    "2083-07-10": [
      {
        name: "\u0915\u094B\u091C\u093E\u0917\u094D\u0930\u0924 \u092A\u0942\u0930\u094D\u0923\u093F\u092E\u093E",
        nameEn: "Kojagrat Purnima",
        type: "festival"
      }
    ],
    "2083-07-20": [
      {
        name: "\u0930\u092E\u093E \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Rama Ekadashi",
        type: "festival"
      }
    ],
    "2083-07-22": [
      {
        name: "\u0915\u093E\u0917 \u0924\u093F\u0939\u093E\u0930",
        nameEn: "Kaag Tihar",
        type: "festival"
      }
    ],
    "2083-07-23": [
      {
        name: "\u0915\u0941\u0915\u0941\u0930 \u0924\u093F\u0939\u093E\u0930",
        nameEn: "Kukur Tihar",
        type: "festival"
      }
    ],
    "2083-07-24": [
      {
        name: "\u0917\u093E\u0908 \u0924\u093F\u0939\u093E\u0930 / \u0932\u0915\u094D\u0937\u094D\u092E\u0940 \u092A\u0942\u091C\u093E",
        nameEn: "Gai Tihar / Laxmi Puja",
        type: "festival"
      }
    ],
    "2083-07-25": [
      {
        name: "\u0917\u094B\u0935\u0930\u094D\u0927\u0928 \u092A\u0942\u091C\u093E / \u092E\u094D\u0939 \u092A\u0942\u091C\u093E",
        nameEn: "Govardhan Puja / Mha Puja",
        type: "festival"
      },
      {
        name: "\u0928\u0947\u092A\u093E\u0932 \u0938\u092E\u094D\u092C\u0924 \u0928\u092F\u093E\u0901 \u0935\u0930\u094D\u0937",
        nameEn: "Nepal Sambat New Year",
        type: "festival"
      }
    ],
    "2083-07-26": [
      {
        name: "\u092D\u093E\u0907 \u091F\u0940\u0915\u093E",
        nameEn: "Bhai Tika",
        type: "festival"
      }
    ],
    "2083-07-30": [
      {
        name: "\u091B\u0920 \u092A\u0930\u094D\u0935",
        nameEn: "Chhath Parva",
        type: "festival"
      }
    ],
    "2083-08-01": [
      {
        name: "\u0935\u0943\u0936\u094D\u091A\u093F\u0915 \u0938\u0902\u0915\u094D\u0930\u093E\u0928\u094D\u0924\u093F",
        nameEn: "Bishchik Sankranti",
        type: "festival"
      }
    ],
    "2083-08-04": [
      {
        name: "\u0926\u0947\u0935\u0909\u0920\u0928\u0940 \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Devuthani / Hari Bodhini Ekadashi",
        type: "festival"
      }
    ],
    "2083-08-18": [
      {
        name: "\u0909\u0924\u094D\u092A\u0928\u094D\u0928\u093E \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Utpanna Ekadashi",
        type: "festival"
      }
    ],
    "2083-09-04": [
      {
        name: "\u092E\u094B\u0915\u094D\u0937\u0926\u093E \u090F\u0915\u093E\u0926\u0936\u0940 / \u0917\u0940\u0924\u093E \u091C\u092F\u0928\u094D\u0924\u0940",
        nameEn: "Mokshada Ekadashi / Gita Jayanti",
        type: "festival"
      }
    ],
    "2083-09-09": [
      {
        name: "\u092F\u094B\u092E\u0930\u0940 \u092A\u0941\u0928\u094D\u0939\u0940",
        nameEn: "Yomari Punhi",
        type: "festival"
      }
    ],
    "2083-09-15": [
      {
        name: "\u0924\u092E\u0941 \u0932\u094D\u0939\u094B\u0938\u093E\u0930",
        nameEn: "Tamu Lhosar",
        type: "festival"
      }
    ],
    "2083-09-20": [
      {
        name: "\u0938\u092B\u0932\u093E \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Saphala Ekadashi",
        type: "festival"
      }
    ],
    "2083-09-27": [
      {
        name: "\u092A\u0943\u0925\u094D\u0935\u0940 \u091C\u092F\u0928\u094D\u0924\u0940 / \u0930\u093E\u0937\u094D\u091F\u094D\u0930\u093F\u092F \u090F\u0915\u0924\u093E \u0926\u093F\u0935\u0938",
        nameEn: "Prithvi Jayanti / National Unity Day",
        type: "festival"
      }
    ],
    "2083-09-30": [
      {
        name: "\u092E\u093E\u0918\u0947 \u0938\u0902\u0915\u094D\u0930\u093E\u0928\u094D\u0924\u093F",
        nameEn: "Maghe Sankranti",
        type: "festival"
      }
    ],
    "2083-10-04": [
      {
        name: "\u092A\u094C\u0937 \u092A\u0941\u0924\u094D\u0930\u0926\u093E \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Pausha Putrada Ekadashi",
        type: "festival"
      }
    ],
    "2083-10-16": [
      {
        name: "\u0936\u0939\u0940\u0926 \u0926\u093F\u0935\u0938",
        nameEn: "Martyrs' Day",
        type: "festival"
      }
    ],
    "2083-10-19": [
      {
        name: "\u0937\u091F\u094D\u0924\u093F\u0932\u093E \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Shattila Ekadashi",
        type: "festival"
      }
    ],
    "2083-10-23": [
      {
        name: "\u0938\u094B\u0928\u093E\u092E \u0932\u094D\u0939\u094B\u0938\u093E\u0930",
        nameEn: "Sonam Lhosar",
        type: "festival"
      }
    ],
    "2083-10-28": [
      {
        name: "\u0935\u0938\u0928\u094D\u0924 \u092A\u091E\u094D\u091A\u092E\u0940 / \u0938\u0930\u0938\u094D\u0935\u0924\u0940 \u092A\u0942\u091C\u093E",
        nameEn: "Basant Panchami / Saraswati Puja",
        type: "festival"
      }
    ],
    "2083-10-30": [
      {
        name: "\u0915\u0941\u092E\u094D\u092D \u0938\u0902\u0915\u094D\u0930\u093E\u0928\u094D\u0924\u093F",
        nameEn: "Kumbh Sankranti",
        type: "festival"
      }
    ],
    "2083-11-05": [
      {
        name: "\u091C\u092F\u093E \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Jaya Ekadashi",
        type: "festival"
      }
    ],
    "2083-11-07": [
      {
        name: "\u092A\u094D\u0930\u091C\u093E\u0924\u0928\u094D\u0924\u094D\u0930 \u0926\u093F\u0935\u0938",
        nameEn: "Prajatantra Diwas",
        type: "festival"
      }
    ],
    "2083-11-21": [
      {
        name: "\u0935\u093F\u091C\u092F\u093E \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Vijaya Ekadashi",
        type: "festival"
      }
    ],
    "2083-11-23": [
      {
        name: "\u092E\u0939\u093E\u0936\u093F\u0935\u0930\u093E\u0924\u094D\u0930\u093F",
        nameEn: "Maha Shivaratri",
        type: "festival"
      }
    ],
    "2083-11-25": [
      {
        name: "\u0905\u0928\u094D\u0924\u0930\u094D\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u093F\u092F \u0928\u093E\u0930\u0940 \u0926\u093F\u0935\u0938",
        nameEn: "International Women's Day",
        type: "festival"
      }
    ],
    "2083-11-26": [
      {
        name: "\u0917\u094D\u092F\u093E\u0932\u094D\u092A\u094B \u0932\u094D\u0939\u094B\u0938\u093E\u0930",
        nameEn: "Gyalpo Lhosar",
        type: "festival"
      }
    ],
    "2083-12-01": [
      {
        name: "\u092E\u0940\u0928 \u0938\u0902\u0915\u094D\u0930\u093E\u0928\u094D\u0924\u093F",
        nameEn: "Min Sankranti",
        type: "festival"
      }
    ],
    "2083-12-07": [
      {
        name: "\u092B\u093E\u0917\u0941 \u092A\u0942\u0930\u094D\u0923\u093F\u092E\u093E / \u0939\u094B\u0932\u0940",
        nameEn: "Holi - Hill Region",
        type: "festival"
      }
    ],
    "2083-12-08": [
      {
        name: "\u0939\u094B\u0932\u0940",
        nameEn: "Holi - Terai Region",
        type: "festival"
      }
    ],
    "2083-12-19": [
      {
        name: "\u092A\u093E\u092A\u092E\u094B\u091A\u0928\u0940 \u090F\u0915\u093E\u0926\u0936\u0940",
        nameEn: "Papamochani Ekadashi",
        type: "festival"
      }
    ],
    "2083-12-23": [
      {
        name: "\u0918\u094B\u0921\u0947 \u091C\u093E\u0924\u094D\u0930\u093E",
        nameEn: "Ghode Jatra",
        type: "festival"
      }
    ]
  };

  // holidays.json
  var holidays_default = {
    "2083-01-01": [
      {
        name: "\u0928\u092F\u093E\u0901 \u0935\u0930\u094D\u0937 \u0968\u0966\u096E\u0969 / \u092C\u093F\u0938\u094D\u0915\u093E \u091C\u093E\u0924\u094D\u0930\u093E / \u092E\u0947\u0937 \u0938\u0902\u0915\u094D\u0930\u093E\u0928\u094D\u0924\u093F",
        nameEn: "Nepali New Year / Biska Jatra / Mesh Sankranti",
        type: "government",
        ad: "2026-04-14"
      }
    ],
    "2083-01-18": [
      {
        name: "\u0905\u0928\u094D\u0924\u0930\u094D\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u093F\u092F \u0936\u094D\u0930\u092E\u093F\u0915 \u0926\u093F\u0935\u0938 / \u0909\u092D\u094C\u0932\u0940 \u092A\u0930\u094D\u0935 / \u092C\u0941\u0926\u094D\u0927 \u091C\u092F\u0928\u094D\u0924\u0940 / \u091A\u0923\u094D\u0921\u0940 \u092A\u0942\u0930\u094D\u0923\u093F\u092E\u093E",
        nameEn: "International Labour Day / Ubhauli / Buddha Jayanti / Chandi Purnima",
        type: "government",
        ad: "2026-05-01"
      }
    ],
    "2083-02-14": [
      {
        name: "\u092C\u0915\u0930 \u0908\u0926 (\u0908\u0926-\u0909\u0932-\u0905\u0927\u093E) / \u092A\u094D\u0930\u0926\u094B\u0937 \u0935\u094D\u0930\u0924",
        nameEn: "Eid al-Adha",
        type: "government",
        ad: "2026-05-28"
      }
    ],
    "2083-02-15": [
      {
        name: "\u0917\u0923\u0924\u0928\u094D\u0924\u094D\u0930 \u0926\u093F\u0935\u0938 / \u0905\u0928\u094D\u0924\u0930\u094D\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u093F\u092F \u0938\u0917\u0930\u092E\u093E\u0925\u093E \u0926\u093F\u0935\u0938",
        nameEn: "Republic Day / International Everest Day",
        type: "government",
        ad: "2026-05-29"
      }
    ],
    "2083-03-06": [
      {
        name: "\u092D\u094B\u091F\u094B \u091C\u093E\u0924\u094D\u0930\u093E / \u0935\u093F\u0936\u094D\u0935 \u0936\u0930\u0923\u093E\u0930\u094D\u0925\u0940 \u0926\u093F\u0935\u0938 / \u0915\u0941\u092E\u093E\u0930\u0937\u0937\u094D\u0920\u0940 / \u0938\u093F\u0925\u093F \u0928\u0916\u0903",
        nameEn: "Bhoto Jatra / World Refugee Day / Sithi Nakha",
        type: "regional",
        ad: "2026-06-20"
      }
    ],
    "2083-05-12": [
      {
        name: "\u091C\u0928\u0948 \u092A\u0942\u0930\u094D\u0923\u093F\u092E\u093E / \u0930\u0915\u094D\u0937\u093E \u092C\u0928\u094D\u0927\u0928 / \u090B\u0937\u093F\u0924\u0930\u094D\u092A\u0923\u0940 / \u0938\u0902\u0938\u094D\u0915\u0943\u0924 \u0926\u093F\u0935\u0938",
        nameEn: "Janai Purnima / Raksha Bandhan",
        type: "government",
        ad: "2026-08-28"
      }
    ],
    "2083-05-13": [
      {
        name: "\u0917\u093E\u0908\u091C\u093E\u0924\u094D\u0930\u093E",
        nameEn: "Gai Jatra",
        type: "regional",
        ad: "2026-08-29"
      }
    ],
    "2083-05-19": [
      {
        name: "\u0936\u094D\u0930\u0940\u0915\u0943\u0937\u094D\u0923 \u091C\u0928\u094D\u092E\u093E\u0937\u094D\u091F\u092E\u0940 / \u0917\u094C\u0930\u093E \u092A\u0930\u094D\u0935",
        nameEn: "Krishna Janmashtami / Gaura Parva",
        type: "government",
        ad: "2026-09-04"
      }
    ],
    "2083-05-29": [
      {
        name: "\u0939\u0930\u093F\u0924\u093E\u0932\u093F\u0915\u093E \u0924\u0940\u091C / \u0930\u093E\u0937\u094D\u091F\u094D\u0930\u093F\u092F \u092C\u093E\u0932 \u0926\u093F\u0935\u0938",
        nameEn: "Haritalika Teej / National Children's Day",
        type: "restricted",
        ad: "2026-09-14"
      }
    ],
    "2083-06-03": [
      {
        name: "\u0938\u0902\u0935\u093F\u0927\u093E\u0928 \u0926\u093F\u0935\u0938 / \u0930\u093E\u0937\u094D\u091F\u094D\u0930\u093F\u092F \u0926\u093F\u0935\u0938",
        nameEn: "Constitution Day / National Day",
        type: "government",
        ad: "2026-09-19"
      }
    ],
    "2083-06-09": [
      {
        name: "\u0907\u0928\u094D\u0926\u094D\u0930\u091C\u093E\u0924\u094D\u0930\u093E",
        nameEn: "Indra Jatra",
        type: "regional",
        ad: "2026-09-25"
      }
    ],
    "2083-06-18": [
      {
        name: "\u091C\u093F\u0924\u093F\u092F\u093E \u092A\u0930\u094D\u0935",
        nameEn: "Jitiya Parva",
        type: "restricted",
        ad: "2026-10-04"
      }
    ],
    "2083-06-25": [
      {
        name: "\u0918\u091F\u0938\u094D\u0925\u093E\u092A\u0928\u093E / \u0928\u0935\u0930\u093E\u0924\u094D\u0930 \u0906\u0930\u092E\u094D\u092D",
        nameEn: "Ghatasthapana / Dashain Begins",
        type: "government",
        ad: "2026-10-11"
      }
    ],
    "2083-06-31": [
      {
        name: "\u092B\u0942\u0932\u092A\u093E\u0924\u0940 / \u0926\u0936\u0948\u0902 \u092C\u093F\u0926\u093E",
        nameEn: "Phulpati / Dashain Holiday",
        type: "government",
        ad: "2026-10-17"
      }
    ],
    "2083-07-01": [
      {
        name: "\u092E\u0939\u093E\u0905\u0937\u094D\u091F\u092E\u0940 / \u0915\u093E\u0932\u0930\u093E\u0924\u094D\u0930\u093F",
        nameEn: "Maha Ashtami",
        type: "government",
        ad: "2026-10-18"
      }
    ],
    "2083-07-02": [
      {
        name: "\u0926\u0936\u0948\u0902 \u092C\u093F\u0926\u093E",
        nameEn: "Dashain Holiday",
        type: "government",
        ad: "2026-10-19"
      }
    ],
    "2083-07-03": [
      {
        name: "\u092E\u0939\u093E\u0928\u0935\u092E\u0940",
        nameEn: "Maha Navami",
        type: "government",
        ad: "2026-10-20"
      }
    ],
    "2083-07-04": [
      {
        name: "\u0935\u093F\u091C\u092F\u093E \u0926\u0936\u092E\u0940 / \u0926\u0947\u0935\u0940 \u0935\u093F\u0938\u0930\u094D\u091C\u0928",
        nameEn: "Vijaya Dashami / Dashain",
        type: "government",
        ad: "2026-10-21"
      }
    ],
    "2083-07-05": [
      {
        name: "\u092A\u093E\u092A\u093E\u0902\u0915\u0941\u0936\u093E \u090F\u0915\u093E\u0926\u0936\u0940 \u0935\u094D\u0930\u0924",
        nameEn: "Papankusha Ekadashi",
        type: "festival",
        ad: "2026-10-22"
      }
    ],
    "2083-07-06": [
      {
        name: "\u0926\u0936\u0948\u0902 \u092C\u093F\u0926\u093E",
        nameEn: "Dashain Holiday",
        type: "government",
        ad: "2026-10-23"
      }
    ],
    "2083-07-22": [
      {
        name: "\u0932\u0915\u094D\u0937\u094D\u092E\u0940 \u092A\u0942\u091C\u093E / \u0915\u0941\u0915\u0941\u0930 \u0924\u093F\u0939\u093E\u0930 / \u0928\u0930\u0915 \u091A\u0924\u0941\u0930\u094D\u0926\u0936\u0940",
        nameEn: "Laxmi Puja / Kukur Tihar",
        type: "government",
        ad: "2026-11-08"
      }
    ],
    "2083-07-23": [
      {
        name: "\u0924\u093F\u0939\u093E\u0930 \u092C\u093F\u0926\u093E / \u0917\u093E\u0908 \u092A\u0942\u091C\u093E",
        nameEn: "Tihar Holiday / Gai Puja",
        type: "government",
        ad: "2026-11-09"
      }
    ],
    "2083-07-24": [
      {
        name: "\u0928\u0947\u092A\u093E\u0932 \u0938\u0902\u0935\u0924\u094D \u0967\u0967\u096A\u096D / \u0917\u094B\u0935\u0930\u094D\u0927\u0928 \u092A\u0942\u091C\u093E / \u092E\u094D\u0939 \u092A\u0942\u091C\u093E",
        nameEn: "Nepal Sambat New Year / Govardhan Puja / Mha Puja",
        type: "government",
        ad: "2026-11-10"
      }
    ],
    "2083-07-25": [
      {
        name: "\u092D\u093E\u0907\u091F\u0940\u0915\u093E / \u092E\u0939\u093E\u0917\u0941\u0930\u0941 \u092B\u093E\u0932\u094D\u0917\u0941\u0928\u0928\u094D\u0926 \u091C\u092F\u0928\u094D\u0924\u0940",
        nameEn: "Bhai Tika / Mahaguru Falgunanda Jayanti",
        type: "government",
        ad: "2026-11-11"
      }
    ],
    "2083-07-26": [
      {
        name: "\u0924\u093F\u0939\u093E\u0930 \u092C\u093F\u0926\u093E",
        nameEn: "Tihar Holiday",
        type: "government",
        ad: "2026-11-12"
      }
    ],
    "2083-07-29": [
      {
        name: "\u091B\u0920 \u092A\u0930\u094D\u0935",
        nameEn: "Chhath Parva",
        type: "government",
        ad: "2026-11-15"
      }
    ],
    "2083-08-08": [
      {
        name: "\u0917\u0941\u0930\u0941 \u0928\u093E\u0928\u0915 \u091C\u092F\u0928\u094D\u0924\u0940 / \u0938\u0915\u093F\u092E\u0928\u093E \u092A\u0941\u0928\u094D\u0939\u093F",
        nameEn: "Guru Nanak Jayanti",
        type: "restricted",
        ad: "2026-11-24"
      }
    ],
    "2083-08-17": [
      {
        name: "\u0905\u0928\u094D\u0924\u0930\u094D\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u093F\u092F \u0905\u092A\u093E\u0919\u094D\u0917 \u0926\u093F\u0935\u0938",
        nameEn: "International Day of Persons with Disabilities",
        type: "restricted",
        ad: "2026-12-03"
      }
    ],
    "2083-09-09": [
      {
        name: "\u0909\u0927\u094C\u0932\u0940 \u092A\u0930\u094D\u0935 / \u0927\u093E\u0928\u094D\u092F \u092A\u0942\u0930\u094D\u0923\u093F\u092E\u093E / \u092F\u094B\u092E\u0930\u0940 \u092A\u0941\u0928\u094D\u0939\u093F / \u091C\u094D\u092F\u093E\u092A\u0941 \u0926\u093F\u0935\u0938",
        nameEn: "Udhauli / Yomari Punhi / Dhanya Purnima / Jyapu Day",
        type: "government",
        ad: "2026-12-24"
      }
    ],
    "2083-09-10": [
      {
        name: "\u0915\u094D\u0930\u093F\u0938\u092E\u0938 \u0921\u0947",
        nameEn: "Christmas Day",
        type: "government",
        ad: "2026-12-25"
      }
    ],
    "2083-09-15": [
      {
        name: "\u0924\u092E\u0941 \u0932\u094D\u0939\u094B\u0938\u093E\u0930 / \u0915\u0935\u093F \u0936\u093F\u0930\u094B\u092E\u0923\u093F \u0932\u0947\u0916\u0928\u093E\u0925 \u091C\u092F\u0928\u094D\u0924\u0940",
        nameEn: "Tamu Lhosar",
        type: "government",
        ad: "2026-12-30"
      }
    ],
    "2083-09-27": [
      {
        name: "\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u093F\u092F \u090F\u0915\u0924\u093E \u0926\u093F\u0935\u0938 / \u092A\u0943\u0925\u094D\u0935\u0940 \u091C\u092F\u0928\u094D\u0924\u0940",
        nameEn: "National Unity Day / Prithvi Jayanti",
        type: "government",
        ad: "2027-01-11"
      }
    ],
    "2083-10-01": [
      {
        name: "\u092E\u093E\u0918\u0947 \u0938\u0902\u0915\u094D\u0930\u093E\u0928\u094D\u0924\u093F / \u092E\u0915\u0930 \u0938\u0902\u0915\u094D\u0930\u093E\u0928\u094D\u0924\u093F",
        nameEn: "Maghe Sankranti / Maghi Parva",
        type: "government",
        ad: "2027-01-15"
      }
    ],
    "2083-10-16": [
      {
        name: "\u0936\u0939\u0940\u0926 \u0926\u093F\u0935\u0938",
        nameEn: "Martyrs' Day",
        type: "government",
        ad: "2027-01-30"
      }
    ],
    "2083-10-24": [
      {
        name: "\u0938\u094B\u0928\u093E\u092E \u0932\u094D\u0939\u094B\u091B\u093E\u0930",
        nameEn: "Sonam Lhosar",
        type: "government",
        ad: "2027-02-07"
      }
    ],
    "2083-10-28": [
      {
        name: "\u0935\u0938\u0928\u094D\u0924\u092A\u091E\u094D\u091A\u092E\u0940 / \u0938\u0930\u0938\u094D\u0935\u0924\u0940 \u092A\u0942\u091C\u093E",
        nameEn: "Vasant Panchami / Saraswati Puja",
        type: "festival",
        ad: "2027-02-11"
      }
    ],
    "2083-11-07": [
      {
        name: "\u092A\u094D\u0930\u091C\u093E\u0924\u0928\u094D\u0924\u094D\u0930 \u0926\u093F\u0935\u0938 / \u0928\u093F\u0930\u094D\u0935\u093E\u091A\u0928 \u0926\u093F\u0935\u0938",
        nameEn: "National Democracy Day / Election Day",
        type: "government",
        ad: "2027-02-19"
      }
    ],
    "2083-11-22": [
      {
        name: "\u092E\u0939\u093E\u0936\u093F\u0935\u0930\u093E\u0924\u094D\u0930\u093F / \u0928\u0947\u092A\u093E\u0932\u0940 \u0938\u0947\u0928\u093E \u0926\u093F\u0935\u0938",
        nameEn: "Maha Shivaratri / Nepali Army Day",
        type: "government",
        ad: "2027-03-06"
      }
    ],
    "2083-11-24": [
      {
        name: "\u0905\u0928\u094D\u0924\u0930\u094D\u0930\u093E\u0937\u094D\u091F\u094D\u0930\u093F\u092F \u0928\u093E\u0930\u0940 \u0926\u093F\u0935\u0938",
        nameEn: "International Women's Day",
        type: "restricted",
        ad: "2027-03-08"
      }
    ],
    "2083-11-25": [
      {
        name: "\u0917\u094D\u092F\u093E\u0932\u094D\u092A\u094B \u0932\u094D\u0939\u094B\u0938\u093E\u0930",
        nameEn: "Gyalpo Lhosar",
        type: "government",
        ad: "2027-03-09"
      }
    ],
    "2083-12-07": [
      {
        name: "\u092B\u093E\u0917\u0941 \u092A\u0942\u0930\u094D\u0923\u093F\u092E\u093E (\u092A\u0939\u093E\u0921\u0940 \u091C\u093F\u0932\u094D\u0932\u093E)",
        nameEn: "Fagu Purnima / Holi (Hills and Mountains)",
        type: "regional",
        ad: "2027-03-21"
      }
    ],
    "2083-12-08": [
      {
        name: "\u092B\u093E\u0917\u0941 \u092A\u0942\u0930\u094D\u0923\u093F\u092E\u093E (\u0924\u0930\u093E\u0908)",
        nameEn: "Fagu Purnima / Holi (Terai)",
        type: "regional",
        ad: "2027-03-22"
      }
    ],
    "2083-12-23": [
      {
        name: "\u0918\u094B\u0921\u0947\u091C\u093E\u0924\u094D\u0930\u093E",
        nameEn: "Ghode Jatra (Kathmandu Valley)",
        type: "regional",
        ad: "2027-04-06"
      }
    ]
  };

  // script.js
  var MIN_BS_YEAR = 1975;
  var MAX_BS_YEAR = 2100;
  var MONTHS = [
    { np: "\u092C\u0948\u0936\u093E\u0916", en: "Baisakh" },
    { np: "\u091C\u0947\u0920", en: "Jestha" },
    { np: "\u0905\u0938\u093E\u0930", en: "Asar" },
    { np: "\u0936\u094D\u0930\u093E\u0935\u0923", en: "Shrawan" },
    { np: "\u092D\u0926\u094C", en: "Bhadra" },
    { np: "\u0906\u0936\u094D\u0935\u093F\u0928", en: "Ashwin" },
    { np: "\u0915\u093E\u0930\u094D\u0924\u093F\u0915", en: "Kartik" },
    { np: "\u092E\u0902\u0938\u093F\u0930", en: "Mangsir" },
    { np: "\u092A\u094C\u0937", en: "Poush" },
    { np: "\u092E\u093E\u0918", en: "Magh" },
    { np: "\u092B\u093E\u0932\u094D\u0917\u0941\u0923", en: "Falgun" },
    { np: "\u091A\u0948\u0924\u094D\u0930", en: "Chaitra" }
  ];
  var WEEKDAYS = [
    "\u0906\u0907\u0924",
    "\u0938\u094B\u092E",
    "\u092E\u0902\u0917\u0932",
    "\u092C\u0941\u0927",
    "\u092C\u093F\u0939\u093F",
    "\u0936\u0941\u0915\u094D\u0930",
    "\u0936\u0928\u093F"
  ];
  var DEVANAGARI = [
    "\u0966",
    "\u0967",
    "\u0968",
    "\u0969",
    "\u096A",
    "\u096B",
    "\u096C",
    "\u096D",
    "\u096E",
    "\u096F"
  ];
  var currentYear = 2083;
  var currentMonth = 5;
  var selectedDay = null;
  var festivals = festivals_default || {};
  var holidays = holidays_default || {};
  function nepaliNumber(number) {
    return String(number).split("").map((digit) => DEVANAGARI[Number(digit)] ?? digit).join("");
  }
  function formatBsDate(year, month, day) {
    return `${nepaliNumber(day)} ${MONTHS[month - 1].np} ${nepaliNumber(year)}`;
  }
  function bsDateToAd(year, month, day) {
    return dateFromBs({
      year,
      month,
      day
    });
  }
  function adDateToBs(year, month, day) {
    return bsFromDate({
      year,
      month,
      day
    });
  }
  function getEvents(year, month, day) {
    const key = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return [
      ...festivals[key] || [],
      ...holidays[key] || []
    ];
  }
  function moonPhase(date) {
    const knownNewMoon = Date.UTC(
      2e3,
      0,
      6,
      18,
      14
    );
    const lunarCycle = 29.530588853;
    const days = (date.getTime() - knownNewMoon) / 864e5;
    const age = (days % lunarCycle + lunarCycle) % lunarCycle;
    if (age < 1.85) {
      return {
        icon: "\u{1F311}",
        name: "New Moon",
        np: "\u0914\u0902\u0938\u0940"
      };
    }
    if (age < 7.38) {
      return {
        icon: "\u{1F312}",
        name: "Waxing Crescent",
        np: "\u0936\u0941\u0915\u094D\u0932 \u092A\u0915\u094D\u0937"
      };
    }
    if (age < 9.23) {
      return {
        icon: "\u{1F313}",
        name: "First Quarter",
        np: "\u0905\u0930\u094D\u0927\u091A\u0928\u094D\u0926\u094D\u0930"
      };
    }
    if (age < 14.77) {
      return {
        icon: "\u{1F314}",
        name: "Waxing Gibbous",
        np: "\u092A\u0942\u0930\u094D\u0923\u093F\u092E\u093E \u0928\u091C\u093F\u0915"
      };
    }
    if (age < 16.62) {
      return {
        icon: "\u{1F315}",
        name: "Full Moon",
        np: "\u092A\u0942\u0930\u094D\u0923\u093F\u092E\u093E"
      };
    }
    if (age < 22.15) {
      return {
        icon: "\u{1F316}",
        name: "Waning Gibbous",
        np: "\u0915\u0943\u0937\u094D\u0923 \u092A\u0915\u094D\u0937"
      };
    }
    if (age < 23.99) {
      return {
        icon: "\u{1F317}",
        name: "Last Quarter",
        np: "\u0905\u0930\u094D\u0927\u091A\u0928\u094D\u0926\u094D\u0930"
      };
    }
    return {
      icon: "\u{1F318}",
      name: "Waning Crescent",
      np: "\u0914\u0902\u0938\u0940 \u0928\u091C\u093F\u0915"
    };
  }
  function getMonthLength(year, month) {
    let day = 1;
    while (true) {
      try {
        dateFromBs({
          year,
          month,
          day
        });
        day++;
      } catch {
        return day - 1;
      }
    }
  }
  function getFirstWeekday(year, month) {
    const ad = bsDateToAd(
      year,
      month,
      1
    );
    return ad.weekday.index;
  }
  function renderYearSelect() {
    const select = document.getElementById("yearSelect");
    if (!select) return;
    select.innerHTML = "";
    for (let year = MIN_BS_YEAR; year <= MAX_BS_YEAR; year++) {
      const option = document.createElement("option");
      option.value = year;
      option.textContent = `${nepaliNumber(year)} BS (${year})`;
      if (year === currentYear) {
        option.selected = true;
      }
      select.appendChild(option);
    }
  }
  function renderMonthSelect() {
    const select = document.getElementById("monthSelect");
    if (!select) return;
    select.innerHTML = "";
    MONTHS.forEach(
      (month, index) => {
        const option = document.createElement("option");
        option.value = index + 1;
        option.textContent = `${month.np} (${month.en})`;
        if (index + 1 === currentMonth) {
          option.selected = true;
        }
        select.appendChild(option);
      }
    );
  }
  function renderConverterMonths() {
    const select = document.getElementById("bsMonth");
    if (!select) return;
    select.innerHTML = "";
    MONTHS.forEach(
      (month, index) => {
        const option = document.createElement("option");
        option.value = index + 1;
        option.textContent = `${month.np} (${month.en})`;
        select.appendChild(option);
      }
    );
    select.value = currentMonth;
  }
  function renderWeekdays() {
    const container = document.getElementById("weekdays");
    if (!container) return;
    container.innerHTML = WEEKDAYS.map((day) => `<div>${day}</div>`).join("");
  }
  function isToday(year, month, day) {
    const now = /* @__PURE__ */ new Date();
    try {
      const bs = adDateToBs(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate()
      );
      return bs.year === year && bs.month === month && bs.day === day;
    } catch {
      return false;
    }
  }
  function renderCalendar() {
    const grid = document.getElementById("calendarGrid");
    if (!grid) return;
    grid.innerHTML = "";
    let firstWeekday;
    try {
      firstWeekday = getFirstWeekday(
        currentYear,
        currentMonth
      );
    } catch (error) {
      grid.innerHTML = `<p>Calendar data unavailable.</p>`;
      console.error(error);
      return;
    }
    const days = getMonthLength(
      currentYear,
      currentMonth
    );
    for (let i = 0; i < firstWeekday; i++) {
      const blank = document.createElement("div");
      blank.className = "calendar-day empty";
      grid.appendChild(blank);
    }
    for (let day = 1; day <= days; day++) {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "calendar-day";
      const events = getEvents(
        currentYear,
        currentMonth,
        day
      );
      if (isToday(
        currentYear,
        currentMonth,
        day
      )) {
        button.classList.add("today");
      }
      if (selectedDay === day) {
        button.classList.add("selected");
      }
      if (events.some(
        (event) => event.type === "holiday"
      )) {
        button.classList.add("holiday");
      }
      if (events.some(
        (event) => event.type === "festival"
      )) {
        button.classList.add("festival");
      }
      const ad = bsDateToAd(
        currentYear,
        currentMonth,
        day
      );
      if (ad.weekday.index === 6) {
        button.classList.add("saturday");
      }
      button.innerHTML = `
      <span class="bs-day">
        ${nepaliNumber(day)}
      </span>

      <small>
        ${ad.day}
      </small>

      ${events.length ? `<i>\u25CF</i>` : ""}
    `;
      button.addEventListener(
        "click",
        () => {
          selectedDay = day;
          renderCalendar();
          showSelectedDate();
        }
      );
      grid.appendChild(button);
    }
    const monthNepali = document.getElementById(
      "monthNepali"
    );
    if (monthNepali) {
      monthNepali.textContent = MONTHS[currentMonth - 1].np;
    }
    const monthEnglish = document.getElementById(
      "monthEnglish"
    );
    if (monthEnglish) {
      monthEnglish.textContent = MONTHS[currentMonth - 1].en;
    }
    const yearBadge = document.getElementById(
      "yearBadge"
    );
    if (yearBadge) {
      yearBadge.textContent = `${nepaliNumber(currentYear)} BS`;
    }
    const calendarTitle = document.getElementById(
      "calendarTitle"
    );
    if (calendarTitle) {
      calendarTitle.textContent = `Nepali Calendar ${nepaliNumber(currentYear)}`;
    }
    const calendarSubtitle = document.getElementById(
      "calendarSubtitle"
    );
    if (calendarSubtitle) {
      calendarSubtitle.textContent = `${MONTHS[currentMonth - 1].en} / ${MONTHS[currentMonth - 1].np} ${currentYear}`;
    }
  }
  function showSelectedDate() {
    if (!selectedDay) {
      return;
    }
    const ad = bsDateToAd(
      currentYear,
      currentMonth,
      selectedDay
    );
    const events = getEvents(
      currentYear,
      currentMonth,
      selectedDay
    );
    const moon = moonPhase(
      new Date(
        Date.UTC(
          ad.year,
          ad.month - 1,
          ad.day
        )
      )
    );
    const selectedTitle = document.getElementById(
      "selectedTitle"
    );
    if (selectedTitle) {
      selectedTitle.textContent = formatBsDate(
        currentYear,
        currentMonth,
        selectedDay
      );
    }
    const selectedAd = document.getElementById(
      "selectedAd"
    );
    if (selectedAd) {
      selectedAd.textContent = `${ad.day}/${ad.month}/${ad.year} AD \u2022 ${ad.weekday.name}`;
    }
    const selectedEvents = document.getElementById(
      "selectedEvents"
    );
    if (selectedEvents) {
      selectedEvents.innerHTML = events.length ? events.map(
        (event) => `
                <div class="event-item">
                  <strong>
                    ${event.name}
                  </strong>

                  ${event.nameEn ? `<small>${event.nameEn}</small>` : ""}
                </div>
              `
      ).join("") : `<p>No festival or holiday listed.</p>`;
    }
    const selectedMoonIcon = document.getElementById(
      "selectedMoonIcon"
    );
    if (selectedMoonIcon) {
      selectedMoonIcon.textContent = moon.icon;
    }
    const selectedMoon = document.getElementById(
      "selectedMoon"
    );
    if (selectedMoon) {
      selectedMoon.textContent = moon.name;
    }
    const selectedMoonAge = document.getElementById(
      "selectedMoonAge"
    );
    if (selectedMoonAge) {
      selectedMoonAge.textContent = moon.np;
    }
  }
  function updateToday() {
    try {
      const bs = todayBs({
        timezone: "Asia/Kathmandu"
      });
      const now = /* @__PURE__ */ new Date();
      const todayNepali = document.getElementById(
        "todayNepali"
      );
      if (todayNepali) {
        todayNepali.textContent = formatBsDate(
          bs.year,
          bs.month,
          bs.day
        );
      }
      const todayEnglish = document.getElementById(
        "todayEnglish"
      );
      if (todayEnglish) {
        todayEnglish.textContent = now.toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric"
          }
        );
      }
      const todayWeekday = document.getElementById(
        "todayWeekday"
      );
      if (todayWeekday) {
        todayWeekday.textContent = bs.weekday.name;
      }
      const todayMoon = document.getElementById(
        "todayMoon"
      );
      if (todayMoon) {
        todayMoon.textContent = moonPhase(now).name;
      }
    } catch (error) {
      console.error(
        "Today's date error:",
        error
      );
    }
  }
  function setupNavigation() {
    const prevMonth = document.getElementById(
      "prevMonth"
    );
    if (prevMonth) {
      prevMonth.addEventListener(
        "click",
        () => {
          currentMonth--;
          if (currentMonth < 1) {
            currentMonth = 12;
            currentYear--;
          }
          currentYear = Math.max(
            MIN_BS_YEAR,
            currentYear
          );
          selectedDay = null;
          renderCalendar();
        }
      );
    }
    const nextMonth = document.getElementById(
      "nextMonth"
    );
    if (nextMonth) {
      nextMonth.addEventListener(
        "click",
        () => {
          currentMonth++;
          if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
          }
          currentYear = Math.min(
            MAX_BS_YEAR,
            currentYear
          );
          selectedDay = null;
          renderCalendar();
        }
      );
    }
    const prevYear = document.getElementById(
      "prevYear"
    );
    if (prevYear) {
      prevYear.addEventListener(
        "click",
        () => {
          currentYear = Math.max(
            MIN_BS_YEAR,
            currentYear - 1
          );
          selectedDay = null;
          renderCalendar();
        }
      );
    }
    const nextYear = document.getElementById(
      "nextYear"
    );
    if (nextYear) {
      nextYear.addEventListener(
        "click",
        () => {
          currentYear = Math.min(
            MAX_BS_YEAR,
            currentYear + 1
          );
          selectedDay = null;
          renderCalendar();
        }
      );
    }
    const goToday = document.getElementById(
      "goToday"
    );
    if (goToday) {
      goToday.addEventListener(
        "click",
        () => {
          try {
            const bs = todayBs({
              timezone: "Asia/Kathmandu"
            });
            currentYear = bs.year;
            currentMonth = bs.month;
            selectedDay = bs.day;
            renderCalendar();
            showSelectedDate();
          } catch (error) {
            console.error(error);
          }
        }
      );
    }
    const yearSelect = document.getElementById(
      "yearSelect"
    );
    if (yearSelect) {
      yearSelect.addEventListener(
        "change",
        (event) => {
          currentYear = Number(
            event.target.value
          );
          selectedDay = null;
          renderCalendar();
        }
      );
    }
    const monthSelect = document.getElementById(
      "monthSelect"
    );
    if (monthSelect) {
      monthSelect.addEventListener(
        "change",
        (event) => {
          currentMonth = Number(
            event.target.value
          );
          selectedDay = null;
          renderCalendar();
        }
      );
    }
  }
  function setupConverter() {
    const form = document.getElementById(
      "converterForm"
    );
    if (!form) return;
    form.addEventListener(
      "submit",
      (event) => {
        event.preventDefault();
        const result = document.getElementById(
          "converterResult"
        );
        if (!result) return;
        const activeTab = document.querySelector(
          ".tab.active"
        );
        if (!activeTab) return;
        const mode = activeTab.dataset.mode;
        try {
          if (mode === "bs") {
            const year = Number(
              document.getElementById(
                "bsYear"
              ).value
            );
            const month = Number(
              document.getElementById(
                "bsMonth"
              ).value
            );
            const day = Number(
              document.getElementById(
                "bsDay"
              ).value
            );
            const ad = bsDateToAd(
              year,
              month,
              day
            );
            result.innerHTML = `
            <strong>
              ${formatBsDate(
              year,
              month,
              day
            )}
            </strong>

            \u2192

            <strong>
              ${ad.day}
              ${new Date(
              Date.UTC(
                2e3,
                ad.month - 1,
                1
              )
            ).toLocaleString(
              "en-US",
              {
                month: "long",
                timeZone: "UTC"
              }
            )}
              ${ad.year} AD
            </strong>
          `;
          } else {
            const year = Number(
              document.getElementById(
                "adYear"
              ).value
            );
            const month = Number(
              document.getElementById(
                "adMonth"
              ).value
            );
            const day = Number(
              document.getElementById(
                "adDay"
              ).value
            );
            const bs = adDateToBs(
              year,
              month,
              day
            );
            result.innerHTML = `
            <strong>
              ${day}/${month}/${year} AD
            </strong>

            \u2192

            <strong>
              ${formatBsDate(
              bs.year,
              bs.month,
              bs.day
            )}
            </strong>
          `;
          }
        } catch (error) {
          result.textContent = error.message || "Invalid date.";
        }
      }
    );
  }
  function setupTabs() {
    document.querySelectorAll(".tab").forEach(
      (tab) => {
        tab.addEventListener(
          "click",
          () => {
            document.querySelectorAll(".tab").forEach(
              (button) => button.classList.remove(
                "active"
              )
            );
            tab.classList.add(
              "active"
            );
            const mode = tab.dataset.mode;
            const bsFields = document.getElementById(
              "bsFields"
            );
            if (bsFields) {
              bsFields.classList.toggle(
                "hidden",
                mode !== "bs"
              );
            }
            const adFields = document.getElementById(
              "adFields"
            );
            if (adFields) {
              adFields.classList.toggle(
                "hidden",
                mode !== "ad"
              );
            }
          }
        );
      }
    );
  }
  async function loadEvents() {
    festivals = festivals_default || {};
    holidays = holidays_default || {};
  }
  function eventMonthGroups(source, query, typeFilter = "all") {
    const normalizedQuery = String(query || "").trim().toLowerCase();
    const all = Object.entries(source || {}).flatMap(([date, items]) => {
      if (!Array.isArray(items)) return [];
      return items.map((item) => {
        const [year, month, day] = date.split("-").map(Number);
        const monthData = MONTHS[month - 1];
        return {
          date,
          year,
          month,
          day,
          ...item,
          monthData,
          dateText: monthData ? `${nepaliNumber(day)} ${monthData.np} ${nepaliNumber(year)}` : date
        };
      });
    });
    return all.filter((item) => {
      const matchesType = typeFilter === "all" || item.type === typeFilter;
      const searchText = [
        item.name,
        item.nameEn,
        item.date,
        item.dateText,
        item.monthData?.np,
        item.monthData?.en,
        item.ad,
        item.type
      ].filter(Boolean).join(" ").toLowerCase();
      return matchesType && searchText.includes(normalizedQuery);
    }).sort((a, b) => a.date.localeCompare(b.date));
  }
  function groupEventsByMonth(items) {
    return MONTHS.map((monthData, index) => ({
      month: index + 1,
      ...monthData,
      items: items.filter((item) => item.month === index + 1)
    })).filter((group) => group.items.length);
  }
  function renderEventDate(item, variant = "festival") {
    const monthName = item.monthData?.np || "";
    const yearText = nepaliNumber(item.year);
    const dayText = nepaliNumber(item.day);
    const adText = item.ad ? `AD ${item.ad}` : "BS \u0968\u0966\u096E\u0969";
    return `
    <div class="event-date event-date-${variant}" aria-label="${item.dateText}">
      <div class="event-date-day">${dayText}</div>
      <div class="event-date-info">
        <span class="event-date-month">${monthName}</span>
        <span class="event-date-year">${yearText} BS</span>
      </div>
      <span class="event-date-ad">${adText}</span>
    </div>
  `;
  }
  function renderFestivalCard(item) {
    return `
    <article class="festival-card" data-type="festival">
      <div class="festival-card-top">
        ${renderEventDate(item, "festival")}
      </div>

      <div class="festival-content">
        <span class="festival-type"><span class="event-type-dot"></span>Festival</span>
        <h3>${item.name || ""}</h3>
        ${item.nameEn ? `<p>${item.nameEn}</p>` : ""}
      </div>
    </article>
  `;
  }
  function renderHolidayCard(item) {
    const typeLabel = {
      government: "Government / Public Holiday",
      regional: "Regional / Valley Holiday",
      restricted: "Community / Eligible Group",
      festival: "Festival Observance"
    }[item.type] || "Holiday";
    return `
    <article
      class="holiday-card"
      data-type="${item.type || "government"}"
    >
      <div class="holiday-card-top">
        ${renderEventDate(item, "holiday")}
      </div>

      <span class="holiday-type"><span class="event-type-dot"></span>${typeLabel}</span>

      <h3>${item.name || ""}</h3>

      ${item.nameEn ? `<p>${item.nameEn}</p>` : ""}

      ${item.ad ? `<small class="holiday-ad">AD: ${item.ad}</small>` : ""}
    </article>
  `;
  }
  function renderMonthWiseGroups(groups, cardRenderer, emptyMessage) {
    if (!groups.length) {
      return {
        html: "",
        empty: emptyMessage
      };
    }
    return {
      html: groups.map((group) => `
        <section class="event-month-card" data-month="${group.month}">
          <div class="event-month-header">
            <div>
              <span class="event-month-number">
                ${nepaliNumber(group.month)}
              </span>
              <div>
                <h3>${group.np}</h3>
                <p>${group.en}</p>
              </div>
            </div>
            <span class="event-month-count">
              ${nepaliNumber(group.items.length)} \u0915\u093E\u0930\u094D\u092F\u0915\u094D\u0930\u092E
            </span>
          </div>

          <div class="event-month-grid">
            ${group.items.map(cardRenderer).join("")}
          </div>
        </section>
      `).join(""),
      empty: ""
    };
  }
  function renderEvents() {
    const container = document.getElementById("festivalList");
    const input = document.getElementById("festivalSearch");
    const empty = document.getElementById("festivalEmpty");
    if (!container) return;
    function render() {
      const filtered = eventMonthGroups(
        festivals,
        input ? input.value : ""
      );
      const groups = groupEventsByMonth(filtered);
      const result = renderMonthWiseGroups(
        groups,
        renderFestivalCard,
        "\u0915\u0941\u0928\u0948 \u091A\u093E\u0921\u092A\u0930\u094D\u0935 \u092D\u0947\u091F\u093F\u090F\u0928\u0964"
      );
      container.innerHTML = result.html;
      if (empty) {
        empty.hidden = Boolean(result.html);
      }
    }
    render();
    if (input) {
      input.addEventListener("input", render);
    }
  }
  function renderHolidays() {
    const container = document.getElementById("holidayList");
    const input = document.getElementById("holidaySearch");
    const filter = document.getElementById("holidayFilter");
    const empty = document.getElementById("holidayEmpty");
    if (!container) return;
    function render() {
      const filtered = eventMonthGroups(
        holidays,
        input ? input.value : "",
        filter ? filter.value : "all"
      );
      const groups = groupEventsByMonth(filtered);
      const result = renderMonthWiseGroups(
        groups,
        renderHolidayCard,
        "\u0915\u0941\u0928\u0948 \u092C\u093F\u0926\u093E \u092D\u0947\u091F\u093F\u090F\u0928\u0964"
      );
      container.innerHTML = result.html;
      if (empty) {
        empty.hidden = Boolean(result.html);
      }
    }
    render();
    if (input) {
      input.addEventListener("input", render);
    }
    if (filter) {
      filter.addEventListener("change", render);
    }
  }
  function setupTools() {
    const dateDiffTool = document.getElementById(
      "dateDiffTool"
    );
    if (!dateDiffTool) {
      return;
    }
    dateDiffTool.addEventListener(
      "click",
      () => {
        const start = prompt(
          "Start date YYYY-MM-DD"
        );
        const end = prompt(
          "End date YYYY-MM-DD"
        );
        if (!start || !end) {
          return;
        }
        const a = /* @__PURE__ */ new Date(
          `${start}T00:00:00`
        );
        const b = /* @__PURE__ */ new Date(
          `${end}T00:00:00`
        );
        if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) {
          alert(
            "Please enter valid dates."
          );
          return;
        }
        const days = Math.abs(
          b - a
        ) / 864e5;
        alert(
          `Difference: ${days} days`
        );
      }
    );
  }
  function setupAgeCalculator() {
    const ageTool = document.getElementById(
      "age-tool"
    );
    const dobInput = document.getElementById(
      "ageDob"
    );
    const calculateButton = document.getElementById(
      "calculateAge"
    );
    const result = document.getElementById(
      "ageResult"
    );
    const error = document.getElementById(
      "ageError"
    );
    const years = document.getElementById(
      "ageYears"
    );
    const months = document.getElementById(
      "ageMonths"
    );
    const days = document.getElementById(
      "ageDays"
    );
    const totalDays = document.getElementById(
      "ageTotalDays"
    );
    const birthday = document.getElementById(
      "ageBirthday"
    );
    if (!dobInput || !calculateButton || !result || !error || !years || !months || !days || !totalDays || !birthday) {
      return;
    }
    if (ageTool) {
      ageTool.addEventListener(
        "click",
        () => {
          document.getElementById(
            "age-calculator"
          )?.scrollIntoView({
            behavior: "smooth"
          });
        }
      );
    }
    calculateButton.addEventListener(
      "click",
      () => {
        error.textContent = "";
        result.classList.add(
          "hidden"
        );
        if (!dobInput.value) {
          error.textContent = "Please select your date of birth.";
          return;
        }
        const [
          year,
          month,
          day
        ] = dobInput.value.split("-").map(Number);
        const birthDate = new Date(
          year,
          month - 1,
          day
        );
        const today = /* @__PURE__ */ new Date();
        today.setHours(
          0,
          0,
          0,
          0
        );
        birthDate.setHours(
          0,
          0,
          0,
          0
        );
        if (birthDate.getFullYear() !== year || birthDate.getMonth() !== month - 1 || birthDate.getDate() !== day) {
          error.textContent = "Please enter a valid date.";
          return;
        }
        if (birthDate > today) {
          error.textContent = "Date of birth cannot be in the future.";
          return;
        }
        let ageYears = today.getFullYear() - birthDate.getFullYear();
        let ageMonths = today.getMonth() - birthDate.getMonth();
        let ageDays = today.getDate() - birthDate.getDate();
        if (ageDays < 0) {
          ageMonths--;
          const previousMonth = new Date(
            today.getFullYear(),
            today.getMonth(),
            0
          );
          ageDays += previousMonth.getDate();
        }
        if (ageMonths < 0) {
          ageYears--;
          ageMonths += 12;
        }
        const millisecondsPerDay = 1e3 * 60 * 60 * 24;
        const total = Math.floor(
          (today - birthDate) / millisecondsPerDay
        );
        years.textContent = ageYears;
        months.textContent = ageMonths;
        days.textContent = ageDays;
        totalDays.textContent = total.toLocaleString();
        let birthdayThisYear = new Date(
          today.getFullYear(),
          month - 1,
          day
        );
        if (month === 2 && day === 29 && birthdayThisYear.getMonth() !== 1) {
          birthdayThisYear = new Date(
            today.getFullYear(),
            1,
            28
          );
        }
        if (birthdayThisYear.getTime() === today.getTime()) {
          birthday.textContent = "\u{1F389} Happy Birthday!";
        } else {
          let nextBirthday = birthdayThisYear;
          if (nextBirthday < today) {
            nextBirthday = new Date(
              today.getFullYear() + 1,
              month - 1,
              day
            );
            if (month === 2 && day === 29 && nextBirthday.getMonth() !== 1) {
              nextBirthday = new Date(
                today.getFullYear() + 1,
                1,
                28
              );
            }
          }
          const daysUntil = Math.ceil(
            (nextBirthday - today) / millisecondsPerDay
          );
          birthday.textContent = `Your next birthday is in ${daysUntil} days.`;
        }
        result.classList.remove(
          "hidden"
        );
      }
    );
  }
  function setupMobileMenu() {
    const menuToggle = document.getElementById("menuToggle");
    const mainNav = document.getElementById("mainNav");
    if (!menuToggle || !mainNav) return;
    function closeMobileMenu() {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.textContent = "\u2630";
    }
    menuToggle.addEventListener("click", function(event) {
      event.stopPropagation();
      const isOpen = mainNav.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.textContent = isOpen ? "\u2715" : "\u2630";
    });
    mainNav.querySelectorAll("a").forEach(function(link) {
      link.addEventListener("click", function() {
        closeMobileMenu();
      });
    });
    document.addEventListener("click", function(event) {
      if (!mainNav.contains(event.target) && event.target !== menuToggle) {
        closeMobileMenu();
      }
    });
    window.addEventListener("resize", function() {
      if (window.innerWidth > 700) {
        closeMobileMenu();
      }
    });
  }
  function setupToolsDropdown() {
    const button = document.getElementById("toolsButton");
    const menu = document.getElementById("toolsMenu");
    const mainNav = document.getElementById("mainNav");
    const menuToggle = document.getElementById("menuToggle");
    if (!button || !menu) return;
    function closeTools() {
      menu.classList.remove("open");
      button.classList.remove("active");
      button.setAttribute("aria-expanded", "false");
    }
    button.addEventListener("click", function(event) {
      event.preventDefault();
      event.stopPropagation();
      const isOpen = menu.classList.toggle("open");
      button.classList.toggle("active", isOpen);
      button.setAttribute("aria-expanded", String(isOpen));
    });
    menu.addEventListener("click", function(event) {
      event.stopPropagation();
      const link = event.target.closest("a");
      if (!link) return;
      closeTools();
      if (mainNav) {
        mainNav.classList.remove("open");
      }
      if (menuToggle) {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "\u2630";
      }
    });
    document.addEventListener("click", function() {
      closeTools();
    });
    window.addEventListener("resize", function() {
      if (window.innerWidth > 700) {
        closeTools();
      }
    });
  }
  async function init() {
    await loadEvents();
    renderYearSelect();
    renderMonthSelect();
    renderConverterMonths();
    renderWeekdays();
    setupNavigation();
    setupConverter();
    setupTabs();
    renderEvents();
    renderHolidays();
    setupTools();
    setupToolsDropdown();
    setupMobileMenu();
    setupAgeCalculator();
    updateToday();
    renderCalendar();
    const footerYear = document.getElementById(
      "footerYear"
    );
    if (footerYear) {
      footerYear.textContent = (/* @__PURE__ */ new Date()).getFullYear();
    }
  }
  init();
  var romanInput = document.getElementById("roman");
  var unicodeOutput = document.getElementById("output");
  var unicodeSuggestions = document.getElementById("suggestions");
  var unicodeStatus = document.getElementById("status");
  if (romanInput && unicodeOutput && unicodeSuggestions && unicodeStatus) {
    let getLastWord = function(text) {
      const match = text.match(/(^|\s)([^\s]+)$/);
      return match ? match[2] : "";
    }, replaceLastWord = function(text, replacement) {
      return text.replace(
        /([^\s]+)$/,
        replacement
      );
    }, showUnicodeSuggestions = function(list) {
      unicodeSuggestions.innerHTML = "";
      activeSuggestion = -1;
      if (!list.length) {
        unicodeSuggestions.classList.remove(
          "show"
        );
        return;
      }
      list.forEach(function(item) {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "unicode-suggestion";
        button.textContent = item;
        button.addEventListener(
          "mousedown",
          function(event) {
            event.preventDefault();
            selectUnicodeSuggestion(item);
          }
        );
        unicodeSuggestions.appendChild(
          button
        );
      });
      unicodeSuggestions.classList.add(
        "show"
      );
    }, selectUnicodeSuggestion = function(value) {
      romanInput.value = replaceLastWord(
        romanInput.value,
        value
      );
      unicodeOutput.value = romanInput.value;
      unicodeSuggestions.classList.remove(
        "show"
      );
      unicodeStatus.textContent = "";
      romanInput.focus();
    };
    let unicodeTimer = null;
    let unicodeRequestNumber = 0;
    let activeSuggestion = -1;
    async function getUnicodeSuggestions(word) {
      if (!word) {
        unicodeSuggestions.classList.remove(
          "show"
        );
        return;
      }
      const currentRequest = ++unicodeRequestNumber;
      unicodeStatus.textContent = "Getting suggestions...";
      try {
        const url = "https://inputtools.google.com/request?text=" + encodeURIComponent(word) + "&itc=ne-t-i0-und&num=10&cp=0&cs=1&ie=utf-8&oe=utf-8";
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(
            "Request failed"
          );
        }
        const data = await response.json();
        if (currentRequest !== unicodeRequestNumber) {
          return;
        }
        let list = [];
        if (data && data[1] && data[1][0] && data[1][0][1]) {
          list = data[1][0][1];
        }
        showUnicodeSuggestions(list);
        unicodeStatus.textContent = list.length ? "Choose a suggestion or keep typing." : "";
      } catch (error) {
        unicodeSuggestions.classList.remove(
          "show"
        );
        unicodeStatus.textContent = "Suggestions unavailable. Check your internet connection.";
      }
    }
    romanInput.addEventListener(
      "input",
      function() {
        unicodeOutput.value = romanInput.value;
        clearTimeout(
          unicodeTimer
        );
        const word = getLastWord(
          romanInput.value
        );
        if (!word || /[\u0900-\u097F]/.test(word)) {
          unicodeSuggestions.classList.remove(
            "show"
          );
          return;
        }
        unicodeTimer = setTimeout(
          function() {
            getUnicodeSuggestions(
              word
            );
          },
          180
        );
      }
    );
    romanInput.addEventListener(
      "keydown",
      function(event) {
        const items = [
          ...unicodeSuggestions.querySelectorAll(
            ".unicode-suggestion"
          )
        ];
        if (!unicodeSuggestions.classList.contains(
          "show"
        ) || !items.length) {
          return;
        }
        if (event.key === "ArrowDown") {
          event.preventDefault();
          activeSuggestion = (activeSuggestion + 1) % items.length;
          items.forEach(
            function(item, index) {
              item.classList.toggle(
                "active",
                index === activeSuggestion
              );
            }
          );
        } else if (event.key === "ArrowUp") {
          event.preventDefault();
          activeSuggestion = (activeSuggestion - 1 + items.length) % items.length;
          items.forEach(
            function(item, index) {
              item.classList.toggle(
                "active",
                index === activeSuggestion
              );
            }
          );
        } else if (event.key === "Enter" && activeSuggestion >= 0) {
          event.preventDefault();
          selectUnicodeSuggestion(
            items[activeSuggestion].textContent
          );
        } else if (event.key === "Escape") {
          unicodeSuggestions.classList.remove(
            "show"
          );
        }
      }
    );
    document.addEventListener(
      "click",
      function(event) {
        if (!event.target.closest(
          ".unicode-editor"
        )) {
          unicodeSuggestions.classList.remove(
            "show"
          );
        }
      }
    );
    document.getElementById(
      "copy"
    ).addEventListener(
      "click",
      async function() {
        if (!unicodeOutput.value) {
          return;
        }
        try {
          await navigator.clipboard.writeText(
            unicodeOutput.value
          );
          unicodeStatus.textContent = "Copied to clipboard.";
        } catch (error) {
          unicodeOutput.select();
          document.execCommand(
            "copy"
          );
          unicodeStatus.textContent = "Copied to clipboard.";
        }
      }
    );
    document.getElementById(
      "clear"
    ).addEventListener(
      "click",
      function() {
        romanInput.value = "";
        unicodeOutput.value = "";
        unicodeSuggestions.classList.remove(
          "show"
        );
        unicodeStatus.textContent = "";
        romanInput.focus();
      }
    );
  }
})();
