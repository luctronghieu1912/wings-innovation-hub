const fs = require("fs-extra");
const path = require("path");
const ejs = require("ejs");

const SRC_DIR = path.join(__dirname, "src");
const DIST_DIR = path.join(__dirname, "dist");
const LOCALES_DIR = path.join(__dirname, "locales");

// Đọc 2 file từ điển
const locales = {
  vi: fs.readJsonSync(path.join(LOCALES_DIR, "vi.json")),
  en: fs.readJsonSync(path.join(LOCALES_DIR, "en.json")),
};

async function build() {
  // 1. Dọn dẹp thư mục dist cũ (nếu có)
  await fs.emptyDir(DIST_DIR);

  // (Tuỳ chọn) Nếu bạn có thư mục public chứa CSS/JS, bỏ comment dòng dưới để copy nó sang dist
  await fs.copy(path.join(__dirname, "public"), DIST_DIR);

  // 2. Tìm tất cả các file .ejs trong thư mục src (không lấy trong partials)
  const files = await fs.readdir(SRC_DIR);
  const pageFiles = files.filter((f) => f.endsWith(".ejs"));

  for (const file of pageFiles) {
    const templatePath = path.join(SRC_DIR, file);
    const outputName = file.replace(".ejs", ".html");

    // Xuất file tiếng Việt
    const htmlVi = await ejs.renderFile(templatePath, {
      lang: "vi",
      t: locales.vi,
      rootPath: "", // <-- THÊM DÒNG NÀY (Để trống vì file VN nằm ở thư mục gốc)
    });
    await fs.outputFile(path.join(DIST_DIR, outputName), htmlVi);

    // Xuất file tiếng Anh (bỏ vào thư mục con /en)
    const htmlEn = await ejs.renderFile(templatePath, {
      lang: "en",
      t: locales.en,
      rootPath: "../", // <-- THÊM DÒNG NÀY (Thêm ../ để lùi ra ngoài 1 cấp)
    });
    await fs.outputFile(path.join(DIST_DIR, "en", outputName), htmlEn);
  }
  console.log("✅ Đã build thành công! Hãy kiểm tra thư mục 'dist'");
}

build();
