import * as THREE from 'three'; // 这里导入 Three.js；本文件要用它创建三维点、线条、材质、分组和 STL 边线几何体。

const projectionColors = { // 这里定义三种投影线颜色；投影过程线会按机械制图习惯用不同颜色区分方向。
  front: 0xd63832, // 这里规定正投影线使用红色；点击“正投影”时，模型到 V 面之间的有限线段会显示成红色。
  side: 0x1e9b55, // 这里规定侧投影线使用绿色；点击“侧投影”时，模型到 W 面之间的有限线段会显示成绿色。
  top: 0x1f72d6, // 这里规定水平投影线使用蓝色；点击“水平投影”时，模型到底部 H 面之间的有限线段会显示成蓝色。
}; // 这里结束颜色表；后面创建线条材质时会读取这些颜色。

const MAX_LINES_PER_DIRECTION = 8; // 这里限制每个方向最多显示 8 条投影线；教学演示需要少而准确，避免线太多导致画面混乱。

function createProjectionMaterial(color) { // 这里定义创建投影线材质的函数；每条投影线都用细实线材质显示。
  return new THREE.LineBasicMaterial({ // 这里创建 Three.js 基础线材质；LineBasicMaterial 显示为连续实线，不会出现虚线或点划线。
    color, // 这里把传入的颜色写进材质；红、绿、蓝三组投影线会因此显示不同颜色。
    transparent: true, // 这里允许线条透明度变化；点击按钮时，投影线可以从透明逐渐淡入。
    opacity: 0, // 这里让投影线初始完全透明；只有点击对应投影按钮后，动画才会把它显示出来。
  }); // 这里结束线条材质创建；函数会把这个材质返回给投影线使用。
} // 这里结束 createProjectionMaterial 函数；后面每次创建投影线都会调用它。

function createProjectionLine(start, end, color) { // 这里定义创建有限投影线段的函数；start 必须是模型表面点，end 必须是投影面上的对应点。
  const geometry = new THREE.BufferGeometry().setFromPoints([start, end]); // 这里只用 start 和 end 两个点创建线段；线条只存在于模型表面到投影面之间，不会向两端无限延长。
  const line = new THREE.Line(geometry, createProjectionMaterial(color)); // 这里把几何体和材质合成一条 Three.js 线；学生看到的投影过程线就是这个对象。
  line.visible = false; // 这里让新线条默认隐藏；点击对应投影按钮时才显示，避免页面加载后直接出现投影线。
  line.userData.start = start.clone(); // 这里记录线段起点；这个点来自 STL 模型朝向投影面一侧的真实表面位置。
  line.userData.end = end.clone(); // 这里记录线段终点；这个点是起点在 V、W 或 H 投影面上的正投影。
  return line; // 这里返回创建好的有限线段；外层会把它加入红、绿、蓝对应分组。
} // 这里结束 createProjectionLine 函数；它保证投影线不会穿过模型继续延伸。

function clearGroup(group) { // 这里定义清空分组的函数；重新根据 STL 计算投影线前，要先删除旧线条。
  group.children.forEach((child) => { // 这里逐条处理分组里的旧投影线；每条线都有自己的几何体和材质。
    child.geometry?.dispose(); // 这里释放旧投影线几何体占用的资源；删除线条时不释放会浪费显存。
    child.material?.dispose(); // 这里释放旧投影线材质占用的资源；旧红绿蓝材质用完后不应继续占用显存。
  }); // 这里结束旧投影线资源释放；所有旧线条的几何和材质都已经处理。
  group.clear(); // 这里把旧投影线对象从分组中移除；后面会放入按最新 STL 表面点生成的新线条。
} // 这里结束 clearGroup 函数；三个方向更新投影线时都会调用它。

function getUniqueEdgePoints(geometry) { // 这里定义从 STL 边线中提取不重复特征点的函数；投影线起点会优先从这些真实边线点里选。
  const edgeGeometry = new THREE.EdgesGeometry(geometry, 18); // 这里从 STL 三角面中提取轮廓和转折边；18 表示角度差足够明显的边才作为教学特征边。
  const position = edgeGeometry.getAttribute('position'); // 这里读取边线几何体里的顶点坐标；每两个点通常组成一段边线。
  const points = []; // 这里准备一个数组，用来保存去重后的真实模型边线点。
  const seen = new Set(); // 这里准备一个集合，用来记住哪些坐标已经加入过，避免同一个表面点重复拉线。
  for (let i = 0; i < position.count; i += 1) { // 这里逐个读取边线顶点；每个顶点都是 STL 模型真实边线上的一个点。
    const point = new THREE.Vector3(position.getX(i), position.getY(i), position.getZ(i)); // 这里把当前顶点坐标转成 Three.js 三维点；后面会判断它是否在朝向投影面的一侧表面。
    const key = `${point.x.toFixed(3)},${point.y.toFixed(3)},${point.z.toFixed(3)}`; // 这里把坐标四舍五入成字符串键；浮点数很细小的误差不会导致重复点漏判。
    if (seen.has(key)) continue; // 这里如果这个点已经加入过，就跳过；同一个特征点只需要一条投影线。
    seen.add(key); // 这里记录这个点已经被使用；后续再遇到相同坐标就不会重复加入。
    points.push(point); // 这里把真实边线点加入数组；它之后可能成为投影线在模型表面的起点。
  } // 这里结束边线顶点遍历；所有候选表面特征点已经收集完。
  edgeGeometry.dispose(); // 这里释放临时边线几何体；点坐标已经复制出来，临时几何体不再需要。
  return points; // 这里返回去重后的 STL 边线点；三个投影方向都会从这组点里筛选靠近投影面的一侧。
} // 这里结束 getUniqueEdgePoints 函数；它让投影线起点来自 STL 实际表面，而不是随便用包围盒远端。

function getTolerance(box, axis) { // 这里定义计算筛选厚度的函数；它决定“靠近投影面一侧表面”的候选范围有多薄。
  const size = box.getSize(new THREE.Vector3()); // 这里读取模型包围盒尺寸；模型大时容许范围稍大，模型小时范围稍小。
  const axisSize = axis === 'x' ? size.x : axis === 'y' ? size.y : size.z; // 这里取出当前投影方向对应的模型厚度；正投影看 Y，侧投影看 X，水平投影看 Z。
  return Math.max(axisSize * 0.08, 0.06); // 这里用模型厚度的 8% 作为筛选范围，并设置最小 0.06，保证能选到足够的表面特征点。
} // 这里结束 getTolerance 函数；后面筛选表面点时会用这个范围。

function sortSurfacePoints(points, primaryAxis) { // 这里定义表面点排序函数；排序后再抽取点，可以让投影线分布更均匀。
  const axisOrder = primaryAxis === 'z' ? ['x', 'y', 'z'] : primaryAxis === 'x' ? ['y', 'z', 'x'] : ['x', 'z', 'y']; // 这里根据投影方向选择排序维度；显示时优先让线条覆盖轮廓的横向和高度方向。
  return [...points].sort((a, b) => a[axisOrder[0]] - b[axisOrder[0]] || a[axisOrder[1]] - b[axisOrder[1]] || a[axisOrder[2]] - b[axisOrder[2]]); // 这里复制并排序候选点；原数组不被改变，排序结果用于均匀抽样。
} // 这里结束排序函数；它帮助投影线不要集中在模型某一小块。

function pickTeachingPoints(points, axis) { // 这里定义抽取教学用关键点的函数；它会从真实表面点中挑出少量、分布较开的投影线起点。
  const sorted = sortSurfacePoints(points, axis); // 这里先把候选点按视图方向排序；这样抽样时能覆盖模型轮廓的不同位置。
  if (sorted.length <= MAX_LINES_PER_DIRECTION) return sorted; // 这里如果候选点本来就不多，就全部使用；少量准确投影线比强行删点更清楚。
  const picked = []; // 这里准备保存最终挑出来的点；数量不会超过 MAX_LINES_PER_DIRECTION。
  for (let i = 0; i < MAX_LINES_PER_DIRECTION; i += 1) { // 这里按目标数量循环；每次从排序后的点里取一个代表点。
    const index = Math.round((i * (sorted.length - 1)) / (MAX_LINES_PER_DIRECTION - 1)); // 这里把候选点按比例均匀取样；第一个和最后一个点也会被保留。
    picked.push(sorted[index]); // 这里把选中的真实表面点加入最终列表；后面会从这些点拉有限投影线。
  } // 这里结束关键点抽样；最终投影线数量已经控制在适合教学的范围。
  return picked; // 这里返回抽样后的表面点；每个点都会生成一条模型到投影面的有限线段。
} // 这里结束 pickTeachingPoints 函数；它保证投影线少而准确。

function getSurfacePoints(edgePoints, box, axis) { // 这里定义筛选朝向投影面一侧表面点的函数；这是避免投影线穿过模型的关键。
  const tolerance = getTolerance(box, axis); // 这里计算当前方向的筛选范围；只选靠近投影面一侧的模型表面点。
  const minValue = box.min[axis]; // 这里取模型在当前方向上最靠近投影面的最小坐标；V/W/H 面都在 0，模型位于正方向。
  const surfacePoints = edgePoints.filter((point) => Math.abs(point[axis] - minValue) <= tolerance); // 这里只保留靠近最小坐标面的真实边线点；这些点在模型朝向投影面的表面上，不会从背面穿透模型。
  const closestPoints = surfacePoints.length ? surfacePoints : [...edgePoints].sort((a, b) => a[axis] - b[axis]).slice(0, MAX_LINES_PER_DIRECTION); // 这里做兜底也只取最靠近投影面的点；即使表面筛选过严，也不会退回模型背面的远端点。
  return pickTeachingPoints(closestPoints, axis); // 这里返回少量靠近投影面的真实边线点；每条投影线都从模型朝向投影面的这一侧出发。
} // 这里结束表面点筛选函数；返回值会直接作为投影线 startPoint。

function addFiniteLines(targetGroup, points, color, projectPoint) { // 这里定义批量创建有限投影线的函数；它会把模型表面点和投影面对应点连接起来。
  points.forEach((start) => { // 这里逐个处理模型表面起点；每个起点都会生成一条有限投影线。
    const end = projectPoint(start); // 这里计算起点在对应投影面上的正投影终点；正投影到 y=0，侧投影到 x=0，水平投影到 z=0。
    targetGroup.add(createProjectionLine(start, end, color)); // 这里把“模型表面点 → 投影面点”的有限线段加入对应颜色分组；线段不会穿过模型或超出模型背面。
  }); // 这里结束当前方向投影线创建；所有挑选出的关键点都已经有对应有限线段。
} // 这里结束 addFiniteLines 函数；三种投影方向会分别调用它。

export function createProjectionLines() { // 这里导出创建投影线系统的函数；主入口会调用它得到红、绿、蓝三组线。
  const group = new THREE.Group(); // 这里创建总分组；所有投影过程线都会放在这个分组里，展开时可以统一隐藏。
  group.name = 'ProjectionLines'; // 这里给总分组命名；调试场景层级时能看出这是投影线系统。
  const vLines = new THREE.Group(); // 这里创建正投影线分组；它只保存模型到 V 面之间的红色有限线段。
  const wLines = new THREE.Group(); // 这里创建侧投影线分组；它只保存模型到 W 面之间的绿色有限线段。
  const hLines = new THREE.Group(); // 这里创建水平投影线分组；它只保存模型到 H 面之间的蓝色有限线段。
  vLines.name = 'FrontProjectionLines'; // 这里给正投影线分组命名；调试时能快速找到红色投影线。
  wLines.name = 'SideProjectionLines'; // 这里给侧投影线分组命名；调试时能快速找到绿色投影线。
  hLines.name = 'TopProjectionLines'; // 这里给水平投影线分组命名；调试时能快速找到蓝色投影线。
  group.add(vLines, wLines, hLines); // 这里把三组投影线放进总分组；主场景只需要添加这个总分组即可。

  group.userData.updateFromBounds = () => {}; // 这里保留旧接口但不再用包围盒对角点生成投影线；避免旧逻辑用 max 值画出穿过模型的长线。

  group.userData.updateFromGeometry = (geometry, box) => { // 这里根据 STL 实际几何体更新三组投影线；投影线起点来自模型朝向投影面一侧的真实边线表面点。
    clearGroup(vLines); // 这里先清空旧正投影线；防止重新加载或重新计算后出现重复红线。
    clearGroup(wLines); // 这里先清空旧侧投影线；防止重新加载或重新计算后出现重复绿线。
    clearGroup(hLines); // 这里先清空旧水平投影线；防止重新加载或重新计算后出现重复蓝线。
    const edgePoints = getUniqueEdgePoints(geometry); // 这里从 STL 实际边线中提取候选点；投影线不会再随便从包围盒远端出发。
    const frontPoints = getSurfacePoints(edgePoints, box, 'y'); // 这里筛选靠近 V 面的一侧表面点；红线会从这些点连到 y=0。
    const sidePoints = getSurfacePoints(edgePoints, box, 'x'); // 这里筛选靠近 W 面的一侧表面点；绿线会从这些点连到 x=0。
    const topPoints = getSurfacePoints(edgePoints, box, 'z'); // 这里筛选靠近 H 面的一侧底部表面点；蓝线会从这些点连到 z=0。
    addFiniteLines(vLines, frontPoints, projectionColors.front, (point) => new THREE.Vector3(point.x, 0, point.z)); // 这里创建正投影有限线段；每条红线只从模型靠近 V 面的表面点连到 V 面，不会穿过模型。
    addFiniteLines(wLines, sidePoints, projectionColors.side, (point) => new THREE.Vector3(0, point.y, point.z)); // 这里创建侧投影有限线段；每条绿线只从模型靠近 W 面的表面点连到 W 面，不会穿过模型。
    addFiniteLines(hLines, topPoints, projectionColors.top, (point) => new THREE.Vector3(point.x, point.y, 0)); // 这里创建水平投影有限线段；每条蓝线只从模型底部表面点连到 H 面，不会从顶部穿出。
  }; // 这里结束 STL 几何更新函数；三组投影线已经按真实表面点重新生成。

  group.userData.updateFrontFromGeometry = () => {}; // 这里保留旧正投影接口但不再单独重算；现在三组投影线统一由 updateFromGeometry 根据真实 STL 表面生成。

  return { // 这里返回投影线系统对象；主入口会拿到总分组和三种颜色分组。
    group, // 这里返回总投影线分组；它会被加入 Three.js 场景。
    vLines, // 这里返回红色正投影线分组；正投影按钮会控制它显示和隐藏。
    wLines, // 这里返回绿色侧投影线分组；侧投影按钮会控制它显示和隐藏。
    hLines, // 这里返回蓝色水平投影线分组；水平投影按钮会控制它显示和隐藏。
  }; // 这里结束返回对象；外层可以继续控制三组有限投影线。
} // 这里结束 createProjectionLines 函数；投影线恢复为模型固定不动的机械制图教学方式。
