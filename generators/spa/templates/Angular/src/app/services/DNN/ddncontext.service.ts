import { Injectable } from '@angular/core';

declare const window: any;

@Injectable({
    providedIn: 'root'
  })
export class DnnContextService {

    // https://medium.com/@ryanchenkie_40935/angular-authentication-using-the-http-client-and-http-interceptors-2f9d1540eb8

    private _moduleId = -1;
    private _tabId = -1;
    private _antiForgeryToken = '';
    private _properties: any = {};

    constructor() {
        const MODULE = '<%= friendlyName %>';
        if (window && window[MODULE]) {
            this._properties = window[MODULE];
        }
    }

    getServiceFramework() {

        this._moduleId = this._properties.ModuleId;

        if (this._antiForgeryToken !== '') {
            return this.context;
        } else {
            // Check if DNN Services framework exists.
            if (window.$ && window.$.ServicesFramework) {
                const sf = window.$.ServicesFramework();
                // Check if sf is initialized.
                if (sf.getAntiForgeryValue() && sf.getTabId() !== -1) {
                    this._tabId = sf.getTabId();
                    this._antiForgeryToken = sf.getAntiForgeryValue();
                    return this.context;
                } else {
                    return this.context;
                }
            } else {
                return this.context;
            }
        }
    }

    get context() {
        return { 'tabId': this._tabId, 'antiForgeryToken': this._antiForgeryToken, 'moduleId': this._moduleId };
    }

    get properties() {
        return this._properties;
    }

    get resources() {
        return this._properties.Resources;
    }
}