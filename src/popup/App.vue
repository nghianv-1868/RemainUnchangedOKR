<template>
  <div class="popup">
    <div class="setup-true" v-if="setup_userId">
      <h3>
        You have set up UserId!
      </h3>
    </div>

    <div class="setup-false" v-if="!setup_userId">
      <h3>
        You have not set up UserId!
        <input type="text" v-model="userId" />
      </h3>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userId: '',
      setup_userId: false
    };
  },
  methods: {
    async getUserId() {
      let self = this;
      const getUserIdFromCookies = () =>
        new Promise((resolve, reject) => {
          chrome.cookies.get({ url: 'https://goal.sun-asterisk.vn', name: 'userId' }, function(
            cookie
          ) {
            self.userId = cookie.value;
            resolve();
          });
        });
      await getUserIdFromCookies();
    },
    setUserIdToCookie() {
      chrome.cookies.set(
        {
          url: 'https://goal.sun-asterisk.vn',
          name: 'userId',
          value: this.userId
        },
        function(cookie) {}
      );
    }
  },
  async created() {
    await this.getUserId();
    if (this.userId) {
      this.setup_userId = true;
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

.setup-true > h3,
.setup-false > h3 {
  text-align: center;
}
</style>
