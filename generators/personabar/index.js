'use strict';
const DnnGeneratorBase = require('../lib/DnnGeneratorBase');
const chalk = require('chalk');
const constants = require('../lib/Constants');
const { removeLeadingZeros } = require('../lib/versionUtil'); 

module.exports = class extends DnnGeneratorBase {
  prompting() {
    const prompts = [
      {
        when: !this.options.spaType,
        type: 'list',
        name: 'pbType',
        message: 'What language do you want your Persona Bar Module to use?',
        choices: [{ name: 'ReactJS', value: 'ReactJS' }]
      },
      {
        when: !this.options.friendlyName,
        type: 'input',
        name: 'friendlyName',
        message: 'What is the name of your Persona Bar Module?',
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
      },
      {
        when: !this.options.parentMenu,
        type: 'list',
        name: 'parentMenu',
        message: 'What menu will your Persona Bar Module show in?',
        choices: [
          { name: 'Content', value: 'Content' },
          { name: 'Settings', value: 'Settings' }
        ]
      },
      {
        when: !this.options.menuLinkName,
        type: 'input',
        name: 'menuLinkName',
        message: 'How do you want your menu link to display?:',
        default: 'My Link',
        store: true,
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
      props.dnnBuildVersion = constants.DNN_BUILD_VERSION;
      props.dnnBuildVersionShort = removeLeadingZeros(constants.DNN_BUILD_VERSION);
      props.hccBuildVersion = constants.HCC_BUILD_VERSION;
      props.hccBuildVersionShort = removeLeadingZeros(constants.HCC_BUILD_VERSION);

      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white('Creating Persona Bar Module.'));

    let namespaceRoot = this.props.namespaceRoot;
    let friendlyName = this.props.friendlyName;
    let currentDate = this.props.currentDate;

    let template = {
      ownerName: this.options.ownerName, /* NOT USED */
      companyName: this.options.companyName, /* NOT USED */
      currentDate: this.props.currentDate,
      extensionType: this.props.extensionType,
      fullNamespace: this.props.fullNamespace,
      namespaceRoot: namespaceRoot,
      friendlyName: this.props.friendlyName,
      msBuildVersion: this.props.msBuildVersion, 
      extensionDescription: this.props.extensionDescription,
      companyUrl: this.options.companyUrl,
      emailAddress: this.options.emailAddress,
      currentYear: currentDate.getFullYear(),
      version: '1.0.0',
      menuLinkName: this.props.menuLinkName, /* NOT USED */
      parentMenu: this.props.parentMenu,
      dnnBuildVersion: this.props.dnnBuildVersion,
      dnnBuildVersionShort: this.props.dnnBuildVersionShort,
      hccBuildVersion: this.props.hccBuildVersion,
      hccBuildVersionShort: this.props.hccBuildVersionShort
    };

    // Do all regular copies
    this.fs.copyTpl(
      this.templatePath('../../common/build/*.*'),
      this.destinationPath(friendlyName + '/_BuildScripts/'),
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

    this.fs.copyTpl(
      this.templatePath('common/.eslintrc.js'),
      this.destinationPath(friendlyName + '/.eslintrc.js'),
      template
    );

    // Do all templated copies
    this.fs.copyTpl(
      this.templatePath('../../common/src/**'),
      this.destinationPath(friendlyName + '/src/'),
      template
    );
    this.fs.copyTpl(
      this.templatePath('../../common/csproj/App_LocalResources/_Module.resx'),
      this.destinationPath(friendlyName + '/App_LocalResources/' + friendlyName + '.resx'),
      template
    );
    this.fs.copyTpl(
      this.templatePath('common/src/Resources/css/_Module.css'),
      this.destinationPath(friendlyName + '/src/css/' + friendlyName + '.css'),
      template
    );
    this.fs.copyTpl(
      this.templatePath('common/src/Resources/scripts/_Module.js'),
      this.destinationPath(friendlyName + '/src/scripts/' + friendlyName + '.js'),
      template
    );
    this.fs.copyTpl(
      this.templatePath('common/src/View.html'),
      this.destinationPath(friendlyName + '/src/' + friendlyName + '.html'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('common/manifest.dnn'),
      this.destinationPath(friendlyName + '/' + friendlyName + '.dnn'),
      template
    );

    this.fs.copyTpl(
      this.templatePath('../../common/csproj/_Project.csproj'),
      this.destinationPath(friendlyName + '/' + friendlyName + '.csproj'),
      template
    );

    this.fs.copyTpl(
      this.templatePath(this.props.pbType + '/_BuildScripts/**'),
      this.destinationPath(friendlyName + '/_BuildScripts/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath(this.props.pbType + '/src/**'),
      this.destinationPath(friendlyName + '/src/'),
      template
    );

    this.fs.copyTpl(
      this.templatePath(this.props.pbType + '/package.json'),
      this.destinationPath(friendlyName + '/package.json'),
      template
    );

    this.fs.copyTpl(
      [this.templatePath('common/MenuControllers/**')],
      this.destinationPath(friendlyName + '/'),
      template
    );

    this._writeBabelRc();
    this._writeJsConfig();

    // Extend package.json file in destination path
    const pkgJson = {
      devDependencies: {
        '@babel/core': '^7.2.2',
        '@babel/plugin-proposal-class-properties': '^7.2.1',
        '@babel/plugin-proposal-object-rest-spread': '^7.2.0',
        '@babel/plugin-transform-object-assign': '^7.2.0',
        '@babel/polyfill': '^7.2.5',
        '@babel/preset-env': '^7.2.0',
        '@babel/preset-react': '^7.0.0',
        // eslint-disable-next-line prettier/prettier
        'archiver': '^3.0.0',
        'babel-loader': '^8.0.4',
        'babel-plugin-transform-react-remove-prop-types': '^0.4.21',
        'copy-webpack-plugin': '^4.6.0',
        'create-react-class': '^15.6.3',
        'css-loader': '^2.0.1',
        // eslint-disable-next-line prettier/prettier
        'dotenv': '^6.2.0',
        // eslint-disable-next-line prettier/prettier
        'eslint': '^5.8.0',
        'eslint-loader': '^2.1.1',
        'eslint-plugin-react': '^7.11.1',
        'eslint-plugin-spellcheck': '^0.0.11',
        'html-webpack-plugin': '^3.2.0',
        // eslint-disable-next-line prettier/prettier
        'marked': '^0.5.2',
        'node-sass': '^4.11.0',
        'react-hot-loader': '^4.3.12',
        'sass-loader': '^7.1.0',
        'style-loader': '^0.23.1',
        // eslint-disable-next-line prettier/prettier
        'webpack': '^4.27.1',
        'webpack-cli': '^3.1.2',
        'webpack-dev-server': '^3.1.10',
        'webpack-node-externals': '^1.7.2'
      },
      dependencies: {
        '@dnnsoftware/dnn-react-common': '^2.0.10',
        'prop-types': '^15.6.2',
        // eslint-disable-next-line prettier/prettier
        'react': '^16.6.3',
        'react-dom': '^16.6.3'
      }
    };

    this.fs.extendJSON(this.destinationPath(friendlyName + '/package.json'), pkgJson);
  }

  install() {
    this._writeSolution();
    this._addProjectToSolution();
    this._defaultInstall();
  }

  end() {
    this.log(chalk.white('Installed Dependencies.'));
    this.log(chalk.white('Running dotnet restore.'));
    this.spawnCommand('dotnet', ['restore']);
    process.chdir('../');
    this.log(chalk.white('All Ready!'));
  }
};
