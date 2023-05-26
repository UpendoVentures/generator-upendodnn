export class ContextInfo {
    /**
     * the DNN module id
     */
    moduleId: number;
  
    /**
     * the DNN tab id (internal page number)
     */
    tabId: number;
  
    /**
     * the security / anti-forgery token for api-requests
     */
    antiForgeryToken: string;
  }