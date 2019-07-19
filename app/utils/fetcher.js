import { ohlc } from './FinDataProviders/IEXCloud'


export const providerList = [
  { key: 'K-IEX Cloud-Sandbox', value: 'iexcloud-sandbox', text: 'IEX Cloud - Sandbox' },
  { key: 'K-IEX Cloud',value: 'iexcloud', text: 'IEX Cloud' },
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