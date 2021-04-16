var <%= extensionName %> = <%= extensionName %> || {};

<%= extensionName %>.services = {}; // we need a service reference for each module

<%= extensionName %>.InitApp = function (moduleid, editmode) {
    // create the service object for this module
    var svc = {
        moduleid: moduleid,
        path: "<%= extensionName %>",
        framework: $.ServicesFramework(moduleid)
    };
    svc.baseUrl = svc.framework.getServiceRoot(svc.path) + "Item/";

    // add the service to the object containg all services in case multiple modules are placed on the page
    <%= extensionName %>.services[`svc-${moduleid}`] = svc;

    // create the edit-component
    Vue.component('edit-component',
        {
            template: `#edit-component-${moduleid}`,
            props: ['moduleid', 'id', 'name', 'description', 'canedit', 'assigned-user', 'users'],
            data: function () {
                return {
                    editMode: false,
                    item: {
                        id: this.id,
                        name: this.name,
                        description: this.description,
                        canedit: this.canedit,
                        assignedUser: this.assignedUser
                    },
                }
            },
            methods: {
                toggleEditMode() {
                    this.editMode = !this.editMode;
                },
                saveItem() {
                    var self = this;
                    <%= extensionName %>.SaveItem(moduleid,
                        {
                            id: self.item.id,
                            name: self.item.name,
                            description: self.item.description,
                            assignedUser: self.item.assignedUser
                        },
                        function (data) {
                            // onDone
                            self.editMode = false;
                            self.$emit('reload');
                        });
                },
                cancelEdit() {
                    this.editMode = false;
                    this.$emit("edit-cancelled");
                },
                deleteItem() {
                    var self = this;
                    <%= extensionName %>.DeleteItem(moduleid, this.item.id,
                        function () {
                            self.$emit('reload');
                        });
                },
            },
            mounted: function () {
            }
        });

    new Vue({
        el: `#app-${moduleid}`,
        computed: {
            userCanAdd: function () {
                return editmode && (this.items.length == 0 || this.items[0].id > 0);
            }
        },
        data: {
            moduleid: moduleid,
            addMode: false,
            editId: 0,
            items: [],
            users: [],
        },
        methods: {
            loadItems() {
                var self = this;
                <%= extensionName %>.GetItemList(moduleid, function (data) {
                    self.items = data;
                });
            },
            loadUsers() {
                var self = this;
                <%= extensionName %>.GetUserList(moduleid, function (data) {
                    self.users = data;
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
        },
        mounted: function () {
            this.loadItems();
            this.loadUsers();
        }
    });
}


<%= extensionName %>.GetItemList = function (moduleid, onDone) {
    // get the service for this module from the services object
    var svc = <%= extensionName %>.services[`svc-${moduleid}`];
    var jqXHR = $.ajax({
        url: svc.baseUrl,
        beforeSend: svc.framework.setModuleHeaders,
        dataType: "json"
    }).done(function (data) {
        if (typeof (onDone) === "function") {
            onDone(data);
        }
    });
}

<%= extensionName %>.SaveItem = function (moduleid, editItem, onDone, onFail) {
    // get the service for this module from the services object
    var svc = <%= extensionName %>.services[`svc-${moduleid}`];
    var ajaxMethod = "POST";
    var restUrl = svc.baseUrl;

    if (editItem.id > 0) {
        // ajaxMethod = "PATCH";
        restUrl += editItem.id;
    }
    var jqXHR = $.ajax({
        method: ajaxMethod,
        url: restUrl,
        contentType: "application/json; charset=UTF-8",
        data: JSON.stringify(editItem),
        beforeSend: svc.framework.setModuleHeaders,
        dataType: "json"
    }).done(function (data) {
        if (typeof (onDone) === "function") {
            onDone(data);
        }
    }).always(function (data) {
    });
};

<%= extensionName %>.DeleteItem = function (moduleid, id, onDone, onFail) {
    // get the service for this module from the services object
    var svc = <%= extensionName %>.services[`svc-${moduleid}`];
    var restUrl = svc.baseUrl + id;
    var jqXHR = $.ajax({
        method: "DELETE",
        url: restUrl,
        beforeSend: svc.framework.setModuleHeaders
    }).done(function () {
        if (typeof (onDone) === "function") {
            onDone();
        }
    }).fail(function () {
    }).always(function (data) {
    });
};

<%= extensionName %>.GetUserList = function (moduleid, onDone) {
    // get the service for this module from the services object
    var svc = <%= extensionName %>.services[`svc-${moduleid}`];
    // need to calculate a different Url for User service
    var restUrl = svc.framework.getServiceRoot(svc.path) + "User/";
    var jqXHR = $.ajax({
        url: restUrl,
        beforeSend: svc.framework.setModuleHeaders,
        dataType: "json",
        async: false
    }).done(function (data) {
        if (typeof (onDone) === "function") {
            onDone(data);
        }
    }).always(function (data) {
    });
};
