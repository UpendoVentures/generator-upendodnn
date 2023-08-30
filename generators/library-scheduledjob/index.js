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
        when: !this.options.friendlyName,
        type: 'input',
        name: 'friendlyName',
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
      props.extensionType = "Libraries";
      props.fullNamespace = props.namespaceRoot + "." + props.extensionType + "." + props.friendlyName;
      props.guid = this._generateGuid();

      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white('Creating Class Library.'));

    // mod: this follows the Upendo development/solution pattern
    this.destinationRoot("Libraries/");

    let namespaceRoot = this.props.namespaceRoot;
    let friendlyName = this.props.friendlyName;
    let currentDate = this.props.currentDate;
    let fullNamespace = this.props.fullNamespace;

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
      guid: this.props.guid
    };

    this.fs.copyTpl(
      this.templatePath('../../common/packaging/**'),
      this.destinationPath(friendlyName + '/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/properties/**'),
      this.destinationPath(friendlyName + '/Properties/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/src-library/**'),
      this.destinationPath(friendlyName + '/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Example.cs'),
      this.destinationPath(friendlyName + '/Example.cs'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('manifest.dnn'),
      this.destinationPath(friendlyName + '/' + friendlyName + '.dnn'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('symbols.dnn'),
      this.destinationPath(friendlyName + '/' + friendlyName + '_Symbols.dnn'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('library.csproj'),
      this.destinationPath(friendlyName + '/' + fullNamespace + '.csproj'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('library.sln'),
      this.destinationPath(friendlyName + '/' + fullNamespace + '.sln'),
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
