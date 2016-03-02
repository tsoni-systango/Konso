require 'bundler/setup'
Bundler.require
# require 'mongoid'
# # Load configurations
Mongoid.load!("mongoid.yml", :development)
# require 'ffaker'
Dir.glob(File.join('models', '*.rb')).each {|file| load file}
Dir.glob(File.join('fake_factories', '*.rb')).each {|file| load file}
# Dir.glob(File.join('*.rb')).each {|file| load file}
load 'config.rb'
