<<%= openDirective %> Control Language="C#" AutoEventWireup="true" CodeBehind="Settings.ascx.cs" Inherits="<%= fullNamespace %>.Settings" <%= closeDirective %>>
<<%= openDirective %> Register TagPrefix="dnn" Namespace="DotNetNuke.UI.WebControls" Assembly="DotNetNuke" <%= closeDirective %>>
<dnn:propertyeditorcontrol id="SettingsEditor" runat="Server" 
    editcontrolwidth="200px" 
    labelwidth="250px" 
    width="450px" 
    helpstyle-cssclass="Help" 
    labelstyle-cssclass="SubHead" 
    editmode="Edit"
    SortMode="SortOrderAttribute"
    />