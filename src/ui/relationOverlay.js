import * as THREE from 'three'; // 这里把 Three.js 整个工具包取名为 THREE，后面创建场景、相机、模型、材质、向量都要用它。

const SVG_NS = 'http://www.w3.org/2000/svg'; // 这里定义 SVG_NS，它保存的是 'http://www.w3.org/2000/svg'，后面的代码会拿这个结果继续工作。

function createSvgElement(type, attributes = {}) { // 这里定义 createSvgElement 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  const element = document.createElementNS(SVG_NS, type); // 这里定义 element，它保存的是 一个 SVG 元素。SVG 元素适合画屏幕上的二维直线、折线和文字，后面的代码会拿这个结果继续工作。
  Object.entries(attributes).forEach(([key, value]) => { // 这里把对象里的键和值一起取出来逐个处理。键用来对应按钮名称，值用来找到具体控制对象。
    element.setAttribute(key, value); // 这里给 SVG 或 DOM 元素设置属性 key, value。线条端点坐标、颜色、宽度都靠这种方式写进去。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
  return element; // 这里返回 element。函数执行到 return 就结束，并把结果交回调用它的地方。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

function worldToScreen(point, camera, container) { // 这里定义 worldToScreen 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  const rect = container.getBoundingClientRect(); // 这里读取容器在屏幕上的矩形范围，包括宽、高和位置，SVG 坐标换算要靠它。
  const projected = point.clone().project(camera); // 这里把三维点按当前相机投影到屏幕空间，后面会把它换算成 SVG 的 x、y 坐标。
  return { // 这里开始返回一个对象。对象里会装多个结果，调用方可以一次拿到它们。
    x: (projected.x * 0.5 + 0.5) * rect.width, // 这里设置 X 坐标为 (projected.x * 0.5 + 0.5) * rect.width。在屏幕上它通常影响左右位置，在三维中代表 OX 方向。
    y: (-projected.y * 0.5 + 0.5) * rect.height, // 这里设置 Y 坐标为 (-projected.y * 0.5 + 0.5) * rect.height。在屏幕上它通常影响上下位置，在三维中代表 OY 深度方向。
  }; // 这里结束对象，表示这张配置表或数据表已经写完。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

function setLine(line, a, b) { // 这里定义 setLine 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  line.setAttribute('x1', a.x); // 这里给 SVG 或 DOM 元素设置属性 'x1', a.x。线条端点坐标、颜色、宽度都靠这种方式写进去。
  line.setAttribute('y1', a.y); // 这里给 SVG 或 DOM 元素设置属性 'y1', a.y。线条端点坐标、颜色、宽度都靠这种方式写进去。
  line.setAttribute('x2', b.x); // 这里给 SVG 或 DOM 元素设置属性 'x2', b.x。线条端点坐标、颜色、宽度都靠这种方式写进去。
  line.setAttribute('y2', b.y); // 这里给 SVG 或 DOM 元素设置属性 'y2', b.y。线条端点坐标、颜色、宽度都靠这种方式写进去。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

function animateLineMove(line, fromA, fromB, toA, toB, duration) { // 这里定义 animateLineMove 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  const start = performance.now(); // 这里定义 start，它保存的是 当前精确时间。动画用它计算已经播放了多久，后面的代码会拿这个结果继续工作。
  return new Promise((resolve) => { // 这里返回 new Promise((resolve) => {。函数执行到 return 就结束，并把结果交回调用它的地方。
    function frame(now) { // 这里定义 frame 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
      const t = Math.min((now - start) / duration, 1); // 这里计算动画进度，0 表示刚开始，1 表示播放结束，中间值表示正在过渡。
      const eased = t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2; // 这里把普通进度加工成缓动进度，让动画不是匀速硬移动，而是先慢、中间快、最后再慢。
      const a = { // 这里定义 a，它保存的是 一个对象的开始。对象像一张表，里面会把多个相关信息用名字收在一起，后面的代码会拿这个结果继续工作。
        x: fromA.x + (toA.x - fromA.x) * eased, // 这里设置 X 坐标为 fromA.x + (toA.x - fromA.x) * eased。在屏幕上它通常影响左右位置，在三维中代表 OX 方向。
        y: fromA.y + (toA.y - fromA.y) * eased, // 这里设置 Y 坐标为 fromA.y + (toA.y - fromA.y) * eased。在屏幕上它通常影响上下位置，在三维中代表 OY 深度方向。
      }; // 这里结束对象，表示这张配置表或数据表已经写完。
      const b = { // 这里定义 b，它保存的是 一个对象的开始。对象像一张表，里面会把多个相关信息用名字收在一起，后面的代码会拿这个结果继续工作。
        x: fromB.x + (toB.x - fromB.x) * eased, // 这里设置 X 坐标为 fromB.x + (toB.x - fromB.x) * eased。在屏幕上它通常影响左右位置，在三维中代表 OX 方向。
        y: fromB.y + (toB.y - fromB.y) * eased, // 这里设置 Y 坐标为 fromB.y + (toB.y - fromB.y) * eased。在屏幕上它通常影响上下位置，在三维中代表 OY 深度方向。
      }; // 这里结束对象，表示这张配置表或数据表已经写完。
      setLine(line, a, b); // 这里更新 SVG 线段的两个端点坐标，所以屏幕上的辅助线会移动到新位置。
      line.style.opacity = '1'; // 这里设置网页文字或 SVG 元素的透明度为 '1'，让它能跟随动画淡入淡出。
      if (t < 1) requestAnimationFrame(frame); // 这里判断 t < 1) requestAnimationFrame(frame 是否成立。成立时执行下面的大括号内容，不成立就跳过。
      else resolve(); // 这里表示否则。也就是上面的 if 不成立时，程序会改走这里的处理。
    } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
    requestAnimationFrame(frame); // 这里让浏览器下一帧继续调用 frame。连续请求下一帧，就形成动画循环。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

function addText(svg, text, point) { // 这里定义 addText 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  const label = createSvgElement('text', { x: point.x, y: point.y }); // 这里定义 label，它保存的是 createSvgElement('text', { x: point.x, y: point.y })，后面的代码会拿这个结果继续工作。
  label.textContent = text; // 这里把页面文字改成 text，用户看到的提示或标签内容就是由这一行写进去的。
  svg.appendChild(label); // 这里把 label 插入到 svg 这个网页容器里。插进去以后，它才真正成为页面的一部分。
  return label; // 这里返回 label。函数执行到 return 就结束，并把结果交回调用它的地方。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

function markRed(element) { // 这里定义 markRed 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
  element.setAttribute('stroke', '#c026ff'); // 这里给 SVG 或 DOM 元素设置属性 'stroke', '#d63832'。线条端点坐标、颜色、宽度都靠这种方式写进去。
  element.setAttribute('stroke-width', '3'); // 这里给 SVG 或 DOM 元素设置属性 'stroke-width', '3'。线条端点坐标、颜色、宽度都靠这种方式写进去。
  return element; // 这里返回 element。函数执行到 return 就结束，并把结果交回调用它的地方。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

export function createRelationOverlay(svg, container, camera) { // 这里导出 createRelationOverlay 函数。别的文件导入后，就能执行这里封装好的完整流程。
  let activeBox = null; // 这里声明会变化的 activeBox，初始值是 null，后面运行过程中会继续改它。

  function clear() { // 这里定义 clear 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
    svg.replaceChildren(); // 这里清空 svg 里的所有子元素。重新演示三等关系前，要先擦掉上一轮的辅助线。
    svg.style.display = 'none'; // 这里把 svg.style.display 设成 'none'。也就是说，从这一行开始，程序后面再读取 svg.style.display 时得到的就是这个新值。
  } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

  function setBounds(box) { // 这里定义 setBounds 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
    activeBox = box.clone(); // 这里把 activeBox 设成 box.clone()。也就是说，从这一行开始，程序后面再读取 activeBox 时得到的就是这个新值。
  } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

  async function showSequence() { // 这里定义异步函数 showSequence。它可以等待动画完成，再继续下一段演示。
    if (!activeBox) return; // 这里先判断 !activeBox。如果满足，就直接退出当前函数，避免继续做不该做的事。
    clear(); // 这里先清空旧的 SVG 辅助线，保证新的演示不会和上一次叠在一起。
    svg.style.display = 'block'; // 这里把 svg.style.display 设成 'block'。也就是说，从这一行开始，程序后面再读取 svg.style.display 时得到的就是这个新值。
    const rect = container.getBoundingClientRect(); // 这里读取容器在屏幕上的矩形范围，包括宽、高和位置，SVG 坐标换算要靠它。
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`); // 这里给 SVG 或 DOM 元素设置属性 'viewBox', `0 0 ${rect.width} ${rect.height}`。线条端点坐标、颜色、宽度都靠这种方式写进去。
    svg.setAttribute('width', rect.width); // 这里给 SVG 或 DOM 元素设置属性 'width', rect.width。线条端点坐标、颜色、宽度都靠这种方式写进去。
    svg.setAttribute('height', rect.height); // 这里给 SVG 或 DOM 元素设置属性 'height', rect.height。线条端点坐标、颜色、宽度都靠这种方式写进去。

    const { min, max } = activeBox; // 这里从右侧返回对象里拆出几个名字。拆出来后，后面直接写 scene、camera、renderer 就能使用它们。
    const frontLeftBottom = worldToScreen(new THREE.Vector3(min.x, 0, min.z), camera, container); // 这里定义 frontLeftBottom，它保存的是 worldToScreen(new THREE.Vector3(min.x, 0, min.z), camera, container)，后面的代码会拿这个结果继续工作。
    const frontRightBottom = worldToScreen(new THREE.Vector3(max.x, 0, min.z), camera, container); // 这里定义 frontRightBottom，它保存的是 worldToScreen(new THREE.Vector3(max.x, 0, min.z), camera, container)，后面的代码会拿这个结果继续工作。
    const topLeftLength = worldToScreen(new THREE.Vector3(min.x, 0, -min.y), camera, container); // 这里定义 topLeftLength，它保存的是 worldToScreen(new THREE.Vector3(min.x, 0, -max.y), camera, container)，后面的代码会拿这个结果继续工作。
    const topRightLength = worldToScreen(new THREE.Vector3(max.x, 0, -min.y), camera, container); // 这里定义 topRightLength，它保存的是 worldToScreen(new THREE.Vector3(max.x, 0, -max.y), camera, container)，后面的代码会拿这个结果继续工作。

    const lengthLine = createSvgElement('line', {
  stroke: '#c026ff',
  'stroke-width': '3',
});// 这里定义 lengthLine，它保存的是 createSvgElement('line')，后面的代码会拿这个结果继续工作。
    svg.appendChild(lengthLine); // 这里把 lengthLine 插入到 svg 这个网页容器里。插进去以后，它才真正成为页面的一部分。
    await animateLineMove(lengthLine, frontLeftBottom, frontRightBottom, topLeftLength, topRightLength, 650); // 这里等待 animateLineMove(lengthLine, frontLeftBottom, frontRightBottom, topLeftLength, topRightLength, 650) 完成。这样教学动画会按顺序播放，不会几步同时挤在一起。
    svg.appendChild(createSvgElement('line', { x1: frontLeftBottom.x, y1: frontLeftBottom.y, x2: topLeftLength.x, y2: topLeftLength.y })); // 这里把 createSvgElement('line', { x1: frontLeftBottom.x, y1: frontLeftBottom.y, x2: topLeftLength.x, y2: topLeftLength.y }) 插入到 svg 这个网页容器里。插进去以后，它才真正成为页面的一部分。
    svg.appendChild(createSvgElement('line', { x1: frontRightBottom.x, y1: frontRightBottom.y, x2: topRightLength.x, y2: topRightLength.y })); // 这里把 createSvgElement('line', { x1: frontRightBottom.x, y1: frontRightBottom.y, x2: topRightLength.x, y2: topRightLength.y }) 插入到 svg 这个网页容器里。插进去以后，它才真正成为页面的一部分。
    addText(svg, '长对正', { x: (topLeftLength.x + topRightLength.x) / 2 - 24, y: topLeftLength.y - 10 }); // 这里调用 addText 函数，并把 svg, '长对正', { x: (topLeftLength.x + topRightLength.x) / 2 - 24, y: topLeftLength.y - 10 } 交给它，让它完成封装好的那一步。
    await new Promise((resolve) => setTimeout(resolve, 400)); // 这里等待 new Promise((resolve) => setTimeout(resolve, 400)) 完成。这样教学动画会按顺序播放，不会几步同时挤在一起。

    const frontHeightBottom = worldToScreen(new THREE.Vector3(min.x, 0, min.z), camera, container); // 这里定义 frontHeightBottom，它保存的是 worldToScreen(new THREE.Vector3(min.x, 0, min.z), camera, container)，后面的代码会拿这个结果继续工作。
    const frontHeightTop = worldToScreen(new THREE.Vector3(min.x, 0, max.z), camera, container); // 这里定义 frontHeightTop，它保存的是 worldToScreen(new THREE.Vector3(min.x, 0, max.z), camera, container)，后面的代码会拿这个结果继续工作。
    const sideHeightBottom = worldToScreen(new THREE.Vector3(-min.y, 0, min.z), camera, container); // 这里定义 sideHeightBottom，它保存的是 worldToScreen(new THREE.Vector3(-max.y, 0, min.z), camera, container)，后面的代码会拿这个结果继续工作。
    const sideHeightTop = worldToScreen(new THREE.Vector3(-min.y, 0, max.z), camera, container); // 这里定义 sideHeightTop，它保存的是 worldToScreen(new THREE.Vector3(-max.y, 0, max.z), camera, container)，后面的代码会拿这个结果继续工作。
    const heightLine = createSvgElement('line'); // 这里定义 heightLine，它保存的是 createSvgElement('line')，后面的代码会拿这个结果继续工作。
    svg.appendChild(heightLine); // 这里把 heightLine 插入到 svg 这个网页容器里。插进去以后，它才真正成为页面的一部分。
    await animateLineMove(heightLine, frontHeightBottom, frontHeightTop, sideHeightBottom, sideHeightTop, 650); // 这里等待 animateLineMove(heightLine, frontHeightBottom, frontHeightTop, sideHeightBottom, sideHeightTop, 650) 完成。这样教学动画会按顺序播放，不会几步同时挤在一起。
    svg.appendChild(createSvgElement('line', { x1: frontHeightTop.x, y1: frontHeightTop.y, x2: sideHeightTop.x, y2: sideHeightTop.y })); // 这里把 createSvgElement('line', { x1: frontHeightTop.x, y1: frontHeightTop.y, x2: sideHeightTop.x, y2: sideHeightTop.y }) 插入到 svg 这个网页容器里。插进去以后，它才真正成为页面的一部分。
    svg.appendChild(createSvgElement('line', { x1: frontHeightBottom.x, y1: frontHeightBottom.y, x2: sideHeightBottom.x, y2: sideHeightBottom.y })); // 这里把 createSvgElement('line', { x1: frontHeightBottom.x, y1: frontHeightBottom.y, x2: sideHeightBottom.x, y2: sideHeightBottom.y }) 插入到 svg 这个网页容器里。插进去以后，它才真正成为页面的一部分。
    addText(svg, '高平齐', { x: (frontHeightTop.x + sideHeightTop.x) / 2 - 24, y: frontHeightTop.y - 12 }); // 这里调用 addText 函数，并把 svg, '高平齐', { x: (frontHeightTop.x + sideHeightTop.x) / 2 - 24, y: frontHeightTop.y - 12 } 交给它，让它完成封装好的那一步。
    await new Promise((resolve) => setTimeout(resolve, 400)); // 这里等待 new Promise((resolve) => setTimeout(resolve, 400)) 完成。这样教学动画会按顺序播放，不会几步同时挤在一起。

    const sideWidthA = worldToScreen(new THREE.Vector3(-min.y, 0, min.z), camera, container); // 这里定义 sideWidthA，它保存的是 worldToScreen(new THREE.Vector3(-min.y, 0, min.z), camera, container)，后面的代码会拿这个结果继续工作。
    const sideWidthB = worldToScreen(new THREE.Vector3(-max.y, 0, min.z), camera, container); // 这里定义 sideWidthB，它保存的是 worldToScreen(new THREE.Vector3(-max.y, 0, min.z), camera, container)，后面的代码会拿这个结果继续工作。
    const topWidthA = worldToScreen(new THREE.Vector3(min.x, 0, -min.y), camera, container); // 这里定义 topWidthA，它保存的是 worldToScreen(new THREE.Vector3(max.x, 0, -min.y), camera, container)，后面的代码会拿这个结果继续工作。
    const topWidthB = worldToScreen(new THREE.Vector3(min.x, 0, -max.y), camera, container); // 这里定义 topWidthB，它保存的是 worldToScreen(new THREE.Vector3(max.x, 0, -max.y), camera, container)，后面的代码会拿这个结果继续工作。
    const sideBaseLine = markRed(createSvgElement('line', { // 这里定义 sideBaseLine，它保存的是 markRed(createSvgElement('line', {，后面的代码会拿这个结果继续工作。
      x1: sideWidthA.x, // 这里设置 SVG 线段起点的横坐标，决定红色辅助线从屏幕哪里开始。
      y1: sideWidthA.y, // 这里设置 SVG 线段起点的纵坐标，决定红色辅助线从屏幕哪里开始。
      x2: sideWidthB.x, // 这里设置 SVG 线段终点的横坐标，决定红色辅助线画到屏幕哪里。
      y2: sideWidthB.y, // 这里设置 SVG 线段终点的纵坐标，决定红色辅助线画到屏幕哪里。
    })); // 这里结束嵌套的回调调用，表示内层流程和外层函数都收尾完成。
    svg.appendChild(sideBaseLine); // 这里把 sideBaseLine 插入到 svg 这个网页容器里。插进去以后，它才真正成为页面的一部分。
    const targetLine = markRed(createSvgElement('line', { // 这里定义 targetLine，它保存的是 markRed(createSvgElement('line', {，后面的代码会拿这个结果继续工作。
      x1: topWidthA.x, // 这里设置 SVG 线段起点的横坐标，决定红色辅助线从屏幕哪里开始。
      y1: topWidthA.y, // 这里设置 SVG 线段起点的纵坐标，决定红色辅助线从屏幕哪里开始。
      x2: topWidthB.x, // 这里设置 SVG 线段终点的横坐标，决定红色辅助线画到屏幕哪里。
      y2: topWidthB.y, // 这里设置 SVG 线段终点的纵坐标，决定红色辅助线画到屏幕哪里。
    })); // 这里结束嵌套的回调调用，表示内层流程和外层函数都收尾完成。
    targetLine.style.opacity = '0.35'; // 这里设置网页文字或 SVG 元素的透明度为 '0.35'，让它能跟随动画淡入淡出。
    svg.appendChild(targetLine); // 这里把 targetLine 插入到 svg 这个网页容器里。插进去以后，它才真正成为页面的一部分。
    const widthLine = markRed(createSvgElement('line')); // 这里定义 widthLine，它保存的是 markRed(createSvgElement('line'))，后面的代码会拿这个结果继续工作。
    svg.appendChild(widthLine); // 这里把 widthLine 插入到 svg 这个网页容器里。插进去以后，它才真正成为页面的一部分。
    await animateLineMove(widthLine, sideWidthA, sideWidthB, topWidthA, topWidthB, 700); // 这里等待 animateLineMove(widthLine, sideWidthA, sideWidthB, topWidthA, topWidthB, 700) 完成。这样教学动画会按顺序播放，不会几步同时挤在一起。
    targetLine.style.opacity = '1'; // 这里设置网页文字或 SVG 元素的透明度为 '1'，让它能跟随动画淡入淡出。
    //const turn = createSvgElement('polyline', { // 这里定义 turn，它保存的是 createSvgElement('polyline', {，后面的代码会拿这个结果继续工作。
      //points: `${sideWidthB.x},${sideWidthB.y} ${(sideWidthB.x + topWidthB.x) / 2},${(sideWidthB.y + topWidthB.y) / 2} ${topWidthB.x},${topWidthB.y}`, // 这里设置 SVG 折线的所有转折点，让“宽相等”的红色传递线能从侧投影转向水平投影。
    //}); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
    //markRed(turn); // 这里把 SVG 线条标成红色粗线，用来突出“宽相等”的对应关系。
    //svg.appendChild(turn); // 这里把 turn 插入到 svg 这个网页容器里。插进去以后，它才真正成为页面的一部分。
    addText(svg, '宽相等', { x: topWidthB.x + 10, y: (topWidthA.y + topWidthB.y) / 2 }); // 这里调用 addText 函数，并把 svg, '宽相等', { x: topWidthB.x + 10, y: (topWidthA.y + topWidthB.y) / 2 } 交给它，让它完成封装好的那一步。
    addText(svg, '长对正 · 高平齐 · 宽相等', { x: rect.width * 0.38, y: rect.height - 28 }); // 这里调用 addText 函数，并把 svg, '长对正 · 高平齐 · 宽相等', { x: rect.width * 0.38, y: rect.height - 28 } 交给它，让它完成封装好的那一步。
  } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

  clear(); // 这里先清空旧的 SVG 辅助线，保证新的演示不会和上一次叠在一起。
  return { clear, setBounds, showSequence }; // 这里开始返回一个对象。对象里会装多个结果，调用方可以一次拿到它们。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
