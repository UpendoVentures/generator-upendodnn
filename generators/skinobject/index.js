'use strict';
const DnnGeneratorBase = require('../lib/DnnGeneratorBase');
const chalk = require('chalk');
const uuid = require('uuid-v4');

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

    var msBuildVersion = this._getMsBuildVersion();

    if (msBuildVersion == "") {
      this.log(chalk.red("YIKES! A valid version of MSBuild was not found! This is a critical error... :("));
    }

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      props.currentDate = new Date();
      props.namespace = this._pascalCaseName(props.company);
      props.extensionName = this._pascalCaseName(props.name);
      props.extensionType = "SkinObjects";
      props.fullNamespace = props.namespace + "." + props.extensionType + "." + props.extensionName;
      props.guid = this._generateGuid();
      props.openDirective = "%@";
      props.closeDirective = "%";
      props.msBuildVersion = msBuildVersion;

      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white('Creating MVC Module.'));

    // mod: this follows the Upendo development/solution pattern
    this.destinationRoot("SkinObjects/");

    let namespace = this.props.namespace;
    let extensionName = this.props.extensionName;
    let currentDate = this.props.currentDate;
    let fullNamespace = this.props.fullNamespace;
    let guid = this.props.guid;

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
      guid: this.props.guid,
      openDirective: this.props.openDirective,
      closeDirective: this.props.closeDirective,
      msBuildVersion: this.props.msBuildVersion
    };

    this.fs.copyTpl(
      this.templatePath('../../common/branding/**'),
      this.destinationPath(extensionName + '/'),
      template
    );

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
      this.templatePath('Components/**'),
      this.destinationPath(extensionName + '/Components/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('manifest.dnn'),
      this.destinationPath(extensionName + '/' + extensionName + '.dnn'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('SkinObject.build'),
      this.destinationPath(extensionName + '/SkinObject.build'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('SkinObject.csproj'),
      this.destinationPath(extensionName + '/' + fullNamespace + '.csproj'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('SkinObject.sln'),
      this.destinationPath(extensionName + '/' + fullNamespace + '.sln'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('View.ascx'),
      this.destinationPath(extensionName + '/View.ascx'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('View.ascx.cs'),
      this.destinationPath(extensionName + '/View.ascx.cs'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('View.ascx.designer.cs'),
      this.destinationPath(extensionName + '/View.ascx.designer.cs'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath(extensionName + '/package.json'),
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
    this.fs.extendJSON(this.destinationPath(extensionName + '/package.json'), pkgJson);
  }

  install() { }

  end() {
    this.log(chalk.white('Installed Skin Object npm Dependencies.'));
    process.chdir('../');
    this.log(chalk.white('All Ready!'));
  }
};
