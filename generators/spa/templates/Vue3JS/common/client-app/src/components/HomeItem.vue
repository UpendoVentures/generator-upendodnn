<template>
    <div class="mx-3">
        <div class="text-center">
            <h2>{{ resx.Welcome }}</h2>
        </div>
        <ItemIterator :items="items" @save="save" @deleteItem="deleteItem" />
    </div>
</template>

<script setup>
import { inject, ref, } from 'vue';
import axios from "axios";

const resx = inject("resx");
const dnnConfig = inject("dnnConfig");
const items = ref([]);
const url = new URL(window.location.href);
const baseUrl = `${url.origin}/API/<%= fullNamespace %>/Items`;

const fetchItems = async () => {
    var url = `${baseUrl}/GetAll`;
    let axiosConfig = {
        method: 'get',
        url: url,
        headers: {
            'Content-Type': 'application/json',
            moduleid: dnnConfig.moduleId,
            tabid: dnnConfig.tabId,
            RequestVerificationToken: dnnConfig.rvt
        }
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
        headers: {
            'Content-Type': 'application/json',
            moduleid: dnnConfig.moduleId,
            tabid: dnnConfig.tabId,
            RequestVerificationToken: dnnConfig.rvt
        }
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
        headers: {
            'Content-Type': 'application/json',
            moduleid: dnnConfig.moduleId,
            tabid: dnnConfig.tabId,
            RequestVerificationToken: dnnConfig.rvt
        }
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
fetchItems();
</script>

<script>
import ItemIterator from "@/components/ItemIterator.vue";
export default {
    components: { ItemIterator },
    data() {
        return {};
    },
    mounted() { },
    methods: {},
};
</script>