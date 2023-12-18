<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="incomes"
        item-key="id"
    >
        <template v-slot:top>
        <v-toolbar
            flat
        >
            <v-toolbar-title>Incomes</v-toolbar-title>
            <v-divider
            class="mx-4"
            inset
            vertical
            ></v-divider>
            <v-spacer></v-spacer>
            <v-dialog
            v-model="dialog"
            max-width="500px"
            >
            <template v-slot:activator="{ props }">
                <v-btn
                color="primary"
                dark
                class="mb-2"
                v-bind="props"
                >
                New income
                </v-btn>
            </template>
            <v-card>
                <v-card-title>
                <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                <v-container>
                    <v-row>
                    <v-col
                        cols="12"
                    >
                        <v-text-field
                        v-model="editedItem.description"
                        label="Description"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                    >
                        <v-text-field
                        v-model="editedItem.amount"
                        label="Amount"
                        ></v-text-field>
                    </v-col>
                    <v-col
                        cols="12"
                    >
                        <v-text-field
                        v-model="editedItem.date"
                        label="Date"
                        type="date"
                        ></v-text-field>
                    </v-col>
                    </v-row>
                </v-container>
                </v-card-text>

                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="close"
                >
                    Cancel
                </v-btn>
                <v-btn
                    color="blue-darken-1"
                    variant="text"
                    @click="save"
                >
                    Save
                </v-btn>
                </v-card-actions>
            </v-card>
            </v-dialog>
            <v-dialog v-model="dialogDelete" max-width="500px">
            <v-card>
                <v-card-title class="text-h5">Are you sure you want to delete income?</v-card-title>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
        <v-icon
            size="small"
            class="me-2"
            @click="editItem(item)"
        >
            mdi-pencil
        </v-icon>
        <v-icon
            size="small"
            @click="deleteItem(item)"
        >
            mdi-delete
        </v-icon>
        </template>
    </v-data-table>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import { getAllincomesFromDB } from '../indexDB';
import { addincomeToDB } from '../indexDB';
import { updateincomeInDB } from '../indexDB';
import { deleteincomeFromDB } from '../indexDB';

export default {
  name: 'incomes',
  data() {
    return {
      dialog: false,
      dialogDelete: false,
      headers: [
        { text: 'ID', title: 'ID', value: 'id' },
        { text: 'Description', title: 'Description', value: 'description' },
        { text: 'Amount', title: 'Amount', value: 'amount' },
        { text: 'Date', title: 'Date', value: 'date' },
        { text: 'Actions', title: 'Actions', value: 'actions', sortable: false },
      ],
      incomes: [],
      editedIndex: -1,
      editedItem: {
        description: '',
        amount: null,
        date: null
      },
      defaultItem: {
        description: '',
        amount: null,
        date: null
      },      
    };
  },
  computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Income' : 'Edit Income'
      },
    },
    watch: {
      dialog (val) {
        val || this.close()
      },
      dialogDelete (val) {
        val || this.closeDelete()
      },
    },

  methods: {
    async addNewincome(data) {    
        try {
            addincomeToDB(data);
            this.incomes = await getAllincomesFromDB();
        } catch (error) {
            console.error('Error fetching incomes:', error);
        }
    },
    async editincome(income) {
        try {
            updateincomeInDB(income.id,income);
            this.incomes = await getAllincomesFromDB();
        } catch (error) {
            console.error('Error fetching incomes:', error);
        }
    },
    async deleteincome(incomeID) {
        try {
            await deleteincomeFromDB(incomeID);
            this.incomes = await getAllincomesFromDB();
        } catch (error) {
            console.error('Error fetching incomes:', error);
        }
    },
    editItem (item) {
        this.editedIndex = this.incomes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.incomes.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.deleteincome(this.incomes[this.editedIndex].id);
        this.closeDelete()
      },

      close () {
        this.dialog = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      closeDelete () {
        this.dialogDelete = false
        this.$nextTick(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        })
      },

      save () {
        if (this.editedIndex > -1) {
          this.editincome(this.editedItem);
        } else {
          this.addNewincome(this.editedItem);
        }
        this.close()
      },
  },
  async created() {
    try {
      this.incomes = await getAllincomesFromDB();
    } catch (error) {
      console.error('Error fetching incomes:', error);
    }
  },
};
</script>

<style scoped>
/* Add styling for cards, layout, etc. */
</style>
