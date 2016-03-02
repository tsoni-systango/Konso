class DataRecord
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  store_in collection: "dataRecord"
  # field :workcenterCode
  # field :workcenterName
  # field :machineIP
  # field :machineName
  # field :isCounter
  # field :currentStatus
  # field :workorderNo
  # field :partno
  # field :partnoName
  # field :sequenceNo
  # field :deviceNo
  field :startTime,   :type => DateTime
  field :endTime,     :type => DateTime
  # field :personCount
  # field :StandardWorkTime
  field :recordTime,  :type => DateTime
  # field :functionCode
  # field :functionName
  # field :remark
end
