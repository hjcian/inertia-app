import { ohlc } from './FinDataProviders/IEXCloud'


export const providerList = [
  { value: 'iexcloud-sandbox', label: 'IEX Cloud - Sandbox' },
  { value: 'iexcloud', label: 'IEX Cloud' },
  // { value: 'other', label: 'Other' },  
]

export const fetchLatestClosePrice = async (symbol, token, provider) => {
  if (provider === 'iexcloud') {
    const { closePrice, date } = await ohlc(symbol, 'https://cloud.iexapis.com/', token)        
    return { closePrice, date }
  } else if (provider === 'iexcloud-sandbox') {
    const { closePrice, date } = await ohlc(symbol, 'https://sandbox.iexapis.com/', token)        
    return { closePrice, date }
  } else {
    console.log('provider not found')
    return { closePrice: null, date: null }
  }
}