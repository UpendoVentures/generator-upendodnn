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
          {
            name: chalk.gray('Credit Card Gateway'),
            value: 'creditcardgateway',
            disabled: chalk.gray('Coming Soon')
          },
          {
            name: chalk.gray('Gift Card Gateway'),
            value: 'giftcardgateway',
            disabled: chalk.gray('Coming Soon')
          },
          {
            name: chalk.gray('Payment Method'),
            value: 'paymentmethod',
            disabled: chalk.gray('Coming Soon')
          },
          {
            name: chalk.gray('Tax Provider'),
            value: 'taxprovider',
            disabled: chalk.gray('Coming Soon')
          },
          {
            name: chalk.gray('Viewset'),
            value: 'viewset',
            disabled: chalk.gray('Coming Soon')
          }
        ]
      },
      {
        when: !this.options.company,
        type: 'input',
        name: 'company',
        message: 'Namespace for your Hotcakes Commerce extension point (Usually a company name)?',
        store: true,
        validate: str => {
          return str.length > 0;
        }
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
      },
      {
        when: !this.options.companyUrl,
        type: 'input',
        name: 'companyUrl',
        message: 'Company Website:',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.emailAddy,
        type: 'input',
        name: 'emailAddy',
        message: 'Your e-mail address:',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      props.currentDate = new Date();
      props.namespace = this._pascalCaseName(props.company);
      props.extensionName = this._pascalCaseName(props.name);
      props.extensionType = "Hotcakes";
      props.fullNamespace = props.namespace + "." + props.extensionType + "." + props.extensionName;
      props.guid = this._generateGuid();

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
      default:
        this.destinationRoot("Hotcakes/");
        break;
    }

    let template = {
      namespace: namespace,
      extensionName: extensionName,
      moduleFriendlyName: this.props.name,
      description: this.props.description,
      companyUrl: this.props.companyUrl,
      emailAddy: this.props.emailAddy,
      currentYear: currentDate.getFullYear(),
      version: '1.0.0',
      menuLinkName: this.props.menuLinkName,
      parentMenu: this.props.parentMenu,
      extensionType: this.props.extensionType,
      fullNamespace: this.props.fullNamespace,
      guid: this.props.guid
    };

    this.fs.copyTpl(
      this.templatePath('../../common/packaging-hcc/**'),
      this.destinationPath(extensionName + '/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/src-library-hcc/**'),
      this.destinationPath(extensionName + '/'),
      template
    );

    if (hccType == "workflow"){
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

    if (hccType == "actiondelegate"){
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
  }

  install() { }

  end() {
    process.chdir('../');
    this.log(chalk.green('All Ready!'));
  }
};
