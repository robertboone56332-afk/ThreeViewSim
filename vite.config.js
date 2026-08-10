import { defineConfig } from 'vite'; // 这里从 Vite 里拿到 defineConfig，它能帮助我们用标准方式写生产构建配置。

export default defineConfig({ // 这里导出 Vite 配置对象，npm run build 和 npm run dev 都会读取这里的设置。
  base: './', // 这里把生产资源路径设置成相对路径，部署到 GitHub Pages 的仓库子目录时，CSS、JS 和模型文件仍然能从当前网页目录下找到。
}); // 这里结束 Vite 配置，当前只处理公网静态部署需要的 base，不改变任何页面功能。
