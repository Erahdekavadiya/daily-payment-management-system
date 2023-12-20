<template>
  <div>
    <v-data-table
        :headers="headers"
        :items="filteredIncomeData"
        item-key="id"
    >
        <template v-slot:top>
        <v-toolbar
            flat
        >
            <v-toolbar-title>Expenses</v-toolbar-title>
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
                New Expense
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
                <v-card-title class="text-h5">Are you sure you want to delete expense?</v-card-title>
                <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="blue-darken-1" variant="text" @click="closeDelete">Cancel</v-btn>
                <v-btn color="blue-darken-1" variant="text" @click="deleteItemConfirm">OK</v-btn>
                <v-spacer></v-spacer>
                </v-card-actions>
            </v-card>
            </v-dialog>
        </v-toolbar>
        <v-card class="px-4 pt-4" flat>
        <v-row align="center">
          <v-col cols="12" md="auto"><h4>Date Filter:</h4></v-col>
          <v-col cols="12" md=4>
            <v-text-field type="date" v-model="startDate" label="Start Date"></v-text-field>
          </v-col>
          <v-col cols="12" md=4>
            <v-text-field type="date" v-model="endDate" label="End Date"></v-text-field>
          </v-col>
        </v-row>
        </v-card>
        </template>
        <template v-slot:item.actions="{ item }">
        <v-btn
            @click="editItem(item)"
            color="primary"
            size="small"
            prepend-icon="mdi-pencil"
            class="me-2">
            Edit
        </v-btn>
        <v-btn
            color="red-darken-2"
            size="small"
            @click="deleteItem(item)"
            prepend-icon="mdi-delete"
          >
          Delete
        </v-btn>
        </template>
    </v-data-table>
  </div>
</template>

<script>
import { reactive, onMounted } from 'vue';
import { getAllExpensesFromDB } from '../indexDB';
import { addExpenseToDB } from '../indexDB';
import { updateExpenseInDB } from '../indexDB';
import { deleteExpenseFromDB } from '../indexDB';

export default {
  name: 'Expenses',
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
      expenses: [],
      editedIndex: -1,
      editedItem: {
        description: '',
        amount: null,
      },
      defaultItem: {
        description: '',
        amount: null,
      }, 
      startDate: null,
      endDate: null,     
    };
  },
  computed: {
      formTitle () {
        return this.editedIndex === -1 ? 'New Expense' : 'Edit Expense'
      },
      filteredIncomeData() {
        if (!this.startDate || !this.endDate){
         if (this.startDate){
          return this.expenses.filter(item => {
            const itemDate = new Date(item.date);
            const startDate = new Date(this.startDate);
            return itemDate >= startDate;
          });
         }
         if (this.endDate){
          return this.expenses.filter(item => {
            const itemDate = new Date(item.date);
            const endDate = new Date(this.endDate);
            return itemDate <= endDate;
          });
         }
         return this.expenses;
        }else{
          return this.expenses.filter(item => {
            const itemDate = new Date(item.date);
            const startDate = new Date(this.startDate);
            const endDate = new Date(this.endDate);
            return itemDate >= startDate && itemDate <= endDate;
          });
        }
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
    async addNewExpense(data) {    
        try {
            addExpenseToDB(data);
            this.expenses = await getAllExpensesFromDB();
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    },
    async editExpense(expense) {
        try {
            updateExpenseInDB(expense.id,expense);
            this.expenses = await getAllExpensesFromDB();
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    },
    async deleteExpense(expenseID) {
        try {
            await deleteExpenseFromDB(expenseID);
            this.expenses = await getAllExpensesFromDB();
        } catch (error) {
            console.error('Error fetching expenses:', error);
        }
    },
    editItem (item) {
        this.editedIndex = this.expenses.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },

      deleteItem (item) {
        this.editedIndex = this.expenses.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialogDelete = true
      },

      deleteItemConfirm () {
        this.deleteExpense(this.expenses[this.editedIndex].id);
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
          this.editExpense(this.editedItem);
        } else {
          this.addNewExpense(this.editedItem);
        }
        this.close()
      },
  },
  async created() {
    try {
      this.expenses = await getAllExpensesFromDB();
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
  },
};
</script>

<style scoped>
/* Add styling for cards, layout, etc. */
</style>
