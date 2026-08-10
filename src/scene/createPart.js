import * as THREE from 'three'; // 这里把 Three.js 整个工具包取名为 THREE，后面创建场景、相机、模型、材质、向量都要用它。
import { STLLoader } from 'three/addons/loaders/STLLoader.js'; // 这里从 three/addons/loaders/STLLoader.js 导入 STLLoader。意思是本文件要使用其他文件已经写好的功能。
import {
  MODEL_PLACEMENT,
  PLANE_SIZE,
  updateModelBoundsFromBox
} from '../data/geometryData.js'; // 这里从 ../data/geometryData.js 导入 MODEL_PLACEMENT, updateModelBoundsFromBox。意思是本文件要使用其他文件已经写好的功能。

const STL_MODEL_URL = `${import.meta.env.BASE_URL}models/part.stl`; // 这里把 STL 文件地址写成“网站基础路径 + models/part.stl”，本地开发时能加载 public/models/part.stl，部署到 GitHub Pages 子目录后也不会因为路径从 / 开头而 404。

const partMaterial = new THREE.MeshStandardMaterial({ // 这里创建 partMaterial 材质。材质决定对应物体的颜色、透明度、金属感或是否受光照影响。
  color: 0xb8c0c9, // 这里设置颜色为 0xb8c0c9，物体显示出来时就会使用这个颜色。
  roughness: 0.55, // 这里把粗糙度设为 0.55，模型表面会更像普通机械零件，不会像镜子一样强反光。
  metalness: 0.16, // 这里把金属感设为 0.16，表示模型带一点金属质感，但不会过度闪亮。
  transparent: true, // 这里允许材质透明。只有打开这个开关，后面 opacity 的淡入淡出动画才有效。
  opacity: 1, // 这里设置透明度为 1。1 是完全可见，0 是完全透明，0.32 这类值就是半透明。
}); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

const edgeMaterial = new THREE.LineBasicMaterial({ // 这里创建 edgeMaterial 材质。材质决定对应物体的颜色、透明度、金属感或是否受光照影响。
  color: 0x1f2630, // 这里设置颜色为 0x1f2630，物体显示出来时就会使用这个颜色。
  transparent: true, // 这里允许材质透明。只有打开这个开关，后面 opacity 的淡入淡出动画才有效。
  opacity: 1, // 这里设置透明度为 1。1 是完全可见，0 是完全透明，0.32 这类值就是半透明。
}); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

function showLoadError(message) { // 这里定义 showLoadError 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  const panel = document.querySelector('.current-step'); // 这里创建控制面板逻辑，并把每个按钮点击后要执行的函数交给它管理。
  if (panel) panel.textContent = message; // 这里判断 panel 是否成立。成立时执行下面的大括号内容，不成立就跳过。
  const container = document.querySelector('#scene-container'); // 这里找到三维场景容器，Three.js 的 WebGL 画面会被放进这个区域。
  if (container) { // 这里判断 container 是否成立。成立时执行下面的大括号内容，不成立就跳过。
    const error = document.createElement('div'); // 这里定义 error，它保存的是 一个新的网页元素。创建出来后还要放进页面，用户才能看到，后面的代码会拿这个结果继续工作。
    error.className = 'scene-error'; // 这里给元素套上 'scene-error' 这个 CSS 类名。套上类名后，CSS 里写好的外观规则才会作用到它身上。
    error.textContent = message; // 这里把页面文字改成 message，用户看到的提示或标签内容就是由这一行写进去的。
    container.appendChild(error); // 这里把 error 插入到 container 这个网页容器里。插进去以后，它才真正成为页面的一部分。
  } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

function normalizeGeometryToTeachingSpace(geometry) { // 这里定义 normalizeGeometryToTeachingSpace 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  geometry.computeVertexNormals(); // 这里重新计算模型表面法线。灯光要靠法线判断表面朝向，所以这一步影响模型明暗。
  geometry.computeBoundingBox(); // 这里计算模型包围盒。包围盒告诉程序模型最左、最右、最高、最低在哪里。

  const originalBox = geometry.boundingBox.clone(); // 这里取得 originalBox 包围盒。包围盒像套住模型的透明长方体，用来计算模型边界和投影位置。
  const originalSize = originalBox.getSize(new THREE.Vector3()); // 这里取得 originalSize 尺寸。程序用它知道模型或容器到底有多宽、多高、多深。
  const originalCenter = originalBox.getCenter(new THREE.Vector3()); // 这里取得 originalCenter 中心点。模型缩放和摆放前，先找到中心会更容易计算。
  const maxDimension = Math.max(originalSize.x, originalSize.y, originalSize.z); // 这里定义 maxDimension，它保存的是 几个数里最大的那个。这里用它保证尺寸不会小到看不清，后面的代码会拿这个结果继续工作。
  const scale = MODEL_PLACEMENT.targetMaxSize / maxDimension; // 这里算出模型缩放倍数。用目标大小除以原始最大尺寸，就知道 STL 应该放大或缩小多少。

  geometry.translate(-originalCenter.x, -originalCenter.y, -originalCenter.z); // 这里把几何体整体平移 -originalCenter.x, -originalCenter.y, -originalCenter.z，用于把 STL 从原始坐标移动到教学场景里的合适位置。
  geometry.scale(scale, scale, scale); // 这里把几何体按 scale, scale, scale 缩放，保证导入模型大小适合当前投影面。
  geometry.rotateZ(Math.PI); // 这里让几何体绕 Z 轴旋转 Math.PI，用于调整模型朝向，让前后左右符合教学视图。
  geometry.computeBoundingBox(); // 这里计算模型包围盒。包围盒告诉程序模型最左、最右、最高、最低在哪里。

  const scaledBox = geometry.boundingBox.clone();
const scaledSize = scaledBox.getSize(new THREE.Vector3());

// 获取当前模型包围盒中心
const currentCenter = scaledBox.getCenter(new THREE.Vector3());

// 三个投影面共同有效区域的中心
const targetCenter = new THREE.Vector3(
  PLANE_SIZE.width / 2,
  Math.min(PLANE_SIZE.depth, PLANE_SIZE.wDepth) / 2,
  PLANE_SIZE.height / 2
);

// 将模型包围盒中心移动到投影空间中心
geometry.translate(
  targetCenter.x - currentCenter.x,
  targetCenter.y - currentCenter.y,
  targetCenter.z - currentCenter.z
);

geometry.computeBoundingBox(); // 这里计算模型包围盒。包围盒告诉程序模型最左、最右、最高、最低在哪里。

  updateModelBoundsFromBox(geometry.boundingBox); // 这里用最新包围盒更新全局模型边界，后面的投影线和三视图都会按真实 STL 尺寸计算。

  return { // 这里开始返回一个对象。对象里会装多个结果，调用方可以一次拿到它们。
    originalSize, // 这里把 originalSize 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    scaledSize: geometry.boundingBox.getSize(new THREE.Vector3()), // 这里把缩放并摆放后的模型尺寸返回出去，方便调试时确认 STL 变成了多大。
    scale, // 这里把 scale 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    rotation: { x: 0, y: 0, z: Math.PI }, // 这里把模型导入时做过的旋转角度记录下来，方便以后知道 STL 曾经如何被摆正。
    finalBox: geometry.boundingBox.clone(), // 这里把最终包围盒返回出去，投影线、投影视图和三等关系都要靠这个最终范围定位。
  }; // 这里结束对象，表示这张配置表或数据表已经写完。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

export function createPart() { // 这里导出 createPart 函数。别的文件导入后，就能执行这里封装好的完整流程。
  const group = new THREE.Group(); // 这里创建一个 Three.js 分组。分组像文件夹，能把相关模型、线条或标签统一管理。
  group.name = 'OfficialStlTeachingPart'; // 这里给这个 Three.js 对象起名 'OfficialStlTeachingPart'。名字主要方便调试和理解层级结构，不直接改变画面外观。
  group.userData.loaded = false; // 这里把 false 存进 group.userData.loaded。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
  group.userData.loadError = null; // 这里把 null 存进 group.userData.loadError。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
  group.userData.modelInfo = null; // 这里把 null 存进 group.userData.modelInfo。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。

  const loader = new STLLoader(); // 这里定义 loader，它保存的是 new STLLoader()，后面的代码会拿这个结果继续工作。
  group.userData.ready = new Promise((resolve, reject) => { // 这里把 new Promise((resolve, reject) => { 存进 group.userData.ready。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
    loader.load( // 这里开始用 STLLoader 加载模型文件。括号里的几段内容分别是文件路径、加载成功后做什么、加载失败后做什么。
      STL_MODEL_URL, // 这里使用前面算好的 STL_MODEL_URL 作为模型文件路径，这样同一份代码在本地和 GitHub Pages 上都能找到 part.stl。
      (geometry) => { // 这里写模型加载成功后的回调。STL 读出来的几何体会作为 geometry 传进来。
        const modelInfo = normalizeGeometryToTeachingSpace(geometry); // 这里定义 modelInfo，它保存的是 normalizeGeometryToTeachingSpace(geometry)，后面的代码会拿这个结果继续工作。
        const mesh = new THREE.Mesh(geometry, partMaterial); // 这里定义 mesh，它保存的是 一个网格模型。网格由形状和材质组成，最终能在三维画面里看到，后面的代码会拿这个结果继续工作。
        mesh.name = 'part.stl'; // 这里给这个 Three.js 对象起名 'part.stl'。名字主要方便调试和理解层级结构，不直接改变画面外观。
        mesh.castShadow = true; // 这里把 mesh.castShadow 设成 true。也就是说，从这一行开始，程序后面再读取 mesh.castShadow 时得到的就是这个新值。
        mesh.receiveShadow = true; // 这里把 mesh.receiveShadow 设成 true。也就是说，从这一行开始，程序后面再读取 mesh.receiveShadow 时得到的就是这个新值。

        const edges = new THREE.LineSegments( // 这里定义 edges，它保存的是 一组线段。这里通常用来显示 STL 模型被提取出来的黑色边线，后面的代码会拿这个结果继续工作。
          new THREE.EdgesGeometry(geometry, 18), // 这里从 STL 几何体里提取边线，18 是角度阈值，用来判断哪些边应该显示出来。
          edgeMaterial, // 这里把 edgeMaterial 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
        ); // 这里结束上一行开始的函数调用，所有参数都已经传完。
        edges.name = 'part.stl edges'; // 这里给这个 Three.js 对象起名 'part.stl edges'。名字主要方便调试和理解层级结构，不直接改变画面外观。

        group.add(mesh, edges); // 这里把 mesh, edges 放进 group 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。
        group.userData.loaded = true; // 这里把 true 存进 group.userData.loaded。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
        group.userData.modelInfo = modelInfo; // 这里把 modelInfo 存进 group.userData.modelInfo。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
        group.userData.mesh = mesh; // 这里把 mesh 存进 group.userData.mesh。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
        group.userData.edges = edges; // 这里把 edges 存进 group.userData.edges。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
        group.userData.geometry = geometry; // 这里把 geometry 存进 group.userData.geometry。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
        resolve(modelInfo); // 这里调用 resolve 函数，并把 modelInfo 交给它，让它完成封装好的那一步。
      }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
      undefined, // 这里把 undefined 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
      (error) => { // 这里写模型加载失败后的回调。失败原因会作为 error 传进来，页面会显示加载失败提示。
        const message = 'part.stl 模型加载失败'; // 这里定义 message，它保存的是 'part.stl 模型加载失败'，后面的代码会拿这个结果继续工作。
        group.userData.loadError = error; // 这里把 error 存进 group.userData.loadError。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
        showLoadError(message); // 这里调用 showLoadError 函数，并把 message 交给它，让它完成封装好的那一步。
        reject(error); // 这里调用 reject 函数，并把 error 交给它，让它完成封装好的那一步。
      }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
    ); // 这里结束上一行开始的函数调用，所有参数都已经传完。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

  group.userData.setOpacity = (opacity) => { // 这里把 (opacity) => { 存进 group.userData.setOpacity。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
    partMaterial.opacity = opacity; // 这里改变 partMaterial.opacity 的透明度为 opacity，所以它会变得更清楚、更淡，或者完全看不见。
    edgeMaterial.opacity = opacity; // 这里改变 edgeMaterial.opacity 的透明度为 opacity，所以它会变得更清楚、更淡，或者完全看不见。
  }; // 这里结束对象，表示这张配置表或数据表已经写完。

  group.userData.setGhosted = (ghosted) => { // 这里把 (ghosted) => { 存进 group.userData.setGhosted。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
    group.userData.setOpacity(ghosted ? 0.28 : 1); // 这里让 group.userData 执行 setOpacity 这个方法，传入 ghosted ? 0.28 : 1，完成它负责的那一步操作。
  }; // 这里结束对象，表示这张配置表或数据表已经写完。

  return group; // 这里返回 group。函数执行到 return 就结束，并把结果交回调用它的地方。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
