import * as THREE from 'three'; // 这里把 Three.js 整个工具包取名为 THREE，后面创建场景、相机、模型、材质、向量都要用它。
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // 这里从 three/addons/controls/OrbitControls.js 导入 OrbitControls。意思是本文件要使用其他文件已经写好的功能。
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer.js'; // 这里从 three/addons/renderers/CSS2DRenderer.js 导入 CSS2DRenderer。意思是本文件要使用其他文件已经写好的功能。
import { INITIAL_CAMERA } from '../data/geometryData.js'; // 这里从 ../data/geometryData.js 导入 INITIAL_CAMERA。意思是本文件要使用其他文件已经写好的功能。

function getContainerSize(container) { // 这里定义 getContainerSize 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  const rect = container.getBoundingClientRect(); // 这里读取容器在屏幕上的矩形范围，包括宽、高和位置，SVG 坐标换算要靠它。
  return { // 这里开始返回一个对象。对象里会装多个结果，调用方可以一次拿到它们。
    width: Math.max(Math.floor(rect.width || container.clientWidth), 1), // 这里用网页里三维容器真实显示出来的宽度作为 Three.js 画布宽度，只保留 1px 兜底，避免旧的 900px 最小值让相机误以为画布比页面实际更宽。
    height: Math.max(Math.floor(rect.height || container.clientHeight), 1), // 这里用网页里三维容器真实显示出来的高度作为 Three.js 画布高度，只保留 1px 兜底，避免旧的 600px 最小值让相机误以为画布比页面实际更高。
  }; // 这里结束对象，表示这张配置表或数据表已经写完。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

function showSceneError(container, message) { // 这里定义 showSceneError 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  const error = document.createElement('div'); // 这里定义 error，它保存的是 一个新的网页元素。创建出来后还要放进页面，用户才能看到，后面的代码会拿这个结果继续工作。
  error.className = 'scene-error'; // 这里给元素套上 'scene-error' 这个 CSS 类名。套上类名后，CSS 里写好的外观规则才会作用到它身上。
  error.textContent = message; // 这里把页面文字改成 message，用户看到的提示或标签内容就是由这一行写进去的。
  container.appendChild(error); // 这里把 error 插入到 container 这个网页容器里。插进去以后，它才真正成为页面的一部分。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

export function createScene(container, labelLayer) { // 这里导出 createScene 函数。别的文件导入后，就能执行这里封装好的完整流程。
  if (!container || !labelLayer) { // 这里判断 !container || !labelLayer 是否成立。成立时执行下面的大括号内容，不成立就跳过。
    throw new Error('Three.js 场景容器不存在：请检查 #scene-container 和 #label-layer。'); // 这里主动抛出错误。遇到关键条件缺失时，程序停止并给出明确提示，比页面静默失败更容易排查。
  } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

  const scene = new THREE.Scene(); // 这里定义 scene，它保存的是 一个 Three.js 场景。可以把它理解成三维舞台，所有可见物体都要放进来，后面的代码会拿这个结果继续工作。
  scene.background = new THREE.Color(0xf4f8fc); // 这里设置 Three.js 场景背景为 new THREE.Color(0xf4f8fc)，也就是模型后面的底色。

  const { width, height } = getContainerSize(container); // 这里从右侧返回对象里拆出几个名字。拆出来后，后面直接写 scene、camera、renderer 就能使用它们。
  const aspect = width / height; // 这里计算画布宽高比。相机要知道这个比例，画面才不会被横向或纵向拉伸。
  const camera = new THREE.OrthographicCamera( // 这里定义 camera，它保存的是 一个正交相机。正交相机没有近大远小，适合机械制图和投影视图教学，后面的代码会拿这个结果继续工作。
    -aspect * 5.8, // 这里用画布宽高比乘以 5.8，算出正交相机右侧可见范围，防止画面被拉伸。
    aspect * 5.8, // 这里用画布宽高比乘以 5.8，算出正交相机右侧可见范围，防止画面被拉伸。
    5.8, // 这里把正交相机上边界设为 5.8，表示相机能看到目标点上方 5.8 个场景单位。
    -5.8, // 这里把正交相机下边界设为 -5.8，表示相机能看到目标点下方 5.8 个场景单位。
    0.1, // 这里把相机近裁剪面设为 0.1，离相机太近、小于这个距离的内容不会被绘制。
    120, // 这里把相机远裁剪面设为 120，超过这个距离的内容不会被绘制，避免无关远处对象参与渲染。
  ); // 这里结束上一行开始的函数调用，所有参数都已经传完。
  camera.up.set(0, 0, 1); // 这里一次性设置 camera.up 的坐标或角度为 0, 0, 1，比逐个写 x、y、z 更直接。
  camera.position.copy(INITIAL_CAMERA.position); // 这里把 INITIAL_CAMERA.position 的坐标复制给 camera.position。复制后，两者数值一样，但仍然是两个独立对象。
  camera.zoom = INITIAL_CAMERA.zoom; // 这里把相机缩放设为 INITIAL_CAMERA.zoom。这会改变画面远近，但不会改变模型真实大小。
  camera.lookAt(INITIAL_CAMERA.target); // 这里让相机朝向 INITIAL_CAMERA.target。可以理解为让观察者把视线对准这个点。
  camera.updateProjectionMatrix(); // 这里刷新相机投影。相机参数改完后必须刷新，否则浏览器还会按旧参数画画面。

  let renderer; // 这里声明 renderer 变量。它稍后会保存 WebGLRenderer，也就是负责绘制三维画面的核心工具。
  try { // 这里开始尝试一段可能失败的代码。比如 WebGL 创建失败时，不能让页面默默空白。
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false }); // 这里真正创建 WebGL 渲染器，并把它放进 renderer 变量。后面所有三维画面都靠它绘制。
  } catch (error) { // 这里结束 try，并开始处理错误。只要上面创建渲染器失败，错误就会进入这里。
    showSceneError(container, `WebGLRenderer 创建失败：${error.message}`); // 这里调用 showSceneError，把 container, `WebGLRenderer 创建失败：${error.message}` 显示到三维场景上，告诉用户 WebGL 初始化失败。
    throw error; // 这里主动抛出错误。遇到关键条件缺失时，程序停止并给出明确提示，比页面静默失败更容易排查。
  } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // 这里设置像素比为 Math.min(window.devicePixelRatio, 2)，高清屏会更清楚，同时不会无限增加渲染负担。
  renderer.setSize(width, height, false); // 这里设置渲染层尺寸为 width, height, false，让画布或标签层和页面容器对齐。
  renderer.setClearColor(0xf4f7fb, 1); // 这里设置 WebGL 背景清除色为 0xf4f7fb, 1，每次重新绘制前画布会先刷成这个底色。
  renderer.outputColorSpace = THREE.SRGBColorSpace; // 这里把渲染器的颜色空间设为 sRGB，让网页上看到的颜色更接近设计时设置的颜色。
  container.appendChild(renderer.domElement); // 这里把 renderer.domElement 插入到 container 这个网页容器里。插进去以后，它才真正成为页面的一部分。
  renderer.domElement.addEventListener('contextmenu', (event) => { // 这里给 WebGL 画布绑定右键菜单事件。用户右键拖动场景时，不希望浏览器菜单弹出来打断操作。
    event.preventDefault(); // 这里阻止浏览器默认动作。比如右键时不弹出菜单，让右键拖动可以留给三维场景平移使用。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

  const labelRenderer = new CSS2DRenderer(); // 这里定义 labelRenderer，它保存的是 一个 CSS2D 文字渲染器。它负责把三维位置上的文字标签显示成网页文字，后面的代码会拿这个结果继续工作。
  labelRenderer.setSize(width, height); // 这里设置渲染层尺寸为 width, height，让画布或标签层和页面容器对齐。
  labelRenderer.domElement.className = 'label-layer'; // 这里给元素套上 'label-layer' 这个 CSS 类名。套上类名后，CSS 里写好的外观规则才会作用到它身上。
  labelLayer.appendChild(labelRenderer.domElement); // 这里把 labelRenderer.domElement 插入到 labelLayer 这个网页容器里。插进去以后，它才真正成为页面的一部分。

  const controls = new OrbitControls(camera, renderer.domElement); // 这里定义 controls，它保存的是 一个鼠标控制器。它把用户的拖动、滚轮和右键操作转换成相机运动，后面的代码会拿这个结果继续工作。
  controls.enableDamping = true; // 这里打开鼠标控制器的阻尼效果。用户拖动后相机会有一点平滑缓冲，不会生硬停住。
  controls.dampingFactor = 0.08; // 这里设置阻尼强度。数值越大，拖动后的缓冲感越明显。
  controls.target.copy(INITIAL_CAMERA.target); // 这里把 INITIAL_CAMERA.target 的坐标复制给 controls.target。复制后，两者数值一样，但仍然是两个独立对象。
  controls.minZoom = 0.55; // 这里设置最小缩放值，防止用户把画面缩得太远导致模型小到看不清。
  controls.maxZoom = 4.5; // 这里设置最大缩放值，防止用户把画面放得过大导致场景难以操作。
  controls.mouseButtons = { // 这里把 controls.mouseButtons 设成 {。也就是说，从这一行开始，程序后面再读取 controls.mouseButtons 时得到的就是这个新值。
    LEFT: THREE.MOUSE.ROTATE, // 这里规定鼠标左键用于旋转观察，也就是拖动左键可以绕着模型看。
    MIDDLE: THREE.MOUSE.DOLLY, // 这里规定鼠标中键或滚轮用于缩放，也就是拉近或拉远观察距离。
    RIGHT: THREE.MOUSE.PAN, // 这里规定鼠标右键用于平移，也就是不改变角度，只把画面整体挪动。
  }; // 这里结束对象，表示这张配置表或数据表已经写完。

  scene.add(new THREE.HemisphereLight(0xffffff, 0xa8b6c8, 2.3)); // 这里把 new THREE.HemisphereLight(0xffffff, 0xa8b6c8, 2.3) 放进 scene 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。

  const keyLight = new THREE.DirectionalLight(0xffffff, 2.1); // 这里定义 keyLight，它保存的是 new THREE.DirectionalLight(0xffffff, 2.1)，后面的代码会拿这个结果继续工作。
  keyLight.position.set(5, 7, 6); // 这里一次性设置 keyLight.position 的坐标或角度为 5, 7, 6，比逐个写 x、y、z 更直接。
  scene.add(keyLight); // 这里把 keyLight 放进 scene 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。

  const fillLight = new THREE.DirectionalLight(0xb8d8ff, 0.9); // 这里定义 fillLight，它保存的是 new THREE.DirectionalLight(0xb8d8ff, 0.9)，后面的代码会拿这个结果继续工作。
  fillLight.position.set(-4, 3, -2); // 这里一次性设置 fillLight.position 的坐标或角度为 -4, 3, -2，比逐个写 x、y、z 更直接。
  scene.add(fillLight); // 这里把 fillLight 放进 scene 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。

  function resize() { // 这里定义 resize 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
    const { width: nextWidth, height: nextHeight } = getContainerSize(container); // 这里从右侧返回对象里拆出几个名字。拆出来后，后面直接写 scene、camera、renderer 就能使用它们。
    const nextAspect = nextWidth / nextHeight; // 这里定义 nextAspect，它保存的是 nextWidth / nextHeight，后面的代码会拿这个结果继续工作。
    camera.left = -nextAspect * 5.8; // 这里设置正交相机左边界 -nextAspect * 5.8，控制相机能看到画面左侧多宽。
    camera.right = nextAspect * 5.8; // 这里设置正交相机右边界 nextAspect * 5.8，控制相机能看到画面右侧多宽。
    camera.top = 5.8; // 这里设置正交相机上边界 5.8，控制相机能看到上方多高。
    camera.bottom = -5.8; // 这里设置正交相机下边界 -5.8，控制相机能看到下方多高。
    camera.updateProjectionMatrix(); // 这里刷新相机投影。相机参数改完后必须刷新，否则浏览器还会按旧参数画画面。
    renderer.setSize(nextWidth, nextHeight, false); // 这里设置渲染层尺寸为 nextWidth, nextHeight, false，让画布或标签层和页面容器对齐。
    labelRenderer.setSize(nextWidth, nextHeight); // 这里设置渲染层尺寸为 nextWidth, nextHeight，让画布或标签层和页面容器对齐。
  } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

  window.addEventListener('resize', resize); // 这里监听 'resize', resize。当用户触发这个浏览器事件时，后面的回调函数会被执行。

  return { scene, camera, renderer, labelRenderer, controls, resize }; // 这里开始返回一个对象。对象里会装多个结果，调用方可以一次拿到它们。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
