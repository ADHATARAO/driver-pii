// General
const https = require('https');
const http = require('http');
const express = require('express');
//const request = require('request');
const bodyParser = require('body-parser');
const fs = require('fs');

// DataBox@
const databox = require('node-databox');
const DATABOX_ARBITER_ENDPOINT = process.env.DATABOX_ARBITER_ENDPOINT || 'tcp://127.0.0.1:4444';
const DATABOX_ZMQ_ENDPOINT = process.env.DATABOX_ZMQ_ENDPOINT || 'tcp://127.0.0.1:5555';
const DATABOX_TESTING = !(process.env.DATABOX_VERSION);

const PORT = process.env.port || '8080';
const store = databox.NewStoreClient(DATABOX_ZMQ_ENDPOINT, DATABOX_ARBITER_ENDPOINT);

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

// Load page templates
const ui_template = fs.readFileSync('src/views/ui1.html', 'utf8');


// UI endpoint
app.get('/ui1', function (req, res) {
  getSettings()
    .then((settings) => {
      const { client_id } = settings;
      res.type('html');
      const html = ui_template
        .replace('__pii__', client_id);
      res.send(html);
    });
});

app.get('/ui1/saveConfiguration', (req, res) => {
  getSettings()
    .then((settings) => {
      const { client_id } = settings;

      // read data based on the client_id and save as json
      const piiData = fs.readFileSync('src/pii/' + pii, 'utf8');
      const dataArray = piiData.split('\n');
      console.log('Data loaded with length: ' + dataArray.length);
      save('piiData', JSON.stringify(dataArray));

      setSettings(settings)
        .then(() => {
          res.type('html');
          res.send(`
            <h1>PII data information</h1>
            <p>Data have been successfully loaded into the datastore.</p>
	        <title>reading file</title>
    <script type="text/javascript">

	var reader = new FileReader();

	function readText(that){

		if(that.files && that.files[0]){
			var reader = new FileReader();
			reader.onload = function (e) {  
				var output=e.target.result;

				//process text to show only lines with "@":				
				output=output.split("\n").filter(/./.test, /\@/).join("\n");

				document.getElementById('main').innerHTML= output;
			};//end onload()
			reader.readAsText(that.files[0]);
		}//end if html5 filelist support
	} 
</script>
</head>
<body>
	<input type="file" onchange='readText(this)' />
	<div id="main"></div>
  </body>
          `);
          res.end();
        });
    });
});

app.get('/status', function (req, res) {
  res.send('active');
});

const piiData = databox.NewDataSourceMetadata();
piiData.Description = 'Reddit Simulator data';
piiData.ContentType = 'application/json';
piiData.Vendor = 'Databox Inc.';
piiData.DataSourceType = 'redditSimulatorData';
piiData.DataSourceID = 'redditSimulatorData';
piiData.StoreType = 'ts/blob';

const driverSettings = databox.NewDataSourceMetadata();
driverSettings.Description = 'Reddit Simulator driver settings';
driverSettings.ContentType = 'application/json';
driverSettings.Vendor = 'Databox Inc.';
driverSettings.DataSourceType = 'redditSimulatorSettings';
driverSettings.DataSourceID = 'redditSimulatorSettings';
driverSettings.StoreType = 'kv';

store.RegisterDatasource(piiData)
  .then(() => {
    return store.RegisterDatasource(driverSettings);
  })
  .catch((err) => {
    console.log('Error registering data source:' + err);
  });

function getSettings() {
  const datasourceid = 'redditSimulatorSettings';
  return new Promise((resolve, reject) => {
    store.KV.Read(datasourceid, 'settings')
      .then((settings) => {
        console.log('[getSettings] read response = ', settings);
        if (Object.keys(settings).length === 0) {
          //return defaults
          const settings = RedditSimulatorDefaultSettings;
          //console.log('[getSettings] using defaults Using ----> ', settings);
          resolve(settings);
          return;
        }

        //console.log('[getSettings]', settings);
        resolve(settings);
      })
      .catch((err) => {
        const settings = RedditSimulatorDefaultSettings;
        console.log('Error getting settings', err);
        console.log('[getSettings] using defaults Using ----> ', settings);
        resolve(settings);
      });
  });
}

function setSettings(settings) {
  const datasourceid = 'redditSimulatorSettings';
  return new Promise((resolve, reject) => {
    store.KV.Write(datasourceid, 'settings', settings)
      .then(() => {
        //console.log('[setSettings] settings saved', settings);
        resolve(settings);
      })
      .catch((err) => {
        console.log('Error setting settings', err);
        reject(err);
      });
  });
}

async function save(datasourceid, data) {
  console.log('Saving pii event::', data);
  const json = { data };
  store.TSBlob.Write(datasourceid, json)
    .then((resp) => {
      console.log('Save got response ', resp);
    })
    .catch((error) => {
      console.log('Error writing to store:', error);
    });
}

//when testing, we run as http, (to prevent the need for self-signed certs etc);
if (DATABOX_TESTING) {
  console.log('[Creating TEST http server]', PORT);
  http.createServer(app).listen(PORT);
} else {
  console.log('[Creating https server]', PORT);
  const credentials = databox.GetHttpsCredentials();
  https.createServer(credentials, app).listen(PORT);
}
