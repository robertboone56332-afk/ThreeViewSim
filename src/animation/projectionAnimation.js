import { tween, tweenMany } from './tween.js'; // 这里导入补间动画工具；投影面、投影线和二维投影视图的淡入淡出都靠它们逐帧改变透明度。

export function animatePlaneVisibility(planes, frames, visible, done) { // 这里导出投影面显隐动画函数；它只负责蓝色投影面和边框的显示或隐藏。
  tweenMany([ // 这里同时播放平面和边框的透明度变化；这样投影面出现时不会突然闪出来。
    { // 这里开始写这次动画任务；下面会定义动画时间和每帧如何更新画面。
      duration: 520, // 这里把投影面显隐动画设为 520 毫秒；学生能看到平面自然淡入或淡出。
      onUpdate: (value) => { // 这里写动画每一帧要做的事；value 从 0 到 1 表示动画进度。
        const opacity = visible ? value * 0.32 : (1 - value) * 0.32; // 这里计算投影面透明度；显示时从 0 到 0.32，隐藏时从 0.32 回到 0。
        const frameOpacity = visible ? value : 1 - value; // 这里计算边框透明度；显示时边框变清楚，隐藏时边框变透明。
        planes.forEach((plane) => { // 这里逐个处理传进来的投影面；正投影面、侧投影面、水平投影面都可以用同一套动画。
          plane.material.opacity = opacity; // 这里把当前透明度写进投影面材质；学生看到的蓝色面会随动画变深或变浅。
          plane.visible = opacity > 0.01; // 这里在投影面几乎完全透明时把它隐藏；这样不可见物体不会继续参与渲染。
        }); // 这里结束投影面遍历；所有传入投影面的透明度都已经更新。
        frames.forEach((frame) => { // 这里逐个处理投影面边框；边框要跟随投影面一起淡入或淡出。
          frame.material.opacity = frameOpacity; // 这里把当前边框透明度写进边框材质；边框会从透明变清楚或从清楚变透明。
          frame.visible = frameOpacity > 0.01; // 这里在边框几乎透明时把它隐藏；这样画面里不会留下不可见线框。
        }); // 这里结束边框遍历；所有传入边框的透明度都已经更新。
      }, // 这里结束每帧更新函数；投影面和边框的显隐变化都在这里完成。
    }, // 这里结束单个动画任务配置；tweenMany 会执行这个任务。
  ], done); // 这里把任务交给 tweenMany，并在动画结束后调用 done 通知外层流程继续。
} // 这里结束 animatePlaneVisibility 函数；投影面按钮会调用它。

export function animateProjectionLines(linesGroup, visible, done) { // 这里导出投影线显隐动画函数；它负责让有限投影线从模型表面到投影面之间逐渐出现或隐藏。
  const lines = linesGroup.children; // 这里取出当前分组里的所有投影线；这些线已经是有限线段，不会穿过模型或无限延长。
  linesGroup.visible = true; // 这里先让投影线分组参与显示；具体每条线是否可见由下面透明度和缩放控制。
  tween({ // 这里开始投影线动画；投影线会从透明逐渐变清楚，隐藏时反向变化。
    duration: 850, // 这里把投影线动画设为 850 毫秒；学生能看清投影线从模型表面连向投影面的过程。
    onUpdate: (value) => { // 这里写动画每一帧要做的事；value 从 0 到 1 表示显示或隐藏进度。
      const amount = visible ? value : 1 - value; // 这里计算当前线条显示程度；显示时从 0 到 1，隐藏时从 1 到 0。
      lines.forEach((line) => { // 这里逐条处理有限投影线；每条线只连接模型表面点和投影面点。
        line.visible = amount > 0.01; // 这里在显示程度接近 0 时隐藏这条线；避免不可见线条继续渲染。
        line.scale.setScalar(Math.max(amount, 0.001)); // 这里让线段从自己的起点向终点逐渐伸出；因为几何体只有 start 和 end 两点，所以不会超出模型或投影面。
        line.material.opacity = amount * 0.72; // 这里设置投影线透明度；最终保持细实线但比二维投影轮廓稍淡。
      }); // 这里结束投影线遍历；这一帧里所有线条都已经同步更新。
    }, // 这里结束每帧更新函数；投影线的伸出和淡入都在这里控制。
    onComplete: () => { // 这里写动画结束后要做的事；最终可见状态要固定下来。
      linesGroup.visible = visible; // 这里把整组投影线最终状态设成目标值；再次点击隐藏时整组都会不可见。
      done?.(); // 这里通知外层投影线动画已经结束；如果没有传 done，问号会让这里安全跳过。
    }, // 这里结束动画完成回调；二维投影视图通常会在这个回调后继续出现。
  }); // 这里结束投影线动画配置；浏览器会开始逐帧执行。
} // 这里结束 animateProjectionLines 函数；正、侧、水平投影按钮都会调用它。

export function animateProjectionViews(viewGroups, visible, done) { // 这里导出二维投影视图显隐动画函数；它负责让投影面上的红绿蓝轮廓逐渐出现或隐藏。
  tween({ // 这里开始二维投影视图淡入淡出动画；线条和文字标签会一起变化。
    duration: 720, // 这里把二维投影视图动画设为 720 毫秒；投影线出现后，投影视图会自然形成。
    onUpdate: (value) => { // 这里写动画每一帧要做的事；value 从 0 到 1 表示动画进度。
      const opacity = visible ? value : 1 - value; // 这里计算当前透明度；显示时越来越清楚，隐藏时越来越透明。
      viewGroups.forEach((group) => { // 这里逐个处理投影视图分组；一个按钮通常只传入一个视图，展开准备可能传入多个。
        group.visible = opacity > 0.01; // 这里在透明度几乎为 0 时隐藏整个视图；这样不可见对象不会干扰画面。
        group.traverse((child) => { // 这里遍历视图中的所有子对象；二维轮廓线和文字标签都要同步淡入淡出。
          if (child.material) child.material.opacity = opacity; // 这里如果子对象是 Three.js 线条，就把线条材质透明度改成当前动画透明度。
          if (child.element) child.element.style.opacity = opacity.toFixed(2); // 这里如果子对象是网页文字标签，就把标签透明度改成当前动画透明度。
        }); // 这里结束视图子对象遍历；这一帧里线条和标签都已经更新。
      }); // 这里结束视图分组遍历；所有传入视图都已经同步更新透明度。
    }, // 这里结束每帧更新函数；二维投影视图的形成和隐藏都在这里完成。
    onComplete: () => { // 这里写动画结束后要做的事；最终显示状态要固定下来。
      viewGroups.forEach((group) => { // 这里逐个处理投影视图分组；每个分组都要写入最终 visible 状态。
        group.visible = visible; // 这里把视图最终显隐状态设成目标值；显示则保留，隐藏则彻底不可见。
      }); // 这里结束最终状态遍历；所有视图都已经固定到目标状态。
      done?.(); // 这里通知外层二维投影视图动画已经结束；按钮状态和文字提示可以继续更新。
    }, // 这里结束动画完成回调；外层流程会在这里之后解锁按钮。
  }); // 这里结束二维视图动画配置；浏览器会开始逐帧执行。
} // 这里结束 animateProjectionViews 函数；它只显示或隐藏投影面上的二维轮廓，不移动模型。

export function animateRelationSteps(relationGroup, visible, done) { // 这里保留三等关系的旧 Three.js 分步动画函数；本轮不修改长对正、高平齐、宽相等逻辑。
  const steps = relationGroup.userData.steps; // 这里取出三等关系步骤清单；每一步里面有线条和文字标签。
  relationGroup.visible = true; // 这里先让三等关系分组参与显示；如果目标是隐藏，下面会立即把它关闭。
  steps.flat().forEach((item) => { // 这里把所有步骤里的元素展开成一层清单，然后逐个恢复到动画开始前的状态。
    item.visible = false; // 这里先隐藏每一个关系元素；播放到对应步骤时再显示。
    if (item.userData.motion?.type === 'translate') item.position.copy(item.userData.motion.from); // 这里如果元素要平移，就把它放回平移动画的起点。
    if (item.userData.motion?.type === 'rotate') item.rotation.z = item.userData.motion.from; // 这里如果元素要旋转，就把它放回旋转动画的起始角度。
    if (item.material) item.material.opacity = 0; // 这里如果元素有 Three.js 材质，就先把它设成完全透明。
    if (item.element) item.element.style.opacity = '0'; // 这里如果元素是网页文字标签，就先把文字透明度设成 0。
  }); // 这里结束关系元素初始化；所有元素都已经准备好等待分步显示。

  if (!visible) { // 这里判断这次是不是要隐藏三等关系；如果目标是隐藏，就不播放后面的分步动画。
    relationGroup.visible = false; // 这里把整个三等关系分组隐藏；用户不会看到任何关系线或文字。
    done?.(); // 这里通知外层隐藏流程已经完成；问号保证没有回调时也不会报错。
    return; // 这里提前结束函数；隐藏关系时不需要继续播放 showNextStep。
  } // 这里结束隐藏分支；如果目标是显示，代码会继续往下播放步骤。

  let current = 0; // 这里记录当前播放到第几个关系步骤；0 表示从第一步开始。
  function showNextStep() { // 这里定义播放下一步的函数；每播放完一步，它会延迟一点再调用自己播放下一步。
    if (current >= steps.length) { // 这里判断所有步骤是否已经播放完；播放完就通知外层流程结束。
      done?.(); // 这里通知外层三等关系演示已经完成；按钮可以解除忙碌状态。
      return; // 这里结束 showNextStep；没有更多步骤需要播放。
    } // 这里结束播放完成判断；如果还没播完，就继续处理当前步骤。
    const items = steps[current]; // 这里取出当前步骤里的线条和文字；下面只让这一组元素显示并运动。
    items.forEach((item) => { // 这里逐个处理当前步骤元素；每个元素都要先变成可见。
      item.visible = true; // 这里让当前元素参与显示；透明度还会在 tween 里从 0 慢慢升高。
    }); // 这里结束当前步骤元素显隐准备；接下来开始播放这一组动画。
    tween({ // 这里开始当前关系步骤动画；它可能是平移、旋转，也可能只是淡入文字。
      duration: 520, // 这里设置每个关系步骤动画为 520 毫秒；学生能看清线条传递方向。
      onUpdate: (value) => { // 这里写每一帧要做的事；value 从 0 到 1 表示当前步骤进度。
        items.forEach((item) => { // 这里逐个更新当前步骤里的每一个元素。
          if (item.userData.motion?.type === 'translate') item.position.lerpVectors(item.userData.motion.from, item.userData.motion.to, value); // 这里如果元素是平移动画，就根据进度把它从起点移动到终点。
          if (item.userData.motion?.type === 'rotate') item.rotation.z = item.userData.motion.from + (item.userData.motion.to - item.userData.motion.from) * value; // 这里如果元素是旋转动画，就根据进度把它从起始角度转到目标角度。
          if (item.material) item.material.opacity = value; // 这里如果元素有材质，就让它按动画进度从透明变清楚。
          if (item.element) item.element.style.opacity = value.toFixed(2); // 这里如果元素是文字标签，就让网页文字也按动画进度从透明变清楚。
        }); // 这里结束当前步骤元素更新；这一帧里所有元素都已经移动或淡入。
      }, // 这里结束当前步骤每帧更新逻辑。
      onComplete: () => { // 这里写当前步骤播放完以后要做的事。
       current += 1; // 这里把步骤编号加 1；下一次 showNextStep 会播放下一组关系线和文字。
        setTimeout(showNextStep, 180); // 这里延迟 180 毫秒再播放下一步；这个停顿让学生能看清每一步结果。
      }, // 这里结束当前步骤完成回调。
    }); // 这里结束当前步骤动画配置；浏览器会开始逐帧执行它。
  } // 这里结束 showNextStep 函数定义；下面会马上启动第一步。

  showNextStep(); // 这里启动第一步三等关系动画；后续步骤会由 showNextStep 自己接着播放。
} // 这里结束三等关系分步动画函数。
