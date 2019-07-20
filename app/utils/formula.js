export const investAmount = (symbolNetValue, totalNetValue, targetRatio, assetIncrement) => {
    const investAmount = targetRatio * (totalNetValue + assetIncrement) - symbolNetValue
    return investAmount
}

export const conservativeShares = (investAmount, currentPrice) => {
    const conservativeShares = Math.floor(investAmount / currentPrice)
    return conservativeShares
}