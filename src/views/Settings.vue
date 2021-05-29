<template>
  <div class="settings" data-app>

    <v-card v-for="family in myFamilies" :key="family.id">

      <h2>{{family.name}}</h2>
      <br>

      <div class="flexi">
        <v-btn @click="copyLink(family.id)">Copy invite link</v-btn>
      </div>

      <br>

      <div class="flexi">
        <v-btn @click="leaveFamily(family.id)">Leave list</v-btn>
      </div>

      <br>

    </v-card>
    <br>
    <br>

    <v-row justify="center">
      <v-dialog
        v-model="dialog"
        persistent
        max-width="600px"
      >
        <template v-slot:activator="{ on, attrs }">
          <div class="flexi">
            <v-btn
              v-bind="attrs"
              v-on="on"
            >
              New list
            </v-btn>
          </div>
        </template>
        <v-card>
          <v-card-title>
            <span class="headline">New list</span>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-text-field
                  label="Family name"
                  v-model="newfamilyname"
                  required
                ></v-text-field>
              </v-row>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="blue darken-1"
              text
              @click="dialog = false"
            >
              Close
            </v-btn>
            <v-btn
              color="blue darken-1"
              text
              @click="newFamily"
            >
              Save
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-row>
  </div>

  
</template>


<script>
export default {
  name: 'Settings',
  created: function() {
    this.getSettings()
  },

  data: function() {
    return {
      dialog: false,
      myFamilies: [],
      testdata: null,
      newfamilyname: null
    }
  },

  methods: {
    getSettings: function() {
      this.axios.get(this.$hostname + "/family/settings", {withCredentials: true}).then((response) => { // What familyIDs is this user in?

        response.data.familyID.forEach(element => { // For each ID, find the name of family
          this.axios.post(this.$hostname + "/family/familyname", {familyID: element}).then((response2) => {

            var obj = {
              "name": response2.data,
              "id": element
            }
            this.myFamilies.push(obj); // Push these into this.myFamilies so we can write it out

          });
        });
      });
    },

    leaveFamily: function(familyid) {

      var conf = confirm("Are you sure you want to leave this list?");

      if (conf) {
        this.axios.post(this.$hostname + "/family/leave", {withCredentials: true, familyID: familyid}).then((response) => {
          if (response.data) {
            localStorage.clear();
            alert("Family left! Please re-log to make sure the change has been committed.");
            this.$router.push('login'); // Redirect to login page
          } else {
            alert(response.data);
          }
        });
      }
    },

    newFamily: function() {
      this.axios.post(this.$hostname + "/family/new", {withCredentials: true, familyName: this.newfamilyname}).then((response) => {
        console.log(response);
        this.dialog = false
        localStorage.clear();
        alert("New family added! Please re-log.");
        this.$router.push('login'); // Redirect to login page
      });      
    },

    copyLink: function(id) {
      //console.log(id);
      var url = "https://fambask.herokuapp.com/#/" + 'login?join=' + id;
      navigator.clipboard.writeText(url).then(function() {
        alert("Copied link! " + url);
      }), function(error) {
        alert("Could not copy link. " + error);
      }
    }
  }
}
</script>