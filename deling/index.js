'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs');

module.exports = yeoman.generators.Base.extend({
    initializing: function () {
        this.log(yosay(chalk.bgGreen.black('#bord4s dele generator ') + '\n' + chalk.cyan('Deles det ikke, virker det ikke.')));
    },

    askForPath: function () {
        var done = this.async();
        var prompts = [
        {
            name: 'path',
            message: 'Hva står bak /#!?/',
            default: ''
        }
        ];
        this.prompt(prompts, function (props) {
            this.path = props.path;
            done();
        }.bind(this));
    },

    createHtaccess: function () {
        var self = this;
        var done = this.async();
        var projectName = this._.last(this.destinationRoot().split(path.sep));
        this.baseurl = 'http://www.bt.no/spesial/'+ projectName + '/!#';
        var url = 'http://www.bt.no/spesial/'+ projectName + '/#!/$3';
        var htaccessContent = 'RewriteEngine On'+'\n';
        htaccessContent += 'RewriteCond %{QUERY_STRING} ^_escaped_fragment_=(.*)$'+'\n';
        htaccessContent += 'RewriteRule ^$ crawler.php [QSA,L]'+'\n';
        htaccessContent += 'RewriteRule ^(.*)([^c]+)!/(.+)$ ' + url + ' [R=301,L,NE]'+'\n';
        fs.writeFile(this.destinationPath('/.htaccess'), htaccessContent, function (err) {
            if (err) {
                self.log(err);
            }
            self.log('.htaccess er opprettet.');
            done();
        });
    },

    runTheComposerBaby: function () {
        var done = this.async();
        var self = this;
        var spawn = this.spawnCommand('composer', ['create-project', 'slim/slim-skeleton', 'api']);
        spawn.on('close', function (code) {
            self.log('Composert ferdig med kode ' + code);
            done();
        });
    },

    crateCrawler: function () {
        var done = this.async();
        this.log('Lager crawler.php. Kopierer fra ' + this.templatePath('/crawler.php') + ' til ' + this.destinationPath('/crawler.php'));
        if (this.path === '') {
            this.fragment = '\/(.*)\//';
        } else {
            this.fragment = '/\/'+this.path+'\/(.*)\//';
        }
        this.fs.copyTpl(this.templatePath('/crawler.php'), this.destinationPath('/crawler.php'), this);
        this.fs.commit(function() { done(); });
    },

    copyView: function () {
        var done = this.async();
        this.log('Kopierer fra ' + this.templatePath('/share.html') + ' til ' + this.destinationPath('/api/templates/share.html'));
        this.fs.copy(this.templatePath('/share.html'), this.destinationPath('/api/templates/share.html'));
        this.fs.commit(function() { done(); });
    }
});
