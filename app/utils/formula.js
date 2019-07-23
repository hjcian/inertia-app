export const calcAssetIncrement = (amount, totalNetValue, targetRatio, capitalInput) => {
  const assetInc = targetRatio * (totalNetValue + capitalInput) - amount
  return assetInc
}

export const calcQuantity = (assetInc, currentPrice) => {
  const quantity = Math.floor(assetInc / currentPrice)
  return quantity
}
