// 此文件作为 Generator 的核心入口
// 需要导出一个继承自 Yeoman Generator 的类型
// Yeoman Generator 在工作时会自动调用我们在此类型中定义的一些生命周期方法
// 我们在这些方法中可以通过调用父类提供的一些工具方法实现一些功能，例如文件写入

const Generator = require('yeoman-generator')

module.exports = class extends Generator {
  // add your own methods
  method1() {
    console.log('I am a custom method')
  }
  method2() {
    console.log('I am a custom method2')
  }

  // 在此方法中可以调用父类的 prompt() 方法与用户进行命令行询问
  prompting() {
    return this.prompt([
      {
        type: 'input', // 交互类型
        name: 'name',
        message: 'Your project name', // 询问信息
        default: this.appname, // 项目目录名称，这里是 generator-simple
      },
      {
        type: 'input', // 交互类型
        name: 'age',
        message: 'Your project age', // 询问信息
        default: this.appname, // 项目目录名称，这里是 generator-simple
      },
    ]).then((answers) => {
      console.log(answers) // 打印输入内容
      this.answers = answers // 存入结果，可以在后面使用
    })
  }
  writing() {
    // 我们使用 Generator 提供的 fs 模块尝试往目录中写入文件
    // this.fs.write(
    //   // destinationPath() 基于项目地址
    //   this.destinationPath('temp.txt'), // 写入地址
    //   Math.random().toString(), // 写入内容
    // )

    // 模版文件路径，默认指向 templates
    const tempPath = this.templatePath('temp.html')
    // 输出目标路径
    const output = this.destinationPath('index.html')
    // 模板数据上下文
    const context = { title: this.answers.name, success: true }

    this.fs.copyTpl(tempPath, output, context)
  }
}
