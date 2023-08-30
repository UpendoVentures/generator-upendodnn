'use strict';
const DnnGeneratorBase = require('../lib/DnnGeneratorBase');
const chalk = require('chalk');
const fs = require('fs');
const constants = require('../lib/Constants');
const { removeLeadingZeros } = require('../lib/versionUtil'); 

module.exports = class extends DnnGeneratorBase {
  prompting() {
    const prompts = [
      {
        when: !this.options.hccType,
        type: 'list',
        name: 'hccType',
        message: 'Which Hotcakes Commerce extension point do you want to build?',
        choices: [
          { name: 'Action Delegate Integration', value: 'actiondelegate' },
          { name: 'Credit Card Gateway', value: 'creditcardgateway' },
          { name: 'Gift Card Gateway', value: 'giftcardgateway' },
          { name: 'Order Workflow', value: 'workflow' },
          { name: 'Payment Method', value: 'paymentmethod' },
          { name: 'Tax Provider', value: 'taxprovider' },
          { name: 'Viewset', value: 'viewset' },          
        ]
      },
      {
        when: !this.options.friendlyName,
        type: 'input',
        name: 'friendlyName',
        message: 'What is the name of your Hotcakes Commerce extension point?',
        default: this.appname, /*to-do: figure out if we want to populate and actually use this later */
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.extensionDescription,
        type: 'input',
        name: 'extensionDescription',
        message: 'Describe your Hotcakes Commerce extension point:',
        validate: str => {
          return str.length > 0;
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      props.currentDate = new Date();
      if (this.options.companyName.endsWith(" -f")) {
        props.namespaceRoot = this.options.companyName.replace(" -f", "");
      }
      else {
        props.namespaceRoot = this._pascalCaseName(this.options.companyName);
      }
      if (props.friendlyName.endsWith(" -f")) {
        props.friendlyName = props.friendlyName.replace(" -f", "");
      }
      else {
        props.friendlyName = this._pascalCaseName(props.friendlyName);
      }
      props.extensionType = "Hotcakes";
      props.fullNamespace = props.namespaceRoot + "." + props.extensionType + "." + props.friendlyName;
      props.guid = this._generateGuid();
      props.openDirective = "%@";
      props.closeDirective = "%";
      props.dnnBuildVersion = constants.DNN_BUILD_VERSION;
      props.dnnBuildVersionShort = removeLeadingZeros(constants.DNN_BUILD_VERSION);
      props.hccBuildVersion = constants.HCC_BUILD_VERSION;
      props.hccBuildVersionShort = removeLeadingZeros(constants.HCC_BUILD_VERSION);

      this.props = props;
    });
  }

  writing() {
    this.log(
      chalk.white("Creating Hotcakes Commerce extension point.")
    );

    let namespaceRoot = this.props.namespaceRoot;
    let friendlyName = this.props.friendlyName;
    let currentDate = this.props.currentDate;
    let fullNamespace = this.props.fullNamespace;
    let hccType = this.props.hccType;
    let guid = this.props.guid;

    // mod: this follows the Upendo development/solution pattern
    switch (hccType) {
      case "workflow":
      case "actiondelegate":
        this.destinationRoot("Libraries/");
        break;
      case "viewset":
        this.destinationRoot("Viewsets/");
        break;
      case "creditcardgateway":
      case "giftcardgateway":
      case "paymentmethod":
      case "taxprovider":
        this.destinationRoot("Modules/");
        break;
      default:
        this.destinationRoot("Hotcakes/");
        break;
    }

    let template = {
      ownerName: this.options.ownerName,
      companyName: this.options.companyName,
      currentDate: this.props.currentDate,
      namespaceRoot: namespaceRoot,
      extensionType: this.props.extensionType,
      friendlyName: this.props.friendlyName,
      msBuildVersion: this.props.msBuildVersion, 
      extensionDescription: this.props.extensionDescription,
      companyUrl: this.options.companyUrl,
      emailAddress: this.options.emailAddress,
      currentYear: currentDate.getFullYear(),
      version: '1.0.0',
      extensionType: this.props.extensionType,
      fullNamespace: this.props.fullNamespace,
      guid: this.props.guid,
      openDirective: this.props.openDirective,
      closeDirective: this.props.closeDirective,
      dnnBuildVersion: this.props.dnnBuildVersion,
      dnnBuildVersionShort: this.props.dnnBuildVersionShort,
      hccBuildVersion: this.props.hccBuildVersion,
      hccBuildVersionShort: this.props.hccBuildVersionShort
    };

    this.fs.copyTpl(
      this.templatePath('../../common/packaging-hcc/**'),
      this.destinationPath(friendlyName + '/'),
      template
    );
    if (hccType == "workflow" || hccType == "actiondelegate") {
    this.fs.copyTpl(
      this.templatePath('../../common/src-library-hcc/**'),
      this.destinationPath(friendlyName + '/'),
      template
    );
    }
    if (hccType == "workflow") {
      
      let task1Guid = this._generateGuid();
      let task2Guid = this._generateGuid();

      template.task1Guid = task1Guid;
      template.task2Guid = task2Guid;

      this.fs.copyTpl(
        this.templatePath(hccType + '/Tasks/**'),
        this.destinationPath(friendlyName + '/Tasks/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/MyWorkflow.cs'),
        this.destinationPath(friendlyName + '/MyWorkflow.cs'),
        template
      );
    }

    if (hccType == "actiondelegate") {
      this.fs.copyTpl(
        this.templatePath(hccType + '/MyCartIntegration.cs'),
        this.destinationPath(friendlyName + '/MyCartIntegration.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/MyCheckoutIntegration.cs'),
        this.destinationPath(friendlyName + '/MyCheckoutIntegration.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/MyProductIntegration.cs'),
        this.destinationPath(friendlyName + '/MyProductIntegration.cs'),
        template
      );
    }

    // used by workflow & action delegate so far
   
    this.fs.copyTpl(
      this.templatePath(hccType + '/ReadMe.txt'),
      this.destinationPath(friendlyName + '/ReadMe.txt'),
      template
    );

    this.fs.copyTpl(
      this.templatePath(hccType + '/extension.csproj'),
      this.destinationPath(friendlyName + '/' + fullNamespace + '.csproj'),
      template
    );

    this.fs.copyTpl(
      this.templatePath(hccType + '/extension.sln'),
      this.destinationPath(friendlyName + '/' + fullNamespace + '.sln'),
      template
    );

    this.fs.copyTpl(
      this.templatePath(hccType + '/manifest.dnn'),
      this.destinationPath(friendlyName + '/' + friendlyName + '.dnn'),
      template
    );

    this.fs.copyTpl(
      this.templatePath(hccType + '/symbols.dnn'),
      this.destinationPath(friendlyName + '/' + friendlyName + '_Symbols.dnn'),
      template
    );
  
    // used by giftcardgateway
    if (hccType == "giftcardgateway") {

      this.fs.copyTpl(
        this.templatePath('../../common/src-hotcakes-hcc/giftcardgateway/Module.build'),
        this.destinationPath(friendlyName + '/Module.build'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('../../common/src-hotcakes-hcc/Properties/AssemblyInfo.cs'),
        this.destinationPath(friendlyName + '/Properties/AssemblyInfo.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/packages.config'),
        this.destinationPath(friendlyName + '/packages.config'),
        template
      );

     
      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/MyTestGateway/Edit.ascx'),
        this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/'+ friendlyName + '/Edit.ascx'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/MyTestGateway/Edit.ascx.cs'),
        this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/'+ friendlyName + '/Edit.ascx.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/MyTestGateway/Edit.ascx.designer.cs'),
        this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/'+ friendlyName + '/Edit.ascx.designer.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/MyTestGateway/MyTestGateway.cs'),
        this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/'+ friendlyName + '/' + friendlyName+'.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/MyTestGateway/MyTestGatewaySettings.cs'),
        this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/'+ friendlyName + '/' + friendlyName+'Settings.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/MyTestGateway/App_LocalResources/Edit.ascx.resx'),
        this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/'+ friendlyName + '/App_LocalResources/' + 'Edit.ascx.resx'),
        template
      );
    }
    // used by paymentmethod
    if (hccType == "paymentmethod") {

      this.fs.copyTpl(
        this.templatePath('../../common/src-hotcakes-hcc/paymentmethod/Module.build'),
        this.destinationPath(friendlyName + '/Module.build'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('../../common/src-hotcakes-hcc/Properties/AssemblyInfo.cs'),
        this.destinationPath(friendlyName + '/Properties/AssemblyInfo.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/packages.config'),
        this.destinationPath(friendlyName + '/packages.config'),
        template
      );

     
      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/Edit.ascx'),
        this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ friendlyName + '/Edit.ascx'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/Edit.ascx.cs'),
        this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ friendlyName + '/Edit.ascx.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/Edit.ascx.designer.cs'),
        this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ friendlyName + '/Edit.ascx.designer.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/MyCustomWorkflowFactory.cs'),
        this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ friendlyName + '/' + friendlyName + 'CustomWorkflowFactory.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/MyPaymentMethod.cs'),
        this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ friendlyName + '/' + friendlyName + 'PaymentMethod.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/MyPaymentMethodCheckoutController.cs'),
        this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ friendlyName + '/' + friendlyName + 'PaymentMethodCheckoutController.cs'),
        template
      );

      
      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/MyPaymentMethodSettings.cs'),
        this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ friendlyName + '/' + friendlyName + 'PaymentMethodSettings.cs'),
        template
      );


      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/StartMyPaymentMethodCheckout.cs'),
        this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ friendlyName + '/Start' + friendlyName + 'PaymentMethodCheckout.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/App_LocalResources/Edit.ascx.resx'),
        this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ friendlyName + '/App_LocalResources/Edit.ascx.resx'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/Portals/_default/HotcakesViews/_default/Views/MyPaymentMethodCheckout/App_LocalResources/Controller.resx'),
        this.destinationPath(friendlyName + '/Portals/_default/HotcakesViews/_default/Views/'+ friendlyName +'PaymentMethodCheckout/App_LocalResources/Controller.resx'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/Portals/_default/HotcakesViews/_default/Views/MyPaymentMethodCheckout/App_LocalResources/Index.cshtml.resx'),
        this.destinationPath(friendlyName + '/Portals/_default/HotcakesViews/_default/Views/'+ friendlyName +'PaymentMethodCheckout/App_LocalResources/Index.cshtml.resx'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/Portals/_default/HotcakesViews/_default/Views/MyPaymentMethodCheckout/Index.cshtml'),
        this.destinationPath(friendlyName + '/Portals/_default/HotcakesViews/_default/Views/'+ friendlyName +'PaymentMethodCheckout/Index.cshtml'),
        template
      );
    }
    // used by taxprovider
    if (hccType == "taxprovider") {

        this.fs.copyTpl(
          this.templatePath('../../common/src-hotcakes-hcc/taxprovider/Module.build'),
          this.destinationPath(friendlyName + '/Module.build'),
          template
        );

        this.fs.copyTpl(
          this.templatePath('../../common/src-hotcakes-hcc/Properties/AssemblyInfo.cs'),
          this.destinationPath(friendlyName + '/Properties/AssemblyInfo.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/packages.config'),
          this.destinationPath(friendlyName + '/packages.config'),
          template
        );

         
        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/Edit.ascx'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ friendlyName + '/Edit.ascx'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/Edit.ascx.cs'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ friendlyName + '/Edit.ascx.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/Edit.ascx.designer.cs'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ friendlyName + '/Edit.ascx.designer.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MessageBox.ascx'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ friendlyName + '/MessageBox.ascx'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MessageBox.ascx.cs'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ friendlyName + '/MessageBox.ascx.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MessageBox.ascx.designer.cs'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ friendlyName + '/MessageBox.ascx.designer.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MyTaxProvider.cs'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ friendlyName + '/' + friendlyName +'.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MyTaxProviderGateway.cs'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ friendlyName + '/' + friendlyName +'Gateway.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MyTaxProviderLineResult.cs'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ friendlyName + '/' + friendlyName +'LineResult.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MyTaxProviderResult.cs'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ friendlyName + '/' + friendlyName +'Result.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MyTaxProviderSettings.cs'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ friendlyName + '/' + friendlyName +'Settings.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/App_LocalResources/Edit.ascx.resx'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ friendlyName + '/App_LocalResources/Edit.ascx.resx'),
          template
        );
    }
      // used by creditcardgateway
    if (hccType == "creditcardgateway") {

        this.fs.copyTpl(
          this.templatePath('../../common/src-hotcakes-hcc/creditcardgateway/Module.build'),
          this.destinationPath(friendlyName + '/Module.build'),
          template
        );

        this.fs.copyTpl(
          this.templatePath('../../common/src-hotcakes-hcc/Properties/AssemblyInfo.cs'),
          this.destinationPath(friendlyName + '/Properties/AssemblyInfo.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/packages.config'),
          this.destinationPath(friendlyName + '/packages.config'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/MyTestGateway/Edit.ascx'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/'+ friendlyName + '/Edit.ascx'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/MyTestGateway/Edit.ascx.cs'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/'+ friendlyName + '/Edit.ascx.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/MyTestGateway/Edit.ascx.designer.cs'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/'+ friendlyName + '/Edit.ascx.designer.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/MyTestGateway/MyTestGateway.cs'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/'+ friendlyName + '/' + friendlyName+'.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/MyTestGateway/MyTestGatewaySettings.cs'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/'+ friendlyName + '/' + friendlyName+'Settings.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/MyTestGateway/App_LocalResources/Edit.ascx.resx'),
          this.destinationPath(friendlyName + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/'+ friendlyName + '/App_LocalResources/' + 'Edit.ascx.resx'),
          template
        );
    }
     // used by viewset
    if (hccType == "viewset") {

      this.fs.copyTpl(
        this.templatePath('../../common/src-hotcakes-hcc/viewset/Module.build'),
        this.destinationPath(friendlyName + '/Module.build'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('../../common/src-hotcakes-hcc/Properties/AssemblyInfo.cs'),
        this.destinationPath(friendlyName + '/Properties/AssemblyInfo.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/packages.config'),
        this.destinationPath(friendlyName + '/packages.config'),
        template
      );
      this.fs.copyTpl(
        this.templatePath(hccType + "/Controllers/MyCustomViewController.cs"),
        this.destinationPath(friendlyName + '/Controllers/MyCustomViewController.cs'), template
      );
      this.fs.copyTpl(
        this.templatePath(hccType + "/Models/MyCustomViewModel.cs"),
        this.destinationPath(friendlyName + '/Models/MyCustomViewModel.cs'), template
      );
      this.fs.copyTpl(
        this.templatePath(hccType + "/Portals/**/*.*"),
        this.destinationPath(friendlyName + '/Portals'), template
      );
    }
  }

  install() { 
    this._addProjectToSolution();
  }

  end() {
    process.chdir('../');
    this.log(chalk.green('All Ready!'));
  }
};
