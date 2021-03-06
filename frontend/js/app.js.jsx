/** @jsx React.DOM */

/* TODO
 * 
 * - All count change, when prospect is archived
 * - When is list is chaanged from all and then returned to All prospects take a long     time to load
 * - Fix pagination issues
 *
 * - Parallelize Workers
 * - Scale up google scrape to hundreds of workers (heroku)
 *
 * - Company Shortcuts 
 * - Add ability to switch accounts for admins
 * - Add email uneditable email fields
 */

var Parse = require("../lib/parse-require.min.js")
var Prospects = require('./prospects.js.min.js');
var Feed = require('./home.js.min.js');
var DataTable = require('./prospects.js.min.js');
var MiningJob = require('./mining_job.js.min.js');
var Campaigns = require('./email.js.min.js');
var Analytics = require('./analytics.js.min.js');
var SignUp = require('./signup.js.min.js');
var Login = require('./login.js.min.js');
var LandingPage = require('./landing_page.js.min.js');
var LandingPage = require('./landing_page_concept.js.min.js');
var FreeTrial = require('./free_trial.js.min.js');
var Pricing = require('./pricing.js.min.js');
var Signals = require('./signals.js.min.js');
var MouseTrap = require('../lib/mousetrap.min.min.js')
var Headhesive = require('../lib/headhesive.min.js')
var UpgradePlanModal = require('./upgrade_plan_modal.js.min.js')
var OnboardingWizard = require('./onboarding_wizard.js.min.js')
var NewUserOnboardingWizard = require('./new_user_onboarding_wizard.js.min.js')
var LandingPageFeatures = require('./landing_page_features.js.min.js')
var LandingPageServices = require('./landing_page_services.js.min.js')
//var checkAuth = require('./auth.min.js')

var Home = React.createClass({
  getInitialState: function() {
    // num_of_pages
    console.log(this.props)
    return {prospects: [] , 
            currentPage: 1, 
            pages: 1, 
            count:"~", 
            prospectType:'Prospect', 
            //selectedScreen:'Prospects'}
            currentUser: JSON.parse(localStorage.currentUser),
            selectedScreen: this.props.selectedScreen}
  },

  componentDidUpdate: function() {
    currentUser = JSON.parse(localStorage.currentUser)
    days = moment().diff(moment(currentUser.createdAt),'days')
    if(days > 14 && currentUser.accountType == 'trial') {
      $('#upgradePlanModal').modal( {
        backdrop: 'static',
        keyboard: false
      })
    }
  },

  launchOnboardingWizard: function() {
    $("#onboardingWizardModal").modal()
  },

  launchNewUserOnboardingWizard: function() {
    $("#newUserOnboardingWizardModal").modal()
  },

  componentWillMount: function(){
    //console.debug('WILL MOUNT')
    checkAuth()
    var thiss = this;
    //console.debug(this.state.currentUser)
    $.ajax({
      url:'https://api.parse.com/1/classes/_User/'+thiss.state.currentUser.objectId,
      headers: appConfig.headers,
      success: function(res) {
        //console.debug('LOL')
        // Number of Prospects for user
        // Number of Lists
        // Number of Emails found
        localStorage.currentUser = JSON.stringify(res)
        console.log(res)
        Intercom('boot', {
          app_id: 'd37c2de5ffe27d69b877645351490517333437bf',
          email: res.email,
          created_at: 1234567890,
          name: 'John Doe',
          user_id: 'lol'
        });
      },
      error: function(err) {
        console.debug('error')
      }
    });
    // Intercom
    // Mixpanel
  },


  toggleScreen: function(e) {
    e.preventDefault()
    this.setState({selectedScreen : $(e.target).text().trim()})
  },

  logout: function() {
    localStorage.clear()
    location.href = "#get_started"
  },

  listDropdown: function() {
    console.log('dropdown')
    //$('.dropdown-menu').dropdown()
    $('.prospect-list-select').css('border-bottom-right-radius','0px')
    $('.prospect-list-select').css('border-bottom-left-radius','0px')
      
    $('.list-select-dropdown').css('border-top-left-radius','0px')
    $('.list-select-dropdown').css('border-top-right-radius','0px')
  },

  selectChange : function() {

  },

  stripeCheckout: function() {
    /*
    handler.open({
      name: 'Customero',
      description: 'Get 900 free email credits!',
      amount: 0,
      panelLabel: "Start Your Free Trial!",
      opened: function() {

      },
      closed: function() {
        console.log("closed")
        //location.reload()
      }
    });
    */
  },

  componentDidMount: function() {
    // Credit Card Verified Check
    localStorage.selectedProspects = "[]"
    currentUser = JSON.parse(localStorage.currentUser)
    if(!currentUser.creditCardVerified)
      this.stripeCheckout()
    //console.debug('DID MOUNT')
    currentUser = JSON.parse(localStorage.currentUser)
    days = moment().diff(moment(currentUser.createdAt),'days')
    if(days > 14 && currentUser.accountType == 'trial') {
      $('#upgradePlanModal').modal( {
        backdrop: 'static',
        keyboard: false
      })
    }
  },

  render: function() {
    //console.debug('APP RENDER')
    prospects = "choose btn btn-primary "
    companyProspects = "choose btn btn-primary "
    campaigns = "choose btn btn-primary "
    signals = "choose btn btn-primary "
    home = "choose btn btn-primary "

    switch (this.state.selectedScreen) {
      case 'Home':
        currentScreen = <Feed />
        //currentScreen = <Prospects><ProspectRow /></Prospects>
        home = "choose btn btn-primary app-active"
        location.href= "#home"
        break;
      case 'Prospects':
        currentScreen = <Prospects listClassName={'ProspectList'}
                                   className={'Prospect'}> 
                                   </Prospects>
        //currentScreen = <Prospects><ProspectRow /></Prospects>
        prospects = "choose btn btn-primary app-active"
        location.href= "#prospects"
        break;
      case 'Companies':
        currentScreen = <Prospects listClassName={'CompanyProspectList'}
                                   className={'CompanyProspect'} >
                        </Prospects>
                                    // paginationLimit
                                    // Add Lists
                                    // Adding Customizable Rows
                                    // Make Editable For NoSQL DataBases
        location.href= "#companies"
        companyProspects = "choose btn btn-primary app-active"
        break;
      case 'Mining Jobs':
        currentScreen = <MiningJob />
        break;
      case 'Analytics':
        currentScreen = <Analytics />
        break;
      case 'Campaigns':
        currentScreen = <Campaigns />
        campaigns = "choose btn btn-primary app-active"
        location.href= "#campaigns"
        break;
      case 'Signals':
        currentScreen = <Signals />
        signals = "choose btn btn-primary app-active"
        location.href= "#signals"
        break;
      case 'Strategies':
        currentScreen = <Signals />
        signals = "choose btn btn-primary app-active"
        location.href= "#strategies"
        break;
      case 'Settings':
        currentScreen = <Settings />
        break;
    }

    if(this.state.currentUser.accountType != "Staff"){
      signals = "dissappear"
      campaigns = "dissappear"
      if(companyProspects == "choose btn btn-primary app-active") {
        companyProspects = "choose btn btn-primary app-active right-btn-rounded"
      } else {
        companyProspects = "choose btn btn-primary right-btn-rounded"
      }
      if(prospects == "choose btn btn-primary app-active") {
        prospects = "choose btn btn-primary app-active left-btn-rounded"
      } else {
        prospects = "choose btn btn-primary left-btn-rounded"
      }
    }
      
    currentUser = JSON.parse(localStorage.currentUser)
    daysLeft = moment().diff(moment(currentUser.createdAt),'days')
    daysLeft = (daysLeft > 14) ? "" : (14 - daysLeft)+" days left. "

    if(currentUser.accountType != "trial")
      upgradeBtn = <a href="javascript:" 
            style={{marginTop:0, marginRight:10,
                    backgroundImage: 'linear-gradient(180deg, #0096ff 0%, #005dff 100%)' , backgroundImage: 'linear-gradient(#8add6d, #60b044)'}}
            className="btn btn-success btn-xs"
            onClick={this.upgradePlanModal}> 
            {daysLeft+"Upgrade Today!"}
          </a>
    else
      upgradeBtn = ""
    return (
      <div>
      <br/>
      <br/>
      <div className="container">
        <h1 style={{fontWeight:'bold',display:'inline',fontWeight:'100',color:'#1ca3fd'}}>
          <img src="build/img/network.png" 
            style={{ height:32,
              marginRight:5, }}
          />
          <span style={{fontWeight:'bold',fontSize:32,fontFamily:'Proxima-Nova' }}>Customero 
            <h6 className="beta-label">BETA</h6>
          </span>

          {upgradeBtn}
        </h1>
      <span style={{float:'right',display:'none'}}>
        <img src="build/img/user.png" style={{height:'40px',width:'40px',padding:'2px',marginTop:'5px',borderRadius:'23px',display:'inline'}} className="thumbnail"/>&nbsp;&nbsp;&nbsp; 
        <h6 style={{marginTop:'20px',float:'right',display:'inline'}}>Welcome </h6>
      </span>
      <span style={{float:'right', marginRight:'0px'}}>
        <h6 style={{marginTop:'20px',float:'right',display:'none',marginRight:'10px'}}><a href="#pricing" style={{color:'#1ca3fd'}}>Pricing</a></h6>
          <a href="javascript:" 
            style={{marginTop:15, float:'right',marginRight:10,
                    backgroundImage: 'linear-gradient(180deg, #0096ff 0%, #005dff 100%)' , backgroundImage: 'linear-gradient(#8add6d, #60b044)'}}
            className="btn btn-success btn-xs"
            onClick={this.downloadSocialProspecter}> 
            <i className="fa fa-download" /> &nbsp;
            Download Chrome Social Prospecter
          </a>
        <h6 style={{marginTop:'20px',float:'right',display:'inline', marginRight:10}}><a href="javascript:" onClick={this.logout} style={{color:'#1ca3fd'}}>
            <i className="fa fa-sign-out" />
            Logout</a></h6>
          <h6 style={{marginTop:'20px',float:'right',display:'inline', marginRight:'10px'}}> <a href="http://resources.customerohq.com/v1.0/discuss" style={{color:'#1ca3fd'}}>

              <i className="fa fa-question-circle" />
              <span style={{paddingLeft:2}}>{'Support'}</span>
        </a> </h6>
        <h6 style={{marginTop:'20px',float:'right',display:'inline', marginRight:'10px'}}> 
          <a href="javascript:"
             onClick={this.launchNewUserOnboardingWizard}
              style={{color:'#1ca3fd'}}>
              <i className="fa fa-magic" />
              <span style={{paddingLeft:2}}>Onboarding</span>
          </a> </h6>
        <h6 style={{marginTop:'20px',float:'right',display:'inline', marginRight:'10px'}}> 
          <a href="javascript:"
             onClick={this.launchOnboardingWizard}
              style={{color:'#1ca3fd'}}>
              <i className="fa fa-magic" />
              <span style={{paddingLeft:2}}>Tutorials</span>
          </a> </h6>

        <h6 style={{marginTop:'20px',float:'right',display:'inline', marginRight:'10px'}}> 
          <a href="http://resources.customerohq.com/v1.0/docs" style={{color:'#1ca3fd'}}>
              <i className="fa fa-book" />
              <span style={{paddingLeft:2}}>Resources</span>
          </a> </h6>
          <h6 style={{marginTop:'20px',float:'right',display:'inline', marginRight:'20px',display:'none'}}> 
            <a href="javascript:" style={{color:'#1ca3fd'}}>
              <i className="fa fa-bell" />
              <span style={{paddingLeft:2}}>Notifications </span>
              <div className="label notification-badge">0</div>
          </a></h6>
          <h6 style={{marginTop:'20px',float:'right',display:'inline', marginRight:'20px',display:'none'}}> 
            <a href="javascript:" style={{color:'#1ca3fd'}}>
              <i className="fa fa-cloud-download" />
              <span style={{paddingLeft:2}}>Mining Jobs </span>
              <div className="label notification-badge">0</div>
          </a></h6>
      </span>
      <br/>
      <br/>
        <div className="panel panel-default">
        <div id="navbar" className="panel-heading"> 

          <div className="btn-group col-md-offset-4" >
            <a href="javascript:" className={signals} style={{display:'block'}} onClick={this.toggleScreen}> 
                <i className="fa fa-line-chart" />&nbsp;Strategies
            </a>
            <a href="javascript:" className={home} style={{display:'none'}} onClick={this.toggleScreen}> 
                <i className="fa fa-home" />&nbsp;Home
            </a>
            <a href="javascript:" className={prospects} onClick={this.toggleScreen}> 
                <i className="fa fa-user" />&nbsp;Prospects
            </a>
            <a href="javascript:" className="choose btn btn-primary" style={{display:'none'}} onClick={this.toggleScreen}>
                <i className="fa fa-bar-chart-o" /> Analytics
            </a>
            <a href="javascript:" className="choose btn btn-primary" 
                  style={{width:162,display:'none'}}
                  onClick={this.toggleScreen}>
                <i className="fa fa-tasks" /> Mining Jobs &nbsp;
                <span className="label label-default">BETA</span>
            </a>
            <a href="javascript:" className={companyProspects} onClick={this.toggleScreen}>
                <i className="fa fa-building" /> Companies
            </a>
            <a href="javascript:" className={campaigns} style={{display:'block'}} onClick={this.toggleScreen}>
                <i className="fa fa-envelope" />&nbsp;Campaigns
            </a>
          </div>
        </div>

          {currentScreen}

        </div>
      </div>
      <UpgradePlanModal />
      <OnboardingWizard />
      <NewUserOnboardingWizard />
      </div>
    );
  },

  upgradePlanModal: function() {
    $('#upgradePlanModal').modal()
  },
  
  downloadSocialProspecter: function() {
    window.open('https://chrome.google.com/webstore/detail/customero-prospecter/ofcalkjbogaiipekcocdefjenclioeci')
  },

  deleteProspect: function(objectId, endpoint) {
    var filtered = _.filter(this.state.prospects, function(item) {
       return item.objectId != objectId
    });
    this.setState({prospects: filtered})

    $.ajax({
      url:'https://api.parse.com/1/classes/'+endpoint+'/'+objectId,
      type:'DELETE',
      headers: parse_headers,
      success: function(res) {
        console.log(res)
      },
      error: function(err) {
      }
    });
  }
});

var Workspace = Backbone.Router.extend({
  routes: {
    //landing_page
    "product/features"    : "features",
    "services"            : "services",
    
    // App
    ""            : "prospects",
    "get_started" : "landing_page",
    "free_trial"  : "free_trial",
    "signup"      : "signup",
    "login"       : "login",
    "pricing"     : "pricing",
    
    "home"        : "home",
    "signals"     : "signals",
    "strategies"  : "strategies",
    "prospects"   : "prospects",
    "companies"   : "companies",
    "campaigns"   : "campaigns",

    "prospects/p:page"       : "prospects",
    "prospects/list/:list"   : "prospects_list",

    "companies/p:page"       : "companies",
    "companies/list/:list"   : "companies_list",

    "signals/profile/:profile"  : "signals_profile",
    "signals/calendar/:profile" : "signals_calendar",

    "campaigns/followup_feed"      : "campaigns",
    "campaigns/sent_emails"         : "campaigns",
    "campaigns/template/:template" : "campaigns",
  },

  mainRoute: function(route) {
    console.log(route)
    currentUser = localStorage.getItem('currentUser')
    $('#content').html('')
    if (currentUser) 
      React.renderComponent(<Home selectedScreen={route} />, 
                            document.getElementById('content'));
    else
      location.href = "#get_started"
  },

  signals  : function() { this.mainRoute('Signals') },
  strategies  : function() { this.mainRoute('Strategies') },
  prospects: function() { this.mainRoute('Prospects') },
  companies: function() { this.mainRoute('Companies') },
  campaigns: function() { this.mainRoute('Campaigns') },

  feed: function() {
    this.mainRoute('Home')
  },

  home: function() {
    currentUser = localStorage.getItem('currentUser')
    if (currentUser) 
      React.renderComponent(<Home selectedScreen="Prospects"/>, 
                            document.getElementById('content'));
    else
      location.href = "#get_started"
  },
  landing_page: function() {
    React.renderComponent(LandingPage(), document.getElementById('content'));
  },
  features: function() {
    React.renderComponent(LandingPageFeatures(), document.getElementById('content'));
  },
  services: function() {
    React.renderComponent(LandingPageServices(), document.getElementById('content'));
  },
  free_trial: function() {
    React.renderComponent(FreeTrial(), document.getElementById('content'));
  },
  signup: function() {
    React.renderComponent(SignUp(), document.getElementById('content'));
  },
  login: function() {
    React.renderComponent(Login(), document.getElementById('content'));
  },
  pricing: function() {
    React.renderComponent(Pricing(), document.getElementById('content'));
  }
});

$(document).ready(function(){
  checkAuth()
  var workspace = new Workspace;
  Backbone.history.start();
  // Add to linkedin
  // Add To Base
});

/*
  $("#chartdiv").css({
    color:"white",
  })

  $(".amChartsInputField").css({
    "background-color": "rgba(0,0,0,0)",
    "border": "1px solid white",
    "border-radius": "5px"
  })
*/
