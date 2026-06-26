/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // Bắt buộc thêm dòng này để Next.js xuất ra HTML tĩnh
  images: { unoptimized: true }, // Thêm dòng này để fix lỗi load ảnh khi xuất file tĩnh
};

export default nextConfig;
