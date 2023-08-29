'use strict';
const DnnGeneratorBase = require('../lib/DnnGeneratorBase');
const chalk = require('chalk');

module.exports = class extends DnnGeneratorBase {
  constructor(args, opts) {
    super(args, opts);

    // This method adds support for a `--test` flag
    this.option('noinstall');
  }

  prompting() {
    const prompts = [
      {
        when: !this.options.companyName,
        type: 'input',
        name: 'companyName',
        message: 'Namespace root for your scheduled job (Usually a company name)?',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.name,
        type: 'input',
        name: 'name',
        message: 'What is the name of your scheduled job?',
        default: this.appname, /*to-do: figure out if we want to populate and actually use this later */
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.extensionDescription,
        type: 'input',
        name: 'extensionDescription',
        message: 'Describe your scheduled job:',
        validate: str => {
          return str.length > 0;
        }
      }
    ];

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      props.currentDate = new Date();
      if (this.options.companyName.endsWith(" -f")) {
        props.namespace = this.options.companyName.replace(" -f", "");
      }
      else {
        props.namespace = this._pascalCaseName(this.options.companyName);
      }
      if (props.name.endsWith(" -f")) {
        props.extensionName = props.name.replace(" -f", "");
      }
      else {
        props.extensionName = this._pascalCaseName(props.name);
      }
      props.extensionType = "Libraries";
      props.fullNamespace = props.namespace + "." + props.extensionType + "." + props.extensionName;
      props.guid = this._generateGuid();

      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white('Creating Class Library.'));

    // mod: this follows the Upendo development/solution pattern
    this.destinationRoot("Libraries/");

    let namespace = this.props.namespace;
    let extensionName = this.props.extensionName;
    let currentDate = this.props.currentDate;
    let fullNamespace = this.props.fullNamespace;

    let template = {
      ownerName: this.options.ownerName,
      companyName: this.options.companyName,
      currentDate: this.props.currentDate,
      namespace: namespace,
      extensionName: extensionName,
      extensionType: this.props.extensionType,
      moduleFriendlyName: this.props.name, /* NOT USED */ 
      extensionDescription: this.props.extensionDescription,
      companyUrl: this.options.companyUrl,
      emailAddress: this.options.emailAddress,
      currentYear: currentDate.getFullYear(), /* NOT USED */
      version: '1.0.0',
      menuLinkName: this.props.menuLinkName, /* NOT USED */
      parentMenu: this.props.parentMenu, /* NOT USED */
      extensionType: this.props.extensionType,
      fullNamespace: this.props.fullNamespace,
      guid: this.props.guid
    };

    this.fs.copyTpl(
      this.templatePath('../../common/packaging/**'),
      this.destinationPath(extensionName + '/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/properties/**'),
      this.destinationPath(extensionName + '/Properties/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/src-library/**'),
      this.destinationPath(extensionName + '/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Example.cs'),
      this.destinationPath(extensionName + '/Example.cs'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('manifest.dnn'),
      this.destinationPath(extensionName + '/' + extensionName + '.dnn'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('symbols.dnn'),
      this.destinationPath(extensionName + '/' + extensionName + '_Symbols.dnn'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('library.csproj'),
      this.destinationPath(extensionName + '/' + fullNamespace + '.csproj'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('library.sln'),
      this.destinationPath(extensionName + '/' + fullNamespace + '.sln'),
      template
    );
  }

  install() { 
    this._addProjectToSolution();
  }

  end() {
    process.chdir('../');
    this.log(chalk.green('All Ready!'));
  }
};
