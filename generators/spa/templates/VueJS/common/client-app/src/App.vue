<template>
    <div ref="approot">
        <div>
            <a @click.prevent="loadItems" href="#">{{resx.Refresh}}</a>
            <a v-if="userCanAdd" @click.prevent="addItem" href="#">{{resx.EditModule}}</a>
        </div>
        <ul class="tm_tl">
            <li class="tm_t" v-for="(item, index) in items" :key="item.id">
                <h3>{{item.name}}</h3>
                <div class="tm_td">{{item.description}}</div>
                <edit-component :moduleid="moduleid" :tabid="tabid" :resx="resx"
                                :id="item.id"
                                :name="item.name"
                                :description="item.description"
                                :canedit="item.canEdit"
                                :assigned-user="item.assignedUser"
                                :users="users"
                                v-on:reload="loadItems"
                                v-on:edit-started="startEdit"
                                v-on:edit-cancelled="cancelAdd"></edit-component>
            </li>
        </ul>
    </div>
</template>

<script>
    import EditComponent from './components/EditComponent.vue'

    export default {
        name: 'App',
        components: {
            EditComponent
        },
        computed: {
            userCanAdd: function () {
                // todo: editmode
                return this.dnnEditMode && (this.items.length == 0 || this.items[0].id > 0);
            }
        },
        data: function () {
            return {
                moduleid: 0,
                tabid: 0,
                dnnEditMode: false,
                addMode: false,
                editId: 0,
                items: [],
                users: [],
                resx: {},
                usersFetched: false,
            }
        },
        methods: {
            loadItems() {
                var self = this;
                EmptyModuleVue.GetItemList(this.tabid, this.moduleid, function (data) {
                    self.items = data;
                });
            },
            loadResx() {
                var self = this;
                EmptyModuleVue.GetResxList(this.tabid, this.moduleid, "View", function (data) {
                    self.resx = data;
                });
            },
            loadUsers() {
                var self = this;
                EmptyModuleVue.GetUserList(this.tabid, this.moduleid, function (data) {
                    self.users = data;
                    self.usersFetched = true;
                });
            },
            addItem(item) {
                this.items.unshift({ id: 0 });
            },
            cancelAdd() {
                if (this.items.length > 0 && this.items[0].id === 0) {
                    this.items.splice(0, 1);
                }
            },
            startEdit() {
                if (this.usersFetched === false) {
                    this.loadUsers();
                }
            },
        },
        mounted: function () {
            this.moduleid = Number(this.$refs.approot.parentNode.attributes["data-moduleid"].nodeValue);
            this.tabid = Number(this.$refs.approot.parentNode.attributes["data-tabid"].nodeValue);
            this.dnnEditMode = this.$refs.approot.parentNode.attributes["data-editmode"].nodeValue.toLowerCase() === "true";
            this.loadItems();
            this.loadResx();
        }
    }
</script>

<style>
</style>
