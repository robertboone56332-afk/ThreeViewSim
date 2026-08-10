import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js'; // 这里从 three/addons/renderers/CSS2DRenderer.js 导入 CSS2DObject。意思是本文件要使用其他文件已经写好的功能。

export function createLabel(text, className = 'scene-label') { // 这里导出 createLabel 函数。别的文件导入后，就能执行这里封装好的完整流程。
  const element = document.createElement('div'); // 这里定义 element，它保存的是 一个新的网页元素。创建出来后还要放进页面，用户才能看到，后面的代码会拿这个结果继续工作。
  element.className = className; // 这里给元素套上 className 这个 CSS 类名。套上类名后，CSS 里写好的外观规则才会作用到它身上。
  element.textContent = text; // 这里把页面文字改成 text，用户看到的提示或标签内容就是由这一行写进去的。
  return new CSS2DObject(element); // 这里返回 new CSS2DObject(element)。函数执行到 return 就结束，并把结果交回调用它的地方。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
