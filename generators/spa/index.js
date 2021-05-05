'use strict';
const DnnGeneratorBase = require('../lib/DnnGeneratorBase');
const chalk = require('chalk');
const fs = require('fs');

module.exports = class extends DnnGeneratorBase {
  prompting() {
    const prompts = [
      {
        when: !this.options.spaType,
        type: 'list',
        name: 'spaType',
        message: 'What language do you want your SPA Module to use?',
        choices: [
          { name: 'ReactJS', value: 'ReactJS' },
          { name: 'VueJS', value: 'VueJS' },
          {
            name: chalk.gray('Angular'),
            value: 'angular',
            disabled: chalk.gray('Coming Soon')
          }
        ]
      },
      {
        when: function (response) {
          return response.spaType === 'ReactJS';
        },
        type: 'list',
        name: 'langType',
        message: 'What Script Language do you want to use?',
        choices: [
          { name: 'TypeScript (tsx)', value: 'tsx' },
          { name: 'ECMAScript (jsx)', value: 'jsx' }
        ]
      },
      {
        when: !this.options.company,
        type: 'input',
        name: 'company',
        message: 'Namespace for your SPA module (Usually a company name)?',
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
        message: 'What is the name of your SPA Module?',
        default: this.appname,
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.description,
        type: 'input',
        name: 'description',
        message: 'Describe your SPA module:',
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
      if (this.options.company.endsWith(" -f")) {
        props.namespace = this.options.company.replace(" -f", "");
      }
      else {
        props.namespace = this._pascalCaseName(this.options.company);
      }
      if (props.name.endsWith(" -f")) {
        props.moduleName = props.name.replace(" -f", "");
      }
      else {
        props.moduleName = this._pascalCaseName(props.name);
      }
      props.extensionType = "Modules";
      props.fullNamespace = props.namespace + "." + props.extensionType + "." + props.moduleName;
      props.guid = this._generateGuid();
      props.msBuildVersion = msBuildVersion;

      this.props = props;
    });
  }

  writing() {
    this.log(
      chalk.white(`Creating ${this.props.spaType} ${this.props.langType} SPA Module.`)
    );

    // mod: this follows the Upendo development/solution pattern
    this.destinationRoot("Modules/");

    let spaType = this.props.spaType;
    let spaPath = spaType === "ReactJS" ? `${this.props.spaType}/${this.props.langType}` : `${this.props.spaType}/`;

    let namespace = this.props.namespace;
    let moduleName = this.props.moduleName;
    let extensionName = this.props.moduleName;
    let currentDate = this.props.currentDate;
    let fullNamespace = this.props.fullNamespace;
    let objectPrefix = this.props.objectPrefix;
    let guid = this.props.guid;

    let template = {
      yourName: this.options.yourName,
      company: this.options.company,
      namespace: namespace,
      moduleName: moduleName,
      extensionName: extensionName,
      moduleFriendlyName: this.props.name,
      description: this.props.description,
      companyUrl: this.options.companyUrl,
      emailAddy: this.options.emailAddy,
      currentYear: currentDate.getFullYear(),
      version: '1.0.0',
      menuLinkName: this.props.menuLinkName,
      parentMenu: this.props.parentMenu,
      extensionType: this.props.extensionType,
      fullNamespace: this.props.fullNamespace,
      guid: this.props.guid,
      localhost: this.options.dnnHost,
      dnnRoot: this.options.dnnRoot,
      objectPrefix: this.props.objectPrefix,
      msBuildVersion: this.props.msBuildVersion
    };

    if (spaType === "ReactJS") {
      this.fs.copyTpl(
        this.templatePath('../../common/build/*.*'),
        this.destinationPath(moduleName + '/_BuildScripts'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/_BuildScripts/**'),
        this.destinationPath(moduleName + '/_BuildScripts/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + '/_BuildScripts/**'),
        this.destinationPath(moduleName + '/_BuildScripts/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('../../common/csproj/Providers/**'),
        this.destinationPath(moduleName + '/Providers'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('../../common/csproj/NuGet.config'),
        this.destinationPath(moduleName + '/NuGet.config'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/App_LocalResources/**'),
        this.destinationPath(moduleName + '/App_LocalResources/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/Components/**'),
        this.destinationPath(moduleName + '/Components/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/Controllers/**'),
        this.destinationPath(moduleName + '/Controllers/'),
        template
      );

      // Do all templated copies
      this.fs.copyTpl(
        this.templatePath('../../common/src/**'),
        this.destinationPath(moduleName + '/src/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/src/**'),
        this.destinationPath(moduleName + '/src/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + '/**/*.*'),
        this.destinationPath(moduleName + '/.'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/RouteConfig.cs'),
        this.destinationPath(moduleName + '/RouteConfig.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/manifest.dnn'),
        this.destinationPath(moduleName + '/' + moduleName + '.dnn'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('../../common/csproj/_Project.csproj'),
        this.destinationPath(moduleName + '/' + moduleName + '.csproj'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/package.json'),
        this.destinationPath(moduleName + '/package.json'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('../../common/branding/Images/**'),
        this.destinationPath(moduleName + '/Images'),
        template
      );

      this._writeBabelRc();

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
          'browser-sync': '^2.26.3',
          // eslint-disable-next-line prettier/prettier
          'chokidar': '^2.1.1',
          // eslint-disable-next-line prettier/prettier
          'concurrently': '^4.1.0',
          'copy-webpack-plugin': '^4.6.0',
          'css-loader': '^2.0.1',
          // eslint-disable-next-line prettier/prettier
          'dotenv': '^6.2.0',
          'fs-extra': '^7.0.1',
          'html-webpack-plugin': '^3.2.0',
          // eslint-disable-next-line prettier/prettier
          'marked': '^0.5.2',
          'node-sass': '^4.11.0',
          'sass-loader': '^7.1.0',
          'style-loader': '^0.23.1',
          // eslint-disable-next-line prettier/prettier
          'webpack': '^4.27.1',
          'webpack-cli': '^3.1.2',
          'webpack-dev-server': '^3.1.10',
          'webpack-node-externals': '^1.7.2'
        },
        dependencies: {
          'prop-types': '^15.6.2',
          // eslint-disable-next-line prettier/prettier
          'react': '^16.6.3',
          'react-dom': '^16.6.3'
        }
      };

      if (this.props.langType === 'jsx') {
        this._writeJsConfig();

        this.fs.copyTpl(
          this.templatePath(spaPath + '/.eslintrc.js'),
          this.destinationPath(moduleName + '/.eslintrc.js'),
          template
        );

        pkgJson.devDependencies = {
          ...pkgJson.devDependencies,
          // eslint-disable-next-line prettier/prettier
          'eslint': '^5.8.0',
          'eslint-loader': '^2.1.1',
          'eslint-plugin-react': '^7.11.1',
          'react-hot-loader': '^4.3.12'
        };
      } else {
        this._writeTsConfig();

        this.fs.copyTpl(
          this.templatePath(spaPath + '/tslint.json'),
          this.destinationPath(moduleName + '/tslint.json'),
          template
        );

        pkgJson.devDependencies = {
          ...pkgJson.devDependencies,
          '@types/react': '^16.0.34',
          '@types/react-dom': '^16.0.3',
          'ts-loader': '^5.3.3',
          // eslint-disable-next-line prettier/prettier
          'tslint': '^5.12.1',
          'tslint-loader': '^3.5.4',
          'tslint-react': '^3.6.0',
          // eslint-disable-next-line prettier/prettier
          'typescript': '^3.2.2',
        };
      }

      // Extend package.json file in destination path
      this.fs.extendJSON(this.destinationPath(moduleName + '/package.json'), pkgJson);

      let launchJsonConfig = {
        type: 'chrome',
        request: 'launch',
        name: 'Launch Chrome against ' + moduleName,
        url: 'http://localhost:3000',
        // eslint-disable-next-line no-template-curly-in-string
        webRoot: '${workspaceRoot}/' + moduleName,
        sourceMaps: true,
        trace: true
      };

      // For some reason json extend is throwing  a conflict. Use FS to do this outside of yeoman to avoid conflict message to user.
      let launchJsonPath = this.destinationPath('.vscode/launch.json');
      if (fs.existsSync(launchJsonPath)) {
        // eslint-disable-next-line handle-callback-err
        fs.readFile(launchJsonPath, function (err, data) {
          let json = JSON.parse(data);
          json.configurations.push(launchJsonConfig);
          fs.writeFileSync(launchJsonPath, JSON.stringify(json, null, 2));
        });
      } else {
        let launchJson = {
          version: '0.2.0',
          configurations: []
        };
        launchJson.configurations.push(launchJsonConfig);
        this.fs.extendJSON(launchJsonPath, launchJson);
      }
    } else if (spaType === "VueJS") {
      this.fs.copyTpl(
        this.templatePath(spaPath + 'Module.csproj'),
        this.destinationPath(moduleName + '/' + moduleName + '.csproj'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + 'Module.dnn'),
        this.destinationPath(moduleName + '/' + moduleName + '.dnn'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + 'symbols.dnn'),
        this.destinationPath(moduleName + '/' + moduleName + '_Symbols.dnn'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + 'Data/ModuleContext.cs'),
        this.destinationPath(moduleName + '/Data/' + moduleName + 'DataContext.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + 'common/**'),
        this.destinationPath(moduleName + '/.'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('../../common/properties/**'),
        this.destinationPath(moduleName + '/Properties/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('../../common/branding/Images/**'),
        this.destinationPath(moduleName + '/Images'),
        template
      );
    }
  }

  install() {
    if (this.props.spaType !== "VueJS")
      this._writeSolution();
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
