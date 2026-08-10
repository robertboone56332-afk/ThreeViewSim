import * as THREE from 'three'; // 这里把 Three.js 整个工具包取名为 THREE，后面创建场景、相机、模型、材质、向量都要用它。
import { PLANE_SIZE } from '../data/geometryData.js'; // 这里从 ../data/geometryData.js 导入 PLANE_SIZE。意思是本文件要使用其他文件已经写好的功能。
import { createLabel } from '../ui/labels.js'; // 这里从 ../ui/labels.js 导入 createLabel。意思是本文件要使用其他文件已经写好的功能。

const planeMaterialOptions = { // 这里创建 planeMaterialOptions 材质。材质决定对应物体的颜色、透明度、金属感或是否受光照影响。
  color: 0x8ec7ff, // 这里设置颜色为 0x8ec7ff，物体显示出来时就会使用这个颜色。
  transparent: true, // 这里允许材质透明。只有打开这个开关，后面 opacity 的淡入淡出动画才有效。
  opacity: 0, // 这里设置透明度为 0。1 是完全可见，0 是完全透明，0.32 这类值就是半透明。
  side: THREE.DoubleSide, // 这里设置平面两面都可见。投影面转动或相机绕到背面时，平面也不会消失。
  depthWrite: false, // 这里关闭深度写入。半透明投影面不会把后面的模型或线条粗暴遮掉。
}; // 这里结束对象，表示这张配置表或数据表已经写完。

function createPlaneFrame(points) { // 这里定义 createPlaneFrame 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  const geometry = new THREE.BufferGeometry().setFromPoints(points); // 这里用传进来的点创建线条几何体。点的顺序决定线框会怎样连接。
  return new THREE.Line( // 这里开始创建并返回一条 Three.js 线。调用这个函数的人会拿到这条线，作为投影面边框使用。
    geometry, // 这里把 geometry 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    new THREE.LineBasicMaterial({ color: 0x2c6fa9, transparent: true, opacity: 0 }), // 这里临时创建一份线条材质，给投影面边框使用，让边框有颜色并且能做透明动画。
  ); // 这里结束上一行开始的函数调用，所有参数都已经传完。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

export function createProjectionPlanes() { // 这里导出 createProjectionPlanes 函数。别的文件导入后，就能执行这里封装好的完整流程。
  const planeMaterial = new THREE.MeshBasicMaterial(planeMaterialOptions); // 这里创建 planeMaterial 材质。材质决定对应物体的颜色、透明度、金属感或是否受光照影响。
  const vGroup = new THREE.Group(); // 这里定义 vGroup，它保存的是 一个 Three.js 分组。分组像文件夹，能把相关对象一起移动、隐藏或显示，后面的代码会拿这个结果继续工作。
  const hingeH = new THREE.Group(); // 这里定义 hingeH，它保存的是 一个 Three.js 分组。分组像文件夹，能把相关对象一起移动、隐藏或显示，后面的代码会拿这个结果继续工作。
  const hingeW = new THREE.Group(); // 这里定义 hingeW，它保存的是 一个 Three.js 分组。分组像文件夹，能把相关对象一起移动、隐藏或显示，后面的代码会拿这个结果继续工作。

  const vPlane = new THREE.Mesh(new THREE.PlaneGeometry(PLANE_SIZE.width, PLANE_SIZE.height), planeMaterial.clone()); // 这里定义 vPlane，它保存的是 一个网格模型。网格由形状和材质组成，最终能在三维画面里看到，后面的代码会拿这个结果继续工作。
  vPlane.rotation.x = Math.PI / 2; // 这里把 vPlane.rotation.x 旋转角度设成 Math.PI / 2。投影面展开和复位时，就是靠改变这些角度实现翻转。
  vPlane.position.set(PLANE_SIZE.width / 2, 0, PLANE_SIZE.height / 2); // 这里一次性设置 vPlane.position 的坐标或角度为 PLANE_SIZE.width / 2, 0, PLANE_SIZE.height / 2，比逐个写 x、y、z 更直接。
  vGroup.add(vPlane); // 这里把 vPlane 放进 vGroup 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。

  const vFrame = createPlaneFrame([ // 这里定义 vFrame，它保存的是 createPlaneFrame([，后面的代码会拿这个结果继续工作。
    new THREE.Vector3(0, -0.006, 0), // 这里创建一个三维点，坐标是 0, -0.006, 0。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
    new THREE.Vector3(PLANE_SIZE.width, -0.006, 0), // 这里创建一个三维点，坐标是 PLANE_SIZE.width, -0.006, 0。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
    new THREE.Vector3(PLANE_SIZE.width, -0.006, PLANE_SIZE.height), // 这里创建一个三维点，坐标是 PLANE_SIZE.width, -0.006, PLANE_SIZE.height。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
    new THREE.Vector3(0, -0.006, PLANE_SIZE.height), // 这里创建一个三维点，坐标是 0, -0.006, PLANE_SIZE.height。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
    new THREE.Vector3(0, -0.006, 0), // 这里创建一个三维点，坐标是 0, -0.006, 0。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
  ]); // 这里结束点数组并把它交给函数使用。前面列出的点会被连接成完整线框或线段。
  vGroup.add(vFrame); // 这里把 vFrame 放进 vGroup 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。

  const wPlane = new THREE.Mesh(new THREE.PlaneGeometry(PLANE_SIZE.height, PLANE_SIZE.wDepth), planeMaterial.clone()); // 这里定义 wPlane，它保存的是 一个网格模型。网格由形状和材质组成，最终能在三维画面里看到，后面的代码会拿这个结果继续工作。
  wPlane.rotation.y = Math.PI / 2; // 这里把 wPlane.rotation.y 旋转角度设成 Math.PI / 2。投影面展开和复位时，就是靠改变这些角度实现翻转。
  wPlane.position.set(0, PLANE_SIZE.wDepth / 2, PLANE_SIZE.height / 2); // 这里一次性设置 wPlane.position 的坐标或角度为 0, PLANE_SIZE.wDepth / 2, PLANE_SIZE.height / 2，比逐个写 x、y、z 更直接。
  hingeW.add(wPlane); // 这里把 wPlane 放进 hingeW 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。

  const wFrame = createPlaneFrame([ // 这里定义 wFrame，它保存的是 createPlaneFrame([，后面的代码会拿这个结果继续工作。
    new THREE.Vector3(-0.006, 0, 0), // 这里创建一个三维点，坐标是 -0.006, 0, 0。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
    new THREE.Vector3(-0.006, PLANE_SIZE.wDepth, 0), // 这里创建一个三维点，坐标是 -0.006, PLANE_SIZE.wDepth, 0。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
    new THREE.Vector3(-0.006, PLANE_SIZE.wDepth, PLANE_SIZE.height), // 这里创建一个三维点，坐标是 -0.006, PLANE_SIZE.wDepth, PLANE_SIZE.height。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
    new THREE.Vector3(-0.006, 0, PLANE_SIZE.height), // 这里创建一个三维点，坐标是 -0.006, 0, PLANE_SIZE.height。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
    new THREE.Vector3(-0.006, 0, 0), // 这里创建一个三维点，坐标是 -0.006, 0, 0。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
  ]); // 这里结束点数组并把它交给函数使用。前面列出的点会被连接成完整线框或线段。
  hingeW.add(wFrame); // 这里把 wFrame 放进 hingeW 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。

  const hPlane = new THREE.Mesh(new THREE.PlaneGeometry(PLANE_SIZE.width, PLANE_SIZE.depth), planeMaterial.clone()); // 这里定义 hPlane，它保存的是 一个网格模型。网格由形状和材质组成，最终能在三维画面里看到，后面的代码会拿这个结果继续工作。
  hPlane.position.set(PLANE_SIZE.width / 2, PLANE_SIZE.depth / 2, 0); // 这里一次性设置 hPlane.position 的坐标或角度为 PLANE_SIZE.width / 2, PLANE_SIZE.depth / 2, 0，比逐个写 x、y、z 更直接。
  hingeH.add(hPlane); // 这里把 hPlane 放进 hingeH 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。

  const hFrame = createPlaneFrame([ // 这里定义 hFrame，它保存的是 createPlaneFrame([，后面的代码会拿这个结果继续工作。
    new THREE.Vector3(0, 0, 0.006), // 这里创建一个三维点，坐标是 0, 0, 0.006。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
    new THREE.Vector3(PLANE_SIZE.width, 0, 0.006), // 这里创建一个三维点，坐标是 PLANE_SIZE.width, 0, 0.006。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
    new THREE.Vector3(PLANE_SIZE.width, PLANE_SIZE.depth, 0.006), // 这里创建一个三维点，坐标是 PLANE_SIZE.width, PLANE_SIZE.depth, 0.006。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
    new THREE.Vector3(0, PLANE_SIZE.depth, 0.006), // 这里创建一个三维点，坐标是 0, PLANE_SIZE.depth, 0.006。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
    new THREE.Vector3(0, 0, 0.006), // 这里创建一个三维点，坐标是 0, 0, 0.006。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
  ]); // 这里结束点数组并把它交给函数使用。前面列出的点会被连接成完整线框或线段。
  hingeH.add(hFrame); // 这里把 hFrame 放进 hingeH 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。

  const vLabel = createLabel('V面'); // 这里创建 vLabel 文字标签。标签会跟随三维坐标显示，用来标出轴名、投影面名或投影视图名。
  vLabel.position.set(PLANE_SIZE.width - 0.55, -0.08, PLANE_SIZE.height - 0.25); // 这里一次性设置 vLabel.position 的坐标或角度为 0.55, -0.08, PLANE_SIZE.height - 0.25，比逐个写 x、y、z 更直接。
  vGroup.add(vLabel); // 这里把 vLabel 放进 vGroup 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。

  const wLabel = createLabel('W面'); // 这里创建 wLabel 文字标签。标签会跟随三维坐标显示，用来标出轴名、投影面名或投影视图名。
  wLabel.position.set(-0.08, PLANE_SIZE.wDepth - 0.45, PLANE_SIZE.height - 0.25); // 这里一次性设置 wLabel.position 的坐标或角度为 -0.08, PLANE_SIZE.wDepth - 0.45, PLANE_SIZE.height - 0.25，比逐个写 x、y、z 更直接。
  hingeW.add(wLabel); // 这里把 wLabel 放进 hingeW 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。

  const hLabel = createLabel('H面'); // 这里创建 hLabel 文字标签。标签会跟随三维坐标显示，用来标出轴名、投影面名或投影视图名。
  hLabel.position.set(0.55, PLANE_SIZE.depth - 0.45, 0.08); // 这里一次性设置 hLabel.position 的坐标或角度为 0.55, PLANE_SIZE.depth - 0.45, 0.08，比逐个写 x、y、z 更直接。
  hingeH.add(hLabel); // 这里把 hLabel 放进 hingeH 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。

  const allSurfaces = [vPlane, wPlane, hPlane]; // 这里把三个蓝色投影面放进同一个数组，后面复位或显隐动画可以一次性处理它们。
  const allFrames = [vFrame, wFrame, hFrame]; // 这里把三个投影面边框放进同一个数组，后面复位或显隐动画可以一次性处理它们。

  return { // 这里开始返回一个对象。对象里会装多个结果，调用方可以一次拿到它们。
    vGroup, // 这里把 vGroup 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    hingeH, // 这里把 hingeH 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    hingeW, // 这里把 hingeW 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    vPlane, // 这里把 vPlane 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    hPlane, // 这里把 hPlane 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    wPlane, // 这里把 wPlane 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    vFrame, // 这里把 vFrame 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    hFrame, // 这里把 hFrame 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    wFrame, // 这里把 wFrame 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    vLabel, // 这里把 vLabel 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    hLabel, // 这里把 hLabel 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    wLabel, // 这里把 wLabel 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    allSurfaces, // 这里把 allSurfaces 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    allFrames, // 这里把 allFrames 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    labels: [vLabel, wLabel, hLabel], // 这里把三个投影面文字标签放成一个数组，复位或隐藏时可以一次性遍历处理。
  }; // 这里结束对象，表示这张配置表或数据表已经写完。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
