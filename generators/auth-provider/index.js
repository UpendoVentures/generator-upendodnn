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
        message: 'Namespace for your module (Usually a company name)?',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.objectPrefix,
        type: 'input',
        name: 'objectPrefix',
        message: 'What would be a good abbreviation for that (e.g., abc for Awesome Beverages Company)?',
        store: true,
        validate: str => {
          return str.length > 0 && str.length < 6;
        }
      },
      {
        when: !this.options.friendlyName,
        type: 'input',
        name: 'friendlyName',
        message: 'What is the name of your authentication provider? ',
        default: this.appname, /*to-do: figure out if we want to populate and actually use this later */
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.extensionDescription,
        type: 'input',
        name: 'extensionDescription',
        message: 'Describe about your authentication provider:',
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.authTypeName,
        type: 'input',
        name: 'authTypeName',
        message: 'Enter your authentication provider name with NO SPACES (e.g., MyCompany)?', 
        validate: str => {
          return str.length > 0;
        }
      }
    ];

    var msBuildVersion = this._getMsBuildVersion();

    if (msBuildVersion == "") {
      this.log(chalk.red("YIKES! A valid version of MSBuild was not found! This is a critical error... :("));
    }

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      props.currentDate = new Date();
      if (this.options.companyName.endsWith(" -f")) {
        props.namespaceRoot = this.options.companyName.replace(" -f", "");
      }
      else {
        props.namespaceRoot = this._pascalCaseName(this.options.companyName);
      }
      if (props.name.endsWith(" -f")) {
        props.friendlyName = props.friendlyName.replace(" -f", "");
      }
      else {
        props.friendlyName = this._pascalCaseName(props.friendlyName);
      }
      props.extensionType = "Auth";
      props.fullNamespace = props.namespaceRoot + "." + props.extensionType + "." + props.friendlyName;
      props.guid = this._generateGuid();
      props.openDirective = "%@";
      props.closeDirective = "%";
      props.msBuildVersion = msBuildVersion;

      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white('Creating Authentication Provider.'));

    // mod: this follows the Upendo development/solution pattern
    this.destinationRoot("Modules/");

    let namespaceRoot = this.props.namespaceRoot;
    let currentDate = this.props.currentDate;
    let fullNamespace = this.props.fullNamespace;

    let template = {
      ownerName: this.options.ownerName,
      companyName: this.options.companyName,
      currentDate: this.props.currentDate,
      namespaceRoot: namespaceRoot,
      friendlyName: this.props.friendlyName,
      extensionDescription: this.props.extensionDescription,
      extensionType: this.props.extensionType,
      authTypeName: this.props.authTypeName,
      companyUrl: this.options.companyUrl,
      emailAddress: this.options.emailAddress,
      currentYear: currentDate.getFullYear(),
      version: '01.00.00',
      extensionType: this.props.extensionType,
      fullNamespace: this.props.fullNamespace,
      guid: this.props.guid,
      openDirective: this.props.openDirective,
      closeDirective: this.props.closeDirective,
      objectPrefix: this.props.objectPrefix,
      msBuildVersion: this.props.msBuildVersion
    };

    this.fs.copyTpl(
      this.templatePath('../../common/branding/**'),
      this.destinationPath(friendlyName + '/'),
      template
    );

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
      this.templatePath('common/**'),
      this.destinationPath(friendlyName + '/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Components/**'),
      this.destinationPath(friendlyName + '/Components/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('manifest.dnn'),
      this.destinationPath(friendlyName + '/' + friendlyName + '.dnn'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Module.csproj'),
      this.destinationPath(friendlyName + '/' + fullNamespace + '.csproj'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Module.sln'),
      this.destinationPath(friendlyName + '/' + fullNamespace + '.sln'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('symbols.dnn'),
      this.destinationPath(friendlyName + '/' + friendlyName + '_Symbols.dnn'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath(friendlyName + '/package.json'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/csproj/NuGet.config'),
      this.destinationPath(friendlyName + '/NuGet.config'),
      template
    );

    const pkgJson = {
      devDependencies: {
        // eslint-disable-next-line prettier/prettier
        'archiver': '^3.0.0',
        'copy-webpack-plugin': '^4.6.0',
        'html-webpack-plugin': '^3.2.0',
        // eslint-disable-next-line prettier/prettier
        'marked': '^0.5.2',
        // eslint-disable-next-line prettier/prettier
        'webpack': '^4.27.1',
        'webpack-cli': '^3.1.2',
        'webpack-dev-server': '^3.1.10',
        'webpack-node-externals': '^1.7.2'
      }
    };

    // Extend package.json file in destination path
    this.fs.extendJSON(this.destinationPath(friendlyName + '/package.json'), pkgJson);
  }

  install() {
    this._addProjectToSolution();
    this._installDependencies();
  }

  end() {
    this.log(chalk.white('Installed npm Dependencies.'));
    this.log(chalk.white('Running dotnet restore.'));
    this.spawnCommand('dotnet', ['restore']);
    process.chdir('../');
    this.log(chalk.green('All Ready!'));
  }
};
