import { ohlc } from './FinDataProviders/IEXCloud'

export const fetchLatestClosePrice = async (symbol, backend='iexcloud') => {
  if (backend === 'iexcloud') {
    const { closePrice, date } = await ohlc(symbol)        
    return { closePrice, date }
  } else {
    console.log('backend not found')
    return { closePrice: null, date: null }
  }
}