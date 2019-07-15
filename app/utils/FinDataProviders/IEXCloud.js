import { stat } from "fs";

export const ohlc = async (symbol, host='https://sandbox.iexapis.com/', token='Tpk_ecd28d7fba8e494f9062d1f017741aac') => {
  let closePrice = -1
  let date = null    
  const url = `${host}stable/stock/${symbol}/ohlc?token=${token}`
  try {
    const resp = await fetch(url)
    const status = resp.status
    if (status === 200 ) {
      const body = await resp.json()
      closePrice = body.close.price
      date = new Date(body.close.time)
    } else {
      console.log(`iex cloud fetch error (${status})`)
    }
  } catch (error) {
    console.log(error)
  }
  return { closePrice, date }
}

