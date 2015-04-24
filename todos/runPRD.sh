meteor add meteorhacks:cluster
export CLUSTER_WORKERS_COUNT=auto
meteor add meteorhacks:kadira
export KADIRA_APP_ID=AngtEFXcKkyRsCofd
export KADIRA_APP_SECRET=91b585b9-925d-4211-9063-400ee06e01c9
meteor add meteorhacks:kadira-profiler
meteor --settings config.json --port 80
