'use strict';
const DnnGeneratorBase = require('../lib/DnnGeneratorBase');
const chalk = require('chalk');
const constants = require('../lib/Constants');
const { removeLeadingZeros } = require('../lib/versionUtil'); 

module.exports = class extends DnnGeneratorBase {
  constructor(args, opts) {
    super(args, opts);

    // This method adds support for a `--test` flag
    this.option('noinstall');
  }

  prompting() {
    const prompts = [
      {
        when: !this.options.friendlyName,
        type: 'input',
        name: 'friendlyName',
        message: 'What is the name of your MVC (.NET Core) Module?',
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

    return this.prompt(prompts).then(props => {
      // To access props later use this.props.someAnswer;
      props.currentDate = new Date();
      props.namespaceRoot = this._pascalCaseName(this.options.companyName);
      props.friendlyName = this._pascalCaseName(props.friendlyName);
      props.extensionType = "Modules";
      props.dnnBuildVersion = constants.DNN_BUILD_VERSION;
      props.dnnBuildVersionShort = removeLeadingZeros(constants.DNN_BUILD_VERSION);
      props.hccBuildVersion = constants.HCC_BUILD_VERSION;
      props.hccBuildVersionShort = removeLeadingZeros(constants.HCC_BUILD_VERSION);

      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white('Creating your new MVC (.NET Core) module project.'));

    // mod: this follows the Upendo development/solution pattern
    this.destinationRoot("Modules/");

    let namespaceRoot = this.props.namespaceRoot;
    let friendlyName = this.props.friendlyName;
    let currentDate = this.props.currentDate;

    let template = {
      ownerName: this.options.ownerName, /* NOT USED */
      companyName: this.options.companyName,
      currentDate: this.props.currentDate,
      extensionType: this.props.extensionType,
      fullNamespace: this.props.fullNamespace,
      namespaceRoot: namespaceRoot,
      msBuildVersion: this.props.msBuildVersion, 
      friendlyName: this.props.friendlyName,
      extensionDescription: this.props.extensionDescription,
      companyUrl: this.options.companyUrl,
      emailAddress: this.options.emailAddress,
      currentYear: currentDate.getFullYear(),
      version: '1.0.0',
      dnnBuildVersion: this.props.dnnBuildVersion,
      dnnBuildVersionShort: this.props.dnnBuildVersionShort,
      hccBuildVersion: this.props.hccBuildVersion,
      hccBuildVersionShort: this.props.hccBuildVersionShort
    };

    this.fs.copyTpl(
      this.templatePath('../../common/build/*.*'),
      this.destinationPath(friendlyName + '/_BuildScripts'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/csproj/Providers/**'),
      this.destinationPath(friendlyName + '/Providers'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/csproj/NuGet.config'),
      this.destinationPath(friendlyName + '/NuGet.config'),
      template
    );

    // Do all templated copies
    this.fs.copyTpl(
      this.templatePath('../../common/src/**'),
      this.destinationPath(friendlyName + '/src/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('App_LocalResources/**'),
      this.destinationPath(friendlyName + '/App_LocalResources/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('_BuildScripts/**'),
      this.destinationPath(friendlyName + '/_BuildScripts/'),
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
      this.templatePath('Models/**'),
      this.destinationPath(friendlyName + '/Models/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('src/**'),
      this.destinationPath(friendlyName + '/src/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('Views/**'),
      this.destinationPath(friendlyName + '/Views/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('RouteConfig.cs'),
      this.destinationPath(friendlyName + '/RouteConfig.cs'),
      {
        namespaceRoot: namespaceRoot,
        friendlyName: friendlyName
      }
    );

    this.fs.copyTpl(
      this.templatePath('manifest.dnn'),
      this.destinationPath(friendlyName + '/' + friendlyName + '.dnn'),
      {
        namespaceRoot: namespaceRoot,
        friendlyName: this.props.friendlyName,
        extensionDescription: this.props.extensionDescription,
        companyUrl: this.props.companyUrl,
        emailAddress: this.props.emailAddress
      }
    );

    this.fs.copyTpl(
      this.templatePath('../../common/csproj/_Project.csproj'),
      this.destinationPath(friendlyName + '/' + friendlyName + '.csproj'),
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
    this._writeSolution();
    this._addProjectToSolution();
    this._restoreSolution();
    this._installDependencies();
  }

  end() {
    process.chdir('../');
    this.log(chalk.white('All Ready!'));
  }
};
