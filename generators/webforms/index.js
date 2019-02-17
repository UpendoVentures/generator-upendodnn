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
        when: !this.options.name,
        type: 'input',
        name: 'name',
        message: 'What is the name of your webforms module?',
        default: this.appname,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.description,
        type: 'input',
        name: 'description',
        message: 'Describe your webforms module:',
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
      props.moduleName = this._pascalCaseName(props.name);
      props.extensionType = "Modules";
      props.fullNamespace = props.namespace + "." + props.extensionType + "." + props.moduleName;
      props.guid = this._generateGuid();
      props.openDirective = "%@";
      props.closeDirective = "%";

      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white('Creating Webforms Module.'));
	
    // mod: this follows the Upendo development/solution pattern
    this.destinationRoot("Modules/");

    let namespace = this.props.namespace;
    let moduleName = this.props.moduleName;
    let currentDate = this.props.currentDate;
    let fullNamespace = this.props.fullNamespace;

    let template = {
      namespace: namespace,
      moduleName: moduleName,
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
      guid: this.props.guid,
      openDirective: this.props.openDirective,
      closeDirective: this.props.closeDirective,
      objectPrefix: this.props.objectPrefix
    };

    this.fs.copyTpl(
      this.templatePath('../../common/src-webforms/**'),
      this.destinationPath(moduleName + '/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/packaging/**'),
      this.destinationPath(moduleName + '/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Components/**'),
      this.destinationPath(moduleName + '/Components/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Controllers/**'),
      this.destinationPath(moduleName + '/Controllers/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Entities/**'),
      this.destinationPath(moduleName + '/Entities/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Images/**'),
      this.destinationPath(moduleName + '/Images/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Properties/**'),
      this.destinationPath(moduleName + '/Properties/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Providers/**'),
      this.destinationPath(moduleName + '/Providers/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('manifest.dnn'),
      this.destinationPath(moduleName + '/' + moduleName + '.dnn'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Module.csproj'),
      this.destinationPath(moduleName + '/' + fullNamespace + '.csproj'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Module.sln'),
      this.destinationPath(moduleName + '/' + fullNamespace + '.sln'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('symbols.dnn'),
      this.destinationPath(moduleName + '/' + moduleName + '_Symbols.dnn'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/csproj/NuGet.config'),
      this.destinationPath(moduleName + '/NuGet.config'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath(moduleName + '/package.json'),
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
    this.fs.extendJSON(this.destinationPath(moduleName + '/package.json'), pkgJson);
  }

  install() {
    this._defaultInstall();
  }

  end() {
    this.log(chalk.white('Installed Webforms Module npm Dependencies.'));
    this.log(chalk.white('Running dotnet restore.'));
    this.spawnCommand('dotnet', ['restore']);
    process.chdir('../');
    this.log(chalk.white('All Ready!'));
  }
};
