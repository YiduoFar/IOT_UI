import $moment from 'moment'
// 接收主线程发来的消息

onmessage = e => {
  let obj = JSON.parse(e.data)
  // console.log('子线程接收到：', obj)
  let ans = [[], [], []]
  let data = obj.data
  let range = obj.range
  let st = obj.st

  if (data.length != 0) {
    // 如果有数据，全线，不断
    for (let i = 0, n = data.length; i < n; i++) {
      var timestamp = $moment(data[i].timestamp).format('YYYY-MM-DD HH:mm:ss')
      var value = data[i].value
      ans[0].push(timestamp)
      ans[1].push(value)
      ans[2].unshift({
        time: timestamp,
        value: value,
      })
    }
  } else {
    // 为了在没数据时显示Y轴
    ans[0].push($moment().format('YYYY-MM-DD HH:mm:ss'))
    ans[1].push(0)
    // 如果没数据，全空
    for (let i = 0; i < range; i++) {
      ans[0].push(
        $moment(st)
          .add(i, 'seconds')
          .format('YYYY-MM-DD HH:mm:ss')
      )
      ans[1].push('-')
    }
  }
  postMessage(ans)
}

// 向主线程发送消息
// postMessage(0)
