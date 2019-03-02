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
        when: !this.options.company,
        type: 'input',
        name: 'company',
        message: 'Namespace for your library (Usually a company name)?',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.name,
        type: 'input',
        name: 'name',
        message: 'What is the name of your library?',
        default: this.appname,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.description,
        type: 'input',
        name: 'description',
        message: 'Describe your library:',
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
      this.templatePath('../../common/packaging/**'),
      this.destinationPath(extensionName + '/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/src-library/**'),
      this.destinationPath(extensionName + '/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/properties/**'),
      this.destinationPath(extensionName + '/Properties/'),
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

  install() {  }

  end() {
    process.chdir('../');
    this.log(chalk.green('All Ready!'));
  }
};
