# 三面投影交互式虚拟仿真

这是一个基于 Vite、原生 JavaScript 和 Three.js 的纯前端网页项目。网页部署后，教师或学生只需要打开浏览器网址即可使用，不需要安装 Node.js、PyCharm 或任何本地软件。

## 本地检查

```bash
npm ci
npm run build
npm run preview
```

`npm run build` 会生成 `dist/` 目录，`public/models/part.stl` 会自动复制到 `dist/models/part.stl`。

## 公网部署

推荐使用 GitHub Pages：

1. 在 GitHub 创建一个新的仓库。
2. 把当前项目推送到这个仓库。
3. 打开仓库页面，进入 `Settings`。
4. 在左侧找到 `Pages`。
5. 在 `Build and deployment` 里，把 `Source` 选择为 `GitHub Actions`。
6. 推送代码到 `main` 分支后，GitHub 会自动运行部署流程。
7. 部署完成后，在仓库的 `Actions` 页面或 `Settings > Pages` 页面查看公网访问网址。

部署完成后，其他人访问类似下面的网址即可直接使用：

```text
https://用户名.github.io/仓库名称/
```

项目已经包含 `.github/workflows/deploy-pages.yml`，推送到 GitHub 后会自动安装依赖、构建 `dist/`，并发布到 GitHub Pages。
