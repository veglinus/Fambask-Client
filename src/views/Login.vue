<template>
  <div class="login">
    <!--
    <h2 v-if="newuser === false">Log in</h2>
    <h2 v-else>Register</h2>-->

    <div v-if="this.$route.query.join" class="cent">
      <br>
      <p class="cent">You've been invited to join someone's family! Simply enter a username and password and press submit to get going.</p>
    </div>

    <v-card
    class="mx-auto justify-center"
    max-width="400"
    >

      <form @submit.prevent="login" method="post" v-show="newuser === false">


        <v-text-field label="Username" v-model="username" required></v-text-field>

        <v-text-field
         label="Password" v-model="password" required
         @click:append="showPassword = !showPassword"
         :type="showPassword ? 'text' : 'password'"
         :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
         >
        </v-text-field>

        <v-btn class="mr-4" type="submit">Submit</v-btn>
        <br><br>

        <p>{{ cb }}</p>

        <a href="#" v-on:click="newuser = true" v-show="newuser === false">New? Register a new user</a>
      </form>

      

      <form @submit.prevent="register" method="post" v-show="newuser === true">

        <h2>Register</h2>

        <v-text-field label="Username" v-model="username2" required></v-text-field>

        <v-text-field
         label="Password" v-model="password2" required
         @click:append="showPassword = !showPassword"
         :type="showPassword ? 'text' : 'password'"
         :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
         >
        </v-text-field>

        <v-radio-group v-model="choosefamily" mandatory>
          <v-radio :value="true" label="Join family"></v-radio>
          <v-radio :value="false" label="New family"></v-radio>
        </v-radio-group>

        <v-text-field v-if="choosefamily === true" v-model="familyID" label="Family code" :disabled="checkDisabled"></v-text-field>
        <v-text-field v-else-if="choosefamily === false" v-model="familyName" label="New family name"></v-text-field>

        <v-btn class="mr-4" type="submit">Submit</v-btn>

        <a href="#" v-on:click="newuser = false" v-show="newuser === true"><br><br>Or log in instead</a>

      </form>

    </v-card>
  </div>
</template>

<script>
export default {
    data: function() {
        return {
            username: null,
            password: null,
            username2: null,
            password2: null,
            cb: null,
            choosefamily: null,
            newuser: false,
            familyID: null,
            familyName: null,
            checkDisabled: false,
            showPassword: false
        }
    },
    beforeMount() {
      if (this.$route.query.join) { // If user has been sent "join" link from someone
        if (localStorage.familyname) {
          // already logged in
              this.axios.post(this.$hostname + "/family/familyname", { // Find familyname from ID
                familyID: this.$route.query.join
              }).then((name) => {
                var join = confirm("You've been invited to join " + name.data + ", would you like to join this family?");

                if (join) {
                  
                  this.axios.get(this.$hostname + "/family/join/" + this.$route.query.join).then((res) => {


                    // Insert logout/login logic
                    if (res) {
                      alert("You've been added to the new family! Please log back in.");
                      localStorage.clear();
                    } else {
                      alert(res);
                    }


                    //this.$router.push({name: 'Home'}); // Redirect to homepage
                  })

                } else {
                  this.$router.push({name: 'Home'}); // Redirect to homepage
                }
              });
        } else {
          this.newuser = true;
          this.choosefamily = true;
          this.checkDisabled = true;
          this.familyID = this.$route.query.join;
        }
        // Set variables to make registering easier, prefill family code, show register form
      }
    },

    methods: {
      login: function() {
        if (this.username && this.password) {
          this.axios.post(this.$hostname + "/family/login", {
            withCredentials: true,
            username: this.username,
            password: this.password
          }).then((response) => {
            localStorage.clear();

            if (response.data.login === true) { // User is now logged in
              //this.cb = response;
              localStorage.familyID = response.data.familyID; // Set ID in localstorage

              var fullarray = response.data.familyID;
              var listofnames = [];

              var index = 1;
              fullarray.forEach(element => {
                this.axios.post(this.$hostname + "/family/familyname", {familyID: element, withCredentials: true}).then((response2) => {
                  //console.log(response2.data);
                  listofnames.push(response2.data);
                  localStorage.familyname = listofnames;

                  if (index == fullarray.length) {
                    this.$router.push({name: 'Home', params: { familyname: this.familyname }});
                  } else {
                    index++;
                  }
                });
              });

            } else if (response.data == "You're already logged in!") { // User was already logged in
              this.$router.push({name: 'Home', params: { familyname: this.familyname }}); // Redirect to homepage
            } else {
              console.log(response);
              if (response.data.login === false) {
                this.cb = "Wrong username or password!";
              } else {
                this.cb = response.data.login;
              }
              
            }
          })
          .catch(function (error) {
            console.log(error);
          });
          return true;
        } else {
          alert("You need to fill in all of the info!");
          return false;
        }
      },

      register: function() {
        if (this.username2 && this.password2) {
          this.axios.post(this.$hostname + "/family/register", {
            username: this.username2,
            password: this.password2,
            familyName: this.familyName,
            familyID: this.familyID
          }).then((response) => {
            if (response) {
              this.familyname = this.familyName;
              console.log(response);

              this.username = this.username2
              this.password = this.password2;
              this.login();
            } else {
              alert(response.data.message);
            }
            //return response;
            

          })

        } else {
          alert("You need to fill in all of the info!");
          return false;
        }
        
      }
    }


}
</script>