import * as THREE from 'three'; // 这里把 Three.js 整个工具包取名为 THREE，后面创建场景、相机、模型、材质、向量都要用它。
import { createLabel } from '../ui/labels.js'; // 这里从 ../ui/labels.js 导入 createLabel。意思是本文件要使用其他文件已经写好的功能。

function createAxis(start, end, color) { // 这里定义 createAxis 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  const direction = end.clone().sub(start); // 这里定义 direction，它保存的是 复制出来的新对象。这样后面修改它时不会意外改坏原始数据，后面的代码会拿这个结果继续工作。
  const length = direction.length(); // 这里定义 length，它保存的是 direction.length()，后面的代码会拿这个结果继续工作。
  return new THREE.ArrowHelper(direction.normalize(), start, length, color, 0.22, 0.12); // 这里返回 new THREE.ArrowHelper(direction.normalize(), start, length, color, 0.22, 0.12)。函数执行到 return 就结束，并把结果交回调用它的地方。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

export function createCoordinateAxes() { // 这里导出 createCoordinateAxes 函数。别的文件导入后，就能执行这里封装好的完整流程。
  const group = new THREE.Group(); // 这里创建一个 Three.js 分组。分组像文件夹，能把相关模型、线条或标签统一管理。
  group.name = 'TeachingCoordinateAxes'; // 这里给这个 Three.js 对象起名 'TeachingCoordinateAxes'。名字主要方便调试和理解层级结构，不直接改变画面外观。

  const origin = new THREE.Vector3(0, 0, 0); // 这里创建 O 点的三维坐标，也就是 OX、OY、OZ 三条轴共同出发的位置。
  const axisX = createAxis(origin, new THREE.Vector3(7.2, 0, 0), 0x29384a); // 这里创建 OX 轴箭头。它从 O 点出发，告诉用户这个方向是哪条坐标轴。
  const axisY = createAxis(origin, new THREE.Vector3(0, 7.2, 0), 0x29384a); // 这里创建 OY 轴箭头。它从 O 点出发，告诉用户这个方向是哪条坐标轴。
  const axisZ = createAxis(origin, new THREE.Vector3(0, 0, 4.8), 0x29384a); // 这里创建 OZ 轴箭头。它从 O 点出发，告诉用户这个方向是哪条坐标轴。
  const originPoint = new THREE.Mesh( // 这里定义 originPoint，它保存的是 一个网格模型。网格由形状和材质组成，最终能在三维画面里看到，后面的代码会拿这个结果继续工作。
    new THREE.SphereGeometry(0.055, 16, 12), // 这里创建一个小球几何体，用它在三维场景里表示坐标原点 O。
    new THREE.MeshBasicMaterial({ color: 0x111827 }), // 这里给原点小球创建深色材质，让 O 点在浅色背景上容易看见。
  ); // 这里结束上一行开始的函数调用，所有参数都已经传完。

  const oLabel = createLabel('O', 'scene-label axis-label'); // 这里创建 oLabel 文字标签。标签会跟随三维坐标显示，用来标出轴名、投影面名或投影视图名。
  oLabel.position.set(-0.12, -0.12, 0.1); // 这里一次性设置 oLabel.position 的坐标或角度为 -0.12, -0.12, 0.1，比逐个写 x、y、z 更直接。
oLabel.visible = false;
  const oxLabel = createLabel('X', 'scene-label axis-label'); // 这里创建 oxLabel 文字标签。标签会跟随三维坐标显示，用来标出轴名、投影面名或投影视图名。
  oxLabel.position.set(6.45, 0, 0); // 这里一次性设置 oxLabel.position 的坐标或角度为 6.45, 0, 0，比逐个写 x、y、z 更直接。

  const oyLabel = createLabel('Y', 'scene-label axis-label'); // 这里创建 oyLabel 文字标签。标签会跟随三维坐标显示，用来标出轴名、投影面名或投影视图名。
  oyLabel.position.set(0, 6.45, 0); // 这里一次性设置 oyLabel.position 的坐标或角度为 0, 16.45, 0，比逐个写 x、y、z 更直接。

  const ozLabel = createLabel('Z', 'scene-label axis-label'); // 这里创建 ozLabel 文字标签。标签会跟随三维坐标显示，用来标出轴名、投影面名或投影视图名。
  ozLabel.position.set(0, 0, 4.75); // 这里一次性设置 ozLabel.position 的坐标或角度为 0, 0, 4.75，比逐个写 x、y、z 更直接。

  const oywLabel = createLabel('YW', 'scene-label axis-label axis-label-unfolded'); // 这里创建 oywLabel 文字标签。标签会跟随三维坐标显示，用来标出轴名、投影面名或投影视图名。
  oywLabel.position.set(-5.05, 0.05, 0.05); // 这里一次性设置 oywLabel.position 的坐标或角度为 -5.05, 0.05, 0.05，比逐个写 x、y、z 更直接。
  oywLabel.visible = false; // 这里把 oywLabel 隐藏起来，它还在程序里，但用户暂时看不到。

  const oyhLabel = createLabel('YH', 'scene-label axis-label axis-label-unfolded'); // 这里创建 oyhLabel 文字标签。标签会跟随三维坐标显示，用来标出轴名、投影面名或投影视图名。
  oyhLabel.position.set(0.05, 0.05, -5.05); // 这里一次性设置 oyhLabel.position 的坐标或角度为 0.05, 0.05, -5.05，比逐个写 x、y、z 更直接。
  oyhLabel.visible = false; // 这里把 oyhLabel 隐藏起来，它还在程序里，但用户暂时看不到。

  group.add(axisX, axisY, axisZ, originPoint, oLabel, oxLabel, oyLabel, ozLabel, oywLabel, oyhLabel); // 这里把 axisX, axisY, axisZ, originPoint, oLabel, oxLabel, oyLabel, ozLabel, oywLabel, oyhLabel 放进 group 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。

    group.userData.setUnfoldedNames = (unfolded) => {
    oyLabel.visible = !unfolded;
    oywLabel.visible = unfolded;
    oyhLabel.visible = unfolded;

    // 一键复位后模型重新出现，因此原点 O 标签重新隐藏
    if (!unfolded) {
      oLabel.visible = false;
    }
  };

  group.userData.setOriginLabelVisible = (visible) => {
    oLabel.visible = visible;
  };

  return group;
}
