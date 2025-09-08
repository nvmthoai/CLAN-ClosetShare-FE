# ClosetShare Deployment & SEO Guide

## 🚀 Deploy to Vercel

1. **Commit và Push code:**

```bash
git add .
git commit -m "Add SEO optimization and ClosetShare branding"
git push origin main
```

2. **Deploy to Vercel:**

- Truy cập: https://vercel.com
- Import repository: CLAN-ClosetShare/CLAN-ClosetShare-FE
- Vercel sẽ tự động deploy

3. **Cấu hình domain tùy chỉnh (Optional):**

- Mua domain: closetshare.com
- Trong Vercel Dashboard → Settings → Domains
- Add custom domain

## 🔍 SEO Setup để xuất hiện khi search "ClosetShare"

### 1. Google Search Console

- Truy cập: https://search.google.com/search-console/
- Add property: https://your-vercel-domain.vercel.app
- Verify ownership bằng HTML tag hoặc DNS
- Submit sitemap: https://your-vercel-domain.vercel.app/sitemap.xml

### 2. Google Analytics (Optional)

- Tạo GA4 account
- Add tracking code vào index.html

### 3. Schema.org Markup

✅ Đã thêm JSON-LD markup trong index.html

### 4. Social Media Presence

Tạo profiles với tên "ClosetShare":

- Facebook Page
- Instagram @closetshare
- Twitter @closetshare
- LinkedIn Company Page

### 5. Content Strategy

- Viết blog về fashion trends
- Tạo tutorial videos
- Share trên fashion communities
- Collaborate với fashion influencers

## 📁 Files đã tạo/cập nhật:

✅ `index.html` - SEO meta tags, title "ClosetShare"
✅ `public/sitemap.xml` - Sitemap cho Google
✅ `public/robots.txt` - Crawler instructions
✅ `public/manifest.json` - PWA support
✅ `package.json` - Updated metadata
✅ `.env` - Environment variables

## 🎯 Kết quả mong đợi:

- ✅ Title hiển thị: "ClosetShare - Your Virtual Wardrobe"
- ✅ Google index trong 3-7 ngày
- ✅ Search "ClosetShare" sẽ thấy website
- ✅ Rich snippets trong search results
- ✅ Social sharing với preview cards

## 📝 Next Steps:

1. **Update URL trong các file:**

   - Thay `https://closetshare.vercel.app` bằng domain thực tế
   - Files cần update: index.html, sitemap.xml, robots.txt

2. **Add Google Analytics:**

```html
<!-- Google tag (gtag.js) -->
<script
  async
  src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"
></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag("js", new Date());
  gtag("config", "GA_MEASUREMENT_ID");
</script>
```

3. **Create og-image.jpg:**

   - Kích thước: 1200x630px
   - Chứa logo ClosetShare
   - Fashion-themed design

4. **Favicon files:**
   - Tạo favicon-16x16.png
   - Tạo favicon-32x32.png
   - Tạo apple-touch-icon.png

## ⏰ Timeline:

- **Ngay lập tức:** Title đổi thành "ClosetShare"
- **1-3 ngày:** Google crawl website
- **1-2 tuần:** Xuất hiện trong search results
- **1 tháng:** Ranking tốt cho "ClosetShare"
