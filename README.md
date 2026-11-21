# DG-LAB-Client-Web

DG-LAB-Client 的应用官网与静态资源分发站点。

## 定位

本仓库承载网站本身，负责两件事：

1. **应用官网** — 下载入口、版本发布说明、使用文档与插件市场的前端页面。
2. **静态资源分发** — 图标、封面、截图等二进制资源，通过稳定路径对外提供。

当前站点是极简的 Next.js 骨架：只有首页标题，页面内容随后续阶段补充。

## 技术形态

- Next.js（App Router）+ TypeScript，`next.config.ts` 只设置 `output: "export"`
- 构建产物是纯静态文件，输出到仓库根目录的 `out/`
- 托管在 Cloudflare Workers 静态资源（`wrangler.toml`，Worker 名 `dglab-web`），零 Cloudflare 构建：构建在 GitHub Actions 里跑完，`wrangler deploy` 直接上传 `out/`

## 站点结构

```text
app/
├── layout.tsx   # 根布局与站点标题
└── page.tsx     # 首页
next.config.ts   # 静态导出配置
wrangler.toml    # 静态资源 Worker，[assets] directory 指向 out/
```

## 本地开发与构建

```bash
npm ci
npm run dev     # 开发服务器
npm run build   # 静态导出到 out/
```

`npm run build` 之后 `out/index.html` 就是线上首页，可用任意静态服务器预览。

## 部署

推送 `main` 触发 `.github/workflows/deploy.yml`：`actions/setup-node` 装依赖 → `npm run build` → `npx wrangler@4 deploy`。

### 工作流依赖的 Secrets

工作流依赖下面两个 Secret，本仓库已配置；未配置时部署步骤会以「缺少 secret」明确失败：

| Secret                  | 用途                                                             |
| ----------------------- | ---------------------------------------------------------------- |
| `CLOUDFLARE_API_TOKEN`  | Cloudflare API token，需要 Account → Workers Scripts → Edit 权限 |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 账号 ID，在面板账号首页右侧可以取到                   |

添加路径：仓库 Settings → Secrets and variables → Actions → New repository secret。

## 资源路径

站点自身的静态资源随 `out/` 一起部署。插件封面由 [DG-LAB-Client-Plugin](https://github.com/CrimsonSeraph/DG-LAB-Client-Plugin) 的 `banners/` 目录统一提供，客户端侧车 `plugin.json` 直接写绝对链接；本站需要展示封面时引用同一地址，不另存副本。

## 许可

本仓库内容以 CC BY 4.0（知识共享 署名 4.0 国际）许可协议发布，全文见 [LICENSE](LICENSE)。

协议要点：

- **署名** — 转载、改编时必须注明来源与本仓库使用的许可协议，并链接到协议全文。
- **允许商用与改编** — 允许商业使用与二次创作，无需另行授权。
- **无附加限制** — 不得对他人行使协议授予的权利施加额外法律或技术限制。
- 协议不授予商标、专利或人格权方面的许可。

协议全文：<https://creativecommons.org/licenses/by/4.0/legalcode>
可读摘要：<https://creativecommons.org/licenses/by/4.0/>

推荐署名格式：

```
DG-LAB-Client-Web by CrimsonSeraph, licensed under CC BY 4.0
https://github.com/CrimsonSeraph/DG-LAB-Client-Web
```

## 相关仓库

- [DG-LAB-Client](https://github.com/CrimsonSeraph/DG-LAB-Client) — 主程序
- [DG-LAB-Client-Plugin](https://github.com/CrimsonSeraph/DG-LAB-Client-Plugin) — 插件发布仓库
