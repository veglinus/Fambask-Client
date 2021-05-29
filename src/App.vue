<template>
  <div id="app" data-app>
    <div id="nav" :key="$route.fullPath">
      <router-link to="/">Home</router-link> |
      <router-link v-if="isLoggedIn" to="/settings">Settings</router-link> |
      
      <router-link v-if="isLoggedIn" to="/logout" event @click.native.prevent="logout()">Log out</router-link>
      <router-link v-else to="/login">Log in</router-link>
    </div>
    <router-view/>
  </div>
</template>

<script>
export default {
  computed: {
    isLoggedIn() {
      return this.$route.name === 'Home' || this.$route.name === "Settings"
    }
  },

  methods: {
    logout: function() {
      console.log('logging out');
      this.axios.get(this.$hostname + "/family/logout").then(() => {
        localStorage.clear();
        //alert(response.body + " logged out");
        this.familyname = null;
        //console.log(this.familyname);
        this.$router.push('login'); // Redirect to login page
      })
    },
  }
}
</script>

<style>
#app, h1, h2 {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

h1 {
  margin-top: 1%;
  margin-bottom: 0;
}

h1, h2 {
  text-align: center;
}
.v-card {
  margin-top: 3%;
  margin-left: auto;
  margin-right: auto;

  padding: 1% 1%;
}

.v-list-item {
  padding-left: 2%!important;
  padding-right: 5px;
}

div.v-list-item__content {
  padding-left: 3%;
}

.flexi {
  display: flex;
  flex: 1 1 auto;
  justify-content: center;
}

#copylink {
  font-style: italic;
  text-align: center;
}

.cent {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

.v-input {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

#nav {
  margin-top: 0%;
  text-align: center;
  padding: 30px;
  padding-top: 3%;
  padding-bottom: 1%;
  margin-left: auto;
  margin-right: auto;
}

.login form, .cent {
  margin-left: auto;
  margin-right: auto;
  text-align: center;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
