const { getRepoList, getTagList } = require('./http')
const ora = require('ora')
const inquirer = require('inquirer')
const downloadGitRepo = require('download-git-repo')
const util = require('util')
const path = require('path')
const chalk = require('chalk')
const fs = require('fs')

let stat = fs.stat

const copy = function (src, dst) {
  // 读取目录中的所有文件/目录
  fs.readdir(src, function (err, paths) {
    if (err) {
      throw err
    }

    paths.forEach(function (path) {
      var _src = src + '/' + path,
        _dst = dst + '/' + path,
        readable,
        writable

      stat(_src, function (err, st) {
        if (err) {
          throw err
        }

        // 判断是否为文件
        if (st.isFile()) {
          // 创建读取流
          readable = fs.createReadStream(_src)
          // 创建写入流
          writable = fs.createWriteStream(_dst)
          // 通过管道来传输流
          readable.pipe(writable)
        }
        // 如果是目录则递归调用自身
        else if (st.isDirectory()) {
          exists(_src, _dst, copy)
        }
      })
    })
  })
}
// 添加加载动画
async function wrapLoading(fn, message, ...args) {
  // 使用 ora 初始化，传入提示信息 message
  const spinner = ora(message)
  // 开始加载动画
  spinner.start()

  try {
    // 执行传入方法 fn
    let result = []
    if (!message.indexOf('tag') > -1 && !message.indexOf('templatddde') > -1) {
      console.log(JSON.stringify(args))
      fs.mkdir(`./${args[2]}`, function () {
        copy(`${process.cwd()}/template`, `./${args[2]}`)
      })

      //   result = await fn(...args)
      //   fs.writeFile(`${path}/` + name, text, function (err) {
      //     if (err) {
      //       return console.log(err)
      //     }
      //     console.log('The file was saved!')
      //   })
    }

    if (message.indexOf('tag') > -1) {
      result = [
        {
          name: '1.01',
        },
        {
          name: '1.02',
        },
        {
          name: '1.03',
        },
      ]
    } else if (message.indexOf('templatddde') > -1) {
      result = [
        {
          name: 'shi_jia1',
        },
        {
          name: 'shi_jia2',
        },
        {
          name: 'shi_jia3',
        },
      ]
    }

    // 状态为修改为成功
    spinner.succeed()
    return result
  } catch (error) {
    console.log(error, 'error')
    // 状态为修改为失败
    spinner.fail('Request failded, refet ...')
  }
}

class Generator {
  constructor(name, targetDir) {
    // 目录名称
    this.name = name
    // 创建位置
    this.targetDir = targetDir
    // 对 download-git-repo 进行 promise 化改造
    this.downloadGitRepo = util.promisify(downloadGitRepo)
  }

  // 下载远程模板
  // 1）拼接下载地址
  // 2）调用下载方法
  async download(repo, tag) {
    // 1）拼接下载地址
    // const requestUrl = `zhurong-cli/${repo}${tag ? '#' + tag : ''}`
    const requestUrl = `./template/index.html`
    // 2）调用下载方法
    await wrapLoading(
      this.downloadGitRepo, // 远程下载方法
      'waiting download template', // 加载提示信息
      requestUrl, // 参数1: 下载地址
      path.resolve(process.cwd(), this.targetDir),
      this.name,
    ) // 参数2: 创建位置
  }

  // 获取用户选择的模板
  // 1）从远程拉取模板数据
  // 2）用户选择自己新下载的模板名称
  // 3）return 用户选择的名称

  async getRepo() {
    // 1）从远程拉取模板数据
    const repoList = await wrapLoading(getRepoList, 'waiting fetch templatddde')
    if (!repoList) return

    // 过滤我们需要的模板名称
    const repos = repoList.map((item) => item.name)

    // 2）用户选择自己新下载的模板名称
    const { repo } = await inquirer.prompt({
      name: 'repo',
      type: 'list',
      choices: repos,
      message: 'Please choose a template to create project',
    })

    // 3）return 用户选择的名称
    return repo
  }

  async getTag(repo) {
    // 1）基于 repo 结果，远程拉取对应的 tag 列表
    const tags = await wrapLoading(getTagList, 'waiting fetch tag', repo)
    if (!tags) return

    // 过滤我们需要的 tag 名称
    const tagsList = tags.map((item) => item.name)

    // 2）用户选择自己需要下载的 tag
    const { tag } = await inquirer.prompt({
      name: 'tag',
      type: 'list',
      choices: tagsList,
      message: 'Place choose a tag to create project',
    })

    // 3）return 用户选择的 tag
    return tag
  }

  // 核心创建逻辑
  // 1）获取模板名称
  // 2）获取 tag 名称
  // 3）下载模板到模板目录
  async create() {
    // 1）获取模板名称
    const repo = await this.getRepo()

    // 2) 获取 tag 名称
    const tag = await this.getTag(repo)

    // 3）下载模板到模板目录
    await this.download(repo, tag)

    // 4）模板使用提示
    console.log(`\r\nSuccessfully created project ${chalk.cyan(this.name)}`)
    console.log(`\r\n  cd ${chalk.cyan(this.name)}`)
    console.log('  npm run dev\r\n')
  }
}

module.exports = Generator
