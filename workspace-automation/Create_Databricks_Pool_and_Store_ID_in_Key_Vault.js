const request = require('request');


module.exports = async function (context, req) {
   const 
    ctenantid = process.env["tenantid"]
    cserviceprincipalclientid = process.env["serviceprincipalclientid"]
    cserviceprincipalsecret = process.env["serviceprincipalsecret"]
    cdatabricksworkspaceid = process.env["databricksworkspaceid"]
    ckeyvaultid = process.env["keyvaultid"]
    context.log('tenantid is '+ctenantid)
    if (req.query.poolsecretname) {
      function getADBToken(callback) {
payload = 'grant_type=client_credentials&client_id='+cserviceprincipalclientid+'&client_secret='+cserviceprincipalsecret+'&resource=2ff814a6-3304-4ab8-85cb-cd0e6f879c1d'
request.post({
    agent: false,
    url: 'https://login.microsoftonline.com/'+ctenantid+'/oauth2/token',
    headers: {
        
        'content-type': "application/x-www-form-urlencoded"
    },
    body: payload

},  function (error, response, body) {
        if (error || response.statusCode != 200) {
            context.log(error)
        }
        else {
             context.log(JSON.parse(body).access_token)
              callback(JSON.parse(body).access_token)
              }
    }
)

 }
 function createPool(bearertoken,pool,callback) {
payload = JSON.stringify({
  "instance_pool_name": pool,
  "node_type_id": "Standard_D3_v2",
  "min_idle_instances": 0, "max_capacity":2, "idle_instance_autotermination_minutes":0
})
//context.log(payload)
request.post({
    agent: false,
    url: 'https://adb-'+cdatabricksworkspaceid+'.12.azuredatabricks.net/api/2.0/instance-pools/create',
    headers: {
        'X-Databricks-Org-Id':cdatabricksworkspaceid, 'Authorization': 'Bearer ' + bearertoken
    },
    body: payload

},  function (error, response, body) {
        if (error || response.statusCode != 200) {
            context.log(error)
        }
        else {
              callback(JSON.parse(body).instance_pool_id)
              }
    }
)
}

function getVLTToken(callback) {
payload = 'grant_type=client_credentials&client_id='+cserviceprincipalclientid+'&client_secret='+cserviceprincipalsecret+'&resource=https%3A%2F%2Fvault.azure.net'
request.post({
    agent: false,
    url: 'https://login.microsoftonline.com/244ecd6b-204f-4a0e-b76f-eb3bc132009e/oauth2/token',
    headers: {
        
        'content-type': "application/x-www-form-urlencoded"
    },
    body: payload

},  function (error, response, body) {
        if (error || response.statusCode != 200) {
            context.log(error)
        }
        else {
              callback(JSON.parse(body).access_token)
              }
    }
)
}

function createVLTSecret(vlttoken,poolid, pool,callback) {
payload = JSON.stringify({
  "value": poolid 
  } )
request.put({
    agent: false,
    url: 'https://'+ckeyvaultid+'.vault.azure.net/secrets/'+tokensecret+'?api-version=7.0',
    headers: {
       'Content-Type': 'application/json', 'Authorization': 'Bearer ' + vlttoken
    },
    body: payload

},  function (error, response, body) {
        if (error || response.statusCode != 200) {
            context.log(error)
        }
        else {
              callback(JSON.parse(body).id)
              }
    }
)
}
var pool=req.query.poolsecretname
getADBToken(function(adbtoken) {
  createPool(adbtoken, pool,function(poolid) {context.log("pool id is "+poolid)
                  getVLTToken(function(vlttoken) {
                        createVLTSecret(vlttoken, poolid, pool, function(svalue){context.log("Secret value is "+svalue)}) 
                                                 })
                                         })
})
        context.res = {
            status: 200, /* Defaults to 200 */
            //body: req.query.pool
        };
    }
    else {
        context.res = {
            status: 400,
            body: "Please pass a pool name on the query string"
        };
    }
};
