<template>
    <div class="mx-3">
        <div class="text-center">
            <h2>{{ resx.DetailsView }}</h2>
            <router-link :to="goHome()">{{ resx.Home }}</router-link>
        </div>
    </div>
</template>
<script setup>
import { inject, } from 'vue';
import { goHome } from '../assets/utils';

// Injected dependencies
const resx = inject("resx");
</script>