import { animateToInitialCamera } from './cameraAnimation.js'; // 这里从 ./cameraAnimation.js 导入 animateToInitialCamera。意思是本文件要使用其他文件已经写好的功能。

export function resetSceneObjects({ // 这里导出 resetSceneObjects 函数。别的文件导入后，就能执行这里封装好的完整流程。
  state, // 这里把 state 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  part, // 这里把 part 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  planes, // 这里把 planes 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  frames, // 这里把 frames 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  hingeH, // 这里把 hingeH 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  hingeW, // 这里把 hingeW 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  projectionLines, // 这里把 projectionLines 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  viewGroups, // 这里把 viewGroups 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  relationGroup, // 这里把 relationGroup 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  labels, // 这里把 labels 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  coordinateAxes, // 这里把 coordinateAxes 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  relationOverlay, // 这里把 relationOverlay 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  camera, // 这里把 camera 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  controls, // 这里把 controls 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
}, done) { // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
  state.vPlaneVisible = true; // 这里更新应用状态 state.vPlaneVisible 为 true。这个状态像开关，后面的按钮逻辑会靠它判断当前步骤。
  state.wPlaneVisible = true; // 这里更新应用状态 state.wPlaneVisible 为 true。这个状态像开关，后面的按钮逻辑会靠它判断当前步骤。
  state.hPlaneVisible = true; // 这里更新应用状态 state.hPlaneVisible 为 true。这个状态像开关，后面的按钮逻辑会靠它判断当前步骤。
  state.vProjectionVisible = false; // 这里更新应用状态 state.vProjectionVisible 为 false。这个状态像开关，后面的按钮逻辑会靠它判断当前步骤。
  state.wProjectionVisible = false; // 这里更新应用状态 state.wProjectionVisible 为 false。这个状态像开关，后面的按钮逻辑会靠它判断当前步骤。
  state.hProjectionVisible = false; // 这里更新应用状态 state.hProjectionVisible 为 false。这个状态像开关，后面的按钮逻辑会靠它判断当前步骤。
  state.unfolded = false; // 这里更新应用状态 state.unfolded 为 false。这个状态像开关，后面的按钮逻辑会靠它判断当前步骤。
  state.planesHiddenAfterUnfold = false; // 这里更新应用状态 state.planesHiddenAfterUnfold 为 false。这个状态像开关，后面的按钮逻辑会靠它判断当前步骤。
  state.relationVisible = false; // 这里更新应用状态 state.relationVisible 为 false。这个状态像开关，后面的按钮逻辑会靠它判断当前步骤。

  hingeH.rotation.set(0, 0, 0); // 这里一次性设置 hingeH.rotation 的坐标或角度为 0, 0, 0，比逐个写 x、y、z 更直接。
  hingeW.rotation.set(0, 0, 0); // 这里一次性设置 hingeW.rotation 的坐标或角度为 0, 0, 0，比逐个写 x、y、z 更直接。

  part.visible = true; // 这里让 part 显示出来，用户会在三维场景或页面标签层看到它。
  part.userData.setOpacity(1); // 这里让 part.userData 执行 setOpacity 这个方法，传入 1，完成它负责的那一步操作。

  planes.forEach((plane) => { // 这里遍历 planes 里的每一个成员，每次取出的成员叫 plane，下面会逐个修改它们的显示、透明度或状态。
    plane.visible = false; // 这里把 plane 隐藏起来，它还在程序里，但用户暂时看不到。
    plane.material.opacity = 0; // 这里设置材质透明度为 0，所以对应的平面或线条会变清楚、变淡或消失。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
  frames.forEach((frame) => { // 这里遍历 frames 里的每一个成员，每次取出的成员叫 frame，下面会逐个修改它们的显示、透明度或状态。
    frame.visible = false; // 这里把 frame 隐藏起来，它还在程序里，但用户暂时看不到。
    frame.material.opacity = 0; // 这里设置材质透明度为 0，所以对应的平面或线条会变清楚、变淡或消失。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
  labels.forEach((label) => { // 这里遍历 labels 里的每一个成员，每次取出的成员叫 label，下面会逐个修改它们的显示、透明度或状态。
    label.visible = false; // 这里把 label 隐藏起来，它还在程序里，但用户暂时看不到。
    label.element.style.opacity = '1'; // 这里设置网页文字或 SVG 元素的透明度为 '1'，让它能跟随动画淡入淡出。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

  projectionLines.group.visible = true; // 这里让 projectionLines.group 显示出来，用户会在三维场景或页面标签层看到它。
  [projectionLines.vLines, projectionLines.wLines, projectionLines.hLines].forEach((lineGroup) => { // 这里开始写一个数组。数组像清单，里面的每一项会按顺序保存起来。
    lineGroup.visible = false; // 这里把 lineGroup 隐藏起来，它还在程序里，但用户暂时看不到。
    lineGroup.children.forEach((line) => { // 这里遍历 lineGroup.children 里的每一个成员，每次取出的成员叫 line，下面会逐个修改它们的显示、透明度或状态。
      line.visible = false; // 这里把 line 隐藏起来，它还在程序里，但用户暂时看不到。
      line.scale.setScalar(0.001); // 这里把缩放比例统一设为 0.001。投影线出现时，会从接近 0 的长度慢慢长出来。
      line.material.opacity = 0; // 这里设置材质透明度为 0，所以对应的平面或线条会变清楚、变淡或消失。
    }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

  viewGroups.forEach((group) => { // 这里遍历 viewGroups 里的每一个成员，每次取出的成员叫 group，下面会逐个修改它们的显示、透明度或状态。
    group.visible = false; // 这里把 group 隐藏起来，它还在程序里，但用户暂时看不到。
    group.traverse((child) => { // 这里从 group 开始向下遍历所有子对象，每个子对象临时叫 child，这样材质线条和文字标签都能被统一处理。
      if (child.material) child.material.opacity = 0; // 这里如果子对象有材质，就把它完全透明，复位时对应线条或轮廓会消失。
      if (child.element) child.element.style.opacity = '0'; // 这里如果子对象是文字标签，就把它的网页透明度设为 0，复位时标签会隐藏。
    }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

  relationGroup.visible = false; // 这里把 relationGroup 隐藏起来，它还在程序里，但用户暂时看不到。
  relationGroup.userData.steps.flat().forEach((item) => { // 这里遍历三等关系分组里保存的所有演示元素，复位时要把它们逐个隐藏。
    item.visible = false; // 这里把 item 隐藏起来，它还在程序里，但用户暂时看不到。
    if (item.material) item.material.opacity = 0; // 这里如果三等关系元素有材质，就把它完全透明，复位或隐藏时用户看不到它。
    if (item.element) item.element.style.opacity = '0'; // 这里如果三等关系元素是文字标签，就把网页文字透明度设为 0，让文字也一起隐藏。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

  coordinateAxes?.userData.setUnfoldedNames(false); // 这里让 coordinateAxes?.userData 执行 setUnfoldedNames 这个方法，传入 false，完成它负责的那一步操作。
  coordinateAxes?.traverse((child) => { // 这里从 coordinateAxes? 开始向下遍历所有子对象，每个子对象临时叫 child，这样材质线条和文字标签都能被统一处理。
    if (child.element && ['X', 'Y', 'Z'].includes(child.element.textContent)) { // 这里判断 child.element && ['OX', 'OY', 'OZ', 'O'].includes(child.element.textContent) 是否成立。成立时执行下面的大括号内容，不成立就跳过。
      child.visible = true; // 这里让 child 显示出来，用户会在三维场景或页面标签层看到它。
      child.element.style.opacity = '1'; // 这里设置网页文字或 SVG 元素的透明度为 '1'，让它能跟随动画淡入淡出。
    } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
  relationOverlay?.clear(); // 这里清空 relationOverlay?。旧线条先清掉，后面才能按最新模型重新生成正确线条。

  animateToInitialCamera(camera, controls, done); // 这里调用相机复位动画，让画面回到初始观察角度。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。


