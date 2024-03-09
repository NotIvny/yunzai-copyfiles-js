import plugin from '../../lib/plugins/plugin.js'
import fs from "fs"
let configpath = "./plugins/example/config.json"
const sleep = (timeountMS) => new Promise((resolve) => {
  setTimeout(resolve, timeountMS);
});
export class files extends plugin {
  constructor() {
    super({
      name: '文件替换',
      dsc: '文件替换',
      event: 'message',
      priority: 5000,
      rule: [{
        reg: '#文件替换',
        fnc: 'copyfiles',
        permission: 'master',
      },{
        reg: '#增加操作([^,]+),([^,]+),([^,]+)',
        fnc: 'addoperations',
        permission: 'master',
      },{
        reg: '#替换列表',
        fnc: 'list',
        permission: 'master',
      },{
        reg: '#删除操作',
        fnc: 'deleteoperations',
        permission: 'master',
      }]
    });
  }
  
  async copyfiles(e){
    if(!fs.existsSync(configpath)){
      await fs.writeFile(configpath, '{}', (err) => { 
        if (err) 
          console.log(err);
      });
      sleep(100);
    }
    let data;
    try {
      data = await JSON.parse(fs.readFileSync(configpath, 'utf-8'));
    } catch (error) {
      console.log(error);
      e.reply("数据读取失败");
    }
    let count = 0,failed = 0;
    let name_,respath,moveto;
    for(var i in data){
      name_ = i;
      respath = data[i]['respath'];
      moveto = data[i]['moveto'];
      fs.cp(respath, moveto, { recursive: true }, (err) => {
        if(err){
          console.log('Error: ' + name_ + '文件复制失败！');
          count--;
          failed++;
        }
      });
      count++;
      sleep(100);
    }
    e.reply('文件复制完毕，成功' + count + '个，' + '失败' + failed + '个');
  }
  async addoperations(e){
    const regex = /#增加操作([^,]+),([^,]+),([^,]+)/;
    const match = e.msg.match(regex);
    let name,respath,moveto,configdata;
    try {
      configdata = JSON.parse(fs.readFileSync(configpath, 'utf-8'));
    } catch (error) {
      e.reply("Error: 无法读取配置文件");
      return true;
    }
    name = match[1];
    respath = match[2];
    moveto = match[3];
    if(configdata[name]){
      e.reply(name + "已存在！");
      return true;
    }
    configdata[name] = (configdata[name] || {});
    configdata[name]["respath"] = respath;
    configdata[name]["moveto"] = moveto;
    try{
      fs.writeFileSync(configpath, JSON.stringify(configdata, null, 2));
    } catch (error){
      e.reply("Error: 无法写入配置文件");
      return true;
    }
    e.reply(name + '添加成功');
  }
  async deleteoperations(e){
    let getname = this.e.msg.replace("#删除操作", "").trim();
    let data;
    try {
      data = JSON.parse(fs.readFileSync(configpath, 'utf-8'));
    } catch (error) {
      e.reply("Error: 无法读取配置文件");
      return true;
    }
    if(!data[getname]){
      e.reply(getname + '不存在');
      return true;
    }else{
      delete data[getname];
      try{
        fs.writeFileSync(configpath, JSON.stringify(data, null, 2));
      } catch (error){
        e.reply("Error: 无法写入配置文件");
        return true;
      }
      e.reply(getname + "已删除")
    }
  }
  async list(e){
    let data;
    try {
      data = await JSON.parse(fs.readFileSync(configpath, 'utf-8'));
    } catch (error) {
      console.log(error);
      e.reply("数据读取失败");
    }
    let message = '',nums = 0;
    for(var i in data){
      nums++;
    }
    message += '共' + nums + '条文件替换配置' + '\n';
    for(var i in data){
      message += '----------------------' + i + '----------------------\n';
      message += '替换文件位置: \'' + data[i]['respath'] + '\'\n';
      message += '被替换文件位置: \'' + data[i]['moveto'] + '\'\n';
      message += '----------------------' + i + '----------------------\n';
    }
    e.reply(message);
  }
}
