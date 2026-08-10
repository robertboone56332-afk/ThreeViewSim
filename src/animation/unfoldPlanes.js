import { tween, tweenMany } from './tween.js'; // 这里从 ./tween.js 导入 tween, tweenMany。意思是本文件要使用其他文件已经写好的功能。
import { animateToFrontCamera } from './cameraAnimation.js'; // 这里从 ./cameraAnimation.js 导入 animateToFrontCamera。意思是本文件要使用其他文件已经写好的功能。

export function unfoldPlanes({ hingeH, hingeW, part, projectionLines, camera, controls, coordinateAxes }, done) { // 这里导出 unfoldPlanes 函数。别的文件导入后，就能执行这里封装好的完整流程。
  const startH = hingeH.rotation.x; // 这里定义 startH，它保存的是 hingeH.rotation.x，后面的代码会拿这个结果继续工作。
  const startW = hingeW.rotation.z; // 这里定义 startW，它保存的是 hingeW.rotation.z，后面的代码会拿这个结果继续工作。
  const targetH = -Math.PI / 2; // 这里定义 targetH，它保存的是 -Math.PI / 2，后面的代码会拿这个结果继续工作。
  const targetW = Math.PI / 2; // 这里定义 targetW，它保存的是 Math.PI / 2，后面的代码会拿这个结果继续工作。

  tween({ // 这里开始播放一段补间动画。补间动画的意思是：程序从 0 到 1 慢慢变化数值，让画面平滑过渡。
    duration: 420, // 这里设置动画播放 420 毫秒，时间越长变化越慢，用户越容易看清过程。
    onUpdate: (value) => { // 这里写每一帧动画要做的事。浏览器会不断传入进度值，画面就能连续变化。
      const opacity = 1 - value; // 这里根据动画进度算出透明度，后面会用它让平面、线条或模型慢慢出现或消失。
      part.userData.setOpacity(opacity); // 这里让 part.userData 执行 setOpacity 这个方法，传入 opacity，完成它负责的那一步操作。
    }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
    onComplete: () => { // 这里写动画结束后要做的事，比如切换提示文字、解锁按钮或进入下一段动画。
      part.visible = false; // 这里把 part 隐藏起来，它还在程序里，但用户暂时看不到。
      coordinateAxes?.userData.setOriginLabelVisible?.(true);
      [projectionLines?.vLines, projectionLines?.wLines, projectionLines?.hLines].forEach((lineGroup) => { // 这里开始写一个数组。数组像清单，里面的每一项会按顺序保存起来。
        lineGroup?.children.forEach((line) => { // 这里遍历 lineGroup?.children 里的每一个成员，每次取出的成员叫 line，下面会逐个修改它们的显示、透明度或状态。
          line.visible = false; // 这里把 line 隐藏起来，它还在程序里，但用户暂时看不到。
          line.material.opacity = 0; // 这里设置材质透明度为 0，所以对应的平面或线条会变清楚、变淡或消失。
        }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
        if (lineGroup) lineGroup.visible = false; // 这里判断 lineGroup 是否成立。成立时执行下面的大括号内容，不成立就跳过。
      }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
      tweenMany([ // 这里开始同时安排多段补间动画。比如平面淡入和边框淡入可以一起进行。
        { // 这里开始写一个对象配置。接下来的几行会说明这次动画或这组数据具体怎么工作。
          duration: 1700, // 这里设置动画播放 1700 毫秒，时间越长变化越慢，用户越容易看清过程。
          onUpdate: (value) => { // 这里写每一帧动画要做的事。浏览器会不断传入进度值，画面就能连续变化。
            hingeH.rotation.x = startH + (targetH - startH) * value; // 这里把 hingeH.rotation.x 旋转角度设成 startH + (targetH - startH) * value。投影面展开和复位时，就是靠改变这些角度实现翻转。
          }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
        }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
        { // 这里开始写一个对象配置。接下来的几行会说明这次动画或这组数据具体怎么工作。
          delay: 350, // 这里设置延迟 350 毫秒开始，用来让多个动画错开一点，过程更像教材展开步骤。
          duration: 1700, // 这里设置动画播放 1700 毫秒，时间越长变化越慢，用户越容易看清过程。
          onUpdate: (value) => { // 这里写每一帧动画要做的事。浏览器会不断传入进度值，画面就能连续变化。
            hingeW.rotation.z = startW + (targetW - startW) * value; // 这里把 hingeW.rotation.z 旋转角度设成 startW + (targetW - startW) * value。投影面展开和复位时，就是靠改变这些角度实现翻转。
          }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
        }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
      ], () => { // 这里结束动画任务数组，并开始写这些动画全部完成后的下一步处理。
        animateToFrontCamera(camera, controls, done); // 这里调用正视相机动画，让展开后的三视图更接近教材上的平面观察方式。
      }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
    }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
