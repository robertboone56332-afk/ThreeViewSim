import * as THREE from 'three'; // 这里把 Three.js 整个工具包取名为 THREE，后面创建场景、相机、模型、材质、向量都要用它。
import { createLabel } from '../ui/labels.js'; // 这里从 ../ui/labels.js 导入 createLabel。意思是本文件要使用其他文件已经写好的功能。

const relationMaterial = new THREE.LineBasicMaterial({ // 这里创建 relationMaterial 材质。材质决定对应物体的颜色、透明度、金属感或是否受光照影响。
  color: 0x1687c8, // 这里设置颜色为 0x1687c8，物体显示出来时就会使用这个颜色。
  transparent: true, // 这里允许材质透明。只有打开这个开关，后面 opacity 的淡入淡出动画才有效。
  opacity: 0, // 这里设置透明度为 0。1 是完全可见，0 是完全透明，0.32 这类值就是半透明。
}); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

function createRelationLine(points) { // 这里定义 createRelationLine 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  const geometry = new THREE.BufferGeometry().setFromPoints(points); // 这里用传进来的点创建线条几何体。点的顺序决定线框会怎样连接。
  return new THREE.Line(geometry, relationMaterial.clone()); // 这里返回 new THREE.Line(geometry, relationMaterial.clone())。函数执行到 return 就结束，并把结果交回调用它的地方。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

export function createRelations() { // 这里导出 createRelations 函数。别的文件导入后，就能执行这里封装好的完整流程。
  const group = new THREE.Group(); // 这里创建一个 Three.js 分组。分组像文件夹，能把相关模型、线条或标签统一管理。
  group.name = 'ProjectionRelations'; // 这里给这个 Three.js 对象起名 'ProjectionRelations'。名字主要方便调试和理解层级结构，不直接改变画面外观。
  group.visible = false; // 这里把 group 隐藏起来，它还在程序里，但用户暂时看不到。

  const lengthCopy = createRelationLine([ // 这里定义 lengthCopy，它保存的是 createRelationLine([，后面的代码会拿这个结果继续工作。
    new THREE.Vector3(0.6, 0.16, 0.07), // 这里创建一个三维点，坐标是 0.6, 0.16, 0.07。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
    new THREE.Vector3(3.6, 0.16, 0.07), // 这里创建一个三维点，坐标是 3.6, 0.16, 0.07。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
  ]); // 这里结束点数组并把它交给函数使用。前面列出的点会被连接成完整线框或线段。
  lengthCopy.userData.motion = { // 这里把 { 存进 lengthCopy.userData.motion。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
    type: 'translate', // 这里说明动画类型是 'translate'，程序会根据它判断这一步是平移还是旋转。
    from: new THREE.Vector3(0, 0, 0), // 这里保存动画起点 new THREE.Vector3(0, 0, 0)，动画开始时对象会先从这里出发。
    to: new THREE.Vector3(0, -4.36, 0), // 这里保存动画终点 new THREE.Vector3(0, -4.08, 0)，动画完成时对象会停在这里。
  }; // 这里结束对象，表示这张配置表或数据表已经写完。

  const heightCopy = createRelationLine([ // 这里定义 heightCopy，它保存的是 createRelationLine([，后面的代码会拿这个结果继续工作。
    new THREE.Vector3(3.72, 0.2, 0.07), // 这里创建一个三维点，坐标是 3.72, 0.2, 0.07。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
    new THREE.Vector3(3.72, 2.2, 0.07), // 这里创建一个三维点，坐标是 3.72, 2.2, 0.07。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
  ]); // 这里结束点数组并把它交给函数使用。前面列出的点会被连接成完整线框或线段。
  heightCopy.userData.motion = { // 这里把 { 存进 heightCopy.userData.motion。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
    type: 'translate', // 这里说明动画类型是 'translate'，程序会根据它判断这一步是平移还是旋转。
    from: new THREE.Vector3(0, 0, 0), // 这里保存动画起点 new THREE.Vector3(0, 0, 0)，动画开始时对象会先从这里出发。
    to: new THREE.Vector3(0.08, 0, 0), // 这里保存动画终点 new THREE.Vector3(2.18, 0, 0)，动画完成时对象会停在这里。
  }; // 这里结束对象，表示这张配置表或数据表已经写完。

  const widthCopy = createRelationLine([ // 这里定义 widthCopy，它保存的是 createRelationLine([，后面的代码会拿这个结果继续工作。
    new THREE.Vector3(3.8, 0.16, 0.07), // 这里创建一个三维点，坐标是 3.8, 0.16, 0.07。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
    new THREE.Vector3(6.0, 0.16, 0.07), // 这里创建一个三维点，坐标是 6.0, 0.16, 0.07。这些点通常会首尾连接起来，形成投影面的矩形边框或投影特征线。
  ]); // 这里结束点数组并把它交给函数使用。前面列出的点会被连接成完整线框或线段。
  widthCopy.position.set(3.8, -4.2, 0); // 这里一次性设置 widthCopy.position 的坐标或角度为 3.8, -4.2, 0，比逐个写 x、y、z 更直接。
  widthCopy.geometry.translate(-3.8, -0.16, -0.07); // 这里把几何体整体平移 -3.8, -0.16, -0.07，用于把 STL 从原始坐标移动到教学场景里的合适位置。
  widthCopy.userData.motion = { // 这里把 { 存进 widthCopy.userData.motion。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
    type: 'rotate', // 这里说明动画类型是 'rotate'，程序会根据它判断这一步是平移还是旋转。
    from: 0, // 这里保存动画起点 0，动画开始时对象会先从这里出发。
    to: -Math.PI / 2, // 这里保存动画终点 -Math.PI / 2，动画完成时对象会停在这里。
  }; // 这里结束对象，表示这张配置表或数据表已经写完。

  const lengthLabel = createLabel('长对正', 'scene-label relation-label'); // 这里创建 lengthLabel 文字标签。标签会跟随三维坐标显示，用来标出轴名、投影面名或投影视图名。
  lengthLabel.position.set(2.1, -1.85, 0.08); // 这里一次性设置 lengthLabel.position 的坐标或角度为 2.1, -1.85, 0.08，比逐个写 x、y、z 更直接。
  const heightLabel = createLabel('高平齐', 'scene-label relation-label'); // 这里创建 heightLabel 文字标签。标签会跟随三维坐标显示，用来标出轴名、投影面名或投影视图名。
  heightLabel.position.set(4.45, 2.38, 0.08); // 这里一次性设置 heightLabel.position 的坐标或角度为 4.45, 2.38, 0.08，比逐个写 x、y、z 更直接。
  const widthLabel = createLabel('宽相等', 'scene-label relation-label'); // 这里创建 widthLabel 文字标签。标签会跟随三维坐标显示，用来标出轴名、投影面名或投影视图名。
  widthLabel.position.set(5.55, -3.0, 0.08); // 这里一次性设置 widthLabel.position 的坐标或角度为 5.55, -3.0, 0.08，比逐个写 x、y、z 更直接。
  const summaryLabel = createLabel('长对正 · 高平齐 · 宽相等', 'scene-label relation-summary'); // 这里创建 summaryLabel 文字标签。标签会跟随三维坐标显示，用来标出轴名、投影面名或投影视图名。
  summaryLabel.position.set(3.35, -6.8, 0.08); // 这里一次性设置 summaryLabel.position 的坐标或角度为 3.35, -6.8, 0.08，比逐个写 x、y、z 更直接。

  const steps = [ // 这里取出三等关系的步骤清单。每个步骤对应“长对正”“高平齐”或“宽相等”的一段演示。
    [lengthCopy, lengthLabel], // 这里开始写一个数组。数组像清单，里面的每一项会按顺序保存起来。
    [heightCopy, heightLabel], // 这里开始写一个数组。数组像清单，里面的每一项会按顺序保存起来。
    [widthCopy, widthLabel, summaryLabel], // 这里开始写一个数组。数组像清单，里面的每一项会按顺序保存起来。
  ]; // 这里结束数组，表示这份清单已经列完。

  steps.flat().forEach((item) => { // 这里把三等关系步骤展开成一层清单，然后逐个处理每条线和每个文字标签。
    item.visible = false; // 这里把 item 隐藏起来，它还在程序里，但用户暂时看不到。
    group.add(item); // 这里把 item 放进 group 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

  group.userData.steps = steps; // 这里把 steps 存进 group.userData.steps。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
  return group; // 这里返回 group。函数执行到 return 就结束，并把结果交回调用它的地方。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
