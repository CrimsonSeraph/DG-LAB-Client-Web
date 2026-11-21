// 临时探针：不碰 ASSETS，验证 Worker 脚本本身能否被调用
export default {
  async fetch() {
    return new Response("ALIVE");
  },
};
