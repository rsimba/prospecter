/** @jsx React.DOM */
var TemplatesMenu = require('./templates_menu.js.min.js');
var EditTemplateView = require('./edit_template.js.min.js');
var FollowupTimeline = require('./followup_timeline.js.min.js');

module.exports = React.createClass({
  // Campaign Detail
  getInitialState: function() {
    return {
      selectedTemplate: 0,
      templateDetailMode: false,
      editMode: false,
      followupDay: 0,
      templates:[],
      currentTemplate:'',
    }
  },

  componentDidMount: function() {
     thissss = this;
     company = JSON.stringify(JSON.parse(localStorage.currentUser).company)
     qry = 'where={"company":'+company+'}'
    $.ajax({
      url:'https://api.parse.com/1/classes/Templates',
      headers: appConfig.headers,
      data: qry,
      success: function(res) {
        //console.log(res.results)
        thissss.setState({templates: res.results})
      },
      error: function(err) {
        console.log('error')
        //console.log(err)
      }
    });
    /*
    $.ajax({
      url:'https://api.parse.com/1/classes/ProspectList',
      headers: appConfig.headers,
      data: qry,
      success: function(res) {
        //console.log(res.results)
        thissss.setState({templates: res.results})
      },
      error: function(err) {
        console.log('error')
        //console.log(err)
      }
    });
    */
  },

  returnToOverview: function() {
    this.props.toggleScreen('Campaigns')
  },

  render: function() {
    //console.log('campaign detail')
    //console.log(this.props.selectedCampaign)
    thiss = this;
    return (
      <div className="container" 
           style={{width:'100%',height:'100%',paddingLeft:0,paddingRight:0}}>
        <div style={{marginBottom:30}}>
        <h5 style={{marginTop:20,marginLeft:20}}>
          <a href="javascript:" onClick={this.returnToOverview} >Campaigns </a>
          <small>
            <i style={{marginLeft:10, marginRight:10}} 
               className="fa fa-chevron-right" />
          </small>
          {this.props.selectedCampaign.name}
        </h5>
        <h6 style={{marginLeft:20}}>
          <span className="text-muted">Prospect List:</span> &nbsp;
          {this.props.selectedCampaign.prospect_list.name}
        </h6>
        <a href="javascript:" 
          style={{float: 'right', marginTop: -35, marginRight: 30, display:'none'}}
           className="btn btn-success btn-sm">
          <i className="fa fa-envelope" /> Send!
        </a>
        </div>
          <div className="col-md-8 panel panel-default" 
               style={{height:'363px',paddingLeft:305,paddingTop:50,overflow:'auto',borderRight:0,borderRadius:0}}>
               <FollowupTimeline 
                  currentCampaign={this.props.selectedCampaign}
                  followups={this.props.selectedCampaign.followups} />
          </div>
          <div className="col-md-4" 
               style={{paddingLeft:0,paddingRight:0,height:363}}>
            <TemplatesMenu 
              templates={this.state.templates}
              toggleTemplateEditMenu={this.toggleTemplateEditMenu} />
          </div>

          {(this.state.templateDetailMode) ? <EditTemplateView 
            editMode={this.state.editMode}
            initialTemplateValues={this.state.currentTemplate}
            toggleTemplateEditMenu={this.toggleTemplateEditMenu}
            followupDay={this.state.followupDay} /> : "" }
      </div>
    );
  },

  toggleTemplateEditMenu: function(currentTemplate) {
    //console.log(this.getDOMNode())
    //console.log(currentTemplate)

    this.setState({
      currentTemplate: currentTemplate,
      templateDetailMode: !this.state.templateDetailMode,
    })
  }
});
