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
          { name: 'Angular', value: 'Angular' },
          { name: 'ReactJS', value: 'ReactJS' },
          { name: 'Vue 2', value: 'VueJS' },
          { name: 'Vue 3', value: 'Vue3JS' }
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
          { name: 'ECMAScript (jsx)', value: 'jsx' },
          { name: 'TypeScript (tsx)', value: 'tsx' }
        ]
      },
      {
        when: !this.options.friendlyName,
        type: 'input',
        name: 'friendlyName',
        message: 'What is the name of your SPA Module?',
        default: this.appname, /*to-do: figure out if we want to populate and actually use this later */
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.extensionDescription,
        type: 'input',
        name: 'extensionDescription',
        message: 'Describe your SPA module:',
        validate: str => {
          return str.length > 0;
        }
      },
      {
        when: !this.options.companyName,
        type: 'input',
        name: 'companyName',
        message: 'Namespace root for your SPA module (Usually a company name)?',
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
      props.extensionType = "Modules";
      props.fullNamespace = props.namespaceRoot + "." + props.extensionType + "." + props.friendlyName;
      props.guid = this._generateGuid();
      props.msBuildVersion = msBuildVersion;

      this.props = props;
    });
  }

  writing() {
    this.log(
      chalk.white(`Creating ${this.props.spaType} ${this.props.langType ? this.props.langType : ""} SPA Module.`)
    );

    // mod: this follows the Upendo development/solution pattern
    this.destinationRoot("Modules/");

    let spaType = this.props.spaType;
    let spaPath = spaType === "ReactJS" ? `${this.props.spaType}/${this.props.langType}` : `${this.props.spaType}/`;

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
      namespaceRoot: namespaceRoot,
      friendlyName: this.props.friendlyName,
      extensionDescription: this.props.extensionDescription,
      companyUrl: this.options.companyUrl,
      emailAddress: this.options.emailAddress,
      currentYear: currentDate.getFullYear(),
      version: '01.00.00',
      extensionType: this.props.extensionType,
      fullNamespace: this.props.fullNamespace,
      guid: this.props.guid,
      localhost: this.options.dnnHost,
      dnnRoot: this.options.dnnRoot,
      msBuildVersion: this.props.msBuildVersion
    };

    if (spaType === "ReactJS") {
      this.fs.copyTpl(
        this.templatePath('../../common/build/*.*'),
        this.destinationPath(friendlyName + '/_BuildScripts'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/_BuildScripts/**'),
        this.destinationPath(friendlyName + '/_BuildScripts/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + '/_BuildScripts/**'),
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
        this.templatePath('common/App_LocalResources/**'),
        this.destinationPath(friendlyName + '/App_LocalResources/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/Components/**'),
        this.destinationPath(friendlyName + '/Components/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/Controllers/**'),
        this.destinationPath(friendlyName + '/Controllers/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/Data/**'),
        this.destinationPath(friendlyName + '/Data/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/ViewModels/**'),
        this.destinationPath(friendlyName + '/ViewModels/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/Providers/**'),
        this.destinationPath(friendlyName + '/Providers/'),
        template
      );

      // Do all templated copies
      this.fs.copyTpl(
        this.templatePath('../../common/src/**'),
        this.destinationPath(friendlyName + '/src/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/src/**'),
        this.destinationPath(friendlyName + '/src/'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + '/**/*.*'),
        this.destinationPath(friendlyName + '/.'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/RouteConfig.cs'),
        this.destinationPath(friendlyName + '/RouteConfig.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/Constants.cs'),
        this.destinationPath(friendlyName + '/Constants.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/manifest.dnn'),
        this.destinationPath(friendlyName + '/' + friendlyName + '.dnn'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/symbols.dnn'),
        this.destinationPath(friendlyName + '/' + friendlyName + '_Symbols.dnn'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/License.txt'),
        this.destinationPath(friendlyName + '/License.txt'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/ReleaseNotes.txt'),
        this.destinationPath(friendlyName + '/ReleaseNotes.txt'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaType + '/common/Module.csproj'),
        this.destinationPath(friendlyName + '/' + fullNamespace + '.csproj'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaType + '/common/Module.build'),
        this.destinationPath(friendlyName + '/Module.build'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/Data/ModuleContext.cs'),
        this.destinationPath(friendlyName + '/Data/' + friendlyName + 'Context.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/package.json'),
        this.destinationPath(friendlyName + '/package.json'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('../../common/branding/Images/**'),
        this.destinationPath(friendlyName + '/Images'),
        template
      );

      this._writeBabelRc();

      const pkgJson = {
        devDependencies: {
          "@babel/plugin-proposal-object-rest-spread": "^7.20.7",
          "@babel/plugin-transform-object-assign": "^7.22.5",
          "@babel/core": "^7.22.5",
          "@babel/preset-env": "^7.22.5",
          "@babel/preset-react": "^7.22.5",
          // eslint-disable-next-line prettier/prettier
          'archiver': '^3.0.0',
          "babel-loader": "^9.1.2",
          'browser-sync': '^2.26.3',
          // eslint-disable-next-line prettier/prettier
          "babel-plugin-transform-react-remove-prop-types": "^0.4.24",
          'chokidar': '^3.5.3',
          // eslint-disable-next-line prettier/prettier
          'concurrently': '^8.2.0',
          "copy-webpack-plugin": "^11.0.0",
          "css-loader": "^6.8.1",
          "file-loader": "^6.2.0",
          // eslint-disable-next-line prettier/prettier
          'dotenv': '^6.2.0',
          'fs-extra': '^7.0.1',
          "html-webpack-plugin": "^5.5.1",
          // eslint-disable-next-line prettier/prettier
          'marked': '^4.3.0',
          "sass": "^1.63.2",
          "sass-loader": "^13.3.1",
          "style-loader": "^3.3.3",
          // eslint-disable-next-line prettier/prettier
          "webpack": "^5.86.0",
          "webpack-cli": "^5.1.4",
          "webpack-dev-server": "^4.15.0",
          "@testing-library/dom": "^7.21.4"
        },
        dependencies: {
          "@testing-library/jest-dom": "^5.16.5",
          "@testing-library/react": "^13.4.0",
          "@testing-library/user-event": "^13.5.0",
          "react": "^18.2.0",
          "react-dom": "^18.2.0",
          "web-vitals": "^2.1.4"
        }
      };

      if (this.props.langType === 'jsx') {
        this._writeJsConfig();

        this.fs.copyTpl(
          this.templatePath(spaPath + '/.eslintrc.js'),
          this.destinationPath(friendlyName + '/.eslintrc.js'),
          template
        );

        pkgJson.devDependencies = {
          ...pkgJson.devDependencies,
          // eslint-disable-next-line prettier/prettier
          'eslint': '^8.42.0',
          'eslint-plugin-react': '^7.32.2',
        };
      } else {
        this._writeTsConfig();

        this.fs.copyTpl(
          this.templatePath(spaPath + '/tslint.json'),
          this.destinationPath(friendlyName + '/tslint.json'),
          template
        );

        pkgJson.devDependencies = {
          ...pkgJson.devDependencies,
          "@types/react": "^18.2.9",
          "@types/react-dom": "^18.2.4",
          "ts-loader": "^9.4.3",
          "typescript": "^5.1.3",
        };
      }

      // Extend package.json file in destination path
      this.fs.extendJSON(this.destinationPath(friendlyName + '/package.json'), pkgJson);

      let launchJsonConfig = {
        type: 'chrome',
        request: 'launch',
        name: 'Launch Chrome against ' + friendlyName,
        url: 'http://localhost:3000',
        // eslint-disable-next-line no-template-curly-in-string
        webRoot: '${workspaceRoot}/' + friendlyName,
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
        this.destinationPath(friendlyName + '/' + fullNamespace + '.csproj'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + 'Module.dnn'),
        this.destinationPath(friendlyName + '/' + friendlyName + '.dnn'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + 'symbols.dnn'),
        this.destinationPath(friendlyName + '/' + friendlyName + '_Symbols.dnn'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + 'Data/ModuleContext.cs'),
        this.destinationPath(friendlyName + '/Data/' + friendlyName + 'Context.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + 'common/**'),
        this.destinationPath(friendlyName + '/.'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('../../common/branding/Images/**'),
        this.destinationPath(friendlyName + '/Images'),
        template
      );
    } else if (spaType === "Vue3JS") {
      this.fs.copyTpl(
        this.templatePath(spaPath + 'Module.csproj'),
        this.destinationPath(friendlyName + '/' + fullNamespace + '.csproj'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + 'Module.dnn'),
        this.destinationPath(friendlyName + '/' + friendlyName + '.dnn'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + 'symbols.dnn'),
        this.destinationPath(friendlyName + '/' + friendlyName + '_Symbols.dnn'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + 'Data/ModuleContext.cs'),
        this.destinationPath(friendlyName + '/Data/' + friendlyName + 'Context.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + 'common/**'),
        this.destinationPath(friendlyName + '/.'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('../../common/branding/Images/**'),
        this.destinationPath(friendlyName + '/Images'),
        template
      );
    } else if (spaType === "Angular") {
      this.fs.copyTpl(
        this.templatePath('common/package.json'),
        this.destinationPath(friendlyName + '/package.json'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('../../common/branding/Images/**'),
        this.destinationPath(friendlyName + '/Images'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/Controllers/**'),
        this.destinationPath(friendlyName + '/Controllers'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/License.txt'),
        this.destinationPath(friendlyName + '/License.txt'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/ReleaseNotes.txt'),
        this.destinationPath(friendlyName + '/ReleaseNotes.txt'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/Components/**'),
        this.destinationPath(friendlyName + '/Components/.'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/ViewModels/**'),
        this.destinationPath(friendlyName + '/ViewModels/.'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/Constants.cs'),
        this.destinationPath(friendlyName + '/Constants.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/Data/Item.cs'),
        this.destinationPath(friendlyName + '/Data/Item.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/Data/ModuleContext.cs'),
        this.destinationPath(friendlyName + '/Data/' + friendlyName + 'Context.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/_BuildScripts/**'),
        this.destinationPath(friendlyName + '/_BuildScripts'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/src/Resources/**'),
        this.destinationPath(friendlyName + '/src/Resources/.'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/src/Settings.html'),
        this.destinationPath(friendlyName + '/src/Settings.html'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/App_LocalResources/**'),
        this.destinationPath(friendlyName + '/App_LocalResources'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/Providers/**'),
        this.destinationPath(friendlyName + '/Providers'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/manifest.dnn'),
        this.destinationPath(friendlyName + '/' + friendlyName + '.dnn'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/symbols.dnn'),
        this.destinationPath(friendlyName + '/' + friendlyName + '_Symbols.dnn'),
        template
      );

      this.fs.copyTpl(
        this.templatePath('common/RouteConfig.cs'),
        this.destinationPath(friendlyName + '/RouteConfig.cs'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + '/webpack.config.js'),
        this.destinationPath(friendlyName + '/webpack.config.js'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + '/Module.csproj'),
        this.destinationPath(friendlyName + '/' + fullNamespace + '.csproj'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + '/src/**'),
        this.destinationPath(friendlyName + '/src/.'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + '/Module.build'),
        this.destinationPath(friendlyName + '/' + 'Module.build'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + '/angular.json'),
        this.destinationPath(friendlyName + '/' + 'angular.json'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + '/tsconfig.app.json'),
        this.destinationPath(friendlyName + '/' + 'tsconfig.app.json'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + '/tsconfig.json'),
        this.destinationPath(friendlyName + '/' + 'tsconfig.json'),
        template
      );

      this.fs.copyTpl(
        this.templatePath(spaPath + '/tsconfig.spec.json'),
        this.destinationPath(friendlyName + '/' + 'tsconfig.spec.json'),
        template
      );

      const pkgJson = {
        "scripts": {
          "ng": "ng",
          "angular-build": "ng build --output-hashing none",
          "start": "ng run " + friendlyName + ":builddev --watch",
        },
        "dependencies": {
          "@angular/animations": "^14.0.0",
          "@angular/common": "^14.0.0",
          "@angular/compiler": "^14.0.0",
          "@angular/core": "^14.0.0",
          "@angular/forms": "^14.0.0",
          "@angular/platform-browser": "^14.0.0",
          "@angular/platform-browser-dynamic": "^14.0.0",
          "@angular/router": "^14.0.0",
          "rxjs": "~7.5.0",
          "tslib": "^2.3.0",
          "zone.js": "~0.11.4"
        },
        "devDependencies": {
          "@angular-builders/custom-webpack": "^14.1.0",
          "@angular-devkit/build-angular": "^14.2.1",
          "copy-webpack-plugin": "^11.0.0",
          "html-webpack-plugin": "^5.5.0",
          "@angular/cli": "~14.2.1",
          "@angular/compiler-cli": "^14.0.0",
          "@types/jasmine": "~4.0.0",
          "jasmine-core": "~4.3.0",
          "karma": "~6.4.0",
          "karma-chrome-launcher": "~3.1.0",
          "karma-coverage": "~2.2.0",
          "karma-jasmine": "~5.1.0",
          "karma-jasmine-html-reporter": "~2.0.0",
          "typescript": "~4.7.2"
        }
      }

      this.fs.extendJSON(this.destinationPath(friendlyName + '/package.json'), pkgJson);

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
