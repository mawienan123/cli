#! /usr/bin/env node

// #! 符号的名称叫 Shebang，用于指定脚本的解释程序
// Node CLI 应用入口文件必须要有这样的文件头
// 如果是Linux 或者 macOS 系统下还需要修改此文件的读写权限为 755
// 具体就是通过 chmod 755 cli.js 实现修改

// 实现与询问用户信息的功能需要引入 inquirer.js  https://github.com/SBoudrias/Inquirer.js/
const inquirer = require('inquirer')
const path = require('path')
const fs = require('fs')
const ejs = require('ejs')

inquirer
  .prompt([
    {
      type: 'input', //type：input,confirm,list,rawlist,checkbox,password...
      name: 'name', // key 名
      message: 'Your name', // 提示信息
      default: 'my-node-cli', // 默认值
    },
  ])
  .then((answers) => {
    // 模版文件目录
    const destUrl = path.join(__dirname, 'templates')
    // 生成文件目录
    // process.cwd() 对应控制台所在目录
    const cwdUrl = process.cwd()
    // 从模版目录中读取文件
    fs.readdir(destUrl, (err, files) => {
      if (err) throw err
      files.forEach((file) => {
        // 使用 ejs 渲染对应的模版文件
        // renderFile（模版文件地址，传入渲染数据）
        ejs.renderFile(path.join(destUrl, file), answers).then((data) => {
          // 生成 ejs 处理后的模版文件
          fs.writeFileSync(path.join(cwdUrl, file), data)
        })
      })
    })
  })
