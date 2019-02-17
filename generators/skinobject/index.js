'use strict';
const DnnGeneratorBase = require('../lib/DnnGeneratorBase');
const chalk = require('chalk');
const uuid = require('uuid');

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
        message: 'Namespace for your skin object (Usually a company name)?',
        store: true,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.name,
        type: 'input',
        name: 'name',
        message: 'What is the name of your skin object?',
        default: this.appname,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.description,
        type: 'input',
        name: 'description',
        message: 'Describe your skin object:',
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
      props.extensionType = "SkinObjects";
      props.fullNamespace = props.namespace + "." + props.extensionType + "." + props.moduleName;
      props.guid = this._generateGuid();

      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white('Creating MVC Module.'));
	
	// mod: this follows the Upendo development/solution pattern
	this.destinationRoot("SkinObjects/");

    let namespace = this.props.namespace;
    let moduleName = this.props.moduleName;
    let currentDate = this.props.currentDate;
    let fullNamespace = this.props.fullNamespace;
    let guid = this.props.guid;

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
      guid: this.props.guid
    };

    this.fs.copyTpl(
      this.templatePath('../../common/csproj/NuGet.config'),
      this.destinationPath(moduleName + '/NuGet.config'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Components/**'),
      this.destinationPath(moduleName + '/Components/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/csproj/Providers/**'),
      this.destinationPath(moduleName + '/Providers'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Images/**'),
      this.destinationPath(moduleName + '/Images/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Properties/AssemblyInfo.cs'),
      this.destinationPath(moduleName + '/Properties/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('License.txt'),
      this.destinationPath(moduleName + '/License.txt'),
      {
        namespace: namespace,
        moduleName: moduleName,
        moduleFriendlyName: this.props.name,
        description: this.props.description,
        companyUrl: this.props.companyUrl,
        emailAddy: this.props.emailAddy,
        fullNamespace: this.props.fullNamespace,
        guid: this.props.guid
      }
    );

    this.fs.copyTpl(
      this.templatePath('manifest.dnn'),
      this.destinationPath(moduleName + '/' + moduleName + '.dnn'),
      {
        namespace: namespace,
        moduleName: moduleName,
        moduleFriendlyName: this.props.name,
        description: this.props.description,
        companyUrl: this.props.companyUrl,
        emailAddy: this.props.emailAddy,
        fullNamespace: this.props.fullNamespace,
        guid: this.props.guid
      }
    );

    this.fs.copyTpl(
      this.templatePath('ReleaseNotes.txt'),
      this.destinationPath(moduleName + '/ReleaseNotes.txt'),
      {
        namespace: namespace,
        moduleName: moduleName,
        moduleFriendlyName: this.props.name,
        description: this.props.description,
        companyUrl: this.props.companyUrl,
        emailAddy: this.props.emailAddy,
        fullNamespace: this.props.fullNamespace,
        guid: this.props.guid
      }
    );

    this.fs.copyTpl(
      this.templatePath('SkinObject.build'),
      this.destinationPath(moduleName + '/SkinObject.build'),
      {
        namespace: namespace,
        moduleName: moduleName,
        moduleFriendlyName: this.props.name,
        description: this.props.description,
        companyUrl: this.props.companyUrl,
        emailAddy: this.props.emailAddy,
        fullNamespace: this.props.fullNamespace,
        guid: this.props.guid
      }
    );

    this.fs.copyTpl(
      this.templatePath('SkinObject.csproj'),
      this.destinationPath(moduleName + '/' + moduleName + '.csproj'),
      {
        namespace: namespace,
        moduleName: moduleName,
        moduleFriendlyName: this.props.name,
        description: this.props.description,
        companyUrl: this.props.companyUrl,
        emailAddy: this.props.emailAddy,
        fullNamespace: this.props.fullNamespace,
        guid: this.props.guid
      }
    );

    this.fs.copyTpl(
      this.templatePath('SkinObject.sln'),
      this.destinationPath(moduleName + '/' + moduleName + '.sln'),
      {
        namespace: namespace,
        moduleName: moduleName,
        moduleFriendlyName: this.props.name,
        description: this.props.description,
        companyUrl: this.props.companyUrl,
        emailAddy: this.props.emailAddy,
        fullNamespace: this.props.fullNamespace,
        guid: this.props.guid
      }
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
    this.log(chalk.white('Installed Skin Object npm Dependencies.'));
    this.log(chalk.white('Running dotnet restore.'));
    this.spawnCommand('dotnet', ['restore']);
    process.chdir('../');
    this.log(chalk.white('All Ready!'));
  }
};
