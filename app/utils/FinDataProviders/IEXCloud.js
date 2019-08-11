const apiBone = async (host, symbol, api, token) => {
  let bodyText = null
  const url = `${host}stable/stock/${symbol}/${api}?token=${token}`
  try {
    const resp = await fetch(url)
    const status = resp.status
    if (status === 200) {
      bodyText = await resp.json()
    } else {
      console.log(`iex cloud fetch error (${status})`)
    }
  } catch (error) {
    console.log(error)
  }
  return bodyText
}

export const ohlc = async (symbol, host, token) => {
  // available only pricing member
  let closePrice = -1
  let date = null
  const bodyText = await apiBone(host, symbol, 'ohlc', token)
  if (bodyText) {
    closePrice = bodyText.close.price
    date = new Date(bodyText.close.time)
  }
  return { closePrice, date }
}

export const previous = async (symbol, host, token) => {
  // Response Attributes
  // {
  //     "date": "2019-07-19",
  //     "open": 76.16,
  //     "close": 75.71,
  //     "high": 76.21,
  //     "low": 75.67,
  //     "volume": 1258504,
  //     "uOpen": 76.16,
  //     "uClose": 75.71,
  //     "uHigh": 76.21,
  //     "uLow": 75.67,
  //     "uVolume": 1258504,
  //     "change": -0.30000000000001137,
  //     "changePercent": -0.39,
  //     "changeOverTime": 0,
  //     "symbol": "VT"
  // }
  let closePrice = -1
  let date = null
  const bodyText = await apiBone(host, symbol, 'previous', token)
  if (bodyText) {
    closePrice = bodyText.close
    date = bodyText.date
  }
  return { closePrice, date }
}
