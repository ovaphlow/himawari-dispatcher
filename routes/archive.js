const grpc = require('grpc')
const protoLoader = require('@grpc/proto-loader')
const Router = require('@koa/router')

const config = require('../config')

const proto = grpc.loadPackageDefinition(
  protoLoader.loadSync(__dirname + '/../protos/archive.proto'), {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
  }
).archive
const grpcClient = new proto.Archive(
  `${config.grpcServer.host}:${config.grpcServer.port}`,
  grpc.credentials.createInsecure()
)

const router = new Router({
  prefix: '/api/archive'
})

router
  /**
   * 查询指定档案号或身份证的单个档案
   */
  .put('/search', async ctx => {
    const grpcFetch = body => {
      return new Promise((resolve, reject) => {
        grpcClient.search({data: JSON.stringify(body)}, (err, response) => {
          if (err) {
            console.error(err)
            reject(err)
            return
          }
          resolve(JSON.parse(response.data))
        })
      })
    }
    try {
      ctx.response.body = await grpcFetch(ctx.request.body)
    } catch (err) {
      console.error(err)
      ctx.response.body = {message: '服务器错误'}
    }
  })

router
  /**
   * 查询档案，返回结果最多2000条
   * 参数：档案号或身份证或姓名
   */
  .put('/filter', async ctx => {
    const grpcFetch = body => {
      return new Promise((resolve, reject) => {
        grpcClient.filter({data: JSON.stringify(body)}, (err, response) => {
          if (err) {
            console.error(err)
            reject(err)
            return
          }
          resolve(JSON.parse(response.data))
        })
      })
    }
    try {
      ctx.response.body = await grpcFetch(ctx.request.body)
    } catch (err) {
      console.error(err)
      ctx.response.body = {message: '服务器错误'}
    }
  })

router
  .get('/', async ctx => {
    const grpcFetch = () => {
      return new Promise((resolve, reject) => {
        grpcClient.list({data: ''}, (err, response) => {
          if (err) {
            console.error(err)
            reject(err)
            return
          }
          resolve(JSON.parse(response.data))
        })
      })
    }
    try {
      ctx.response.body = await grpcFetch(ctx.request.body)
    } catch (err) {
      console.error(err)
      ctx.response.body = {message: '服务器错误'}
    }
  })
  .post('/', async ctx => {
    const grpcFetch = body => {
      return new Promise((resolve, reject) => {
        grpcClient.save({data: JSON.stringify(body)}, (err, response) => {
          if (err) {
            console.error(err)
            reject(err)
            return
          }
          resolve(JSON.parse(response.data))
        })
      })
    }
    try {
      ctx.response.body = await grpcFetch(ctx.request.body)
    } catch (err) {
      console.error(err)
      ctx.response.body = {message: '服务器错误'}
    }
  })

router
  .get('/:id', async ctx => {
    const grpcFetch = body => {
      return new Promise((resolve, reject) => {
        grpcClient.get({data: JSON.stringify(body)}, (err, response) => {
          if (err) {
            console.error(err)
            reject(err)
            return
          }
          resolve(JSON.parse(response.data))
        })
      })
    }
    try {
      ctx.response.body = await grpcFetch(ctx.params)
    } catch (err) {
      console.error(err)
      ctx.response.body = {message: '服务器错误'}
    }
  })

module.exports = router
