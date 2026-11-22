// Copyright (c) 2026 CrimsonSeraph
// SPDX-License-Identifier: MIT

import type { NextConfig } from "next";

// 静态导出：产物直接落在 out/，由 wrangler 直传，Cloudflare 侧不跑构建
const nextConfig: NextConfig = {
  output: "export",
};

export default nextConfig;
