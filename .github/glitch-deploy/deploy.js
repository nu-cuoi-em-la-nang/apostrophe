const upload_Md = require('./git-push.js');
const createNew_Md = require('./newCreate.js')
const shell = require('shelljs')
const queryString = require('query-string');
const axios = require("axios").default;
const axiosRetry = require('axios-retry');

setTimeout(() => {
  console.log('force exit');
  process.exit(0)
}, 30 * 60 * 1000);

axiosRetry(axios, {
  retries: 100,
  retryDelay: (retryCount) => {
    // console.log(`retry attempt: ${retryCount}`);
    return 3000 || retryCount * 1000;
  },
  retryCondition: (error) => {
    return error.response.status === 502;
  },
});


const listProject = `https://1d9f4e23-0f5f-4b64-b0e3-bdeb8e8e5c3a@api.glitch.com/git/colossal-pool-particle|https://1d9f4e23-0f5f-4b64-b0e3-bdeb8e8e5c3a@api.glitch.com/git/fascinated-kindly-cherry|https://1d9f4e23-0f5f-4b64-b0e3-bdeb8e8e5c3a@api.glitch.com/git/equatorial-aeolian-quotation|https://1d9f4e23-0f5f-4b64-b0e3-bdeb8e8e5c3a@api.glitch.com/git/somber-alert-impala|https://1d9f4e23-0f5f-4b64-b0e3-bdeb8e8e5c3a@api.glitch.com/git/harmonious-separate-dentist|https://1d9f4e23-0f5f-4b64-b0e3-bdeb8e8e5c3a@api.glitch.com/git/plant-hazel-pepperberry|https://1d9f4e23-0f5f-4b64-b0e3-bdeb8e8e5c3a@api.glitch.com/git/pepper-helpful-texture|https://1d9f4e23-0f5f-4b64-b0e3-bdeb8e8e5c3a@api.glitch.com/git/dented-slender-variraptor|https://1d9f4e23-0f5f-4b64-b0e3-bdeb8e8e5c3a@api.glitch.com/git/zenith-traveling-minibus|https://1d9f4e23-0f5f-4b64-b0e3-bdeb8e8e5c3a@api.glitch.com/git/plump-unleashed-feast|https://1d9f4e23-0f5f-4b64-b0e3-bdeb8e8e5c3a@api.glitch.com/git/puzzling-heady-pincushion|https://1d9f4e23-0f5f-4b64-b0e3-bdeb8e8e5c3a@api.glitch.com/git/mighty-longhaired-trail|https://1d9f4e23-0f5f-4b64-b0e3-bdeb8e8e5c3a@api.glitch.com/git/platinum-efficacious-monkey|https://1d9f4e23-0f5f-4b64-b0e3-bdeb8e8e5c3a@api.glitch.com/git/classic-crystal-cuckoo`.trim().split('|');

const delay = t => {
  return new Promise(function(resolve) {
    setTimeout(function() {
      resolve(true);
    }, t);
  });
};

(async () => {
  try {
    let accountNumber = 0;

    for (let i = 0; i < listProject.length; i++) {
      accountNumber = i + 1;
      try {
        const nameProject = listProject[i].split('/')[4]
        console.log('deploy', nameProject);
        createNew_Md.run(nameProject)
        await upload_Md.upload2Git(listProject[i].trim(), 'code4Delpoy');
        console.log(`account ${accountNumber} upload success ^_^`);

        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' true'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });

        if (i + 1 < listProject.length) await delay(1.8 * 60 * 1000);
      } catch (error) {
        console.log(`account ${accountNumber} upload fail ^_^`);
        axios
          .get(`https://eager-profuse-python.glitch.me/deploy?${queryString.stringify({
            email: listProject[i].trim() + ' false'
          })}`)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            if (error.response) {
              console.log(error.response.data);
            } else {
              console.log('Loi');
            }
          });
      }

      if (process.cwd().includes('code4Delpoy')) shell.cd('../', { silent: true });

    }

    await delay(20000)
    console.log('Done! exit')
    process.exit(0)

  } catch (err) {
    console.log(`error: ${err}`);
  }
})();