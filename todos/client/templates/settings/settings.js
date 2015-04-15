Template.settings.created = function(){
    this.embeddedPosition = new ReactiveVar({bottom: 0, right: 0});
    this.embeddedHeight = new ReactiveVar(400);
    this.embeddedWidth = new ReactiveVar(256);
}
Template.settings.helpers({
    scriptContent: function(){
        return '<script>var IM_CHAT_WIDGET_EMBEDDED = {'+
            'url: "'+Meteor.absoluteUrl('embedded')+'",width: '+Template.instance().embeddedWidth.get()
            +',height: '+
            Template.instance().embeddedHeight.get()+',position: '+JSON.stringify(Template.instance().embeddedPosition.get())+'}'+
            '</script><script src="'+Meteor.absoluteUrl('embedded/widget/chat.embedded.js')+'"></script>'
    }
});
Template.settings.events({
    "change paper-radio-button": function(e,t){
        var currPos = t.embeddedPosition.get();
        var pos = $(e.currentTarget).attr("name");
        if(pos === "top" || pos === "bottom"){
            delete currPos.top;
            delete currPos.bottom;
            currPos[pos] = 0;
        } else if(pos === "right" || pos === "left"){
            delete currPos.right;
            delete currPos.left;
            currPos[pos] = 0;
        }
        t.embeddedPosition.set(currPos);
    },
    "immediate-value-change .embedded-width": function(e, t){
        t.embeddedWidth.set(e.currentTarget.immediateValue);
    },
    "immediate-value-change .embedded-height": function(e, t){
        t.embeddedHeight.set(e.currentTarget.immediateValue);
    }
})