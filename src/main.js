import { appState as state } from './data/geometryData.js'; // 这里从 ./data/geometryData.js 导入 appState as state。意思是本文件要使用其他文件已经写好的功能。
import { createScene } from './scene/createScene.js'; // 这里从 ./scene/createScene.js 导入 createScene。意思是本文件要使用其他文件已经写好的功能。
import { createPart } from './scene/createPart.js'; // 这里从 ./scene/createPart.js 导入 createPart。意思是本文件要使用其他文件已经写好的功能。
import { createProjectionPlanes } from './scene/createProjectionPlanes.js'; // 这里从 ./scene/createProjectionPlanes.js 导入 createProjectionPlanes。意思是本文件要使用其他文件已经写好的功能。
import { createProjectionLines } from './scene/createProjectionLines.js'; // 这里从 ./scene/createProjectionLines.js 导入 createProjectionLines。意思是本文件要使用其他文件已经写好的功能。
import { createViews } from './scene/createViews.js'; // 这里从 ./scene/createViews.js 导入 createViews。意思是本文件要使用其他文件已经写好的功能。
import { createRelations } from './scene/createRelations.js'; // 这里从 ./scene/createRelations.js 导入 createRelations。意思是本文件要使用其他文件已经写好的功能。
import { createCoordinateAxes } from './scene/createCoordinateAxes.js'; // 这里从 ./scene/createCoordinateAxes.js 导入 createCoordinateAxes。意思是本文件要使用其他文件已经写好的功能。
import { createControlPanel } from './ui/controls.js'; // 这里从 ./ui/controls.js 导入 createControlPanel。意思是本文件要使用其他文件已经写好的功能。
import { createRelationOverlay } from './ui/relationOverlay.js'; // 这里从 ./ui/relationOverlay.js 导入 createRelationOverlay。意思是本文件要使用其他文件已经写好的功能。
import { // 这里开始多行导入。因为要导入好几个动画函数，分行写更容易看清楚。
  animatePlaneVisibility, // 这里从动画模块里导入 animatePlaneVisibility，后面按钮触发时会直接调用这个动画函数。
  animateProjectionLines, // 这里从动画模块里导入 animateProjectionLines，后面按钮触发时会直接调用这个动画函数。
  animateProjectionViews, // 这里从动画模块里导入 animateProjectionViews，后面按钮触发时会直接调用这个动画函数。
} from './animation/projectionAnimation.js'; // 这里结束多行导入，并说明上面这些函数来自哪个文件。
import { unfoldPlanes } from './animation/unfoldPlanes.js'; // 这里从 ./animation/unfoldPlanes.js 导入 unfoldPlanes。意思是本文件要使用其他文件已经写好的功能。
import { animateToInitialCamera } from './animation/cameraAnimation.js'; // 这里从 ./animation/cameraAnimation.js 导入 animateToInitialCamera。意思是本文件要使用其他文件已经写好的功能。
import { resetSceneObjects } from './animation/resetScene.js'; // 这里从 ./animation/resetScene.js 导入 resetSceneObjects。意思是本文件要使用其他文件已经写好的功能。

const container = document.querySelector('#scene-container'); // 这里找到三维场景容器，Three.js 的 WebGL 画面会被放进这个区域。
const labelLayer = document.querySelector('#label-layer'); // 这里找到标签层容器，OX、OY、OZ、V面等文字标签会显示在这个层里。
const relationsSvg = document.querySelector('#relations-overlay'); // 这里找到 SVG 覆盖层，长对正、高平齐、宽相等的二维辅助线会画在这里。

const { scene, camera, renderer, labelRenderer, controls } = createScene(container, labelLayer); // 这里从右侧返回对象里拆出几个名字。拆出来后，后面直接写 scene、camera、renderer 就能使用它们。
const part = createPart(); // 这里创建机械零件分组，并开始加载 public/models/part.stl 这个本地 STL 模型。
const planes = createProjectionPlanes(); // 这里创建三个投影面对象，包括 V 面、W 面、H 面，以及它们的边框和文字标签。
const projectionLines = createProjectionLines(); // 这里创建投影过程线对象，后面点击正投影、侧投影、水平投影按钮时会显示这些线。
const views = createViews(); // 这里创建三视图轮廓对象，也就是投到 V、W、H 面上的红、绿、蓝二维图形。
const relations = createRelations(); // 这里创建三等关系演示分组，里面保存“长对正、高平齐、宽相等”的备用三维标注对象。
const coordinateAxes = createCoordinateAxes(); // 这里创建教学坐标轴，包含 O 点、OX、OY、OZ，以及展开后的 OYW、OYH 标签。
const relationOverlay = createRelationOverlay(relationsSvg, container, camera); // 这里创建关系演示控制器，用 SVG 在屏幕上画“长对正、高平齐、宽相等”的传递线。

scene.add(part); // 这里把 part 放进 scene 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。
scene.add(planes.vGroup, planes.hingeH, planes.hingeW); // 这里把 planes.vGroup, planes.hingeH, planes.hingeW 放进 scene 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。
scene.add(projectionLines.group); // 这里把 projectionLines.group 放进 scene 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。
scene.add(relations); // 这里把 relations 放进 scene 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。
scene.add(coordinateAxes); // 这里把 coordinateAxes 放进 scene 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。

planes.vGroup.add(views.vProjection); // 这里把 views.vProjection 放进 planes.vGroup 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。
planes.hingeH.add(views.hProjection); // 这里把 views.hProjection 放进 planes.hingeH 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。
planes.hingeW.add(views.wProjection); // 这里把 views.wProjection 放进 planes.hingeW 里面。Three.js 像搭积木，物体只有放进场景或分组，才会显示并跟随这个分组一起变化。

const planeSets = { // 这里开始整理三个投影面的按钮配置表。以后点按钮时，程序只要查这张表就知道该控制哪个平面、边框、标签和状态。
  vPlane: { surface: planes.vPlane, frame: planes.vFrame, label: planes.vLabel, stateKey: 'vPlaneVisible', title: '正投影面 V面' }, // 这里开始写 vPlane 这一项。它把按钮、状态、投影线或投影面对应起来，点击时程序就知道该控制谁。
  wPlane: { surface: planes.wPlane, frame: planes.wFrame, label: planes.wLabel, stateKey: 'wPlaneVisible', title: '侧投影面 W面' }, // 这里开始写 wPlane 这一项。它把按钮、状态、投影线或投影面对应起来，点击时程序就知道该控制谁。
  hPlane: { surface: planes.hPlane, frame: planes.hFrame, label: planes.hLabel, stateKey: 'hPlaneVisible', title: '水平投影面 H面' }, // 这里开始写 hPlane 这一项。它把按钮、状态、投影线或投影面对应起来，点击时程序就知道该控制谁。
}; // 这里结束对象，表示这张配置表或数据表已经写完。

const projectionSets = { // 这里开始整理三个投影视图的按钮配置表。以后点投影按钮时，程序会用这张表找到对应的投影线和二维轮廓。
  vProjection: { // 这里开始写 vProjection 这一项。它把按钮、状态、投影线或投影面对应起来，点击时程序就知道该控制谁。
    lineGroup: projectionLines.vLines, // 这里指定哪一组投影过程线归这个按钮控制，比如红色、绿色或蓝色投影线。
    viewGroup: views.vProjection, // 这里指定哪一个二维投影轮廓归这个按钮控制，比如正投影图、侧投影图或水平投影图。
    stateKey: 'vProjectionVisible', // 这里写状态字段名。程序会通过这个名字去 appState 里读写“当前是否显示”。
    title: '红色正投影已显示于 V面', // 这里写按钮执行后的提示文字 '红色正投影已显示于 V面'，用户会在教学流程状态栏里看到它。
  }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
  wProjection: { // 这里开始写 wProjection 这一项。它把按钮、状态、投影线或投影面对应起来，点击时程序就知道该控制谁。
    lineGroup: projectionLines.wLines, // 这里指定哪一组投影过程线归这个按钮控制，比如红色、绿色或蓝色投影线。
    viewGroup: views.wProjection, // 这里指定哪一个二维投影轮廓归这个按钮控制，比如正投影图、侧投影图或水平投影图。
    stateKey: 'wProjectionVisible', // 这里写状态字段名。程序会通过这个名字去 appState 里读写“当前是否显示”。
    title: '绿色侧投影已显示于 W面', // 这里写按钮执行后的提示文字 '绿色侧投影已显示于 W面'，用户会在教学流程状态栏里看到它。
  }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
  hProjection: { // 这里开始写 hProjection 这一项。它把按钮、状态、投影线或投影面对应起来，点击时程序就知道该控制谁。
    lineGroup: projectionLines.hLines, // 这里指定哪一组投影过程线归这个按钮控制，比如红色、绿色或蓝色投影线。
    viewGroup: views.hProjection, // 这里指定哪一个二维投影轮廓归这个按钮控制，比如正投影图、侧投影图或水平投影图。
    stateKey: 'hProjectionVisible', // 这里写状态字段名。程序会通过这个名字去 appState 里读写“当前是否显示”。
    title: '蓝色水平投影已显示于 H面', // 这里写按钮执行后的提示文字 '蓝色水平投影已显示于 H面'，用户会在教学流程状态栏里看到它。
  }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
}; // 这里结束对象，表示这张配置表或数据表已经写完。

projectionLines.group.visible = true; // 这里让 projectionLines.group 显示出来，用户会在三维场景或页面标签层看到它。
Object.values(projectionSets).forEach(({ lineGroup, viewGroup }) => { // 这里把对象里的所有配置项取出来逐个处理。这样不用分别写 V 面、W 面、H 面三套重复代码。
  lineGroup.visible = false; // 这里把 lineGroup 隐藏起来，它还在程序里，但用户暂时看不到。
  viewGroup.visible = false; // 这里把 viewGroup 隐藏起来，它还在程序里，但用户暂时看不到。
  viewGroup.traverse((child) => { // 这里从 viewGroup 开始向下遍历所有子对象，每个子对象临时叫 child，这样材质线条和文字标签都能被统一处理。
    if (child.material) child.material.opacity = 0; // 这里如果子对象有材质，就把它完全透明，复位时对应线条或轮廓会消失。
    if (child.element) child.element.style.opacity = '0'; // 这里如果子对象是文字标签，就把它的网页透明度设为 0，复位时标签会隐藏。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
}); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

Object.values(planeSets).forEach(({ surface, frame, label }) => { // 这里把对象里的所有配置项取出来逐个处理。这样不用分别写 V 面、W 面、H 面三套重复代码。
  surface.visible = false; // 这里把 surface 隐藏起来，它还在程序里，但用户暂时看不到。
  surface.material.opacity = 0; // 这里设置材质透明度为 0，所以对应的平面或线条会变清楚、变淡或消失。
  frame.visible = false; // 这里把 frame 隐藏起来，它还在程序里，但用户暂时看不到。
  frame.material.opacity = 0; // 这里设置材质透明度为 0，所以对应的平面或线条会变清楚、变淡或消失。
  label.visible = false; // 这里把 label 隐藏起来，它还在程序里，但用户暂时看不到。
}); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

const panel = createControlPanel({ // 这里创建控制面板逻辑，并把每个按钮点击后要执行的函数交给它管理。
  vPlane: () => togglePlane('vPlane'), // 这里说明点击正投影面按钮时，要调用 togglePlane 来显示或隐藏对应投影面。
  wPlane: () => togglePlane('wPlane'), // 这里说明点击侧投影面按钮时，要调用 togglePlane 来显示或隐藏对应投影面。
  hPlane: () => togglePlane('hPlane'), // 这里说明点击水平投影面按钮时，要调用 togglePlane 来显示或隐藏对应投影面。
  vProjection: () => toggleProjection('vProjection'), // 这里说明点击正投影按钮时，要调用 toggleProjection 来显示或隐藏对应投影线和投影视图。
  wProjection: () => toggleProjection('wProjection'), // 这里说明点击侧投影按钮时，要调用 toggleProjection 来显示或隐藏对应投影线和投影视图。
  hProjection: () => toggleProjection('hProjection'), // 这里说明点击水平投影按钮时，要调用 toggleProjection 来显示或隐藏对应投影线和投影视图。
  unfold: () => runAction('unfold', (done) => { // 这里说明点击“三投影面的展开”按钮时，要进入 unfold 动画流程，并用 runAction 防止动画期间重复点击。
    if (state.unfolded) { // 这里判断 state.unfolded 是否成立。成立时执行下面的大括号内容，不成立就跳过。
      done(); // 这里调用 done 函数，并把 需要的数据 交给它，让它完成封装好的那一步。
      return; // 这里提前结束当前函数。程序走到这里就不再执行下面的代码。
    } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
    ensureAllProjectionReady(() => { // 这里先确保三个投影面和三种投影都已经准备好，再开始展开动画。
      state.unfolded = true; // 这里更新应用状态 state.unfolded 为 true。这个状态像开关，后面的按钮逻辑会靠它判断当前步骤。
      //coordinateAxes.userData.setUnfoldedNames(true); // 这里让 coordinateAxes.userData 执行 setUnfoldedNames 这个方法，传入 true，完成它负责的那一步操作。
      panel.setActive('unfold', true); // 这里让 panel 执行 setActive 这个方法，传入 'unfold', true，完成它负责的那一步操作。
      panel.setStepText('正在展开三投影面：OX、OZ 保持不变，OY 分为 OYW 与 OYH'); // 这里让 panel 执行 setStepText 这个方法，传入 '正在展开三投影面：OX、OZ 保持不变，OY 分为 OYW 与 OYH'，完成它负责的那一步操作。
      unfoldPlanes({ // 这里开始调用展开动画函数，并把 H 面铰链、W 面铰链、模型、投影线和相机控制器交给它。
        hingeH: planes.hingeH, // 这里填写 hingeH 这一项数据。后面的逻辑会通过这个名字读取对应对象、坐标、文字或回调函数。
        hingeW: planes.hingeW, // 这里填写 hingeW 这一项数据。后面的逻辑会通过这个名字读取对应对象、坐标、文字或回调函数。
        part, // 这里把 part 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
        projectionLines, // 这里把 projectionLines 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
        camera, // 这里把 camera 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
        controls, // 这里把 controls 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
      coordinateAxes,
      }, () => { // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
        coordinateAxes.userData.setUnfoldedNames(true);
        panel.setStepText('展开完成：左上为正投影，右上为侧投影，左下为水平投影；轴名为 OX、OZ、OYW、OYH'); // 这里让 panel 执行 setStepText 这个方法，传入 '展开完成：左上为正投影，右上为侧投影，左下为水平投影；轴名为 OX、OZ、OYW、OYH'，完成它负责的那一步操作。
        done(); // 这里调用 done 函数，并把 需要的数据 交给它，让它完成封装好的那一步。
      }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
    }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
  }), // 这里结束当前按钮或动画回调，表示这个功能分支写到这里完成。
  relations: () => runAction('relations', (done) => { // 这里说明点击“三等关系”按钮时，要进入关系演示流程，按顺序画出长、高、宽的对应辅助线。
    if (!state.unfolded) { // 这里判断 !state.unfolded 是否成立。成立时执行下面的大括号内容，不成立就跳过。
      panel.setStepText('请先点击“三投影面的展开”，再演示长对正、高平齐、宽相等'); // 这里让 panel 执行 setStepText 这个方法，传入 '请先点击“三投影面的展开”，再演示长对正、高平齐、宽相等'，完成它负责的那一步操作。
      done(); // 这里调用 done 函数，并把 需要的数据 交给它，让它完成封装好的那一步。
      return; // 这里提前结束当前函数。程序走到这里就不再执行下面的代码。
    } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
    state.relationVisible = !state.relationVisible; // 这里更新应用状态 state.relationVisible 为 !state.relationVisible。这个状态像开关，后面的按钮逻辑会靠它判断当前步骤。
    panel.setActive('relations', state.relationVisible); // 这里让 panel 执行 setActive 这个方法，传入 'relations', state.relationVisible，完成它负责的那一步操作。
    if (!state.relationVisible) { // 这里判断 !state.relationVisible 是否成立。成立时执行下面的大括号内容，不成立就跳过。
      relationOverlay.clear(); // 这里清空 relationOverlay。旧线条先清掉，后面才能按最新模型重新生成正确线条。
      panel.setStepText('已隐藏三等关系 SVG 辅助线'); // 这里让 panel 执行 setStepText 这个方法，传入 '已隐藏三等关系 SVG 辅助线'，完成它负责的那一步操作。
      done(); // 这里调用 done 函数，并把 需要的数据 交给它，让它完成封装好的那一步。
      return; // 这里提前结束当前函数。程序走到这里就不再执行下面的代码。
    } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
    relationOverlay.showSequence().then(() => { // 这里播放 SVG 三等关系演示，等演示完整结束后再更新提示文字并解锁按钮。
      panel.setStepText('已通过 SVG 依次演示：长对正、高平齐、宽相等'); // 这里让 panel 执行 setStepText 这个方法，传入 '已通过 SVG 依次演示：长对正、高平齐、宽相等'，完成它负责的那一步操作。
      done(); // 这里调用 done 函数，并把 需要的数据 交给它，让它完成封装好的那一步。
    }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
  }), // 这里结束当前按钮或动画回调，表示这个功能分支写到这里完成。
  reset: () => runAction('reset', (done) => { // 这里说明点击“一键复位”按钮时，要把模型、投影面、投影线、标签和相机恢复到初始状态。
    panel.setStepText('正在恢复初始三投影面空间状态'); // 这里让 panel 执行 setStepText 这个方法，传入 '正在恢复初始三投影面空间状态'，完成它负责的那一步操作。
    resetSceneObjects({ // 这里开始调用复位函数，并把需要恢复的模型、投影面、线条、标签、相机等对象交给它。
      state, // 这里把 state 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
      part, // 这里把 part 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
      planes: planes.allSurfaces, // 这里填写 planes 这一项数据。后面的逻辑会通过这个名字读取对应对象、坐标、文字或回调函数。
      frames: planes.allFrames, // 这里填写 frames 这一项数据。后面的逻辑会通过这个名字读取对应对象、坐标、文字或回调函数。
      hingeH: planes.hingeH, // 这里填写 hingeH 这一项数据。后面的逻辑会通过这个名字读取对应对象、坐标、文字或回调函数。
      hingeW: planes.hingeW, // 这里填写 hingeW 这一项数据。后面的逻辑会通过这个名字读取对应对象、坐标、文字或回调函数。
      projectionLines, // 这里把 projectionLines 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
      viewGroups: [views.vProjection, views.hProjection, views.wProjection], // 这里填写 viewGroups 这一项数据。后面的逻辑会通过这个名字读取对应对象、坐标、文字或回调函数。
      relationGroup: relations, // 这里填写 relationGroup 这一项数据。后面的逻辑会通过这个名字读取对应对象、坐标、文字或回调函数。
      labels: planes.labels, // 这里填写 labels 这一项数据。后面的逻辑会通过这个名字读取对应对象、坐标、文字或回调函数。
      coordinateAxes, // 这里把 coordinateAxes 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
      relationOverlay, // 这里把 relationOverlay 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
      camera, // 这里把 camera 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
      controls, // 这里把 controls 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    }, () => { // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
      Object.keys(panel.buttons).forEach((key) => panel.setActive(key, false)); // 这里让 Object 执行 keys 这个方法，传入 panel.buttons).forEach((key) => panel.setActive(key, false)，完成它负责的那一步操作。
      panel.setStepText('已复位：仅显示 part.stl 模型、O点、OX、OY、OZ'); // 这里让 panel 执行 setStepText 这个方法，传入 '已复位：仅显示 part.stl 模型、O点、OX、OY、OZ'，完成它负责的那一步操作。
      done(); // 这里调用 done 函数，并把 需要的数据 交给它，让它完成封装好的那一步。
    }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
  }), // 这里结束当前按钮或动画回调，表示这个功能分支写到这里完成。
  camera: () => runAction('camera', (done) => { // 这里说明点击“恢复观察视角”按钮时，只恢复相机视角，不重置其他教学状态。
    animateToInitialCamera(camera, controls, done); // 这里调用相机复位动画，让画面回到初始观察角度。
    panel.setStepText('已恢复观察视角'); // 这里让 panel 执行 setStepText 这个方法，传入 '已恢复观察视角'，完成它负责的那一步操作。
  }), // 这里结束当前按钮或动画回调，表示这个功能分支写到这里完成。
}); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

function runAction(name, action) { // 这里定义 runAction 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  if (state.animating && name !== 'reset') return; // 这里先判断 state.animating && name !== 'reset'。如果满足，就直接退出当前函数，避免继续做不该做的事。
  state.animating = true; // 这里更新应用状态 state.animating 为 true。这个状态像开关，后面的按钮逻辑会靠它判断当前步骤。
  panel.setBusy(true); // 这里让 panel 执行 setBusy 这个方法，传入 true，完成它负责的那一步操作。
  action(() => { // 这里真正执行刚才传进来的动作函数，动作完成时会通过回调通知 runAction。
    state.animating = false; // 这里更新应用状态 state.animating 为 false。这个状态像开关，后面的按钮逻辑会靠它判断当前步骤。
    panel.setBusy(false); // 这里让 panel 执行 setBusy 这个方法，传入 false，完成它负责的那一步操作。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

function togglePlane(key) { // 这里定义 togglePlane 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  runAction(key, (done) => { // 这里把当前按钮操作交给 runAction 包装执行，done 用来表示这次按钮动作什么时候结束。
    const plane = planeSets[key]; // 这里定义 plane，它保存的是 planeSets[key]，后面的代码会拿这个结果继续工作。
    const nextVisible = !state[plane.stateKey]; // 这里算出下一步应该显示还是隐藏：如果现在是显示，点击后就隐藏；如果现在隐藏，点击后就显示。
    state[plane.stateKey] = nextVisible; // 这里按照配置里的状态字段名，把对应显示开关更新为点击后的新状态。
    plane.label.visible = nextVisible; // 这里根据 nextVisible 的结果决定 plane.label 是否显示。通常透明度大于一点点时显示，太透明时就隐藏。
    animatePlaneVisibility([plane.surface], [plane.frame], nextVisible, () => { // 这里播放投影面和边框的显示/隐藏动画，动画结束后再更新按钮高亮和状态文字。
      panel.setActive(key, nextVisible); // 这里让 panel 执行 setActive 这个方法，传入 key, nextVisible，完成它负责的那一步操作。
      panel.setStepText(nextVisible ? `${plane.title}已显示` : `${plane.title}已隐藏`); // 这里让 panel 执行 setStepText 这个方法，传入 nextVisible ? `${plane.title}已显示` : `${plane.title}已隐藏`，完成它负责的那一步操作。
      done(); // 这里调用 done 函数，并把 需要的数据 交给它，让它完成封装好的那一步。
    }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

function toggleProjection(key) { // 这里定义 toggleProjection 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  runAction(key, (done) => { // 这里把当前按钮操作交给 runAction 包装执行，done 用来表示这次按钮动作什么时候结束。
    const projection = projectionSets[key]; // 这里定义 projection，它保存的是 projectionSets[key]，后面的代码会拿这个结果继续工作。
    const nextVisible = !state[projection.stateKey]; // 这里算出下一步应该显示还是隐藏：如果现在是显示，点击后就隐藏；如果现在隐藏，点击后就显示。
    state[projection.stateKey] = nextVisible; // 这里按照配置里的状态字段名，把对应显示开关更新为点击后的新状态。
    const requiredPlaneKey = key === 'vProjection' ? 'vPlane' : key === 'wProjection' ? 'wPlane' : 'hPlane'; // 这里定义 requiredPlaneKey，它保存的是 key === 'vProjection' ? 'vPlane' : key === 'wProjection' ? 'wPlane' : 'hPlane'，后面的代码会拿这个结果继续工作。
    const showProjection = () => { // 这里定义 showProjection，它保存的是 () => {，后面的代码会拿这个结果继续工作。
      part.visible = true; // 这里确保正式 STL 模型始终显示；本轮投影形成不允许模型移动、消失或被临时副本替换。
      part.userData.setOpacity(1); // 这里确保正式模型和黑色边线保持完全不透明；点击投影按钮时模型不能淡出。
      animateProjectionLines(projection.lineGroup, nextVisible, () => { // 这里先播放有限投影线显隐动画；线段只从模型朝向投影面一侧表面连到投影面。
        animateProjectionViews([projection.viewGroup], nextVisible, () => { // 这里再播放二维投影视图显隐动画；投影线出现后，投影面上的红绿蓝轮廓逐渐出现。
          panel.setActive(key, nextVisible); // 这里让 panel 执行 setActive 这个方法，传入 key, nextVisible，完成它负责的那一步操作。
          panel.setStepText(nextVisible ? projection.title : '已隐藏对应投影'); // 这里根据显隐状态更新流程提示；显示时说明投影形成，隐藏时说明对应投影已隐藏。
          done(); // 这里调用 done 函数，并把 需要的数据 交给它，让它完成封装好的那一步。
        }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
      }); // 这里结束投影线动画回调；二维投影视图会在投影线动画结束后继续处理。
    }; // 这里结束对象，表示这张配置表或数据表已经写完。

    if (nextVisible && !state[planeSets[requiredPlaneKey].stateKey]) { // 这里判断 nextVisible && !state[planeSets[requiredPlaneKey].stateKey] 是否成立。成立时执行下面的大括号内容，不成立就跳过。
      const plane = planeSets[requiredPlaneKey]; // 这里定义 plane，它保存的是 planeSets[requiredPlaneKey]，后面的代码会拿这个结果继续工作。
      state[plane.stateKey] = true; // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
      plane.label.visible = true; // 这里让 plane.label 显示出来，用户会在三维场景或页面标签层看到它。
      animatePlaneVisibility([plane.surface], [plane.frame], true, () => { // 这里播放投影面和边框的显示/隐藏动画，动画结束后再更新按钮高亮和状态文字。
        panel.setActive(requiredPlaneKey, true); // 这里让 panel 执行 setActive 这个方法，传入 requiredPlaneKey, true，完成它负责的那一步操作。
        showProjection(); // 这里调用 showProjection 函数，并把 需要的数据 交给它，让它完成封装好的那一步。
      }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
      return; // 这里提前结束当前函数。程序走到这里就不再执行下面的代码。
    } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
    showProjection(); // 这里调用 showProjection 函数，并把 需要的数据 交给它，让它完成封装好的那一步。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

function ensureAllProjectionReady(done) { // 这里定义 ensureAllProjectionReady 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  Object.entries(planeSets).forEach(([key, plane]) => { // 这里把对象里的键和值一起取出来逐个处理。键用来对应按钮名称，值用来找到具体控制对象。
    state[plane.stateKey] = true; // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
    panel.setActive(key, true); // 这里让 panel 执行 setActive 这个方法，传入 key, true，完成它负责的那一步操作。
    plane.label.visible = true; // 这里让 plane.label 显示出来，用户会在三维场景或页面标签层看到它。
    plane.surface.visible = true; // 这里让 plane.surface 显示出来，用户会在三维场景或页面标签层看到它。
    plane.surface.material.opacity = 0.32; // 这里设置材质透明度为 0.32，所以对应的平面或线条会变清楚、变淡或消失。
    plane.frame.visible = true; // 这里让 plane.frame 显示出来，用户会在三维场景或页面标签层看到它。
    plane.frame.material.opacity = 1; // 这里设置材质透明度为 1，所以对应的平面或线条会变清楚、变淡或消失。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

  const pendingViews = []; // 这里定义 pendingViews，它保存的是 []，后面的代码会拿这个结果继续工作。
  Object.entries(projectionSets).forEach(([key, projection]) => { // 这里把对象里的键和值一起取出来逐个处理。键用来对应按钮名称，值用来找到具体控制对象。
    state[projection.stateKey] = true; // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
    panel.setActive(key, true); // 这里让 panel 执行 setActive 这个方法，传入 key, true，完成它负责的那一步操作。
    projection.lineGroup.visible = false; // 这里继续保持旧投影辅助线隐藏；展开前只需要二维投影视图准备好，不再显示从模型拉出的过程线。
    projection.lineGroup.children.forEach((line) => { // 这里遍历 projection.lineGroup.children 里的每一个成员，每次取出的成员叫 line，下面会逐个修改它们的显示、透明度或状态。
      line.visible = false; // 这里隐藏单条旧投影辅助线；学生不会在展开准备阶段看到辅助线。
      line.scale.setScalar(0.001); // 这里把旧投影辅助线缩到接近 0；即使外部误开，也不会出现长线。
      line.material.opacity = 0; // 这里把旧投影辅助线透明度设为 0；它不会干扰新的模型移动投影视觉。
    }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
    pendingViews.push(projection.viewGroup); // 这里把新数据放进 pendingViews 数组末尾。数组收集完点以后，就能生成线条。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

  animateProjectionViews(pendingViews, true, done); // 这里调用 animateProjectionViews 函数，并把 pendingViews, true, done 交给它，让它完成封装好的那一步。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

function animate() { // 这里定义 animate 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  controls.update(); // 这里刷新 controls，让鼠标控制器的阻尼、目标点或相机变化在这一帧生效。
  renderer.render(scene, camera); // 这里把当前 Three.js 场景画出来。每一帧都要调用它，用户才会看到连续变化的画面。
  labelRenderer.render(scene, camera); // 这里把当前 Three.js 场景画出来。每一帧都要调用它，用户才会看到连续变化的画面。
  requestAnimationFrame(animate); // 这里让浏览器下一帧继续调用 animate。连续请求下一帧，就形成动画循环。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

part.userData.ready // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
  .then((modelInfo) => { // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
    projectionLines.group.userData.updateFromGeometry(part.userData.geometry, modelInfo.finalBox); // 这里根据 STL 实际几何体生成三组有限投影线；每条线都从模型朝向投影面的一侧表面出发。
    views.updateFromGeometry(part.userData.geometry); // 这里让 views 执行 updateFromGeometry 这个方法，传入 part.userData.geometry，完成它负责的那一步操作。
    relationOverlay.setBounds(modelInfo.finalBox); // 这里让 relationOverlay 执行 setBounds 这个方法，传入 modelInfo.finalBox，完成它负责的那一步操作。
    panel.setStepText('part.stl 已加载：当前仅显示模型、O点、OX、OY、OZ'); // 这里让 panel 执行 setStepText 这个方法，传入 'part.stl 已加载：当前仅显示模型、O点、OX、OY、OZ'，完成它负责的那一步操作。
  }) // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
  .catch(() => { // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
    panel.setStepText('part.stl 模型加载失败'); // 这里让 panel 执行 setStepText 这个方法，传入 'part.stl 模型加载失败'，完成它负责的那一步操作。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

panel.setStepText('正在加载 part.stl 模型...'); // 这里让 panel 执行 setStepText 这个方法，传入 '正在加载 part.stl 模型...'，完成它负责的那一步操作。
animate(); // 这里启动动画循环。循环开始后，场景会一帧一帧持续渲染。
