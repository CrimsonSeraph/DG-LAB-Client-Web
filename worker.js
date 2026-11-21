// 静态资源 Worker 入口：请求转给 ASSETS 绑定，异常时把原因写进响应便于定位
export default {
  async fetch(request, env) {
    try {
      if (!env.ASSETS) {
        return new Response("ASSETS binding missing", { status: 500 });
      }
      return await env.ASSETS.fetch(request);
    } catch (error) {
      const detail = error && error.stack ? error.stack : String(error);
      return new Response("PROBE: " + detail, { status: 500 });
    }
  },
};
