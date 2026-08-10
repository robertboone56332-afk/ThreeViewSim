import * as THREE from 'three'; // 这里把 Three.js 整个工具包取名为 THREE，后面创建场景、相机、模型、材质、向量都要用它。

export const MODEL_BOUNDS = { // 这里导出 MODEL_BOUNDS 对象。导出的意思是：别的文件也可以拿到这组数据一起用。
  minX: 2.45, // 这里记录模型最左边的 X 坐标 2.45，投影和包围盒计算会用它确定左边界。
  maxX: 16.85, // 这里记录模型最右边的 X 坐标 16.85，投影和包围盒计算会用它确定右边界。
  minY: 1.63, // 这里记录模型在 Y 方向的起点 1.63，侧投影和水平投影会用它计算宽度。
  maxY: 3.67, // 这里记录模型在 Y 方向的终点 3.67，侧投影和水平投影会用它计算宽度。
  minZ: 1.84, // 这里记录模型最低高度 1.84，正投影、侧投影会用它确定底部轮廓。
  maxZ: 3.88, // 这里记录模型最高高度 3.88，正投影、侧投影会用它确定顶部轮廓。
}; // 这里结束对象，表示这张配置表或数据表已经写完。

export const PLANE_SIZE = { // 这里导出 PLANE_SIZE 对象。导出的意思是：别的文件也可以拿到这组数据一起用。
  width: 7.2, // 这里设置投影面横向宽度为 7.2，也就是沿 OX 方向能覆盖多远。
  height: 4.8, // 这里设置投影面竖向高度为 4.8，也就是沿 OZ 方向能覆盖多高。
  depth: 7.2, // 这里设置 H 面的深度为 7.2，也就是水平投影面沿 OY 方向伸出去多长。
  wDepth: 7.2, // 这里设置 W 面自己的深度为 7.2，也就是侧投影面沿 OY 方向展开时有多宽。
}; // 这里结束对象，表示这张配置表或数据表已经写完。

export const MODEL_PLACEMENT = { // 这里导出 MODEL_PLACEMENT 对象。导出的意思是：别的文件也可以拿到这组数据一起用。
  targetMaxSize: 3.4, // 这里规定 STL 导入后最长边缩放到 3.4，这样模型不会因为原文件尺寸太大或太小而不适合观察。
}; // 这里结束对象，表示这张配置表或数据表已经写完。

export function updateModelBoundsFromBox(box) { // 这里导出 updateModelBoundsFromBox 函数。别的文件导入后，就能执行这里封装好的完整流程。
  MODEL_BOUNDS.minX = box.min.x; // 这里把 MODEL_BOUNDS.minX 设成 box.min.x。也就是说，从这一行开始，程序后面再读取 MODEL_BOUNDS.minX 时得到的就是这个新值。
  MODEL_BOUNDS.maxX = box.max.x; // 这里把 MODEL_BOUNDS.maxX 设成 box.max.x。也就是说，从这一行开始，程序后面再读取 MODEL_BOUNDS.maxX 时得到的就是这个新值。
  MODEL_BOUNDS.minY = box.min.y; // 这里把 MODEL_BOUNDS.minY 设成 box.min.y。也就是说，从这一行开始，程序后面再读取 MODEL_BOUNDS.minY 时得到的就是这个新值。
  MODEL_BOUNDS.maxY = box.max.y; // 这里把 MODEL_BOUNDS.maxY 设成 box.max.y。也就是说，从这一行开始，程序后面再读取 MODEL_BOUNDS.maxY 时得到的就是这个新值。
  MODEL_BOUNDS.minZ = box.min.z; // 这里把 MODEL_BOUNDS.minZ 设成 box.min.z。也就是说，从这一行开始，程序后面再读取 MODEL_BOUNDS.minZ 时得到的就是这个新值。
  MODEL_BOUNDS.maxZ = box.max.z; // 这里把 MODEL_BOUNDS.maxZ 设成 box.max.z。也就是说，从这一行开始，程序后面再读取 MODEL_BOUNDS.maxZ 时得到的就是这个新值。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

export const INITIAL_CAMERA = { // 这里导出 INITIAL_CAMERA 对象。导出的意思是：别的文件也可以拿到这组数据一起用。
  position: new THREE.Vector3(14.0, 18.0, 12.75), // 这里给相机一个三维站位 new THREE.Vector3(4.0, 18.0, 2.75)，相当于告诉镜头从哪里看模型。
  target: new THREE.Vector3(3.15, 0.35, 2.15), // 这里给相机一个观察目标 new THREE.Vector3(3.15, 0.35, 2.15)，相当于告诉镜头中心对准哪里。
  zoom: 0.78, // 这里设置缩放为 0.78，它决定默认视图是看得更近还是看得更完整。
}; // 这里结束对象，表示这张配置表或数据表已经写完。

export const FRONT_CAMERA = { // 这里导出 FRONT_CAMERA 对象。导出的意思是：别的文件也可以拿到这组数据一起用。
  position: new THREE.Vector3(3.45, 10.8, 2.15), // 这里给相机一个三维站位 new THREE.Vector3(3.45, 10.8, 2.15)，相当于告诉镜头从哪里看模型。
  target: new THREE.Vector3(3.45, 0, 0), // 这里给相机一个观察目标 new THREE.Vector3(3.45, 0, 2.15)，相当于告诉镜头中心对准哪里。
  zoom: 0.75, // 这里设置缩放为 0.80，它决定默认视图是看得更近还是看得更完整。
}; // 这里结束对象，表示这张配置表或数据表已经写完。

export const appState = { // 这里导出 appState 对象。导出的意思是：别的文件也可以拿到这组数据一起用。
  vPlaneVisible: false, // 这里把 vPlaneVisible 设为 false，意思是：V 面一开始不显示。
  wPlaneVisible: false, // 这里把 wPlaneVisible 设为 false，意思是：W 面一开始不显示。
  hPlaneVisible: false, // 这里把 hPlaneVisible 设为 false，意思是：H 面一开始不显示。
  vProjectionVisible: false, // 这里把 vProjectionVisible 设为 false，意思是：正投影一开始不显示。
  wProjectionVisible: false, // 这里把 wProjectionVisible 设为 false，意思是：侧投影一开始不显示。
  hProjectionVisible: false, // 这里把 hProjectionVisible 设为 false，意思是：水平投影一开始不显示。
  unfolded: false, // 这里把 unfolded 设为 false，意思是：三投影面一开始还没有展开。
  planesHiddenAfterUnfold: false, // 这里把 planesHiddenAfterUnfold 设为 false，意思是：展开后一开始没有额外隐藏平面背景。
  relationVisible: false, // 这里把 relationVisible 设为 false，意思是：三等关系辅助线一开始不显示。
  animating: false, // 这里把 animating 设为 false，意思是：页面一开始没有动画正在播放。
}; // 这里结束对象，表示这张配置表或数据表已经写完。
