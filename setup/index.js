'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');
var nodegit = require('nodegit');

module.exports = yeoman.generators.Base.extend({
    initializing: function() {
        this.log(yosay(chalk.bgGreen.black('Velkommen til #bord4') + '\n' + chalk.cyan('La oss gjøre deg klar til å bruke generatoren.')));
        console.log(this.config.getAll());
    },
    prompting: {
        isRoot: function() {
            var done = this.async();
            this.prompt({
                type: 'confirm',
                name: 'isRoot',
                message: 'Er ' + this.destinationRoot() + ' hvor generatorprosjektene dine skal lages?',
                default: true
            }, function(props) {
                if (props.isRoot === false) {
                    console.log();
                    console.log();
                    console.log(chalk.red('**** FEIL **** FEIL **** FEIL **** FEIL ****'));
                    console.log(chalk.red('*'));
                    console.log(chalk.red('*  Setup må kjøres fra rotkatalogen til generatorprosjektene dine.'));
                    console.log(chalk.red('*'));
                    console.log(chalk.red('**** FEIL **** FEIL **** FEIL **** FEIL ****'));
                    console.log();
                    console.log();
                    process.exit();
                } else {
                    done();
                }
            });
        },
        setVars: function() {
            var done = this.async();
            var prompts = [{
                type: 'input',
                name: 'githubUser',
                message: '(1/8) Hva er brukernavnet ditt på Github?',
                store: true
            }, {
                type: 'input',
                name: 'appTemplateRepo',
                message: '(2/8) URL til github repository for app-template?',
                default: 'https://github.com/BergensTidende/bord4-app-template',
                store: true
            }, {
                type: 'input',
                name: 'dailyTemplateRepo',
                message: '(3/8) URL til github repository for app-template?',
                default: 'https://github.com/BergensTidende/bord4-daily-template',
                store: true
            }, {
                type: 'input',
                name: 'dailyStorageRepo',
                message: '(4/8) URL til github repository daily graphics storage?',
                store: true
            }, {
                type: 'input',
                name: 'folderAppTemplate',
                message: '(5/8) Mappenavn for app-template?',
                default: 'bord4-app-template',
                store: true
            }, {
                type: 'input',
                name: 'folderDailyTemplate',
                message: '(6/8) Mappenavn for daily-template?',
                default: 'bord4-daily-template',
                store: true
            }, {
                type: 'input',
                name: 'folderDailyGraphics',
                message: '(7/8) Mappenavn for daily graphics storage? (Må bruke ssh clone url om den er privat)',
                default: 'daily-graphics-storage',
                store: true
            },{
                type: 'input',
                name: 'repository',
                message: '(8/8) URL til github-kontoen nye prosjekter skal sjekkes inn til?',
                store: true
            }];
            this.prompt(prompts, function(props) {
                this.githubUser = props.githubUser;
                this.appTemplateRepo = props.appTemplateRepo;
                this.dailyTemplateRepo = props.dailyTemplateRepo;
                this.dailyStorageRepo = props.dailyStorageRepo;
                this.folderAppTemplate = props.folderAppTemplate;
                this.folderDailyTemplate = props.folderDailyTemplate;
                this.folderDailyGraphics = props.folderDailyGraphics;
                this.repository = props.repository;
                done();
            }.bind(this));
        }
    },
    config: function() {
        this.config.set('githubUser', this.githubUser);
        this.config.set('appTemplateRepo', this.appTemplateRepo);
        this.config.set('dailyTemplateRepo', this.dailyTemplateRepo);
        this.config.set('dailyStorageRepo', this.dailyStorageRepo);
        this.config.set('folderAppTemplate', this.folderAppTemplate);
        this.config.set('folderDailyTemplate', this.folderDailyTemplate);
        this.config.set('folderDailyGraphics', this.folderDailyGraphics);
        this.config.set('repository', this.repository);
        this.config.save();
        this.log('Lagerer valgene dine så de kan brukes i generatoren.');
    },
    install: function() {
        var done = this.async();

        nodegit.Clone(this.appTemplateRepo, this.folderAppTemplate, {
                remoteCallbacks: {
                    certificateCheck: function() {
                        return 1;
                    }
                }
            })
            .catch(function(err) {
                console.log(err);
            })
            .done(function(appTemplateRepo) {
                if (appTemplateRepo instanceof nodegit.Repository) {
                    console.log('Klonet ' + this.appTemplateRepo + ' til mappen ' + this.folderAppTemplate);
                    nodegit.Clone(this.dailyTemplateRepo, this.folderDailyTemplate, {
                            remoteCallbacks: {
                                certificateCheck: function() {
                                    return 1;
                                }
                            }
                        })
                        .catch(function(err) {
                            console.log(err);
                        })
                        .done(function(dailyTemplateRepo) {
                            if (dailyTemplateRepo instanceof nodegit.Repository) {
                                console.log('Klonet ' + this.dailyTemplateRepo + ' til mappen ' + this.folderDailyTemplate);
                                nodegit.Clone(this.dailyStorageRepo, this.folderDailyGraphics, {
                                        remoteCallbacks: {
                                            certificateCheck: function() {
                                                return 1;
                                            },
                                            credentials: function(url, userName) {
                                                return nodegit.Cred.sshKeyFromAgent(userName);
                                            }
                                        }
                                    })
                                    .catch(function(err) {
                                        console.log(err);
                                    })
                                    .done(function(dailyStorageRepo) {
                                        if (dailyStorageRepo instanceof nodegit.Repository) {
                                            console.log('Klonet ' + this.dailyStorageRepo + ' til mappen ' + this.folderDailyGraphics);
                                            done();
                                        } else {
                                            console.error('Fæle ting skjedde under kloning av ' + this.dailyStorageRepo);
                                        }
                                    }.bind(this));
                            } else {
                                console.error('Fæle ting skjedde under kloning av ' + this.dailyTemplateRepo);
                            }
                        }.bind(this));
                } else {
                    console.error('Fæle ting skjedde under kloning av ' + this.appTemplateRepo);
                }
            }.bind(this));
    },
    end: {

    }
});
