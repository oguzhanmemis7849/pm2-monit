const pm2 = require('pm2');
const { response } = require('express');

const express = require('express');
const router = express.Router();
const app = express();
const fs = require('fs');
let processInfo = []
let outLog = "";
let errLog = [];
let currentAppId = null;
let outLogControl = false;
let errLogControl = false;
const WebSocket = require('ws');
const INTERVAL_TIME = 1000
const wss = new WebSocket.Server({ port: 8080 });

const getPm2Info =async  () =>
{
pm2.list((_err, list) => {
    let a= list.map(item => {
      return {
        name: item.name,
        pid: item.pid,
        username: item.pm2_env.username,
        user_domain: item.pm2_env.userDomain,
        unique_id: item.pm2_env.unique_id,
        status: item.pm2_env.status,
        pm_uptime: getTimeAsFormat(item.pm2_env.pm_uptime),
        created_at: new Date(item.pm2_env.created_at),
        pm_id: item.pm2_env.pm_id,
        restart_time: item.pm2_env.restart_time,
        unstable_restarts: item.pm2_env.unstable_restarts,
        version: item.pm2_env.version,
        node_version: item.pm2_env.node_version,
        memory_usage: Math.round(item.monit.memory / (1024 * 1024)),
        cpu_usage: item.monit.cpu ,
        pm_out_log_path: item.pm2_env.pm_out_log_path,
        pm_err_log_path: item.pm2_env.pm_err_log_path,
        computer_name:item.pm2_env.COMPUTERNAME

      }
    });
    processInfo = a
  })
}
wss.on('connection', function connection(ws) {
console.log("connected");

pm2.launchBus(function(err_, bus) {
  if(err_){
    throw(err_)
  }
  bus.on("log:out", function(data) { 
    if(outLogControl){ 
      data["type"]="outlog"
      if(data.process.pm_id == currentAppId){
        ws.send(JSON.stringify(data));
      }
    }
    // console.log(data); 
  });   
  
});

  pm2.launchBus(function(err_, bus) {
    if(err_){
      throw(err_)
    }
    bus.on("log:err", function(data) {
      if(errLogControl){
        data["type"]="errlog" 
        if(data.process.pm_id == currentAppId){
          ws.send(JSON.stringify(data));
        }
      }
      // console.log(data); 
    });   
  });

 setInterval(() => {
   getPm2Info()  
   ws.send(JSON.stringify({type:"apps",apps:processInfo}))
 }, INTERVAL_TIME);  
});  


function startStop(res) {
  return (_err, proc) => {
    let c = proc.map(item => {
      return {
        status: item.pm2_env.status
      };
    });
    res.send(c);
  };
}

const getTimeAsFormat = (uptime) => {
  let created_time = new Date(uptime); // oluşturulma zamanı - epoch time convert

  let _uptime = (new Date() - created_time) / 1000; // çalışma zamanı(saniye) - epoch time convert

  let dayTime = _uptime / 3600 / 24;
  let hourTime = (_uptime / 3600) % 24;
  let minuteTime = ((_uptime % 3600) / 60) % 24;
  let secondTime = _uptime % 60;

  let time = "";

  time += Math.floor(dayTime) ? Math.floor(dayTime) + 'D ' : ""
  time += Math.floor(hourTime) ? Math.floor(hourTime) + 'H ' : ""
  time += Math.floor(minuteTime) ? Math.floor(minuteTime) + 'm ' : ""
  time += Math.floor(secondTime) ? Math.floor(secondTime) + 's' : ""
  return time
}

/* Home Pagee*/
router.get('/', function (_req, res, _next) {
    res.render('index', { title: 'Express' });
  });


/* POST Start */
router.post('/appstart', (req, res) => {
  pm2.start({
    script: req.body.script,
    name: req.body.name,
    args: req.body.args || ""
  }, startStop(res))
});

/* POST Stop */
router.post('/appstop', (req, res) => {
  pm2.stop(req.body.name || req.body.id, startStop(res));
});

/* POST Restart */
router.post('/apprestart', (req, res) => {
  let rest = req.body.hasOwnProperty("id") ? req.body.id : req.body.hasOwnProperty("name") ? req.body.name : ""
  rest == "" ? res.send("ID or Name not found.") : pm2.restart(rest, (err, proc) => {
    let r = proc.map(item => {
      return {
        restart_count: item.restart_time      }
    });
    res.send(r);
  });
  });

/* DELETE */
router.delete('/appdelete/:id', (req, res) => {
  let del = req.params.hasOwnProperty("id") ? req.params.id : req.params.hasOwnProperty("name") ? req.params.name : ""
  del === "" ? res.send("ID or Name Not Found") : pm2.delete(del, (err, proc) => {
      proc ? res.send({ message: proc }) : res.send({ message: "App can not found." })
    });
});
//---------------------------------------------------------------------------------------------------------------------------------
  /* Errlog Launchbus Anlık oluşan hatalar(Realtime err/issues) */
  
  pm2.launchBus(function(err_, bus) {
    if(err_){
      throw(err_)
    }
    bus.on("log:err", function(data) {
      errLog.push({id : data.process.pm_id, data : data.data}) 
    });   
  });

  router.get('/realtimeerr', (req, res) =>{
      errLogControl = true;
      res.send(JSON.stringify(errLog)) //name ile hata yazdırma
  });
//------------------------------------------------------------------------------------------------------------------------------------
  /* Outlog Launchbus*/
 
  pm2.launchBus(function(err_, bus) {
    if(err_){
      throw(err_)
    }
    bus.on("log:out", function(data) { 
      outLog = data;
      // console.log(data); 
    });   
  });

  router.get('/realtimeout', (req, res) =>{
    outLogControl = true;
    res.send(outLog.data);
});
//---------------------------------------------------------------------------------------------------------------------------
/* GET Errorlog page / pathdeki hataları oku */
router.get('/geterrLogFalse/:id', (req, res) => { 
  let id = req.params.id;
  currentAppId = id;
  errLogControl = false;
  console.log(errLogControl);
  res.send({ errLogControl })
});

router.get('/geterrLogTrue/:id', (req, res) => { 
  let id = req.params.id;
  currentAppId = id;
  errLogControl = true;
  console.log(errLogControl);
  res.send({ errLogControl })
});

// router.get('/geterrlog/:id', (req, res) => {
//   let str = "";
//   pm2.describe(req.params.id, (err, description) => {
//     try {
      

//       fs.readFile(description[0].pm2_env.pm_err_log_path, function (hata, data) {
//         if (hata) {
//           throw (hata);
//         }
//         str = data.toString();

//         res.status(200).send(str.substring(str.length - 5000)); // last 2000 char

//       });
//     } catch (error) {
//       console.log(error);
//       res.send({ "error": error.toString() })
//     }
//   });
// });

/*--------------------------------------------------------------------------------------------------------- */


/* GET Outlog page */
router.get('/getoutlogFalse/:id', (req, res) => { 
  let id = req.params.id;
  currentAppId = id;
  outLogControl = false;
  console.log(outLogControl);
  res.send({ outLogControl })
});

router.get('/getoutlogTrue/:id', (req, res) => { 
  let id = req.params.id;
  currentAppId = id;
  outLogControl = true;
  console.log(outLogControl);
  res.send({ outLogControl })

  

  // pm2.describe(req.params.id, (_err, description) => {
  //   try {
  //     fs.readFile(description[0].pm2_env.pm_out_log_path, function (hata, data) {
  //       if (hata) {
  //         throw (hata);
  //       }
  //       str = data.toString(); 
  //       res.status(200).send(str);
  //     });
  //   } catch (error) {
  //     console.log(error);
  //     res.send({ "error": error.toString() })
  //   }
  // });
});

/* GET pm2 list page */
router.get('/getpm2list', (_req, res, _next) => {
  pm2.list((_err, list) => {
    let a = list.map(item => {
      return {
        name: item.name,
        pid: item.pid,
        username: item.pm2_env.username,
        user_domain: item.pm2_env.userDomain,
        unique_id: item.pm2_env.unique_id,
        status: item.pm2_env.status,
        pm_uptime: getTimeAsFormat(item.pm2_env.pm_uptime),
        created_at: new Date(item.pm2_env.created_at),
        pm_id: item.pm2_env.pm_id,
        restart_time: item.pm2_env.restart_time,
        unstable_restarts: item.pm2_env.unstable_restarts,
        version: item.pm2_env.version,
        node_version: item.pm2_env.node_version,
        memory_usage: Math.round(item.monit.memory / (1024 * 1024)),
        cpu_usage:  item.monit.cpu,
        pm_out_log_path: item.pm2_env.pm_out_log_path,
        pm_err_log_path: item.pm2_env.pm_err_log_path,
        computer_name:item.pm2_env.COMPUTERNAME

      }
    });
 
    res.status(200).send(a)
  });
});
module.exports = router;

