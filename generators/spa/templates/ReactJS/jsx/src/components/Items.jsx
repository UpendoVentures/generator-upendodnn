import React from "react";
import { useState, useEffect } from "react";
const moduleId = window.getmoduleId();
const serviceFramework = window.$.ServicesFramework(moduleId);
const token = serviceFramework.getAntiForgeryValue();
const tabId = serviceFramework.getTabId();
const baseUrl ="DesktopModules/<%= moduleName %>/API/";

const Items = () => {
    const [modal, setModal] = useState(false);
    const [items, setItems] = useState(null);
    const [users, setUsers] = useState(null);
    const [description, setDescription] = useState('');
    const [name, setName] = useState('');
    const [assignedUser, setUser] = useState(null);
    const [id, setId] = useState(0);
    // SETTINGS
    const [idSetting, setIdSetting] = useState(false);
    const [nameSetting, setNameSetting] = useState(false);
    const [descriptionSetting, setDescriptionSetting] = useState(false);
    const [createdOnDateSetting, setCreatedOnDateSetting] = useState(false);

    const loadItems = () => {
        const url = baseUrl+"Item/GetList";
        fetch(url,
            {
                method: "GET",
                headers: {
                    "ModuleId": moduleId,
                    "RequestVerificationToken": token,
                    "TabId": tabId
                }
            }).then(res => {
            return res.json();
        }).then(data => {
            setItems(data);
        });
    };

    const loadSettings = () => {
        const url = baseUrl+"Settings/LoadSettings";
        fetch(url,
            {
                method: "GET",
                headers: {
                    "ModuleId": moduleId,
                    "RequestVerificationToken": token,
                    "TabId": tabId
                }
            }).then(res => {
            return res.json();
        }).then(data => {
            setIdSetting(data.itemId === "true" ? true : false);
            setNameSetting(data.name === "true" ? true : false);
            setDescriptionSetting(data.description === "true" ? true : false);
            setCreatedOnDateSetting(data.createdOnDate === "true" ? true : false);
        });
    };

    const cancelAdd = () => {
        setModal(false);
        resetItem();
    };

    const resetItem = () => {
        setName(null);
        setId(0);
        setDescription(null);
        setUser(null);
    };

    const editItem = (item) => {
        setName(item.name);
        setUser(item.assignedUser);
        setDescription(item.description);
        setId(item.id);
        setModal(true);
    };

    const saveChanges = () => {
        const item = { id, name, description, assignedUser };
        const url = baseUrl + "Item/Save";
        fetch(url,
            {
                method: "POST",
                headers: {
                    "ModuleId": moduleId,
                    "RequestVerificationToken": token,
                    "TabId": tabId,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(item)
            }).then(res => {
            if (res.ok) {
                resetItem();
                setModal(false);
                loadItems();
            }
        });
    };

    const loadUsers = () => {
        const url = baseUrl + "User/GetList";
        fetch(url,
            {
                method: "GET",
                headers: {
                    "ModuleId": moduleId,
                    "RequestVerificationToken": token,
                    "TabId": tabId
                }
            }).then(res => {
            return res.json();
        }).then(data => {
            setUsers(data);
        });
    };

    useEffect(() => {
        loadItems();
        loadSettings();
        loadUsers();
    }, []);

    const removeItem = (itemId) => {
        const url = baseUrl + "Item/Delete?itemId=" + itemId;

        if (confirm("Do you want to remove this item?")) {
            fetch(url,
                {
                    method: "DELETE",
                    headers: {
                        "ModuleId": moduleId,
                        "RequestVerificationToken": token,
                        "TabId": tabId
                    }
                }).then(res => {
                if (!res.ok) {
                    throw new Error("HTTP status " + res.status);
                } else {
                    loadItems();
                }
            });
        }
    };

    return (<div>
        <div className="col-xs-12">
            <h3>Item list </h3>
        </div>
        <button type="button" onClick={() => setModal(true)}>Add item</button>
        <table className="table table-striped">
            <thead>
                <tr>
                    {idSetting && <th>Id</th>}
                    {nameSetting && <th>Name</th>}
                    {descriptionSetting && <th>Description</th>}
                    <th>Created on</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {items && items.map((item) => (<tr className="tm_t" key={item.id}>
                    {idSetting && <td>{item.id}</td>}
                    {nameSetting && <td>{item.name}</td>}
                    {descriptionSetting && <td>{item.description}</td>}
                    {createdOnDateSetting && <td>{item.createdOnDate}</td>}
                    <td>
                        <button type="button" className="btn btn-sm" onClick={() => editItem(item)} title="Edit item">
                            <i className="glyphicon glyphicon-edit"></i>
                        </button>
                        <button type="button" className="btn btn-sm btn-danger" onClick={() => removeItem(item.id)} title="Remove item">
                            <i className="glyphicon glyphicon-remove"></i>
                        </button>
                    </td>
                </tr >))}
            </tbody >
        </table >
        {modal && <div className="modal fade in" id="myModal" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel" style={{ display: "block" }}>
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <button type="button" className="close" onClick={cancelAdd} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 className="modal-title" id="myModalLabel">Create Item</h4>
                    </div>
                    <div className="modal-body">
                        <div className="dnnForm dnnEditBasicSettings" id="dnnEditBasicSettings">
                            <fieldset>
                                <div className="dnnFormItem">
                                    <div><label htmlFor="itemName">Name</label></div>
                                    <input id="itemName" type="text" onChange={(e) => setName(e.target.value)} value={name} />
                                </div>
                                <div className="dnnFormItem">
                                    <div><label htmlFor="itemDescription">Description</label></div>
                                    <textarea id="itemDescription" cols="20" rows="5" onChange={(e) => setDescription(e.target.value)} value={description}></textarea>
                                </div>
                                <div className="dnnFormItem">
                                    <div><label htmlFor="itemUser">AssignedUser</label></div>
                                    <select onChange={(e) => setUser(e.target.value)}>
                                        {users && users.map((user) => (
                                            <option value={user.id} key={user.id}>
                                                {user.name}
                                            </option>
                                        ))
                                        }
                                    </select>
                                </div>
                            </fieldset>
                        </div>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-default" onClick={cancelAdd}>Close</button>
                        <button type="button" className="btn btn-primary" onClick={saveChanges}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>}
    </div >);
};

export default Items;
