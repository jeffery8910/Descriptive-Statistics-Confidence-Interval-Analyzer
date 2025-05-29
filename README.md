# Descriptive Statistics & Confidence Interval Analyzer | 描述性統計與信賴區間分析器

一個互動式的網頁應用程式，允許使用者上傳 CSV 或 Excel 檔案，以生成描述性統計數據和平均數的信賴區間。本應用程式提供了一個使用者友好的介面，以便快速分析資料集，並以「牛皮紙」風格主題和雙語（英文/繁體中文）支援呈現。

## 主要功能

* **檔案上傳**：支援 CSV (.csv) 和 Excel (.xls, .xlsx) 檔案格式。
* **描述性統計**：計算並顯示：
    * 計數 (Count)
    * 平均值 (Mean)
    * 中位數 (Median)
    * 眾數 (Mode)
    * 標準差 (Std. Dev.)
    * 變異數 (Variance)
    * 最小值 (Min)
    * 最大值 (Max)
    * 全距 (Range)
* **平均數信賴區間**：計算並顯示平均數的信賴區間：
    * 90%
    * 95%
    * 99%
    * 同時顯示平均數標準誤 (SEM)。
* **原始數據顯示**：可切換顯示已上傳的原始數據表格。
* **使用者介面**：
    * 以類似牛皮紙美學的淺色和深色模式為主題。
    * 主要標籤和標題支援雙語（英文和繁體中文）。
    * 提供載入指示器和錯誤訊息，以提升使用者體驗。
* **響應式設計**：能適應不同螢幕尺寸。

## 技術棧

* **前端**：React, TypeScript, Vite
* **樣式**：Tailwind CSS
* **檔案解析**：
    * `xlsx` 函式庫 (SheetJS) 用於 Excel 檔案（透過 CDN 載入）。
    * 自訂 CSV 解析器。
* **統計計算**：自訂的實用函式。

## 環境需求

* Node.js
* npm (Node Package Manager)

## 本地開發

1.  **複製儲存庫：**
    ```bash
    git clone <repository-url>
    cd descriptive-statistics-confidence-interval-analyzer
    ```

2.  **安裝依賴套件：**
    ```bash
    npm install
    ```
   

3.  **環境變數 (選擇性)：**
    Vite 設定檔已設定為從 `.env` 檔案（例如 `.env.local`）載入 `GEMINI_API_KEY`。
    ```
    VITE_GEMINI_API_KEY=YOUR_API_KEY
    ```
    *注意：此應用程式的核心統計分析功能（檔案解析、描述性統計、信賴區間）目前並未使用此 `GEMINI_API_KEY`。它可能是模板的殘留部分，或用於未來與 AI 相關的擴充功能。*

4.  **執行開發伺服器：**
    ```bash
    npm run dev
    ```
   
    這將啟動 Vite 開發伺服器，通常在 `http://localhost:5173`。

5.  **建置生產版本：**
    ```bash
    npm run build
    ```
   
    此命令會將應用程式打包成用於生產的靜態檔案，通常位於 `dist` 資料夾中。

6.  **預覽生產版本：**
    ```bash
    npm run preview
    ```
   
    此命令會在本地端提供 `dist` 資料夾的內容。

## 使用方式

1.  在您的網頁瀏覽器中開啟應用程式（透過本地開發伺服器或已部署的 URL）。
2.  在「Upload Data File」/「上傳資料檔案」區域下，點擊檔案輸入區域。
3.  從您的本機系統中選擇一個 CSV 或 Excel 檔案（.csv, .xls, .xlsx）。
4.  成功上傳並解析後，應用程式將顯示：
    * 已上傳檔案的檔名。
    * 一個「Show Raw Data」/「顯示原始數據」按鈕，用於切換顯示已上傳檔案的原始數據。
    * 一個「Descriptive Statistics」/「描述性統計」表格，顯示資料集中每個（數值型）欄位的統計數據。
    * 一個「Mean Confidence Intervals」/「平均數信賴區間」表格，顯示每個（數值型）欄位的信賴區間。
5.  如果檔案解析出現問題，或者數據不適合某些計算，將顯示相應的訊息或「N/A」值。

## 部署

本專案包含一個 GitHub Actions 工作流程，用於將應用程式作為靜態內容部署到 GitHub Pages。

* **專案名稱 (儲存庫)**：`jeffery8910/descriptive-statistics-confidence-interval-analyzer`
* **觸發條件**：此工作流程會在推送到 `main` 分支時執行。
* **流程**：
    1.  簽出儲存庫程式碼。
    2.  設定 GitHub Pages。
    3.  將*整個儲存庫內容* (`path: '.'`) 作為 Pages 成品上傳。
    4.  將成品部署到 GitHub Pages。

* **關於 Vite 部署的注意事項**：對於典型的 Vite 應用程式，標準做法是先建置專案（例如 `npm run build`），然後部署生成的 `dist`（或指定的 `build.outDir`）目錄的內容。目前的工作流程會上傳整個儲存庫的原始碼。如果您打算部署已準備好用於生產的建置版本，您可能需要調整工作流程以包含建置步驟，並將 `actions/upload-pages-artifact@v3` 中的 `path` 更改為您的建置輸出目錄（例如 `./dist`）。

## 檔案結構重點

* `public/`: 靜態資源。
* `src/`:
    * `App.tsx`: 主要應用程式組件，負責協調 UI 和邏輯。
    * `main.tsx` (在您上傳的檔案中為 `index.tsx`): React 應用程式的進入點。
    * `components/`: 可重複使用的 React 組件，用於 UI 元素，例如：
        * `FileUpload.tsx`: 處理檔案輸入和啟動解析。
        * `StatisticsTable.tsx`: 顯示描述性統計數據。
        * `ConfidenceIntervalTable.tsx`: 顯示信賴區間。
        * `RawDataTable.tsx`: 顯示匯入的原始數據。
        * `DataTable.tsx`: 用於渲染表格的通用組件。
        * `Loader.tsx`: 載入指示器。
        * `ErrorMessage.tsx`: 顯示錯誤訊息。
    * `utils/`: 實用函式：
        * `fileParser.ts`: 包含解析 CSV 和 Excel 檔案的邏輯。
        * `statisticsCalculator.ts`: 包含所有統計計算的函式。
    * `types.ts`: TypeScript 類型定義和介面。
* `index.html`: 主要 HTML 進入點，包含 CDN 連結和基本頁面結構。
* `vite.config.ts`: Vite 設定檔。
* `package.json`: 專案元數據、依賴套件和腳本。
* `.github/workflows/static.yml`: 用於部署的 GitHub Actions 工作流程。
