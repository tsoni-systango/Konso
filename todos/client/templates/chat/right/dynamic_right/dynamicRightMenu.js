Template.dynamicRightMenu.onCreated( function() {
    //TODO: select tab based on data
<<<<<<< HEAD
    this.currentTab = new ReactiveVar( "todos" );
=======
    this.currentTab = new ReactiveVar( "allUserList" );
>>>>>>> dc4bb5691af8479cd53380556e2c198d0e214061
});

Template.dynamicRightMenu.helpers({
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

Template.dynamicRightMenu.events({
    'click .nav-pills li': function( event, template ) {
        var currentTab = $( event.target ).closest( "li" );

        currentTab.addClass( "active" );
        $( ".nav-pills li" ).not( currentTab ).removeClass( "active" );

        template.currentTab.set( currentTab.data( "template" ) );
    }
});