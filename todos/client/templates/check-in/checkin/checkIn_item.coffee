Template.checkIn_item.onCreated ->
	@isSaving = new ReactiveVar false
	@isError = new ReactiveVar false
	@isSuccess = new ReactiveVar false
	@isDisabled = not (PrivilegesUtils.canAddCheckins() or PrivilegesUtils.isCheckinStillEditable(@data));

Template.checkIn_item.onRendered ->
	self = this

	manage = (key, selector)->
		if self.data.data and self.data.data[key] then self.$(selector).attr("checked", "checked");
		if self.isDisabled then self.$(selector).attr("disabled", "disabled");
	manage "hk", ".HK"
	manage "prc", ".PRC"
	manage "oc", ".OC"
	manage null, ".remark"



	if !self.isDisabled
		@onInput = _.debounce(
			->
				self.serializeAndSave()
			,1000)

		@serializeAndSave = ->
			self.isSaving.set true
			self.isError.set false
			self.isSuccess.set false
			val =
				hk: self.$(".HK").is(":checked")
				prc: self.$(".PRC").is(":checked")
				oc: self.$(".OC").is(":checked")
				remark: self.$(".remark").val()
			Checkins.update self.data._id, {$set: {data: val}}, (error, _id)->
				self.isSaving.set false
				if error
					self.isError.set true
					msg = if error.reason then error.reason else error.message;
					GlobalUI.errorToast(msg);
				else
					self.isSuccess.set true



Template.checkIn_item.helpers
	date: ->
		moment(this.date).format "dddd, Do"
	isError: ->
		Template.instance().isError.get()
	isSaving: ->
		Template.instance().isSaving.get()
	isSuccess: ->
		Template.instance().isSuccess.get()
	checked: (v)->
		if this.data
			return if this.data[v] then "checked"

Template.checkIn_item.events
	'change input[type=checkbox]': (e, t) ->
		t.serializeAndSave()
	'input tr': (e, t) ->
		t.onInput()
