# InertIA
> An inert investment assistant for index fund investors


# TODO
## Features
1. 再平衡工具
    - 給真資料測試
    資料格式統一
1. 記憶前次各種設定(需要儲存資料到local fodler)

## Bug
1. 再平衡工具
    - toggole off 後 leftover 沒有有正常變，算式正確，但不應該出現value overflow

## Improvements
1. date picker for calculate returns
1. 將 portfolio pie chart 與 import 頁面合併
1. 調整年化投報率長條圖的顏色(+綠-紅)與上Y軸座標軸標籤

## error handling
1. 再平衡時即時計算是否total > 100%，在適當的位置放 error message 
1. 匯入失敗時(格式不預期)彈訊息
1. 匯入檔案時詢問是否覆蓋既有資料
1. 遠端取得資料失敗，檢查網路連線、換個後端、手動輸入

# Contributors
- Leo Lee

