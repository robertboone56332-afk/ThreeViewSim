export function easeInOutCubic(t) { // 这里导出 easeInOutCubic 函数。别的文件导入后，就能执行这里封装好的完整流程。
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2; // 这里返回 t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2。函数执行到 return 就结束，并把结果交回调用它的地方。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

export function tween({ // 这里导出 tween 函数。别的文件导入后，就能执行这里封装好的完整流程。
  duration = 800, // 这里把 duration 设成 800。也就是说，从这一行开始，程序后面再读取 duration 时得到的就是这个新值。
  delay = 0, // 这里把 delay 设成 0。也就是说，从这一行开始，程序后面再读取 delay 时得到的就是这个新值。
  onUpdate, // 这里把 onUpdate 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  onComplete, // 这里把 onComplete 这个已经准备好的结果放进返回对象里，让调用方可以拿到并继续使用它。
  easing = easeInOutCubic, // 这里把 easing 设成 easeInOutCubic。也就是说，从这一行开始，程序后面再读取 easing 时得到的就是这个新值。
}) { // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
  const startTime = performance.now() + delay; // 这里定义 startTime，它保存的是 当前精确时间。动画用它计算已经播放了多久，后面的代码会拿这个结果继续工作。
  let cancelled = false; // 这里声明会变化的 cancelled，初始值是 false，后面运行过程中会继续改它。

  function frame(now) { // 这里定义 frame 函数。函数就像一段可重复使用的小说明书，调用一次就执行一次。
    if (cancelled) return; // 这里先判断 cancelled。如果满足，就直接退出当前函数，避免继续做不该做的事。
    if (now < startTime) { // 这里判断 now < startTime 是否成立。成立时执行下面的大括号内容，不成立就跳过。
      requestAnimationFrame(frame); // 这里让浏览器下一帧继续调用 frame。连续请求下一帧，就形成动画循环。
      return; // 这里提前结束当前函数。程序走到这里就不再执行下面的代码。
    } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
    const progress = Math.min((now - startTime) / duration, 1); // 这里定义 progress，它保存的是 几个数里最小的那个。这里常用来限制数值不要超过上限，后面的代码会拿这个结果继续工作。
    onUpdate(easing(progress), progress); // 这里调用 onUpdate 函数，并把 easing(progress), progress 交给它，让它完成封装好的那一步。
    if (progress < 1) { // 这里判断 progress < 1 是否成立。成立时执行下面的大括号内容，不成立就跳过。
      requestAnimationFrame(frame); // 这里让浏览器下一帧继续调用 frame。连续请求下一帧，就形成动画循环。
    } else { // 这里把这一行作为当前流程的一部分执行，具体作用由这一行里的函数名、变量名和参数共同决定。
      onComplete?.(); // 这里调用动画完成回调。问号表示如果外面没有传这个回调，程序也不会报错。
    } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
  } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

  requestAnimationFrame(frame); // 这里让浏览器下一帧继续调用 frame。连续请求下一帧，就形成动画循环。
  return () => { // 这里返回 () => {。函数执行到 return 就结束，并把结果交回调用它的地方。
    cancelled = true; // 这里把 cancelled 设成 true。也就是说，从这一行开始，程序后面再读取 cancelled 时得到的就是这个新值。
  }; // 这里结束对象，表示这张配置表或数据表已经写完。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。

export function tweenMany(tasks, onDone) { // 这里导出 tweenMany 函数。别的文件导入后，就能执行这里封装好的完整流程。
  let remaining = tasks.length; // 这里声明会变化的 remaining，初始值是 tasks.length，后面运行过程中会继续改它。
  if (!remaining) { // 这里判断 !remaining 是否成立。成立时执行下面的大括号内容，不成立就跳过。
    onDone?.(); // 这里通知外层所有动画已经完成。问号表示没有传 onDone 时直接跳过。
    return []; // 这里开始返回一个数组。数组会按顺序保存多个同类结果。
  } // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
  return tasks.map((task) => tween({ // 这里返回 tasks.map((task) => tween({。函数执行到 return 就结束，并把结果交回调用它的地方。
    ...task, // 这里把原来 task 对象里的配置展开复制进新对象，相当于保留它原本的动画时间和更新逻辑。
    onComplete: () => { // 这里写动画结束后要做的事，比如切换提示文字、解锁按钮或进入下一段动画。
      task.onComplete?.(); // 这里先执行这个单独动画任务自己的完成回调，再继续统计总任务是否全部完成。
      remaining -= 1; // 这里把剩余动画数量减 1。每完成一个动画就减一次，减到 0 表示全部完成。
      if (remaining === 0) onDone?.(); // 这里判断 remaining === 0) onDone?.( 是否成立。成立时执行下面的大括号内容，不成立就跳过。
    }, // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
  })); // 这里结束嵌套的回调调用，表示内层流程和外层函数都收尾完成。
} // 这里结束当前这一组配置。到这里为止，这个小对象里需要的说明已经写全。
