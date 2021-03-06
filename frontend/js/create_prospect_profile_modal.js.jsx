/** @jsx React.DOM */

module.exports = React.createClass({
  // createCompanyProfileModal
  createProfile: function() {
    profileName = $(".profileName").val()

    titleProfile = {
      'className': 'ProspectTitleProfile',
      'title_keywords'    : $('.prospect-profile-title').tagsinput('items').reverse()
    }

    /* */
    
    profiles = [titleProfile]

    nonemptyProfiles = _.filter(profiles, function(profile) {
      if(_.values(profile)[1]){ return _.values(profile)[1].length }
    });
    console.log(nonemptyProfiles)

    newProfile = {
      name: profileName,
      profiles: nonemptyProfiles,
      type: 'prospect_profile',
      mining_job:true,
      list_type:"mining_job",
      only_people:true,
      timestamp: moment().valueOf(),
      done: 0,
      user:{
        __type:'Pointer',
        className:'_User',
        objectId:JSON.parse(localStorage.currentUser).objectId
      },
      company: JSON.parse(localStorage.currentUser).company
    }

    if(nonemptyProfiles.length) {
      this.props.addProfile(newProfile)
      this.persistSignal(nonemptyProfiles, newProfile)
      $('.modal').click()
      $('.prospect-profile-title').val('')
    }
  },

  persistSignal: function(nonemptyProfiles, newProfile) {
    console.log('NEW PROFILE')
    console.log(newProfile)

    var thissss = this;
    var thiss = this;
    var _this = this;
    $.ajax({
      url:'https://api.parse.com/1/classes/ProspectProfile',
      headers:appConfig.headers,
      type:'POST',
      data:JSON.stringify(_.omit(newProfile, 'profiles')),
      success:function(ress) {
        
        user_id = JSON.parse(localStorage.currentUser).objectId
        newProfile.user = appConfig.pointer('_User', user_id) 
        newProfile._user_company = Parse._user_company

        $.ajax({
          url:     'https://api.parse.com/1/classes/ProspectList',
          type:    'POST',
          headers: appConfig.headers,
          data:    JSON.stringify(_.pick(newProfile, 
                                     'name','user','list_type',
                                     'open_people', 'company',
                                     'mining_job_list')),
          success: function(res) {
            console.log(res)
            prospectList = appConfig.pointer('ProspectList',res.objectId)
            $.ajax({
              url:'https://api.parse.com/1/classes/ProspectProfile/'+ress.objectId,
              type:'PUT',
              headers: appConfig.headers,
              data: JSON.stringify({'prospect_list':prospectList}),
              success: function(res){ console.log(res) },
              error: function(err){ console.log(err) }
            })
          },
          error: function() { }
        })

        // Start Mining Job
        if(newProfile.type == 'prospect_profile') {
          $.ajax({
            url: 'https://nameless-retreat-3525.herokuapp.com/title_mining_job',
            //url:'http://127.0.0.1:5000/title_mining_job',
            type:'GET',
            data: {prospect_profile: ress.objectId},
            success: function(res) { console.log(res) },
            error: function(err) { console.log(err) }
          })
        }

        // Create Profiles
        _.map(nonemptyProfiles, function(profile) {
          $.ajax({
            url:'https://api.parse.com/1/classes/'+_.values(profile)[0],
            headers:appConfig.headers,
            type:'POST',
            data:JSON.stringify( _.pick(profile, _.keys(profile)[1]) ),
            success:function(res) {
              $.ajax({
                url:'https://api.parse.com/1/classes/ProspectProfile/'+ress.objectId,
                type:'PUT',
                headers:appConfig.headers,
                data:JSON.stringify({profiles:{
                  __op: 'AddUnique',
                  objects:[{
                    __type:'Pointer',
                    className: _.values(profile)[0],
                    objectId:res.objectId
                  }]}
                }),
              })
            }
          })
        });

        thiss.props.updateProfileWithObjectId(newProfile.timestamp, ress.objectId)
      }
    })
  },

  render: function() {
    return (
      <div className="modal fade " tabIndex="-1" role="dialog" 
           aria-labelledby="mySmallModalLabel" aria-hidden="true" 
           id="createProspectProfileModal" 
           style={{top:'50px',overflow:'hidden'}}>
            <div className="modal-dialog modal-sm" style={{width:650}}>
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title" id="myModalLabel">
                    Create Prospect Profile lmao
                  </h4>
                  <a href="javascript:" className="btn btn-success btn-sm" 
                     onClick={this.createProfile}
                     style={{float:'right',marginTop:-28,marginRight:-5}}>
                    Create Profile
                  </a>
                </div>
                <div className="modal-body">
                  <CreateHiringSignal />
                </div>
              <div className="modal-footer" style={{display:'none'}}>
                <button type="button" className="btn btn-default">
                  Close
                </button>
                <button type="button" className="btn btn-primary">
                  Send Email
                </button>
              </div>
              </div>
            </div>
          </div>
    );
  },
  createCompanyProfile: function() {
  },
});

var CreateHiringSignal = React.createClass({
  getInitialState: function() {
    return {
      addCompany: false,
      addProspect: false,
      hideCompanyDetails: false,
      hideProspectDetails: false,
    }
  },

  componentDidMount: function() {

  },
  
  toggleCompany : function() {
    this.setState({addCompany: !this.state.addCompany})
  },

  toggleProspect : function() {
    this.setState({addProspect: !this.state.addProspect})
  },

  toggleCompanyDetails: function() {
    this.setState({hideCompanyDetails: !this.state.hideCompanyDetails})
  },

  toggleProspectDetails: function() {
    this.setState({hideProspectDetails: !this.state.hideProspectDetails})
  },

  componentDidMount: function() {
    _.map($('.hiring-role'),function(input){$(input).tagsinput()})
    $(this.getDOMNode()).find('.hiring-role').tagsinput()
    $('.bootstrap-tagsinput').width('59.1%')
  },

  render: function(){
    return (
      <div>
        <form className="createSignal" onSubmit={this.createProfile}>
          <span> 
            <h6 style={{width:140,display:'inline-block',marginBottom:20}}>
              Prospect Profile Name: &nbsp;</h6>
            <input type="text" 
                   style={{display:'inline-block',width:'73.1%'}}
                   className="form-control hiring-profile-name profileName" 
                   placeholder="Prospect Profile Name ..."/>
          </span>
          <br/>
          <span style={{display:'block',marginBottom:-10}}> 
            <h6 style={{width:140,display:'inline-block'}}>
              Title: &nbsp;
            </h6>
            <input type="text" 
                   style={{display:'inline-block',width:'73.1%',marginRight:10}} 
                   data-role="tagsinput"
                   className="form-control hiring-role prospect-profile-title" />

                <a href="javascript:" 
                   className="btn btn-xs btn-success" style={{display:'none'}}>
                  <i className="fa fa-plus" />
                </a>
          </span>
          <br/>
          <span style={{display:'block',marginBottom:-10}}> 
            <h6 style={{width:140,display:'none'}}>
              Location: &nbsp;
            </h6>
            <input type="text" 
                   style={{display:'none',width:'73.1%',marginRight:10}} 
                   data-role="tagsinput"
                   className="form-control prospect-location-profile-tmp" />

                <a href="javascript:" 
                   className="btn btn-xs btn-success" style={{display:'none'}}>
                  <i className="fa fa-plus" />
                </a>
          </span>
          <span style={{display:'none',marginBottom:-10}}> 
            <h6 style={{width:140,display:'inline-block'}}>
              Industries: &nbsp;
            </h6>
            <input type="text" 
                   style={{display:'inline-block',width:'73.1%',marginRight:10}} 
                   data-role="tagsinput"
                   className="form-control " />

            <a href="javascript:" 
               className="btn btn-xs btn-success" style={{display:'none'}}>
              <i className="fa fa-plus" />
            </a>
          </span>
          <CompanyProfile />

          <div style={{display:'none'}}>
          <div style={{marginTop:10}}>
            <h6 style={{width:140,display:'inline-block'}}>Auto Prospect: &nbsp;</h6>
            <div className="btn-group autoprospect" data-toggle="buttons" >
              <label className="btn btn-sm btn-default active">
                <input type="radio"/> Yes
              </label>
              <label className="btn btn-sm btn-default">
                <input type="radio"/> No
              </label> 
            </div>
          </div>
        </div>
        </form>
      </div>
    )
  },
  createSignal: function(e) { e.preventDefault() }
});

var CompanyProfile = React.createClass({
  companyFormSubmit: function(e) { e.preventDefault() },

  componentDidMount: function() {
    $(this.getDOMNode()).find('.btn-default').click(function(e) {

      if($(e.target).parent('label').hasClass('active'))
        $(e.target).parent('label').removeClass('active')
      else
        $(e.target).parent('label').addClass('active')

      console.log($(e.target).parent('label'))
    });
  },

  render: function() {
    return (
      <div >
          <br/> 
          <div style={{display:'none'}}>
          <h6 style={{display:'inline-block',margin:0,
                      width:140,marginBottom:20}}>Company Size </h6>
                    <div className="btn-group" data-toggle="buttons" 
                      style={{width:'73.5%'}} id="prospect-profile-companySizeBtns">
              <label className="btn btn-sm btn-default employeeBtn">
                <input type="checkbox"/> 1 - 50
              </label>
              <label className="btn btn-sm btn-default employeeBtn">
                <input type="checkbox"/> 50 - 250
              </label>
              <label className="btn btn-sm btn-default employeeBtn">
                <input type="checkbox"/> 250 - 1000
              </label>
              <label className="btn btn-sm btn-default employeeBtn">
                <input type="checkbox"/> 1000 +
              </label>
            </div>
          </div>

          <div style={{display:'none'}}>
            <br/> <h6 style={{display:'inline-block',margin:0,width:140}}>
              Approx. Revenue  </h6>
            <div className="btn-group" data-toggle="buttons" 
              style={{width:'73.5%'}} id="prospect-profile-companyRevenueBtns">
              <label className="btn btn-sm btn-default revenueBtn">
                <input type="checkbox"/> {'< $1M'}
              </label>
              <label className="btn btn-sm btn-default revenueBtn">
                <input type="checkbox"/> $1M - $5M
              </label>
              <label className="btn btn-sm btn-default revenueBtn">
                <input type="checkbox"/> $5M - $25M
              </label>
              <label className="btn btn-sm btn-default revenueBtn">
                <input type="checkbox"/> $25M +
              </label>
            </div>
          </div>
      </div>
    )
  }
});

var ProspectProfile = React.createClass({
  prospectFormSubmit: function(e) { e.preventDefault() },

  componentDidMount: function() {
    $('.prospectRoleKeywords').tagsinput({
      maxTags: 5,
    })
    $('.bootstrap-tagsinput').width(400)
  },

  render: function() {
    showDetails = (this.props.hideProspectDetails) ? {display: 'none'} : {display:'block'}
    return (
      <div style={showDetails}>
        <form className="createSignal" onSubmit={this.prospectFormSubmit}>
          <span> 
            <span style={{width:140,display:'inline-block'}}>
              <h6>Job Title Keyword: &nbsp;</h6>
            </span>
            <input type="text" 
                   data-role="tagsinput"
                   style={{width:'400px !important'}}
                   className="form-control prospectRoleKeywords" 
                   placeholder="" />
          </span> 
        </form>
      </div>
    )
  }
})
