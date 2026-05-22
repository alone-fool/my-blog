# My Blog

Vue 3 + Supabase 个人博客，部署至 GitHub Pages：`https://alone-fool.github.io/my-blog/`

## 功能

- 个人简历展示与编辑（仅博主）
- 文章增删改查（Markdown）
- 评论、点赞、收藏、分享
- 预置主题：森林 / 海洋 / 天空 / 红砖 / 公园
- 上传图片自动取色生成自定义主题

## 本地开发

```bash
npm install
cp .env.example .env.development   # 已提供默认 Mock 配置
npm run dev
```

访问 `http://localhost:5173/my-blog/`。Mock 模式下点击「GitHub 登录」即可模拟博主。

关闭 Mock、连接 Supabase：

```bash
# .env.development
VITE_USE_MOCK_BLOG=false
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## Supabase 配置

1. 新建 Supabase 项目，在 SQL Editor 执行 [`supabase/migrations/20260522000000_init.sql`](supabase/migrations/20260522000000_init.sql)
2. 将你的 GitHub 数字 ID 写入：

```sql
update public.site_config
set value = '你的GitHub数字ID'
where key = 'owner_github_id';
```

3. Authentication → Providers → 启用 **GitHub**
4. URL Configuration → Redirect URLs 添加：
   - `http://localhost:5173/my-blog/`
   - `https://alone-fool.github.io/my-blog/`

## GitHub Pages 部署

1. 创建仓库 `alone-fool/my-blog`，推送本代码到 `main`
2. 仓库 Settings → Pages → Source 选择 **GitHub Actions**
3. 仓库 Settings → Secrets → Actions，添加：
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_OWNER_GITHUB_ID`
   - `VITE_OWNER_GITHUB_LOGIN`（可选，默认 `alone-fool`）

推送后 workflow [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) 自动构建部署。

## 技术栈

- Vue 3 · TypeScript · Vite · Pinia · Vue Router · Tailwind CSS v4
- Supabase（Auth + PostgreSQL + RLS）
- md-editor-v3 · marked · colorthief
