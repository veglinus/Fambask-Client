<template>
  <div class="home">

    <v-card v-for="shoppinglistFiltered in familyarrays" :key="shoppinglistFiltered[0].familyname"
      class="mx-auto justify-content-center"
      max-width="400"
    >

    <h2>{{shoppinglistFiltered[0].familyname}} 🛒</h2>

      <v-text-field v-model="productName[shoppinglistFiltered[0].familyID]" name="title" label="Add a product to the list:"/>
      <v-text-field v-model="content[shoppinglistFiltered[0].familyID]" name="content" label="(Optional text)"/>

      <v-flex class="flexi">
          <v-btn @click="newProduct(shoppinglistFiltered[0].familyname, shoppinglistFiltered[0].familyID, productName[shoppinglistFiltered[0].familyID], content[shoppinglistFiltered[0].familyID])">Add
            <v-icon right dark>mdi-send</v-icon>
          </v-btn>
      </v-flex>

      <br>
      <v-divider></v-divider>
      <br>

      <v-list
        flat
        subheader
        two-line
        name="list"
      >
        <v-slide-y-transition
          class="py-0"
          group
        >
          <v-list-item 
            v-for="item in shoppinglistFiltered"
            :key="item._id"
            :style="{'grid-row': shoppinglistFiltered + 1}"
            >
            <template>
              <v-list-item-action>
                <v-checkbox :input-value="item.bought" @change="checkmarkAction($event, item._id)"></v-checkbox>
              </v-list-item-action>
              <v-list-item-content>

                <v-list-item-title>
                  <v-edit-dialog
                    :return-value.sync="item.title"
                    @save="editProduct('title', item.title, item._id)"
                    large
                  >
                    {{item.title}}
                    <template v-slot:input>
                      <v-text-field
                        v-model="item.title"
                        label="Edit"
                        single-line
                        counter
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </v-list-item-title>

                <v-list-item-subtitle>
                  <v-edit-dialog
                    :return-value.sync="item.content"
                    @save="editProduct('content', item.content, item._id)"
                    large
                  >
                    <span v-if="item.content">
                      {{item.content}} - {{item.username}}
                    </span>
                    <span v-else>
                      {{item.username}}
                    </span>
                    
                    <template v-slot:input>
                      <v-text-field
                        v-if="item.content"
                        v-model="item.content"
                        label="Edit"
                        single-line
                        counter
                      ></v-text-field>
                    </template>
                  </v-edit-dialog>
                </v-list-item-subtitle>

              </v-list-item-content>

              <v-list-item-action class="text-right" v-if="item.bought === true" @click="deleteFromList(item._id)">
                <v-btn icon>
                  <v-icon color="grey lighten-1">mdi-close-circle</v-icon>
                </v-btn>
              </v-list-item-action>

            </template>
          </v-list-item>
        </v-slide-y-transition>
      </v-list>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'home',
  created () { // on create
    this.getData()
  },

  data: function() {
    return {
        shoppinglist: null,
        productName: {},
        content: {},
        //familyIDs: this.getFamilyIDs(),
        shoppingarray: null,
        familyarrays: null
    }
  },

  methods: {
    getFamilyIDs: function() {
      if (localStorage.familyID) {
        var data = localStorage.familyID;
        var array = data.split(",");
        return array;
      } else {
        return null;
      }
    },
    getFamilyNames: function() {
      if (localStorage.familyname) {
        var data = localStorage.familyname;
        var array = data.split(",");
        return array;
      } else {
        return null;
      }
    },

    getData: function() {
        this.axios.get(this.$hostname + "/shoppinglist/", {withCredentials: true}).then((response) => {
          //console.log("Current shopping list: " + response.data);
          if (response.data == "You're not logged in!") {
            alert("You need to be logged in to view this page!");
            this.$router.push('login'); // Redirect to login page
          } else {

              var sorteddata = response.data;
              sorteddata.sort((a, b) => (a.bought > b.bought) ? 1 : -1); // Credit: https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/ For sorting items
              this.familyarrays = this.groupBy(sorteddata, "familyID"); // Take values from sorted data and split them into arrays
              var names = this.getFamilyNames();
              var ids = this.getFamilyIDs();
              var index = 0;

              ids.forEach(element => { // Foreach family the user is a part of:
                if (!(element in this.familyarrays)) { // If element doesn't exist already:
                  this.familyarrays[element] = [{"familyname": names[index], "familyID": element}]; // This enters data like there's a product, to show the family title and be able to add products.
                }
                index++;
              });
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },

    groupBy: function(arr, property) {
      return arr.reduce(function(memo, x) {
        if (!memo[x[property]]) { memo[x[property]] = []; }
        memo[x[property]].push(x);
        return memo;
      }, {});
    },

    newProduct: function(familyname, familyid, namn, kontent) {
      this.axios.post(this.$hostname + "/shoppinglist/add", {title: namn, content: kontent, familyname: familyname, familyid: familyid}).then((response) => {
        //console.log(response);
        if (response.data) {
          this.productName = {}; // Set textfields to empty
          this.content = {};
          this.getData(); // Reload context
        } else {
          alert(response);
        }
      });
    },

    checkmarkAction: function(checkboxValue, id) {
        this.axios.post(this.$hostname + "/shoppinglist/edit", {bought: checkboxValue, productOID: id}).then((response) => {
        if (response.data) { // Append to context
          this.getData(); // Reload context
        } else {
          alert(response);
        }
      });
    },

    editProduct: function(what, newvalue, id) {
      var data;
      
      if (what == "title") {
        data = {
          title: newvalue,
          productOID: id
        }
      } else if (what == "content") {
        data = {
          content: newvalue,
          productOID: id
        }
      }

        this.axios.post(this.$hostname + "/shoppinglist/edit", data).then((response) => {
        //console.log(response.data);
        if (response.data) {
          this.getData(); // Reload context
        } else {
          alert(response);
        }
      });
    },

    deleteFromList: function(id) {
      this.axios.delete(this.$hostname + "/shoppinglist/delete/" + id).then((response) => {
        //console.log(response);
        if (response.data) {
          this.getData(); // Reload context
        } else {
          alert(response);
        }
      });
    },
  }
}

</script>