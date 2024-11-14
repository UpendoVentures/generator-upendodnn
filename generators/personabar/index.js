'use strict';
const DnnGeneratorBase = require('../lib/DnnGeneratorBase');
const chalk = require('chalk');
const constants = require('../lib/Constants');
const { removeLeadingZeros } = require('../lib/versionUtil');

module.exports = class extends DnnGeneratorBase {
  prompting() {
    const prompts = [
      {
        when: !this.options.pbType,
        type: 'list',
        name: 'pbType',
        message: 'What language do you want your Persona Bar Module to use?',
        choices: [{ name: 'Vue 3', value: 'Vue 3' }]
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
      } else {
        props.namespaceRoot = this._pascalCaseName(this.options.companyName);
      }
      if (props.friendlyName.endsWith(" -f")) {
        props.friendlyName = props.friendlyName.replace(" -f", "");
      } else {
        props.friendlyName = this._pascalCaseName(props.friendlyName);
      }
      props.fullNamespace = props.namespaceRoot + "." + props.friendlyName;
      props.dnnBuildVersion = constants.DNN_BUILD_VERSION;
      props.dnnBuildVersionShort = removeLeadingZeros(constants.DNN_BUILD_VERSION);
      props.hccBuildVersion = constants.HCC_BUILD_VERSION;
      props.hccBuildVersionShort = removeLeadingZeros(constants.HCC_BUILD_VERSION);
      props.guid = this._generateGuid();
      this.props = props;
    });
  }

  writing() {
    this.log(chalk.white(`Creating your new ${this.props.pbType} Persona Bar extension project.`));

    this.destinationRoot("Modules/");

    let pbType = this.props.pbType;
    let pbPath = "Vue3JS/";

    let namespaceRoot = this.props.namespaceRoot;
    let friendlyName = this.props.friendlyName;
    let currentDate = this.props.currentDate;
    let fullNamespace = this.props.fullNamespace;
    let guid = this.props.guid;

    let template = {
      ownerName: this.options.ownerName,
      companyName: this.options.companyName,
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
      version: '01.00.00',
      guid: this.props.guid,
      menuLinkName: this.props.menuLinkName,
      parentMenu: this.props.parentMenu,
      dnnBuildVersion: this.props.dnnBuildVersion,
      dnnBuildVersionShort: this.props.dnnBuildVersionShort,
      hccBuildVersion: this.props.hccBuildVersion,
      hccBuildVersionShort: this.props.hccBuildVersionShort
    };

    if (pbType === "Vue 3") {
      this.fs.copyTpl(
        this.templatePath(pbPath + 'Module.csproj'),
        this.destinationPath(friendlyName + '/' + fullNamespace + '.csproj'),
        template
      );
      this.fs.copyTpl(
        this.templatePath(pbPath + 'Module.dnn'),
        this.destinationPath(friendlyName + '/' + fullNamespace + '.dnn'),
        template
      );
      this.fs.copyTpl(
        this.templatePath(pbPath + 'symbols.dnn'),
        this.destinationPath(friendlyName + '/' + fullNamespace + '_Symbols.dnn'),
        template
      );
      this.fs.copyTpl(
        this.templatePath(pbPath + 'common/**'),
        this.destinationPath(friendlyName + '/.'),
        template
      );
      this.fs.copyTpl(
        this.templatePath(pbPath + 'personaBar/App_LocalResources/_Module.resx'),
        this.destinationPath(friendlyName + '/admin/personaBar/App_LocalResources/' + friendlyName + '.resx'),
        template
      );
      this.fs.copyTpl(
        this.templatePath(pbPath + 'personaBar/css/_Module.css'),
        this.destinationPath(friendlyName + '/admin/personaBar/css/' + friendlyName + '.css'),
        template
      );
      this.fs.copyTpl(
        this.templatePath(pbPath + 'personaBar/images/**'),
        this.destinationPath(friendlyName + '/admin/personaBar/images/.'),
        template
      );
      this.fs.copyTpl(
        this.templatePath(pbPath + 'personaBar/scripts/_Module.js'),
        this.destinationPath(friendlyName + '/admin/personaBar/scripts/' + friendlyName + '.js'),
        template
      );
      this.fs.copyTpl(
        this.templatePath(pbPath + 'personaBar/_Module.html'),
        this.destinationPath(friendlyName + '/admin/personaBar/' + friendlyName + '.html'),
        template
      );
    }
  }

  install() {
    this._writeSolution();
    this._restoreSolution();
    this._addProjectToSolution();
    this._installDependencies();
  }

  end() {
    this.log(chalk.white('All Ready!'));
  }
};
