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


const listProject = `https://8cd8c7d9-ca01-4060-82dd-db01b8f0bb9b@api.glitch.com/git/determined-horse-mars|https://8cd8c7d9-ca01-4060-82dd-db01b8f0bb9b@api.glitch.com/git/fir-carnelian-train|https://8cd8c7d9-ca01-4060-82dd-db01b8f0bb9b@api.glitch.com/git/slash-incongruous-stitch|https://8cd8c7d9-ca01-4060-82dd-db01b8f0bb9b@api.glitch.com/git/better-obvious-corleggy|https://8cd8c7d9-ca01-4060-82dd-db01b8f0bb9b@api.glitch.com/git/detailed-pentagonal-soup|https://8cd8c7d9-ca01-4060-82dd-db01b8f0bb9b@api.glitch.com/git/prism-erratic-scaffold|https://8cd8c7d9-ca01-4060-82dd-db01b8f0bb9b@api.glitch.com/git/glittery-fearless-adasaurus|https://8cd8c7d9-ca01-4060-82dd-db01b8f0bb9b@api.glitch.com/git/tin-frequent-sandalwood|https://8cd8c7d9-ca01-4060-82dd-db01b8f0bb9b@api.glitch.com/git/onyx-unmarred-ulna|https://8cd8c7d9-ca01-4060-82dd-db01b8f0bb9b@api.glitch.com/git/granite-highfalutin-science|https://8cd8c7d9-ca01-4060-82dd-db01b8f0bb9b@api.glitch.com/git/polite-dear-locust|https://8cd8c7d9-ca01-4060-82dd-db01b8f0bb9b@api.glitch.com/git/cute-mercurial-pastry|https://8cd8c7d9-ca01-4060-82dd-db01b8f0bb9b@api.glitch.com/git/separate-dog-wrinkle|https://8cd8c7d9-ca01-4060-82dd-db01b8f0bb9b@api.glitch.com/git/ethereal-mesquite-farm`.trim().split('|');

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