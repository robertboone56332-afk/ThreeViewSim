import { INITIAL_CAMERA, FRONT_CAMERA } from '../data/geometryData.js'; // 这里从 ../data/geometryData.js 导入 INITIAL_CAMERA, FRONT_CAMERA。意思是本文件要使用其他文件已经写好的功能。
import { tween } from './tween.js'; // 这里从 ./tween.js 导入 tween。意思是本文件要使用其他文件已经写好的功能。

function animateCameraTo(camera, controls, targetConfig, duration = 1000, done) { // 这里定义 animateCameraTo 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  const startPosition = camera.position.clone(); // 这里记住动画开始前的相机位置。后面相机会从这个位置平滑移动到目标位置。
  const startTarget = controls.target.clone(); // 这里记住动画开始前相机看向的目标点。后面视线中心会从这里平滑转到新目标。
  const startZoom = camera.zoom; // 这里记住动画开始前的缩放值。后面会从这个缩放慢慢过渡到目标缩放。

  tween({ // 这里开始播放一段补间动画。补间动画的意思是：程序从 0 到 1 慢慢变化数值，让画面平滑过渡。
    duration, // 这里把 duration 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    onUpdate: (value) => { // 这里写每一帧动画要做的事。浏览器会不断传入进度值，画面就能连续变化。
      camera.position.lerpVectors(startPosition, targetConfig.position, value); // 这里在起点和终点之间计算中间坐标。动画每帧位置一点点变化，就形成平滑移动。
      controls.target.lerpVectors(startTarget, targetConfig.target, value); // 这里在起点和终点之间计算中间坐标。动画每帧位置一点点变化，就形成平滑移动。
      camera.zoom = startZoom + (targetConfig.zoom - startZoom) * value; // 这里把相机缩放设为 startZoom + (targetConfig.zoom - startZoom) * value。这会改变画面远近，但不会改变模型真实大小。
      camera.lookAt(controls.target); // 这里让相机朝向 controls.target。可以理解为让观察者把视线对准这个点。
      camera.updateProjectionMatrix(); // 这里刷新相机投影。相机参数改完后必须刷新，否则浏览器还会按旧参数画画面。
      controls.update(); // 这里刷新 controls，让鼠标控制器的阻尼、目标点或相机变化在这一帧生效。
    }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
    onComplete: done, // 这里写动画结束后要做的事，比如切换提示文字、解锁按钮或进入下一段动画。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

export function animateToInitialCamera(camera, controls, done) { // 这里导出 animateToInitialCamera 函数。别的文件导入后，就能执行这里封装好的完整流程。
  animateCameraTo(camera, controls, INITIAL_CAMERA, 950, done); // 这里调用 animateCameraTo 函数，并把 camera, controls, INITIAL_CAMERA, 950, done 交给它，让它完成封装好的那一步。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

export function animateToFrontCamera(camera, controls, done) { // 这里导出 animateToFrontCamera 函数。别的文件导入后，就能执行这里封装好的完整流程。
  animateCameraTo(camera, controls, FRONT_CAMERA, 1200, done); // 这里调用 animateCameraTo 函数，并把 camera, controls, FRONT_CAMERA, 1200, done 交给它，让它完成封装好的那一步。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
