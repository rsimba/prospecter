/** @jsx React.DOM */

var PanelFooting = require('./panel_footing.js.min.js')
var SignalProfile = require('./signal_profile.js.min.js')
var SignalLoading = require('./signal_loading.js.min.js')
var MiningJobLoading = require('./mining_job_loading.js.min.js')
var CompanySignalCard = require('./company_signal_card.js.min.js')
var PeopleSignalCard = require('./people_signal_card.js.min.js')
var SignalCalendar = require('./signal_calendar.js.min.js')
var MiningJobCalendar = require('./mining_job_calendar.js.min.js')
var SignalsDetail = require('./signal_detail.js.min.js')
var TerritoryOverview = require('./territory_overview.js.min.js')
var TerritoryDetail = require('./territory_detail.js.min.js')
var MiningJobDetail = require('./mining_job_detail.js.min.js')
var SignalAnalytics = require('./signal_analytics.js.min.js')
var SignalApps = require('./signal_apps.js.min.js')

var CreateHiringSignalModal = require('./create_hiring_signal_modal.js.min.js')
var CreateFundingSignalModal = require('./create_funding_signal_modal.js.min.js')
//var CreateProspectProfileModal = require('./create_prospect_profile_modal.js.min.js')
var CreateCompanyProfileModal = require('./create_company_profile_modal.js.min.js')
var CreateTerritoryStrategyModal = require('./create_territory_strategy_modal.js.min.js')
var CreateMiningJobModal = require('./create_mining_job_modal.js.min.js')
var CreateProspectListFromCompanyListModal = require('./create_prospect_list_from_company_list.js.min.js')
var CreateProspectProfileModal = require('./create_title_mining_job.js.min.js')
var CreateCompanyMiningJobModal = require('./create_company_mining_job.js.min.js')
var CreatePressSignalModal = require('./create_company_mining_job.js.min.js')
var CreateEmployeeMiningJobModal = require('./create_employee_mining_job.js.min.js')
var CreatePressSignalModal = require('./create_press_signal_modal.js.min.js')
/* Loading Stuff */

module.exports = React.createClass({
  getInitialState: function() {
    return {
      signalType: 'CompanySignal',
      currentProfile: {name:'All'},
      currentProfileObjectId: {},
      currentProfileReport: {},
      signals: [],
      pressSignal:"",
      pressSignalObjectId: {},
      currentView: 'Apps',
      profiles: [],
    }
  },

  setCurrentReport: function(newProfileReport) {
    console.log('NEW REPORT')
    console.log(newProfileReport)

    this.setState({ 
      currentView:'Detail',
      currentProfileReport: newProfileReport 
    })
  },

  setCurrentPressSignal: function(signal, signal_id) {
    this.setState({
      pressSignal: signal,
      pressSignalObjectId: signal_id
    })
    console.debug(signal)
    console.debug(signal_id)
  },

  setReport: function(view, report) {
    console.log('setReport')
    this.setState({currentView:view, currentProfileReport: report}) 
  },

  prospectSignalReport: function(profile, report) {
    profiles = _.map(this.state.profiles, function(_profile) {
                  if(_profile.objectId == profile.objectId){
                    reports = _.map(_profile.reports, function(_report) {
                                if(_report.objectId == report.objectId){
                                  _report.prospected = true
                                  return _report
                                }
                                return _report
                              })
                    _profile.reports = reports
                    return _profile
                  }
                  return _profile
                })
                //console.log(profiles)
    this.setState({profiles: profiles})
    $.ajax({
      url:'https://api.parse.com/1/classes/SignalReport/'+report.objectId,
      type:'PUT',
      headers:appConfig.headers,
      data:JSON.stringify({prospected:moment().valueOf()/1000}),
      success: function(res) {},
      error: function(err) {}
    })
  },

  setCurrentView: function(newSignalView) {
    console.log("VIEW")
    console.log(newSignalView)
    this.setState({currentView: newSignalView})
  },

  render: function() {
    currentProfile = this.state.currentProfile
    reports = this.state.currentProfile.reports
    reports = (reports) ? reports : []
    //reports = _.sortBy(reports, function(o){ return o.createdAt }).reverse()
    //console.log(currentProfile)
    console.log('CURRENT VIEW')
    console.log(this.state.currentView)
    if(currentProfile.name == "All" || currentProfile.done || this.state.currentView == "Apps"){
      if(this.state.currentView == "Apps") {
        // SignalNews
        signalView = <div style={{height:"100%"}}><SignalApps setCurrentPressSignal={this.setCurrentPressSignal}/></div>
      } else if(this.state.currentView == "Feed"){
        signalView = <div>
            <SignalDetailButtons signalType={this.state.signalType} 
                                 currentProfile={this.state.currentProfile}
                                 setSignalType={this.setSignalType}/>
            <SignalsFeed setCurrentView={this.setCurrentView}
                         signalType={this.state.signalType} 
                         profile={this.state.currentProfile}
                         signals={this.state.signals}/>
            </div>
      } else if(this.state.currentView == "Calendar"){
        signalView = <SignalCalendar currentProfile={this.state.currentProfile}
                                    prospectSignalReport={this.prospectSignalReport}
                                     reports={reports}
                                     setCurrentReport={this.setCurrentReport}
                                     setCurrentView={this.setCurrentView} />
      } else if(this.state.currentView == "Analytics"){
        signalView = <SignalAnalytics currentProfile={this.state.currentProfile}
                                    prospectSignalReport={this.prospectSignalReport}
                                     reports={reports}
                                     setCurrentReport={this.setCurrentReport}
                                     setCurrentView={this.setCurrentView} />
      } else if(this.state.currentView == "Detail"){
        signalView = <SignalsDetail currentProfile={this.state.currentProfile}
                                    currentProfileReport={this.state.currentProfileReport}
                                    setCurrentView={this.setCurrentView}/>
      } else if(this.state.currentView == "MiningJobDetail"){
        signalView = <MiningJobDetail currentProfile={this.state.currentProfile}
                                    currentProfileReport={this.state.currentProfileReport}
                                    setCurrentView={this.setCurrentView}/>
      } else if(this.state.currentView == "MiningJobOverview"){
        signalView = <MiningJobDetail currentProfile={this.state.currentProfile}
                                    currentProfileReport={this.state.currentProfileReport}
                                    setCurrentView={this.setCurrentView}/>
      } else if(this.state.currentView == "MiningJobCalendar"){
        signalView = <MiningJobCalendar currentProfile={this.state.currentProfile}
                                        setCurrentReport={this.setCurrentReport}
                                        setReport={this.setReport}
                                        setCurrentView={this.setCurrentView}/>
      } else if(this.state.currentView == "TerritoryCalendar"){
        console.log('TERRITORY OVERVIEW IS CHOSEN')
        signalView = <TerritoryOverview currentProfile={this.state.currentProfile}
                                        setCurrentReport={this.setCurrentReport}
                                        setReport={this.setReport}
                                        setCurrentView={this.setCurrentView}/>
      } else if(this.state.currentView == "TerritoryDetail"){
        console.log('TERRITORY DETAIL IS CHOSEN')
        signalView = <TerritoryDetail currentProfile={this.state.currentProfile}
                                      currentProfileReport={this.state.currentProfileReport}
                                      setCurrentReport={this.setCurrentReport}
                                      setReport={this.setReport}
                                      setCurrentView={this.setCurrentView}/>
      }
    } else {
      // Show Calendar Even When Signal Is Loading
      if(this.state.currentView == "Calendar"){
        signalView = <SignalCalendar currentProfile={this.state.currentProfile}
                                     setCurrentReport={this.setCurrentReport}
                                     reports={reports}
                                     setCurrentView={this.setCurrentView} />
      } else {
        console.log(this.state.currentProfile)
        if(this.state.currentProfile.type == "prospect_profile")
          signalView =<MiningJobLoading currentProfile={this.state.currentProfile}/>
        else
          signalView = <SignalLoading currentProfile={this.state.currentProfile}/>
      }
    }

   return (
     <div>
      <div style={{height:500}}>
        <div className="container" style={{padding:0, width:'100%', height:'100%'}}>
          <div className="col-md-3 signal-list" 
               style={{ height:'102.8%', padding:0}}>
              <SignalsOptions profiles={this.state.profiles}
                              addProfile={this.addProfile}
                              updateMiningJobDone={this.updateMiningJobDone}
                              removeProfile={this.removeProfile}
                              setCurrentPressSignal={this.setCurrentPressSignal}
                              setCurrentView={this.setCurrentView}
                              currentProfile={this.state.currentProfile}
                              setCurrentProfile={this.setCurrentProfile}/>
          </div>
          <div className="col-md-9" style={{height:'100%',padding:0}}>
            {signalView}
          </div>

        </div>

        <CreateMiningJobModal createMiningJob={this.createMiningJob}
                              currentProfile={this.state.currentProfile}/>
        <CreateHiringSignalModal addProfile={this.addProfile}/>
        <CreateFundingSignalModal addProfile={this.addProfile}/>
        <CreateCompanyProfileModal addProfile={this.addProfile}/>
        <CreateProspectProfileModal addProfile={this.addProfile} 
                      updateProfileWithObjectId={this.updateProfileWithObjectId}/>
        <CreateTerritoryStrategyModal addProfile={this.addProfile} 
                      updateProfileWithObjectId={this.updateProfileWithObjectId}/>
        <CreateCompanyMiningJobModal />
        <CreatePressSignalModal pressSignal={this.state.pressSignal} 
                          pressSignalObjectId={this.state.pressSignalObjectId}/>
      </div>
      </div>

    )
  },
  /*
      <PanelFooting currentPage={this.state.currentPage}
                    count={this.state.count}
                    paginate={this.paginate}
                    prospectType={'Prospect'}
                    prospectsPerPage={this.state.prospectsPerPage}
                    setPaginate={this.setPaginate}
                    pages={this.state.pages}/>
  */

  createMiningJob: function(theProfile, date) {
    console.log('create mining job')
    var thiss = this;
    report = {
      //createdAt: moment().valueOf(),
      company_count: 0,
      people_count: 0,
      list_type:'mining_job',
      done: 0,
      mining_job: true,
    }

    profiles=_.map(this.state.profiles, function(profile) {
      if(_.isEqual(theProfile, profile)){
        if(profile.mining_days){
          profile.mining_days.push(date)
        }else{
          profile.mining_days = [date]
        }

        if(profile.reports){
          profile.reports = [report].concat(profile.reports)
        }else{
          profile.reports = [report]
        }
        
        thiss.setState({currentProfile: profile})
        thiss.persistMiningJob(date, report)
        return profile
      }
      return profile
    })
    thiss.setState({profiles: profiles})
  },

  persistMiningJob: function(date, report) {
    console.log(this.state)
    objectId = this.state.currentProfile.objectId
  },

  addProfile: function(newProfile) {
    profiles = this.state.profiles
    console.debug(newProfile)
    this.setState({profiles: [newProfile].concat(profiles)})
    this.setCurrentProfile(newProfile)
  },

  removeProfile: function(oldProfile) {
    this.setState({profiles: _.reject(this.state.profiles, function(profile) {
      return _.isEqual(oldProfile, profile)
    })})

    if(oldProfile.objectId){
      $.ajax({
        url:'https://api.parse.com/1/classes/ProspectProfile/'+oldProfile.objectId,
        headers:appConfig.headers,
        type:'DELETE',
      })
    }
  },

  updateMiningJobDone: function(profile) {
    profiles = _.map(this.state.profiles, function(_profile) {
                  if(_profile.objectId == profile.objectId) {
                    _profile.done = true
                    return _profile
                  }
                  return _profile
                })
    this.setState({profiles: profiles})
  },

  updateProfileWithObjectId: function(timestamp, objectId) {
    console.log('UPDATE PROFILES')
    newProfiles = _.map(this.state.profiles, function(profile) {
        if(profile.timestamp == timestamp) {
          profile.objectId = objectId
          return profile
        }
      return profile
    })
    
    console.log(newProfiles)
    this.setState({profiles: newProfiles})
    console.log(objectId)

    var pusher = new Pusher('1a68a96c8fde938fa75a');
    console.log('new pusher channel ->', objectId)
    var channel = pusher.subscribe(objectId);
    var thiss = this;
    channel.bind("done", function(data) {
      thiss.updateMiningJobDone(_.findWhere(thiss.state.profiles, {timestamp: timestamp}))
      alertify.success("New Success notification");
    });
  },

  setCurrentProfile: function(newProfile) {
    if(newProfile.only_people) {
      this.getSignals('PeopleSignal', 
                      JSON.stringify({
                         __type: 'Pointer',
                         className: 'ProspectProfile', 
                         objectId: newProfile.objectId}))
      this.setState({
        signalType: 'PeopleSignal',
        currentProfile: newProfile 
      })
    } else {
      this.setState({currentProfile: newProfile })
    }

    this.getSignals('PeopleSignal', newProfile)
  },

  componentDidMount: function() {
    this.getSignals(this.state.signalType)
    qry = {'include':'profiles,reports,prospect_list&order=-createdAt'}

    var _this = this;
    Parse.get('ProspectProfile', qry).done(function(res) {
      console.log(res)
      _this.setState({profiles: res.results})
    })
  },

  setSignalType: function(labelText) {
    if(labelText == "People")
      currentSignal = "PeopleSignal"
    else if(labelText == "Companies")
      currentSignal = "CompanySignal"
    this.getSignals(currentSignal)
    this.setState({signalType: currentSignal})
  },

  componentDidUpdate: function(nextProps, nextState) {
  },

  getSignals: function(signalType, currentProfile) {
    currentUser = JSON.parse(localStorage.currentUser)
    user = {
      '__type'    : 'Pointer',
      'className' : '_User',
      'objectId'  : currentUser.objectId
    }

    user = JSON.stringify(user)
    company = JSON.stringify(currentUser.company)
    profiles = this.state.currentProfile.profiles

    if(profiles){
      //qry = 'where={"company":'+company+',"user":'+user+',"profile":'+currentProfile+'}'
      profile = JSON.stringify({
        __type:'Pointer',
        className:'ProspectProfile',
        objectId:currentProfile.objectId
      })
      qry = 'where={"profile":'+profile+'}'
      //qry = qry + ',"profiles":{"$all":'+JSON.stringify(profiles)+'}}'
      if(signalType == 'PeopleSignal')
        qry = qry + '&include=signals'
      else
        qry = qry + '&include=signals,company'

    } else {
      qry = {'include':['signals','company']}
    }
  
    thiss = this
    $.ajax({
      url: 'https://api.parse.com/1/classes/'+signalType,
      //url: 'https://api.parse.com/1/classes/CompanySignal',
      type:'GET',
      data: qry,
      headers:appConfig.parseHeaders,
      success: function(res) {
        //console.log(res.results)
        thiss.setState({signals: res.results})
      },
      error: function(err) { console.log(err) }
    });
  },
});

var SignalDetailButtons = React.createClass({
  setSignalType: function(e) {
    this.props.setSignalType($(e.target).text().trim())
  },

  render: function() {
    ppl = (this.props.signalType == "PeopleSignal") ? "choose btn btn-primary app-active" : "choose btn btn-primary"
    cmp = (this.props.signalType == "CompanySignal") ? "choose btn btn-primary app-active" : "choose btn btn-primary"

    cmp = (this.props.currentProfile.only_people)  ? cmp + " disabled" : cmp

    return (
      <div>
        <div id="signalDetailButtons" style={{height:44}}>
          <h4 style={{display:'inline-block',float:'left',width:300,
                      fontWeight:200,marginTop:4,paddingLeft:20}}>
            <i className="fa fa-newspaper-o" />&nbsp; 
            {this.props.currentProfile.name}
          </h4>
          <div className="btn-group" style={{marginLeft:'0%'}}>
            <a className={ppl}
               style={{padding:2}} 
               onClick={this.setSignalType}> 
                <i className="fa fa-user" />&nbsp;People
            </a>
            <a className={cmp}
               style={{padding:2}}
               onClick={this.setSignalType}> 
                <i className="fa fa-building" />&nbsp;Companies
            </a>
          </div>
        </div>
      </div>
    );
  }
});

var SignalsOptions = React.createClass({
  addProfile: function(newProfile) {
    this.props.addProfile(newProfile)
  },

  setCurrentProfile: function(currentProfile) {
    this.props.setCurrentProfile(currentProfile)
  },

  removeProfile: function(oldProfile) {
    this.props.removeProfile(oldProfile)
  },

  componentDidMount: function() {
  },

  setCurrentView: function(newView) {
    console.log(newView)
    this.props.setCurrentView(newView)
  },

  render: function() {
    profs = []
    //console.log('signals render')
    console.debug(this.props.profiles)
    for(i=0; i< this.props.profiles.length;i++) {
      select= this.props.profiles[i].objectId == this.props.currentProfile.objectId
      profs.push(<SignalProfile setCurrentProfile={this.setCurrentProfile} 
                                updateMiningJobDone={this.props.updateMiningJobDone}
                                setCurrentView={this.setCurrentView}
                                currentProfile={this.props.currentProfile}
                                selected={select}
                                removeProfile={this.removeProfile}
                                profile={this.props.profiles[i]} />)
    }

    profiles_num = (this.props.profiles.length) ? this.props.profiles.length : "~"
    return (
      <div>
      <div className="list-group" >
        <li className="list-group-item" 
            style={{borderTop:0,borderLeft:0,height:44,paddingRight:5,paddingLeft:10,
                    backgroundColor:'#e0e6ea',
                    backgroundImage:'linear-gradient(#f5f7f8,#e0e6ea);'}}>
            <h4 style={{margin:0,textAlign:'center',fontWeight:200,cursor:"pointer",
              float:'left',marginTop:2}}
              onClick={this.mainPage}>
              <i className="fa fa-th" />&nbsp;
              Profiles ({profiles_num})
            </h4> 
          <a href="javascript:" 
             className="btn btn-xs btn-primary create-profile-dropdown" 
             data-toggle="dropdown"
             onClick={this.launchDropdown}
             style={{float:'right',
              backgroundImage:'linear-gradient(180deg, #0096ff 0%, #005dff 100%)'}}>
            <i className="fa fa-plus" />&nbsp; Create Profile
          </a>

          <ul className="dropdown-menu" 
              style={{marginLeft:175,marginTop:-10}}
              role="menu" aria-labelledby="dropdownMenu1">
            <li role="presentation" style={{display:'block'}}>
              <a href="javascript:" onClick={this.launchModal} style={{paddingLeft:5}}>
                <h6 style={{margin:2}}><i className="fa fa-globe"  style={{width:10}}/>
                  &nbsp;&nbsp;Create Territory Strategy
                </h6>
              </a>
            </li>
            <li role="presentation" style={{display:'block'}}>
              <a href="javascript:" onClick={this.launchModal} style={{paddingLeft:5}}>
                <h6 style={{margin:2}}><i className="fa fa-map-marker"  style={{width:10}}/>
                  &nbsp;&nbsp;Create SMB Strategy
                </h6>
              </a>
            </li>
            <li role="presentation">
              <a href="javascript:"
                 onClick={this.launchModal}
                 style={{paddingLeft:5}}>
                 <h6 style={{margin:2}}>
                   <i className="fa fa-suitcase" style={{width:10}} />
                  &nbsp;&nbsp;Create Hiring Signal
                </h6>
              </a>
            </li>
            <li role="presentation" style={{display:'block'}}>
              <a href="javascript:"
                 onClick={this.launchModal}
                 style={{paddingLeft:5}}>
                <h6 style={{margin:2}}><i className="fa fa-institution"  style={{width:10}}/>
                  &nbsp;&nbsp;Create Funding Signal
                </h6>
              </a>
            </li>
            <li role="presentation" style={{display:'block'}}>
              <a href="javascript:" onClick={this.launchModal} style={{paddingLeft:5}}>
                <h6 style={{margin:2}}><i className="fa fa-trophy"  style={{width:10}}/>
                  &nbsp;&nbsp;Create Award Signal
                </h6>
              </a>
            </li>
            <li role="presentation" style={{display:'block'}}>
              <a href="javascript:" onClick={this.launchModal} style={{paddingLeft:5}}>
                <h6 style={{margin:2}}><i className="fa fa-comments"  style={{width:10}}/>
                  &nbsp;&nbsp;Create Social Signal
                </h6>
              </a>
            </li>
            <li role="presentation" style={{display:'block'}}>
              <a href="javascript:" onClick={this.launchModal} style={{paddingLeft:5}}>
                <h6 style={{margin:2}}><i className="fa fa-cubes"  style={{width:10}}/>
                  &nbsp;&nbsp;Create Product News Signal
                </h6>
              </a>
            </li>
            <li role="presentation" style={{display:'block'}}>
              <a href="javascript:" onClick={this.launchModal} style={{paddingLeft:5}}>
                <h6 style={{margin:2}}><i className="fa fa-plus-circle"  style={{width:10}}/>
                  &nbsp;&nbsp;{"Create M&A Signal"}
                </h6>
              </a>
            </li>
            <li role="presentation" style={{display:'block'}}>
              <a href="javascript:" onClick={this.launchModal} style={{paddingLeft:5}}>
                <h6 style={{margin:2}}><i className="fa fa-file-text"  style={{width:10}}/>
                  &nbsp;&nbsp;Create Contracts News Signal
                </h6>
              </a>
            </li>
            <li role="presentation" style={{display:'block'}}>
              <a href="javascript:" onClick={this.launchModal} style={{paddingLeft:5}}>
                <h6 style={{margin:2}}><i className="fa fa-user-plus"  style={{width:10}}/>
                  &nbsp;&nbsp;Create Personnel Signal
                </h6>
              </a>
            </li>
            <li role="presentation">
              <a onClick={this.launchModal}
                 style={{paddingLeft:5,paddingRight:2}} 
                 href="javascript">
                <h6 style={{margin:2}}>
                  <i className="fa fa-user" style={{width:10}} />
                  &nbsp;&nbsp;Download Prospect List
                </h6>
              </a>
            </li>
            <li role="presentation" style={{display:'block'}}>
              <a role="menuitem" tabindex="-1" 
                 onClick={this.launchModal}
                 style={{paddingLeft:5,paddingRight:2}} href="#">
                 <h6 style={{margin:2}}>
                   <i className="fa fa-building" style={{width:10}}/>
                   &nbsp;&nbsp;Download Company List
                 </h6>
              </a>
            </li>
          </ul>
        </li>
        <div id="profiles-menu" style={{height:456, overflow:'auto',marginTop:1}}>
          {profs}
        </div>
      </div>
    </div>
    );
  },

  mainPage: function(e) {
    //this.setState({currentView: "Apps"})
    this.props.setCurrentView("Apps")
    console.log("main page")
  },

  launchModal: function(e) {
    e.preventDefault()
    console.log($(e.target).text().trim())
    if($(e.target).text().trim() == 'Create Hiring Signal')
      $('#createHiringSignalModal').modal()
    else if($(e.target).text().trim() == 'Create Funding Signal') {
      this.props.setCurrentPressSignal("Funding", "BfeCJW0YK6")
      $('#createPressSignalModal').modal()
    } else if($(e.target).text().trim() == 'Create Award Signal') {
      this.props.setCurrentPressSignal("Awards", "xYI8bAh39b")
      $('#createPressSignalModal').modal()
    } else if($(e.target).text().trim() == 'Create Social Signal')
      $('#createFundingSignalModal').modal()
    else if($(e.target).text().trim() == 'Create Product News Signal') {
      this.props.setCurrentPressSignal("Product News", "jwfmvkrnQw")
      $('#createPressSignalModal').modal()
    } else if($(e.target).text().trim() == 'Create M&A Signal') {
      this.props.setCurrentPressSignal("M&A", "rXTD2ZeW6D")
      $('#createPressSignalModal').modal()
    } else if($(e.target).text().trim() == 'Create Contract News Signal') {
      this.props.setCurrentPressSignal("Contract News", "PEWk9hDbzf")
      $('#createPressSignalModal').modal()
    } else if($(e.target).text().trim() == 'Create Personnel Signal') {
      this.props.setCurrentPressSignal("Personnel", "UGNDEb6Sy7")
      $('#createPressSignalModal').modal()
    } else if($(e.target).text().trim() == 'Download Prospect List')
      $('#createProspectProfileModal').modal()
    else if($(e.target).text().trim() == 'Create Territory Strategy')
      $('#createTerritoryStrategyModal').modal()
    else if($(e.target).text().trim() == 'Create SMB Strategy')
      $('#createTerritoryStrategyModal').modal()
    else if($(e.target).text().trim() == 'Download Company List')
      $('#createCompanyMiningJobModal').modal() 
  },

  launchDropdown: function(e) {
    e.preventDefault()
    $('.create-profile-dropdown').dropdown()
  }
});

var SignalsFeed = React.createClass({
  render: function() {
    //this.getSignals()
    signalCards = []
    for(i=0;i< this.props.signals.length;i++) {
      if(this.props.signalType == "CompanySignal")
        signalCards.push(<CompanySignalCard company={this.props.signals[i]}/>)
      else if(this.props.signalType == "PeopleSignal")
        signalCards.push(<PeopleSignalCard profile={this.props.profile} person={this.props.signals[i]}/>)
    }
    
    content = (this.props.signals.length) ? signalCards : <div className="signal-card">LOL</div>
    content = signalCards

    return (
      <div className="container signal-card-background" style={{height:456, overflow:'auto'}}>
        <div className="col-md-8 col-md-offset-2">
          {content}
        </div>
      </div>
    );
  }
});
