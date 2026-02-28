const https = require('https');
https.get('https://api.postalpincode.in/postoffice/Haveli', (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => console.log(JSON.parse(data)[0].PostOffice?.[0]));
});
