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
import { inject, defineProps, ref, getCurrentInstance } from 'vue';

// Injecting language resources
const resx = inject("resx");

// Defining received props
const { items } = defineProps({
    items: {
        type: Array,
        default: () => []
    }
});

// Getting the instance for emitting events
const { emit } = getCurrentInstance();

// Reactive references
const showModal = ref(false);
const dataModel = ref({
    ItemName: '',
    ItemDescription: '',
});

// Functions
function addItem() {
    showModal.value = true;
}

function editItem(item) {
    dataModel.value = { ...item };
    showModal.value = true;
}

function closeModal() {
    showModal.value = false;
    dataModel.value = {
        ItemName: '',
        ItemDescription: '',
    };
}

function saveItem() {
    emit('save', dataModel.value);
    closeModal();
}

function deleteItem(item) {
    emit('deleteItem', item);
}
</script>