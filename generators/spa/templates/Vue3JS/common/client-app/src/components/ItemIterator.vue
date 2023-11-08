<template>
    <div>
        <button type="button" class="btn btn-primary margin5" @click="addItem">{{ resx.Add }}</button>
        <table class="table table-striped table-bordered table-container">
            <thead>
                <tr>
                    <th>{{ resx.ID }}</th>
                    <th>{{ resx.Name }}</th>
                    <th>{{ resx.Description }}</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item in items" :key="item.itemId">
                    <td>{{ item.ItemId }}</td>
                    <td>{{ item.ItemName }}</td>
                    <td>{{ item.ItemDescription }}</td>
                    <td>
                        <button type="button" class="btn btn-primary" @click="editItem(item)">
                            <span class="glyphicon glyphicon-edit" aria-hidden="true"></span>
                        </button>
                        <button type="button" class="btn btn-danger" @click="deleteItem(item)">
                            <span class="glyphicon glyphicon-trash" aria-hidden="true"></span>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
        <!-- Add Item Modal -->
        <div v-if="showModal" class="modal fade in" id="myModal"
            :class="{ 'display_block': showModal, 'display_none': !showModal }">
            <div class="modal-dialog d-flex align-items-center justify-content-center">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">{{ resx.AddItem }}</h5>
                    </div>
                    <div class="form-container">
                        <div class="row">
                            <div class="col-6">
                                <label for="ItemName">{{ resx.Name }}</label>
                                <input type="text" class="form-control" id="ItemName" v-model="dataModel.ItemName" />
                            </div>
                            <div class="col-6">
                                <label for="ItemDescription">{{ resx.Description }}</label>
                                <textarea class="form-control" id="ItemDescription"
                                    v-model="dataModel.ItemDescription"></textarea>
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" @click="closeModal">{{ resx.Close }}</button>
                        <button type="button" class="btn btn-primary" @click="saveItem">{{ resx.Save }}</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { inject, } from 'vue';
const resx = inject("resx");
</script >

<script>
export default {
    props: {
        items: {
            type: Array,
            default: () => []
        },
    },
    components: {},
    data() {
        return {
            showModal: false,
            dataModel: {
                ItemName: '',
                ItemDescription: '',
            },
        };
    },
    mounted() { },
    methods: {
        addItem() {
            this.showModal = true;
        },
        editItem(item) {

            this.dataModel = item;
            this.showModal = true;
        },
        closeModal() {
            this.showModal = false;
            this.dataModel = {
                ItemName: '',
                ItemDescription: '',
            };
        },
        saveItem() {
            this.$emit('save', this.dataModel);
            this.closeModal();
        },
        deleteItem(item) {
            this.$emit('deleteItem', item);
        },
    },
};
</script>
