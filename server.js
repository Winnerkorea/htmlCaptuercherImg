const express = require("express");
const bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static("public"));

app.post("/capture", async (req, res) => {
  const { html, index } = req.body;

  if (!html) {
    return res.json({
      success: false,
      message: "HTML 내용을 제공해야 합니다.",
    });
  }

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 800, height: 600 });

    // HTML 템플릿 작성
    const htmlContent = `
            <html>
                <head>
                    <style>
                        body { margin: 0; padding: 0; }
                        .container { width: 800px; height: 600px; position: relative; }
                        .container img { width: 100%; height: 100%; object-fit: cover; }
                        .text-sm { font-size: 0.875rem; line-height: 1.25rem; color: #FB923C; }
                        .text-xs { font-size: 0.75rem; line-height: 1rem; color: #FB923C; }
                        .absolute { position: absolute; }
                        .left-2 { left: 0.5rem; }
                        .bottom-16 { bottom: 4rem; }
                        .bottom-2 { bottom: 0.5rem; }
                        .leading-tight { line-height: 1; }
                    </style>
                </head>
                <body>
                    <div class="container">${html}</div>
                </body>
            </html>
        `;

    // HTML 파일을 로드하여 스크린샷을 찍습니다.
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    const filePath = path.join(__dirname, "public", `capture_${index}.png`);
    await page.screenshot({ path: filePath });

    await browser.close();

    res.json({ success: true, filePath: `/capture_${index}.png` });
  } catch (error) {
    console.error(error);
    res.json({ success: false, message: "이미지 캡처에 실패했습니다." });
  }
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
