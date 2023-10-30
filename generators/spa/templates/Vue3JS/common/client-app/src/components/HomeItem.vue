<template>
    <div class="text-center">
        <h2>{{ resx.Welcome }}</h2>
    </div>
</template>

<script setup>
import { inject, } from 'vue';
const resx = inject("resx");
</script>

<script>
export default {
    components: {},
    data() {
        return {};
    },
    mounted() { },
    methods: {},
};
</script>