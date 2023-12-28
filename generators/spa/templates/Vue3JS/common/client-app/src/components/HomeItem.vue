<template>
    <div class="mx-3">
        <div class="text-center">
            <h2>{{ resx.Welcome }}</h2>
            <router-link :to="`${url.pathname}/details`">Details</router-link>
            <router-link :to="`${url.pathname}/about`" class="ml20">AboutItem</router-link>
        </div>
        <ItemIterator :items="items" @save="save" @deleteItem="deleteItem" />
    </div>
</template>

<script setup>
import { inject, ref, } from 'vue';
import axios from "axios";
import ItemIterator from "@/components/ItemIterator.vue";

// Injected dependencies
const resx = inject("resx");
const dnnConfig = inject("dnnConfig");

// Reactive references
const items = ref([]);

// Variables
const url = new URL(window.location.href);
const baseUrl = `${url.origin}/API/<%= fullNamespace %>/Items`;

// Functions
const fetchItems = async () => {
    var url = `${baseUrl}/GetAll`;
    let axiosConfig = {
        method: 'get',
        url: url,
        headers: { 'Content-Type': 'application/json', }
    };
    axios({
        ...axiosConfig
    }).then((response) => {
        if (response.status === 200) {
            items.value = response.data;
        }
    }).catch((error) => {
        console.log(error);
    });
};
function save(item) {
    console.log(item);
    item.ModuleId = dnnConfig.moduleId;
    var url = item.ItemId != null ? `${baseUrl}/Update` : `${baseUrl}/Create`;
    let axiosConfig = {
        method: item.ItemId != null ? 'put' : 'post',
        url: url,
        data: item,
        headers: { 'Content-Type': 'application/json', }
    };
    axios({
        ...axiosConfig
    }).then((response) => {
        if (response.status === 200) {
            fetchItems();
        }
    }).catch((error) => {
        console.log(error);
    });
}
function deleteItem(item) {
    item.ModuleId = dnnConfig.moduleId;
    var url = `${baseUrl}/Delete?id=${item.ItemId}`;
    let axiosConfig = {
        method: 'delete',
        url: url,
        headers: { 'Content-Type': 'application/json', }
    };
    axios({
        ...axiosConfig
    }).then((response) => {
        if (response.status === 200) {
            fetchItems();
        }
    }).catch((error) => {
        console.log(error);
    });
}

// Executed methods during the component's mounting phase
fetchItems();// Initial fetching of items
</script>