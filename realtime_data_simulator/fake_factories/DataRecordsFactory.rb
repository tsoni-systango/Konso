class DataRecordFactory
  attr_reader :no_of_data_records
  def initialize(arg)
    raise 'Must be a numeric and positive value.' unless (Float arg rescue nil) and (arg > 0)
    @no_of_data_records = arg.to_i
  end

  def start
    shop_floors = ShopFloorGroup.all.map {|group| group.shopfloor}.flatten
    work_centers = shop_floors.map { |shopfloor| shopfloor['workcenter'] }.flatten
    no_of_data_records.times do
      # sleep rand(5)
      create_record work_centers.sample
    end if work_centers.present?
  end

  def create_record random_workcenter
    DataRecord.create(
      :workcenterCode => random_workcenter["workcenterCode"],
      :workcenterName => random_workcenter["workcenterName"],
      :machineIP => FFaker::Internet.ip_v4_address,
      :machineName => "#{FFaker::NameCN.first_name} #{FFaker::NameCN.last_name}",
      :isCounter => Config::isCounter.sample,
      :currentStatus => Config::currentStatus.sample,
      :workorderNo => FFaker::PhoneNumber.imei,
      :partno => FFaker::Identification.drivers_license,
      :partnoName => FFaker::PhoneNumber.imei,
      :sequenceNo => FFaker::PhoneNumber.imei,
      :deviceNo => FFaker::PhoneNumber.imei,
      :startTime => FFaker::Time.date,
      :endTime => FFaker::Time.date,
      :personCount => rand(100),
      :StandardWorkTime => rand(200),
      :recordTime => Time.now,
      :functionCode => ["S#{rand(999)}", "C001"].sample,
      :functionName => FFaker::UnitMetric.volume_name,
      :remark => FFaker::SSNMX.imss
    )
  end
end
