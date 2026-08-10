export function createControlPanel(handlers) { // 这里导出 createControlPanel 函数。别的文件导入后，就能执行这里封装好的完整流程。
  const buttons = { // 这里把页面上的所有按钮按功能收集成一个对象，后面可以用名字直接找到对应按钮。
    vPlane: document.querySelector('[data-action="v-plane"]'), // 这里找到页面上的正投影面按钮，后面会给它绑定点击事件。
    wPlane: document.querySelector('[data-action="w-plane"]'), // 这里找到页面上的侧投影面按钮，后面会给它绑定点击事件。
    hPlane: document.querySelector('[data-action="h-plane"]'), // 这里找到页面上的水平投影面按钮，后面会给它绑定点击事件。
    vProjection: document.querySelector('[data-action="v-projection"]'), // 这里找到页面上的正投影按钮，后面会给它绑定点击事件。
    wProjection: document.querySelector('[data-action="w-projection"]'), // 这里找到页面上的侧投影按钮，后面会给它绑定点击事件。
    hProjection: document.querySelector('[data-action="h-projection"]'), // 这里找到页面上的水平投影按钮，后面会给它绑定点击事件。
    unfold: document.querySelector('[data-action="unfold"]'), // 这里找到页面上的三投影面的展开按钮，后面会给它绑定点击事件。
    relations: document.querySelector('[data-action="relations"]'), // 这里找到页面上的长对正、高平齐、宽相等按钮，后面会给它绑定点击事件。
    reset: document.querySelector('[data-action="reset"]'), // 这里找到页面上的一键复位按钮，后面会给它绑定点击事件。
    camera: document.querySelector('[data-action="camera"]'), // 这里找到页面上的恢复观察视角按钮，后面会给它绑定点击事件。
  }; // 这里结束对象，表示这张配置表或数据表已经写完。

  Object.entries(buttons).forEach(([key, button]) => { // 这里把对象里的键和值一起取出来逐个处理。键用来对应按钮名称，值用来找到具体控制对象。
    button?.addEventListener('click', handlers[key]); // 这里监听 'click', handlers[key]。当用户触发这个浏览器事件时，后面的回调函数会被执行。
  }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。

  return { // 这里开始返回一个对象。对象里会装多个结果，调用方可以一次拿到它们。
    buttons, // 这里把 buttons 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
    setBusy(isBusy) { // 这里定义 setBusy 方法。它负责统一禁用或启用所有按钮，防止动画播放时用户连续点击。
      Object.values(buttons).forEach((button) => { // 这里把对象里的所有配置项取出来逐个处理。这样不用分别写 V 面、W 面、H 面三套重复代码。
        if (button) button.disabled = isBusy; // 这里如果按钮确实存在，就按 isBusy 的值禁用或启用它；动画忙碌时按钮不能点，动画结束后恢复可点。
      }); // 这里把刚才打开的回调函数和函数调用收起来，表示这一小段流程到这里结束。
    }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
    setActive(name, active) { // 这里定义 setActive 方法。它负责让指定按钮出现或取消高亮状态。
      buttons[name]?.classList.toggle('is-active', active); // 这里按 active 的真假给按钮切换 is-active 类名，按钮会因此变成高亮或恢复普通样式。
    }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
    setStepText(text) { // 这里定义 setStepText 方法。它负责修改“教学流程”下方的当前步骤提示文字。
      const element = document.querySelector('.current-step'); // 这里定义 element，它保存的是 页面中 '.current-step' 对应的元素，后面的代码会拿这个结果继续工作。
      if (element) element.textContent = text; // 这里如果找到了步骤提示元素，就把它显示的文字换成 text，让用户知道当前教学流程走到哪一步。
    }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
  }; // 这里结束对象，表示这张配置表或数据表已经写完。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
