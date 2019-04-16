# generator-upendodnn [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Dependency Status][daviddm-image]][daviddm-url]  

> Scaffolds DNN extensions, including Modules (Webforms, SPA, and MVC), Persona Bar, Skin Object, Library, Scheduler, and Hotcakes Commerce projects (based on [generator-dnn](https://github.com/mtrutledge/generator-dnn) built by Matt Rutledge).  

<div align="center">
<iframe width="560" height="315" src="https://www.youtube.com/embed/ZD1p5DDlY2E" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
</div>

## Installation  

First, install [Yeoman](http://yeoman.io) and generator-upendodnn using [npm](https://www.npmjs.com/) (we assume you have pre-installed [node.js](https://nodejs.org/)).  

Warning: You may need to [add the user path to your Environmental Variables](https://superuser.com/questions/949560/how-do-i-set-system-environment-variables-in-windows-10).  Here is an example from Windows 10 (you'd replace your username):

`C:\Users\yourUsername\AppData\Roaming\npm`

You also need to install the latest version of MSBuild if you don't already have it installed.

* [Build tools for Visual Studio 2017](https://visualstudio.microsoft.com/downloads/#build-tools-for-visual-studio-2017)  
* [Build tools for Visual Studio 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48159)  
* [Build tools for Visual Studio 2013](https://www.microsoft.com/en-us/download/details.aspx?id=40760)  

Now, simply run the following commands:

```bash
npm install -g yo
npm install -g yarn
npm install -g generator-upendodnn
```

Then generate your new project:

```bash
mkdir my-project-name
cd my-project-name
yo upendodnn
```

You're intended to first create the `Solution Structure` if you haven't yet done so in this directory.

[More verbose instructions on how to use this.](http://www.dnnsoftware.com/community-blog/cid/155574/create-a-dnn-module-in-less-than-2-minutes)  

## Getting To Know Yeoman  

 * Yeoman has a heart of gold.  
 * Yeoman is a person with feelings and opinions, but is very easy to work with.  
 * Yeoman can be too opinionated at times but is easily convinced not to be.  
 * Feel free to [learn more about Yeoman](http://yeoman.io/).  
 
## Video Overview

* [DNN: Building Enterprise & Team Friendly Solutions & Extensions with UpendoDNN](https://www.youtube.com/watch?v=ZD1p5DDlY2E)

## More Documentation  

Want to learn more or how to build the generator code locally?  

[Original Project Documentation](https://mtrutledge.github.io/generator-dnn/)  

## License  

MIT © 2018 [Matt Rutledge]()  

MIT © 2019 [Upendo Ventures, LLC](https://upendoventures.com)  


[npm-image]: https://badge.fury.io/js/generator-dnn.svg
[npm-url]: https://npmjs.org/package/generator-dnn
[travis-image]: https://travis-ci.org/mtrutledge/generator-dnn.svg?branch=master
[travis-url]: https://travis-ci.org/mtrutledge/generator-dnn
[daviddm-image]: https://david-dm.org/mtrutledge/generator-dnn.svg?theme=shields.io
[daviddm-url]: https://david-dm.org/mtrutledge/generator-dnn
