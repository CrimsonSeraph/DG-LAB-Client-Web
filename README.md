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
- 对外地址为自定义子域名 <https://dglab-web.crimsonseraph.top>，通过 `routes` 的 `custom_domain` 绑定，不对外暴露托管平台的账号子域

## 站点结构

```text
app/
├── layout.tsx   # 根布局与站点标题
└── page.tsx     # 首页
next.config.ts   # 静态导出配置
worker.js        # Worker 入口，把请求转给 env.ASSETS
wrangler.toml    # 静态资源 Worker，main 指向 worker.js，[assets] directory 指向 out/
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

本仓库内容以 MIT 许可协议发布，全文见 [LICENSE](LICENSE)，版权行为 `Copyright (c) 2026 CrimsonSeraph`。

允许使用、复制、修改、合并、发布、分发、再许可与销售本仓库内容，包括商业用途，条件是在副本或重要部分中保留上述版权声明与许可声明。内容按「原样」提供，不带任何形式的明示或默示担保。

适用文件在头部加两行 SPDX 声明，标识符为 `MIT`：

```text
// Copyright (c) 2026 CrimsonSeraph
// SPDX-License-Identifier: MIT
```

YAML 与 TOML 文件改用 `#` 注释符，其余内容相同。

`package.json`、`package-lock.json`、`tsconfig.json`、`.gitignore` 属于 JSON 或约定文件，不能写注释，因此不带 SPDX 声明；它们仍受仓库根目录 [LICENSE](LICENSE) 的 MIT 条款覆盖。

## 相关仓库

- [DG-LAB-Client](https://github.com/CrimsonSeraph/DG-LAB-Client) — 主程序
- [DG-LAB-Client-Plugin](https://github.com/CrimsonSeraph/DG-LAB-Client-Plugin) — 插件发布仓库
