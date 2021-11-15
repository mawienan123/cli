#! /usr/bin/env node

const program = require('commander')
const chalk = require('chalk')
const figlet = require('figlet')

program
  // 定义命令和参数
  .command('create <app-name>')
  .description('create a new project')
  // -f or --force 为强制创建，如果创建的目录存在则直接覆盖
  .option('-f, --force', 'overwrite target directory if it exist')
  .action((name, options) => {
    // 打印执行结果
    require('../lib/create.js')(name, options)
  })

program
  // 配置版本号信息
  .version(`v${require('../package.json').version}`, '-v,--template-engine')
  .description('a good cli')
  .option('-P, --pineapple', 'Add pineapple', '23')
  .option('-b, --bbq-sauce', 'Add bbq sauce')
  .option('-c, --cheese [type]', 'Add the specified type of cheese [marble]', 'marble')
  .usage('<command> [option]')

program
  .command('config [value]')
  .description('inspect and modify the config')
  .option('-g, --get [get]', 'get value from option', '我是path的默认值')
  .option('-s, --set <path> <value>')
  .option('-d, --delete <path>', 'delete option from config')
  .action((value, options, cmd) => {
    console.log(value, options)
    console.log(cmd.get)
  })

// 配置 ui 命令
program
  .command('ui')
  .description('start add open roc-cli ui')
  .option('-p, --port <port>', 'Port used for the UI Server')
  .action((option) => {
    console.log(option)
  })
program
  // 监听 --help 执行
  .on('--help', () => {
    console.log(
      '\r\n' +
        figlet.textSync('shijia', {
          font: 'Ghost',
          horizontalLayout: 'default',
          verticalLayout: 'default',
          width: 80,
          whitespaceBreak: true,
        }),
    )

    // 新增说明信息
    console.log(`\r\nRun ${chalk.cyan(`zr <command> --help`)} for detailed usage of given command\r\n`)
  })

program.on('command:config', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '))
  // process.exit(1)
})
program.option('-dm, --podddt <port>', 'Port used for the UI Server').action((option) => {
  console.log(option, 7)
})

program.on('option:podddt', function (e) {
  console.log('进入dm', e)
})

// console.log(program.chdir, 99999)

// 解析用户执行命令传入参数
program.parse(process.argv)
