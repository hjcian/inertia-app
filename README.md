# InertIA
### An inert investment assistant for index fund investors

# User Guide
## Downloads
> Windows Release - *(coming soon)*

> Linux Release - *(coming soon)*

> Mac OSX Release - *(coming soon)*

## Features
- **IMPORT** transaction from Firstrade or well-defined CSV file then get your portfolio overview
- **CALCULATE** annualized returns for your portfolio and each part of allocation
- **REBALANCING** your portfolio and get the buying/selling recommendations

## Screenshots
*(coming soon)*
### View it in action
*(coming soon)*

## How to...
### Report Bugs 
*(coming soon)*
### Enhancement Suggestions
*(coming soon)*

## Built With
- [Electron React Boilerplate](https://electron-react-boilerplate.js.org/)
- [Semantic UI React](https://react.semantic-ui.com/)
- [Node.js](https://nodejs.org/en/)

# Developer Guide
## Install
```bash
git clone https://github.com/hjcian/inertia-app.git  you-repo
cd  you-repo
yarn
```
## Starting Development
```bash
yarn dev
```
## Packaging for Production
```bash
yarn package
```

# LICENSE
*(coming soon)*

# Development notes
## Features
1. 再平衡工具
    - 給真資料測試
    - 資料格式統一
1. 記憶前次設定(需要儲存資料到local fodler)

## Bug
1. 再平衡工具
    - toggole off 後 leftover 沒有有正常變，算式正確，但不應該出現value overflow

## Improvements
1. 將 portfolio pie chart 與 import 頁面合併
1. 調整年化投報率長條圖的顏色(+綠-紅)與上Y軸座標軸標籤

## Error handling
1. 再平衡時即時計算是否total > 100%，在適當的位置放 error message 
1. 匯入失敗時(格式不預期)彈訊息
1. 再次匯入檔案時詢問是否覆蓋既有資料
1. 遠端取得資料失敗，檢查網路連線、換個後端、手動輸入

# Contributors
- ***Leo Lee***

