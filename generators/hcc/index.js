'use strict';
const DnnGeneratorBase = require('../lib/DnnGeneratorBase');
const chalk = require('chalk');
const fs = require('fs');

module.exports = class extends DnnGeneratorBase {
  prompting() {
    const prompts = [
      {
        when: !this.options.hccType,
        type: 'list',
        name: 'hccType',
        message: 'Which Hotcakes Commerce extension point do you want to build?',
        choices: [
          { name: 'Order Workflow', value: 'workflow' },
          { name: 'Action Delegate Integration', value: 'actiondelegate' },
          { name: 'Credit Card Gateway', value: 'creditcardgateway' },
          { name: 'Gift Card Gateway', value: 'giftcardgateway' },
          { name: 'Payment Method', value: 'paymentmethod' },
          { name: 'Tax Provider', value: 'taxprovider' },
          {
            name: chalk.gray('Viewset'),
            value: 'viewset',
            disabled: chalk.gray('Coming Soon')
          }
        ]
      },
      {
        when: !this.options.name,
        type: 'input',
        name: 'name',
        message: 'What is the name of your Hotcakes Commerce extension point?',
        default: this.appname,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.description,
        type: 'input',
        name: 'description',
        message: 'Describe your Hotcakes Commerce extension point:',
        validate: str => {
          return str.length > 0;
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      props.currentDate = new Date();
      if (this.options.company.endsWith(" -f")) {
        props.namespace = this.options.company.replace(" -f", "");
      }
      else {
        props.namespace = this._pascalCaseName(this.options.company);
      }
      if (props.name.endsWith(" -f")) {
        props.extensionName = props.name.replace(" -f", "");
      }
      else {
        props.extensionName = this._pascalCaseName(props.name);
      }
      props.extensionType = "Hotcakes";
      props.fullNamespace = props.namespace + "." + props.extensionType + "." + props.extensionName;
      props.guid = this._generateGuid();
      props.openDirective = "%@";
      props.closeDirective = "%";
      this.props = props;
    });
  }

  writing() {
    this.log(
      chalk.white("Creating Hotcakes Commerce extension point.")
    );

    let namespace = this.props.namespace;
    let extensionName = this.props.extensionName;
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
      yourName: this.options.yourName,
      company: this.options.company,
      namespace: namespace,
      extensionName: extensionName,
      moduleFriendlyName: this.props.name,
      description: this.props.description,
      companyUrl: this.options.companyUrl,
      emailAddy: this.options.emailAddy,
      currentYear: currentDate.getFullYear(),
      version: '1.0.0',
      menuLinkName: this.props.menuLinkName,
      parentMenu: this.props.parentMenu,
      extensionType: this.props.extensionType,
      fullNamespace: this.props.fullNamespace,
      guid: this.props.guid,
      openDirective: this.props.openDirective,
      closeDirective: this.props.closeDirective
    };

    this.fs.copyTpl(
      this.templatePath('../../common/packaging-hcc/**'),
      this.destinationPath(extensionName + '/'),
      template
    );
    if (hccType == "workflow" || hccType == "actiondelegate") {
    this.fs.copyTpl(
      this.templatePath('../../common/src-library-hcc/**'),
      this.destinationPath(extensionName + '/'),
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
        this.destinationPath(extensionName + '/Tasks/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/MyWorkflow.cs'),
        this.destinationPath(extensionName + '/MyWorkflow.cs'),
        template
      );
    }

    if (hccType == "actiondelegate") {
      this.fs.copyTpl(
        this.templatePath(hccType + '/MyCartIntegration.cs'),
        this.destinationPath(extensionName + '/MyCartIntegration.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/MyCheckoutIntegration.cs'),
        this.destinationPath(extensionName + '/MyCheckoutIntegration.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/MyProductIntegration.cs'),
        this.destinationPath(extensionName + '/MyProductIntegration.cs'),
        template
      );
    }

    // used by workflow & action delegate so far
   
    this.fs.copyTpl(
      this.templatePath(hccType + '/ReadMe.txt'),
      this.destinationPath(extensionName + '/ReadMe.txt'),
      template
    );

    this.fs.copyTpl(
      this.templatePath(hccType + '/extension.csproj'),
      this.destinationPath(extensionName + '/' + fullNamespace + '.csproj'),
      template
    );

    this.fs.copyTpl(
      this.templatePath(hccType + '/extension.sln'),
      this.destinationPath(extensionName + '/' + fullNamespace + '.sln'),
      template
    );

    this.fs.copyTpl(
      this.templatePath(hccType + '/manifest.dnn'),
      this.destinationPath(extensionName + '/' + extensionName + '.dnn'),
      template
    );

    this.fs.copyTpl(
      this.templatePath(hccType + '/symbols.dnn'),
      this.destinationPath(extensionName + '/' + extensionName + '_Symbols.dnn'),
      template
    );
  
    // used by giftcardgateway
    if (hccType == "giftcardgateway") {

      this.fs.copyTpl(
        this.templatePath('../../common/src-hotcakes-hcc/giftcardgateway/Module.build'),
        this.destinationPath(extensionName + '/Module.build'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('../../common/src-hotcakes-hcc/Properties/AssemblyInfo.cs'),
        this.destinationPath(extensionName + '/Properties/AssemblyInfo.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/packages.config'),
        this.destinationPath(extensionName + '/packages.config'),
        template
      );

     
      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/MyTestGateway/Edit.ascx'),
        this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/'+ extensionName + '/Edit.ascx'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/MyTestGateway/Edit.ascx.cs'),
        this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/'+ extensionName + '/Edit.ascx.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/MyTestGateway/Edit.ascx.designer.cs'),
        this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/'+ extensionName + '/Edit.ascx.designer.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/MyTestGateway/MyTestGateway.cs'),
        this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/'+ extensionName + '/' + extensionName+'_GiftCardGateway.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/MyTestGateway/MyTestGatewaySettings.cs'),
        this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/'+ extensionName + '/' + extensionName+'_GiftCardGatewaySettings.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/MyTestGateway/App_LocalResources/Edit.ascx.resx'),
        this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/GiftCardGateways/'+ extensionName + '/App_LocalResources/' + 'Edit.ascx.resx'),
        template
      );
    }
    // used by paymentmethod
    if (hccType == "paymentmethod") {

      this.fs.copyTpl(
        this.templatePath('../../common/src-hotcakes-hcc/paymentmethod/Module.build'),
        this.destinationPath(extensionName + '/Module.build'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('../../common/src-hotcakes-hcc/Properties/AssemblyInfo.cs'),
        this.destinationPath(extensionName + '/Properties/AssemblyInfo.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/packages.config'),
        this.destinationPath(extensionName + '/packages.config'),
        template
      );

     
      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/Edit.ascx'),
        this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ extensionName + '/Edit.ascx'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/Edit.ascx.cs'),
        this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ extensionName + '/Edit.ascx.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/Edit.ascx.designer.cs'),
        this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ extensionName + '/Edit.ascx.designer.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/MyCustomWorkflowFactory.cs'),
        this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ extensionName + '/' + extensionName + '_CustomWorkflowFactory.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/MyPaymentMethod.cs'),
        this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ extensionName + '/' + extensionName + '_PaymentMethod.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/MyPaymentMethodCheckoutController.cs'),
        this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ extensionName + '/' + extensionName + '_PaymentMethodCheckoutController.cs'),
        template
      );

      
      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/MyPaymentMethodSettings.cs'),
        this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ extensionName + '/' + extensionName + '_PaymentMethodSettings.cs'),
        template
      );


      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/StartMyPaymentMethodCheckout.cs'),
        this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ extensionName + '/Start_' + extensionName + '_PaymentMethodCheckout.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/MyPaymentMethod/App_LocalResources/Edit.ascx.resx'),
        this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/PaymentMethods/'+ extensionName + '/App_LocalResources/Edit.ascx.resx'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/Portals/_default/HotcakesViews/_default/Views/MyPaymentMethodCheckout/App_LocalResources/Controller.resx'),
        this.destinationPath(extensionName + '/Portals/_default/HotcakesViews/_default/Views/'+extensionName+'PaymentMethodCheckout/App_LocalResources/Controller.resx'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/Portals/_default/HotcakesViews/_default/Views/MyPaymentMethodCheckout/App_LocalResources/Index.cshtml.resx'),
        this.destinationPath(extensionName + '/Portals/_default/HotcakesViews/_default/Views/'+extensionName+'PaymentMethodCheckout/App_LocalResources/Index.cshtml.resx'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(hccType + '/Portals/_default/HotcakesViews/_default/Views/MyPaymentMethodCheckout/Index.cshtml'),
        this.destinationPath(extensionName + '/Portals/_default/HotcakesViews/_default/Views/'+extensionName+'PaymentMethodCheckout/Index.cshtml'),
        template
      );
    }
    // used by taxprovider
    if (hccType == "taxprovider") {

        this.fs.copyTpl(
          this.templatePath('../../common/src-hotcakes-hcc/taxprovider/Module.build'),
          this.destinationPath(extensionName + '/Module.build'),
          template
        );

        this.fs.copyTpl(
          this.templatePath('../../common/src-hotcakes-hcc/Properties/AssemblyInfo.cs'),
          this.destinationPath(extensionName + '/Properties/AssemblyInfo.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/packages.config'),
          this.destinationPath(extensionName + '/packages.config'),
          template
        );

         
        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/Edit.ascx'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ extensionName + '/Edit.ascx'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/Edit.ascx.cs'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ extensionName + '/Edit.ascx.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/Edit.ascx.designer.cs'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ extensionName + '/Edit.ascx.designer.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MessageBox.ascx'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ extensionName + '/MessageBox.ascx'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MessageBox.ascx.cs'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ extensionName + '/MessageBox.ascx.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MessageBox.ascx.designer.cs'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ extensionName + '/MessageBox.ascx.designer.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MyTaxProvider.cs'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ extensionName + '/' + extensionName +'_TaxProvider.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MyTaxProviderGateway.cs'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ extensionName + '/' + extensionName +'_TaxProviderGateway.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MyTaxProviderLineResult.cs'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ extensionName + '/' + extensionName +'_TaxProviderLineResult.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MyTaxProviderResult.cs'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ extensionName + '/' + extensionName +'_TaxProviderResult.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/MyTaxProviderSettings.cs'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ extensionName + '/' + extensionName +'_TaxProviderSettings.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/MyProvider/App_LocalResources/Edit.ascx.resx'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/TaxProviders/'+ extensionName + '/App_LocalResources/Edit.ascx.resx'),
          template
        );
    }
      // used by creditcardgateway
    if (hccType == "creditcardgateway") {

        this.fs.copyTpl(
          this.templatePath('../../common/src-hotcakes-hcc/creditcardgateway/Module.build'),
          this.destinationPath(extensionName + '/Module.build'),
          template
        );

        this.fs.copyTpl(
          this.templatePath('../../common/src-hotcakes-hcc/Properties/AssemblyInfo.cs'),
          this.destinationPath(extensionName + '/Properties/AssemblyInfo.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/packages.config'),
          this.destinationPath(extensionName + '/packages.config'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/MyTestGateway/Edit.ascx'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/'+ extensionName + '/Edit.ascx'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/MyTestGateway/Edit.ascx.cs'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/'+ extensionName + '/Edit.ascx.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/MyTestGateway/Edit.ascx.designer.cs'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/'+ extensionName + '/Edit.ascx.designer.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/MyTestGateway/MyTestGateway.cs'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/'+ extensionName + '/' + extensionName+'_CreditCardGateway.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/MyTestGateway/MyTestGatewaySettings.cs'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/'+ extensionName + '/' + extensionName+'_CreditCardGatewaySettings.cs'),
          template
        );

        this.fs.copyTpl(
          this.templatePath(hccType + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/MyTestGateway/App_LocalResources/Edit.ascx.resx'),
          this.destinationPath(extensionName + '/DesktopModules/Hotcakes/Core/Admin/Parts/CreditCardGateways/'+ extensionName + '/App_LocalResources/' + 'Edit.ascx.resx'),
          template
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
