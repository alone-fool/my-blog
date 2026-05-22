# Agent 快速上手 — my-blog

## 30 秒

```bash
npm install && npm run dev
# http://localhost:5173/my-blog/
```

默认 **Mock**（`.env.development` 中 `VITE_USE_MOCK_BLOG=true`）。点「GitHub 登录」可模拟博主进 `/admin`。

## 改代码前

| 要改什么 | 先看 |
|----------|------|
| 列表/详情/评论/点赞 | `src/api/blogClient.ts` → `blogApi` / `mocks/blog/blogMockApi` |
| 权限/登录 | `src/stores/authStore.ts` + `supabase/migrations/*` RLS |
| 主题 | `src/config/themes.ts` + `src/stores/themeStore.ts` |
| 部署/OAuth URL | `vite.config.ts` `base` + `README.md` |

## 硬规则（详见 `.cursor/rules/`）

1. 业务只走 **`blogClient`**，禁止页面内 Mock 假数据
2. 禁止 Vue 模板行内 **`style="..."`**
3. 禁止前端使用 **`service_role`**
4. 改 RLS/表 → 新 **migration** 文件

## 生产

- 站点：`https://alone-fool.github.io/my-blog/`
- CI：GitHub Actions + 仓库 Secrets（`VITE_SUPABASE_*`、`VITE_OWNER_GITHUB_ID`）
