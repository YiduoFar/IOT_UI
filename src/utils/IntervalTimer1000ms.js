import $moment from 'moment'
let timer = null

onmessage = e => {
  let obj = JSON.parse(e.data)
  let token = obj.token
  let sCode = obj.code
  let st = obj.st
  let et = obj.et
  clearInterval(timer)
  timer = setInterval(async () => {
    // 时间段递进
    st = $moment(st)
      .add(1, 'seconds')
      .format('YYYY-MM-DD HH:mm:ss')
    et = $moment(et)
      .add(1, 'seconds')
      .format('YYYY-MM-DD HH:mm:ss')
    // 请求地址
    let url =
      '/api/data-info/sensor/' + sCode + '?startTime=' + st + '&endTime=' + et
    // Fetch API
    await fetch(url, {
      headers: {
        Authorization: token,
      },
    })
      .then(function(response) {
        return response.json()
      })
      .then(function(data) {
        // 将获取到的数据发送回主线程
        postMessage(data)
      })
  }, 1000)
}
