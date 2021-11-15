#! /usr/bin/env node

// const program = require('commander') //提示

// const chalk = require('chalk') //样式
// //  inquirert\提示信息

// const ora = require('ora') //动效
// program
//   .version('0.1.0')
//   .option('-p, --peppers', 'Add peppers')
//   .option('-D, --ssss', 'Add dddd')
//   .command('create <name>')
//   .description('create a new project')
//   .action((name) => {
//     // 打印命令行输入的值
//     console.log('project name is ' + chalk.bold(name))

//     // 颜色
//     const message = 'Loading unicorns'
//     // 初始化
//     const spinner = ora(message)
//     // 开始加载动画
//     spinner.start()

//     setTimeout(() => {
//       // 修改动画样式

//       // Type: string
//       // Default: 'cyan'
//       // Values: 'black' | 'red' | 'green' | 'yellow' | 'blue' | 'magenta' | 'cyan' | 'white' | 'gray'
//       spinner.color = 'red'
//       spinner.text = 'Loading rainbows'

//       setTimeout(() => {
//         // 加载状态修改
//         spinner.stop() // 停止
//         spinner.succeed('Loading succeed') // 成功 ✔
//         // spinner.fail(text?);  失败 ✖
//         // spinner.warn(text?);  提示 ⚠
//         // spinner.info(text?);  信息 ℹ
//       }, 2000)
//     }, 2000)
//   })

// program.parse()

const spawn = require('cross-spawn')
const chalk = require('chalk')

// 定义需要按照的依赖
const dependencies = ['vue', 'vuex', 'vue-router']

// 执行安装
const child = spawn('npm', ['install', '-D'].concat(dependencies), {
  stdio: 'inherit',
})

// 监听执行结果
child.on('close', function (code) {
  // 执行失败
  if (code !== 0) {
    console.log(chalk.red('Error occurred while installing dependencies!'))
    process.exit(1)
  }
  // 执行成功
  else {
    console.log(chalk.cyan('Install finished'))
  }
})
