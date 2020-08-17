global.browser = require('webextension-polyfill');

function getCookie(domain, name, callback) {
  chrome.cookies.get({ url: domain, name: name }, function(cookie) {
    if (callback) {
      callback(cookie.value);
    }
  });
}

async function getIdRemainUnchanged() {
  let respone = await fetch('https://goal.sun-asterisk.vn/groups/1339', {
    headers: {
      'accept':
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
      'accept-language': 'en-US,en;q=0.9,vi;q=0.8,he;q=0.7,sv;q=0.6',
      'sec-fetch-dest': 'document',
      'sec-fetch-mode': 'navigate',
      'sec-fetch-site': 'same-origin',
      'sec-fetch-user': '?1',
      'upgrade-insecure-requests': '1'
    },
    referrer: 'https://goal.sun-asterisk.vn/dashboard',
    referrerPolicy: 'no-referrer-when-downgrade',
    body: null,
    method: 'GET',
    mode: 'no-cors'
  });
  let text = await respone.text();
  var parser = new DOMParser();
  var doc = parser.parseFromString(text, 'text/html');

  var remainsDOM = doc.querySelectorAll('.remain-unchanged');
  var csrf_token = doc.querySelector('meta[name="csrf-token"]').content;

  var arrayId = [];
  remainsDOM.forEach((dom) => {
    if (dom.classList.value !== 'remain-unchanged top-10 float-left') {
      var id = dom.id.substring(10, remainsDOM[0].id.length);
      arrayId.push(parseInt(id));
    }
  });
  console.log(arrayId);

  return { arrayId, csrf_token };
}

async function senRequest(arrId) {
  let access_token = '';
  const getAccessToken = () =>
    new Promise((resolve, reject) => {
      getCookie('https://goal.sun-asterisk.vn', 'access_token', function(e) {
        access_token = e;
        resolve();
      });
    });
  await getAccessToken();
  let { arrayId, csrf_token } = await getIdRemainUnchanged();
  fetch('https://goal.sun-asterisk.vn/api/v1/objectives/22263/remain_unchanged', {
    headers: {
      'accept': '*/*',
      'accept-language': 'en-US,en;q=0.9,vi;q=0.8,he;q=0.7,sv;q=0.6',
      'authorization': `Bearer ${access_token}`,
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'x-csrf-token': csrf_token,
      'x-requested-with': 'XMLHttpRequest'
    },
    referrer: 'https://goal.sun-asterisk.vn/groups/1339',
    referrerPolicy: 'no-referrer-when-downgrade',
    body: 'keyResultId=22263',
    method: 'POST',
    mode: 'cors'
  });
}

senRequest([]);
