class Config < Settingslogic
  source Dir[File.join('config.yml')].first
  namespace "development"
end
