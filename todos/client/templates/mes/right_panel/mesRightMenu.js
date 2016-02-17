Template.mesRightMenu.onCreated( function() {
    //TODO: select tab based on data
    this.currentTab = new ReactiveVar( "visual_charts" );


});

Template.mesRightMenu.helpers({
    tab: function() {
        return Template.instance().currentTab.get();
    },
    tabData: function() {
        var tab = Template.instance().currentTab.get();

        var data = {
            "notes": [{ "name": "example" }],
            "todos": [{}],
            "files": [{}]
        };

        return data[ tab ];
        }
});

Template.mesRightMenu.events({
    'click .nav-pills li': function( event, template ) {
        var currentTab = $( event.target ).closest( "li" );

        currentTab.addClass( "active" );
        $( ".nav-pills li" ).not( currentTab ).removeClass( "active" );

        template.currentTab.set( currentTab.data( "template" ) );
    }
});