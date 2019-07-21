export const calcAssetIncrement = (amount, totalNetValue, targetRatio, capitalInput) => {
  const assetInc = targetRatio * (totalNetValue + capitalInput) - amount
  console.log(`${targetRatio} x (${totalNetValue} + ${capitalInput}) - ${amount} = ${assetInc}`)
  return assetInc
}

export const calcQuantity = (assetInc, currentPrice) => {
  const quantity = Math.floor(assetInc / currentPrice)
  return quantity
}
