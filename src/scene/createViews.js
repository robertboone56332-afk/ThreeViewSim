import * as THREE from 'three'; // 这里把 Three.js 整个工具包取名为 THREE，后面创建场景、相机、模型、材质、向量都要用它。
import { createLabel } from '../ui/labels.js'; // 这里从 ../ui/labels.js 导入 createLabel。意思是本文件要使用其他文件已经写好的功能。

const viewColors = { // 这里定义 viewColors，它保存的是 一个对象的开始。对象像一张表，里面会把多个相关信息用名字收在一起，后面的代码会拿这个结果继续工作。
  front: 0xd63832, // 这里规定正投影使用红色。后面创建正投影线和正投影视图时都会读取这个颜色。
  side: 0x1e9b55, // 这里设置平面两面都可见。投影面转动或相机绕到背面时，平面也不会消失。
  top: 0x1f72d6, // 这里规定水平投影使用蓝色。后面创建水平投影线和水平投影视图时都会读取这个颜色。
}; // 这里结束对象，表示这张配置表或数据表已经写完。

function createMaterial(color) { // 这里定义 createMaterial 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  return new THREE.LineBasicMaterial({ // 这里返回 new THREE.LineBasicMaterial({。函数执行到 return 就结束，并把结果交回调用它的地方。
    color, // 这里把 color 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    transparent: true, // 这里允许材质透明。只有打开这个开关，后面 opacity 的淡入淡出动画才有效。
    opacity: 0, // 这里设置透明度为 0。1 是完全可见，0 是完全透明，0.32 这类值就是半透明。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

function createPath(points, material) { // 这里定义 createPath 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  return new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material); // 这里返回 new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), material)。函数执行到 return 就结束，并把结果交回调用它的地方。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

function clearView(group) { // 这里定义 clearView 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  const label = group.userData.label; // 这里定义 label，它保存的是 group.userData.label，后面的代码会拿这个结果继续工作。
  group.children.filter((child) => child !== label).forEach((child) => { // 这里先排除固定的文字标签，再遍历剩下的投影线对象，准备删除旧轮廓线。
    child.geometry?.dispose(); // 这里释放 child.geometry? 占用的资源。三维几何体和材质会占显存，用完不释放会越积越多。
    child.material?.dispose(); // 这里释放 child.material? 占用的资源。三维几何体和材质会占显存，用完不释放会越积越多。
    group.remove(child); // 这里让 group 执行 remove 这个方法，传入 child，完成它负责的那一步操作。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

function createViewGroup(labelText, labelPosition) { // 这里定义 createViewGroup 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  const group = new THREE.Group(); // 这里创建一个 Three.js 分组。分组像文件夹，能把相关模型、线条或标签统一管理。
  const label = createLabel(labelText, 'scene-label view-label'); // 这里定义 label，它保存的是 createLabel(labelText, 'scene-label view-label')，后面的代码会拿这个结果继续工作。
  label.position.copy(labelPosition); // 这里把 labelPosition 的坐标复制给 label.position。复制后，两者数值一样，但仍然是两个独立对象。
  group.add(label); // 这里把 label 放进 group 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。
  group.userData.label = label; // 这里把 label 存进 group.userData.label。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
  return group; // 这里返回 group。函数执行到 return 就结束，并把结果交回调用它的地方。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

export function createViews() { // 这里导出 createViews 函数。别的文件导入后，就能执行这里封装好的完整流程。
  const vProjection = createViewGroup('正投影', new THREE.Vector3(3.5, -0.08, 4.55)); // 这里定义 vProjection，它保存的是 createViewGroup('正投影', new THREE.Vector3(0.9, -0.08, 4.25))，后面的代码会拿这个结果继续工作。
  const wProjection = createViewGroup('侧投影', new THREE.Vector3(-0.08, 4.4, 4.55)); // 这里定义 wProjection，它保存的是 createViewGroup('侧投影', new THREE.Vector3(-0.08, 4.8, 4.25))，后面的代码会拿这个结果继续工作。
  const hProjection = createViewGroup('水平投影', new THREE.Vector3(3.5, 6.9, 0.08)); // 这里定义 hProjection，它保存的是 createViewGroup('水平投影', new THREE.Vector3(0.9, 4.8, 0.08))，后面的代码会拿这个结果继续工作。

  function addProjectedEdges(targetGroup, sourceGeometry, mapper, material) { // 这里定义 addProjectedEdges 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
    const edgeGeometry = new THREE.EdgesGeometry(sourceGeometry, 18); // 这里创建 edgeGeometry 几何体。几何体保存点、线、面的形状数据，材质负责把它显示出来。
    const source = edgeGeometry.getAttribute('position'); // 这里定义 source，它保存的是 edgeGeometry.getAttribute('position')，后面的代码会拿这个结果继续工作。
    const points = []; // 这里定义 points，它保存的是 []，后面的代码会拿这个结果继续工作。
    for (let i = 0; i < source.count; i += 1) { // 这里开始循环，循环规则是 let i = 0; i < source.count; i += 1，程序会一项一项重复处理。
      points.push(mapper(new THREE.Vector3(source.getX(i), source.getY(i), source.getZ(i)))); // 这里把新数据放进 points 数组末尾。数组收集完点以后，就能生成线条。
    } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
    targetGroup.add(new THREE.LineSegments( // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
      new THREE.BufferGeometry().setFromPoints(points), // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
      material, // 这里把 material 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    )); // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
    edgeGeometry.dispose(); // 这里释放 edgeGeometry 占用的资源。三维几何体和材质会占显存，用完不释放会越积越多。
  } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

  function updateFromGeometry(geometry) { // 这里定义 updateFromGeometry 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
    const frontMaterial = createMaterial(viewColors.front); // 这里创建 frontMaterial 材质。材质决定对应物体的颜色、透明度、金属感或是否受光照影响。
    const sideMaterial = createMaterial(viewColors.side); // 这里创建 sideMaterial 材质。材质决定对应物体的颜色、透明度、金属感或是否受光照影响。
    const topMaterial = createMaterial(viewColors.top); // 这里创建 topMaterial 材质。材质决定对应物体的颜色、透明度、金属感或是否受光照影响。

    clearView(vProjection); // 这里调用 clearView 函数，并把 vProjection 交给它，让它完成封装好的那一步。
    clearView(wProjection); // 这里调用 clearView 函数，并把 wProjection 交给它，让它完成封装好的那一步。
    clearView(hProjection); // 这里调用 clearView 函数，并把 hProjection 交给它，让它完成封装好的那一步。

    addProjectedEdges( // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
      vProjection, // 这里把 vProjection 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
      geometry, // 这里把 geometry 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
      (point) => new THREE.Vector3(point.x, -0.018, point.z), // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
      frontMaterial, // 这里把 frontMaterial 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    ); // 这里结束上一行开始的函数调用，所有参数都已经传完。
    addProjectedEdges( // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
      wProjection, // 这里把 wProjection 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
      geometry, // 这里把 geometry 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
      (point) => new THREE.Vector3(-0.018, point.y, point.z), // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
      sideMaterial, // 这里把 sideMaterial 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    ); // 这里结束上一行开始的函数调用，所有参数都已经传完。
    addProjectedEdges( // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
      hProjection, // 这里把 hProjection 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
      geometry, // 这里把 geometry 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
      (point) => new THREE.Vector3(point.x, point.y, 0.018), // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
      topMaterial, // 这里把 topMaterial 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    ); // 这里结束上一行开始的函数调用，所有参数都已经传完。

    vProjection.userData.material = frontMaterial; // 这里把 frontMaterial 存进 vProjection.userData.material。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
    wProjection.userData.material = sideMaterial; // 这里把 sideMaterial 存进 wProjection.userData.material。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
    hProjection.userData.material = topMaterial; // 这里把 topMaterial 存进 hProjection.userData.material。userData 是 Three.js 给对象准备的“备注本”，我们可以把加载状态、模型信息、回调函数放进去。
  } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

  return { // 这里开始返回一个对象。对象里会装多个结果，调用方可以一次拿到它们。
    vProjection, // 这里把 vProjection 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    wProjection, // 这里把 wProjection 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    hProjection, // 这里把 hProjection 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    updateFromGeometry, // 这里把 updateFromGeometry 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  }; // 这里结束对象，表示这张配置表或数据表已经写完。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
