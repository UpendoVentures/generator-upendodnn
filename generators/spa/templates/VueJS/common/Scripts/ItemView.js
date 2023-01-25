var <%= moduleName %> = <%= moduleName %> || {};

<%= moduleName %>.services = {}; // we need a service reference for each module

<%= moduleName %>.InitApp = function (moduleid, editmode) {
    // create the service object for this module
    var svc = {
        moduleid: moduleid,
        baseUrl: "DesktopModules/<%= moduleName %>/API/",
        framework: $.ServicesFramework(moduleid)
    };

    // add the service to the object containg all services in case multiple modules are placed on the page
    <%= moduleName %>.services[`svc-${moduleid}`] = svc;

    new Vue({
        el: `#app-${moduleid}`,
        computed: {
            userCanAdd: function () {
                return editmode;
            }
        },
        data: {
            showModal: false,
            moduleid: moduleid,
            addMode: false,
            editId: 0,
            item: {
                id: 0,
                name: "",
                description: "",
                canedit: "",
                assignedUser: ""
            },
            items: [],
            users: [],
        },
        methods: {
            loadItems() {
                var self = this;
                <%= moduleName %>.GetItemList(moduleid, function (data) {
                    self.items = data;
                    self.isLoading = false;
                });
            },
            loadUsers() {
                var self = this;
                <%= moduleName %>.GetUserList(moduleid, function (data) {
                    self.users = data;
                });
            },
            addItem() {
                this.showModal = true;
            },
            saveChanges() {
                var self = this;
                <%= moduleName %>.SaveItem(moduleid,
                    {
                        id: self.item.id,
                        name: self.item.name,
                        description: self.item.description,
                        assignedUser: self.item.assignedUser
                    },
                    function () {
                        // onDone
                        self.resetItem();
                        self.loadItems();
                        self.showModal = false;
                    });
            },          
            editItem(item) {
                this.item.id = item.ItemId;
                this.item.name = item.ItemName;
                this.item.description = item.ItemDescription;
                this.item.assignedUser = item.AssignedUserId
                this.showModal = true;
            },
            cancelAdd() {
                this.showModal = false;
                this.resetItem();
            },
            resetItem() {
                this.item = {
                    id: 0,
                    name: "",
                    description: "",
                    canedit: "",
                    assignedUser: ""
                };
            },
            deleteItem(itemId) {
                var self = this;
                if (confirm("Do you want to remove this item?")) {
                    <%= moduleName %>.DeleteItem(moduleid, itemId, function () {
                        self.loadItems();
                    });
                }     
            }
        },
        mounted: function () {
            this.loadItems();
            this.loadUsers();
        }
    });
}


<%= moduleName %>.GetItemList = function (moduleid, onDone) {
    // get the service for this module from the services object
    var svc = <%= moduleName %>.services[`svc-${moduleid}`];
    var jqXHR = $.ajax({
        url: svc.baseUrl + "Item/GetList",
        beforeSend: svc.framework.setModuleHeaders,
        dataType: "json"
    }).done(function (data) {
        if (typeof (onDone) === "function") {
            onDone(data);
        }
    });
}

<%= moduleName %>.SaveItem = function (moduleid, editItem, onDone, onFail) {
    // get the service for this module from the services object
    var svc = <%= moduleName %>.services[`svc-${moduleid}`];
    var ajaxMethod = "POST";
    var restUrl = svc.baseUrl + "Item/Save";

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

<%= moduleName %>.DeleteItem = function (moduleid, id, onDone, onFail) {
    // get the service for this module from the services object
    var svc = <%= moduleName %>.services[`svc-${moduleid}`];
    var restUrl = svc.baseUrl + "Item/Delete?itemId=" + id;
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

<%= moduleName %>.GetUserList = function (moduleid, onDone) {
    // get the service for this module from the services object
    var svc = <%= moduleName %>.services[`svc-${moduleid}`];
    // need to calculate a different Url for User service
    var restUrl = svc.baseUrl + "/User/GetList";
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
