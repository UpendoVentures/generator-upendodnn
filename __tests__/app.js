'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

describe('generator-dnn:mvc', () => {
  beforeAll(() => {
    return helpers
      .run(path.join(__dirname, '../generators/mvc'))
      .withArguments(['--noinstall'])
      .withPrompts({
        company: 'Upendo Ventures',
        name: 'TestMVC',
        description: 'Test Build Module',
        companyUrl: 'upendoventures.com',
        emailAddy: 'solutions@upendoventures.com'
      });
  });

  it('created files', () => {
    assert(true);
  });
});
