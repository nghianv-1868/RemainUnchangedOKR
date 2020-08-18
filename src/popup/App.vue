<template>
  <div class="popup">
    <div class="login-true" v-if="login">
      <h3>
        You are logged in!
      </h3>
      <a @click="manually" class="btn-manually">Manually</a>
      <div id="result">{{ result }}</div>
      <p class="text-help">Default will automatically run every Monday and Sunday</p>
    </div>
    <div class="login-false" v-if="!login">
      <h3>
        You are not logged in!
      </h3>
      <a href="https://goal.sun-asterisk.vn/login/framgia" class="btn-login" target="_blank"
        >Login via WSM</a
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      access_token: '',
      login: false,
      result: ''
    };
  },
  methods: {
    async getAccessToken() {
      let self = this;
      const getAccessTokenFromCookies = () =>
        new Promise((resolve, reject) => {
          chrome.cookies.get(
            { url: 'https://goal.sun-asterisk.vn', name: 'access_token' },
            function(cookie) {
              if (cookie) {
                self.access_token = cookie.value;
              }

              resolve();
            }
          );
        });
      await getAccessTokenFromCookies();
    },
    async manually() {
      let self = this;
      chrome.runtime.sendMessage({ sendManually: true }, function(response) {
        self.result = response.result;
      });
      console.log(this.result);
      setTimeout(() => {
        this.result = '';
      }, 2000);
    }
  },
  async created() {
    await this.getAccessToken();
    if (this.access_token) {
      this.login = true;
    }
  }
};
</script>

<style lang="scss">
body {
  background: #fff;
  font-family: sans-serif;
  font-size: 0.8rem;
  min-width: 15rem;
}

.login-true,
.login-false {
  text-align: center;
}

.btn-manually {
  display: inline-block;
  text-align: center;
  padding: 1rem 1rem;
  margin: 1rem 0;
  background-color: #058be8;
  border-color: #058be8;
  color: #fff;
  font-size: 1.2rem;
  box-shadow: 0 5px 10px 2px rgba(52, 191, 163, 0.36);
  border-radius: 60px;
  font-weight: 400;
  cursor: pointer;
}

.btn-manually:hover {
  color: #fff;
  background-color: #0a71bb;
  border-color: #0a71bb;
}

#result {
  color: seagreen;
}

.btn-login {
  display: inline-block;
  text-align: center;
  padding: 1rem 1.5rem;
  margin: 1rem;
  font-size: 1rem;
  cursor: pointer;
  color: #fff;
  box-shadow: 0 5px 10px 2px rgba(52, 191, 163, 0.19);
  font-weight: 400;
  border-radius: 60px;
  background-color: #0eb997;
  border-color: #34bfa3;
  text-decoration: none;
}

.btn-login:hover {
  color: #fff;
  background-color: #2ca189;
  border-color: #299781;
}

.text-help {
  color: #656464;
}
</style>
