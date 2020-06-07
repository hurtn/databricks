const request = require('request');


module.exports = async function (context, req) {
   const 
    ctenantid = process.env["tenantid"]
    cserviceprincipalclientid = process.env["serviceprincipalclientid"]
    cserviceprincipalsecret = process.env["serviceprincipalsecret"]
    cdatabricksworkspaceid = process.env["databricksworkspaceid"]
    ckeyvaultid = process.env["keyvaultid"]
    context.log('tenantid is '+ctenantid)
    if (req.query.patsecretname) {
      function getADBToken(callback) {
payload = 'grant_type=client_credentials&client_id='+cserviceprincipalclientid+'&client_secret='+cserviceprincipalsecret+'&resource=2ff814a6-3304-4ab8-85cb-cd0e6f879c1d'
context.log(payload)
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
              callback(JSON.parse(body).access_token)
              }
    }
)

 }
 function createPAT(bearertoken,callback) {
payload = JSON.stringify({
  "lifetime_seconds": 3600,
  "comment": "ADF Linked Service"
})
request.post({
    agent: false,
    url: 'https://adb-'+cdatabricksworkspaceid+'.12.azuredatabricks.net/api/2.0/token/create',
    headers: {
        
        'X-Databricks-Org-Id':cdatabricksworkspaceid, 'Authorization': 'Bearer ' + bearertoken
    },
    body: payload

},  function (error, response, body) {
        if (error || response.statusCode != 200) {
            context.log(error)
        }
        else {
              callback(JSON.parse(body).token_value)
              }
    }
)
}

function getVLTToken(callback) {
payload = 'grant_type=client_credentials&client_id='+cserviceprincipalclientid+'&client_secret='+cserviceprincipalsecret+'&resource=https%3A%2F%2Fvault.azure.net'
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
              callback(JSON.parse(body).access_token)
              }
    }
)
}

function createVLTSecret(vlttoken,adbtoken, tokensecret,callback) {
payload = JSON.stringify({
  "value": adbtoken 
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
var tokensecret=req.query.patsecretname
getADBToken(function(adbtoken) {
  createPAT(adbtoken, function(pattoken) {
                  getVLTToken(function(vlttoken) {
                        createVLTSecret(vlttoken, pattoken, tokensecret, function(svalue){context.log("secret name is "+svalue)}) 
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
            body: "Please pass a secret name on the query string"
        };
    }
};
