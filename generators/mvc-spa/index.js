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
        message: 'What is the name of your MVC-SPA Module?',
        default: this.appname, /*to-do: figure out if we want to populate and actually use this later */
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.extensionDescription,
        type: 'input',
        name: 'extensionDescription',
        message: 'Describe your module:',
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
      props.extensionType = "Modules";
      props.fullNamespace = props.namespaceRoot + "." + props.extensionType + "." + props.friendlyName;
      props.guid = this._generateGuid();
      props.msBuildVersion = msBuildVersion;

      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white('Creating your MVC+SPA Module.'));

    // mod: this follows the Upendo development/solution pattern
    this.destinationRoot("Modules/");

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
      extensionDescription: this.props.extensionDescription,
      companyUrl: this.options.companyUrl,
      emailAddress: this.options.emailAddress,
      currentYear: currentDate.getFullYear(), /* NOT USED */
      version: '1.0.0',
      extensionType: this.props.extensionType,
      fullNamespace: this.props.fullNamespace,
      guid: this.props.guid,
      objectPrefix: this.props.objectPrefix,
      msBuildVersion: this.props.msBuildVersion
    };

    this.fs.copyTpl(
      this.templatePath('../../common/csproj/NuGet.config'),
      this.destinationPath(friendlyName + '/NuGet.config'),
      template
    );

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
      this.templatePath('App_LocalResources/**'),
      this.destinationPath(friendlyName + '/App_LocalResources/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Components/**'),
      this.destinationPath(friendlyName + '/Components/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Controllers/**'),
      this.destinationPath(friendlyName + '/Controllers/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Data/**'),
      this.destinationPath(friendlyName + '/Data/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Models/**'),
      this.destinationPath(friendlyName + '/Models/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Providers/**'),
      this.destinationPath(friendlyName + '/Providers/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Scripts/**'),
      this.destinationPath(friendlyName + '/Scripts/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Services/**'),
      this.destinationPath(friendlyName + '/Services/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Styles/**'),
      this.destinationPath(friendlyName + '/Styles/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Templates/**'),
      this.destinationPath(friendlyName + '/Templates/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Views/**'),
      this.destinationPath(friendlyName + '/Views/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('manifest.dnn'),
      this.destinationPath(friendlyName + '/' + friendlyName + '.dnn'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Module.build'),
      this.destinationPath(friendlyName + '/Module.build'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Module.csproj'),
      this.destinationPath(friendlyName + '/' + fullNamespace + '.csproj'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Module.css'),
      this.destinationPath(friendlyName + '/Module.css'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Module.sln'),
      this.destinationPath(friendlyName + '/' + fullNamespace + '.sln'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('packages.config'),
      this.destinationPath(friendlyName + '/packages.config'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('symbols.dnn'),
      this.destinationPath(friendlyName + '/' + friendlyName + '_Symbols.dnn'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('web.config'),
      this.destinationPath(friendlyName + '/web.config'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath(friendlyName + '/package.json'),
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
    this._restoreSolution();
    this._installDependencies();
  }

  end() {
    process.chdir('../');
    this.log(chalk.green('All Ready!'));
  }
};
