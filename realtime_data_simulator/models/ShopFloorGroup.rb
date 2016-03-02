class ShopFloorGroup
  include Mongoid::Document
  include Mongoid::Attributes::Dynamic
  store_in collection: "shopfloor"

end
