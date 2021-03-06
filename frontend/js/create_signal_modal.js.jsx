/** @jsx React.DOM */

module.exports = React.createClass({
  // createSignalModal
  createSignal: function() {
    console.log('Create SIgnal Called')
    // Get Name
    profileName = $('.hiring-profile-name').val()

    hiringProfile = {
      'className': 'HiringProfile',
      'roles'    : $('.hiring-role').tagsinput('items').reverse()
    }

    autoProspect = $('.autoprospect > .active').text() ==  " Yes"
    
    revenueProfile = {'className':'RevenueProfile', 
                      'revenues': _.map($('#revenueBtns').find('.active'), 
                                            function(revBtn){
                                              return $(revBtn).text().trim() 
                                            }).reverse()}

    employeeProfile = {'className':'EmployeeProfile', 
                       'employees': _.map($('#employeeBtns').find('.active'), 
                                          function(empBtn){ 
                                            return $(empBtn).text().trim() 
                                          }).reverse()}

    prospectProfile = {
      'className':'ProspectTitleProfile',
      'title_keywords' : $('.prospectRoleKeywords').tagsinput('items').reverse()
    }

    $.ajax({
      url:'https://api.parse.com/1/classes/ProspectProfile',
      headers:appConfig.headers,
      type:'POST',
      data:JSON.stringify({name:profileName, 
                          only_people:true,
                          autoProspect:autoProspect,
                          user:{
                            __type:'Pointer',
                            className:'_User',
                            objectId:JSON.parse(localStorage.currentUser).objectId
                          },
                          company: JSON.parse(localStorage.currentUser).company
      }),
      success:function(ress) {
        // Add Signal List

        $.ajax({
          url:'https://api.parse.com/1/classes/HiringProfile',
          headers:appConfig.headers,
          type:'POST',
          data:JSON.stringify({roles: hiringProfile.roles}),
          success:function(res) {
            $.ajax({
              url:'https://api.parse.com/1/classes/ProspectProfile/'+ress.objectId,
              type:'PUT',
              headers:appConfig.headers,
              data:JSON.stringify({profiles:{
                __op: 'AddUnique',
                objects:[{
                  __type:'Pointer',
                  className:'HiringProfile',
                  objectId:res.objectId
                }]}
              }),
            })
          },
        })
        //Create Prospect Profile
        $.ajax({
          url:'https://api.parse.com/1/classes/RevenueProfile',
          headers:appConfig.headers,
          type:'POST',
          data:JSON.stringify({revenues: revenueProfile.revenues}),
          success:function(res) {
            $.ajax({
              url:'https://api.parse.com/1/classes/ProspectProfile/'+ress.objectId,
              type:'PUT',
              headers:appConfig.headers,
              data:JSON.stringify({profiles:{
                __op: 'AddUnique',
                objects:[{
                  __type:'Pointer',
                  className:'RevenueProfile',
                  objectId:res.objectId
                }]}
              }),
            })
          },
        })
        //Create Employee Profile
        $.ajax({
          url:'https://api.parse.com/1/classes/EmployeeProfile',
          headers:appConfig.headers,
          type:'POST',
          data:JSON.stringify({employees: employeeProfile.employees}),
          success:function(res) {
            $.ajax({
              url:'https://api.parse.com/1/classes/ProspectProfile/'+ress.objectId,
              type:'PUT',
              headers:appConfig.headers,
              data:JSON.stringify({profiles:{
                __op: 'AddUnique',
                objects:[{
                  __type:'Pointer',
                  className:'EmployeeProfile',
                  objectId:res.objectId
                }]}
              }),
            })
          },
        })
        //Create Revenue Profile
        $.ajax({
          url:'https://api.parse.com/1/classes/ProspectTitleProfile',
          type:'POST',
          headers:appConfig.headers,
          data:JSON.stringify({title_keywords: prospectProfile.title_keywords}),
          success:function(res) {
            $.ajax({
              url:'https://api.parse.com/1/classes/ProspectProfile/'+ress.objectId,
              type:'PUT',
              headers:appConfig.headers,
              data:JSON.stringify({profiles:{
                __op: 'AddUnique',
                objects:[{
                  __type:'Pointer',
                  className:'ProspectTitleProfile',
                  objectId:res.objectId
                }]}
              }),
            })
          },
        })
      },
    })

    newProfile = {
      name: profileName,
      autoProspect: autoProspect,
      profiles: [
        prospectProfile,
        revenueProfile,
        employeeProfile,
        hiringProfile
      ]
    }
    console.log(newProfile)

    this.props.addProfile(newProfile)
    /*
    $('#createListModal').modal('hide')
    $('body').removeClass('modal-open');
    $('.modal-backdrop').remove();
    */

  },

  render: function() {
    return (
      <div className="modal fade bs-createSignal-modal-md" tabIndex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true" id="createListModal" 
           style={{top:'50px',overflow:'hidden'}}>
            <div className="modal-dialog modal-sm" style={{width:650}}>
              <div className="modal-content">
                <div className="modal-header">
                  <h4 className="modal-title" id="myModalLabel">
                    {this.props.chosenSignal}
                  </h4>
                  <a href="javascript:" className="btn btn-success btn-sm" 
                     onClick={this.createSignal}
                     style={{float:'right',marginTop:-28,marginRight:-5}}>
                    Create Signal
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
  }
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
    $(this.getDOMNode()).find('.hiring-role').tagsinput()
    $('.bootstrap-tagsinput').width(400)
  },

  render: function(){
    addCompany = (!this.state.addCompany) ? <a href="javascript:" 
                                           onClick={this.toggleCompany}
                                           className="btn btn-sm btn-default">
                                          <i className="fa fa-plus" />&nbsp;
                                          Add Company Details
                                        </a> : <CompanyProfile hideCompanyDetails={this.state.hideCompanyDetails}/>

    addProspect = (!this.state.addProspect) ? <a href="javascript:" 
                                           onClick={this.toggleProspect}
                                           className="btn btn-sm btn-default">
                                          <i className="fa fa-plus" />&nbsp;
                                          Add Prospect Details
                                        </a> : <ProspectProfile hideProspectDetails={this.state.hideProspectDetails}/>
    addCompanyStyle = (!this.state.addCompany) ? {display:'block',textAlign:'center'} : {}
    addProspectStyle = (!this.state.addProspect) ? {display:'block',textAlign:'center'} : {}

    closeCompanyBtns = (!this.state.addCompany) ? "" : <span><a href="javascript:" className="btn btn-xs btn-default"
               onClick={this.toggleCompany}
               style={{float:'right',marginTop:-5}}>
               <i className="fa fa-times" /></a>
               <a href="javascript:" className="btn btn-xs btn-default"
                  onClick={this.toggleCompanyDetails}
                  style={{float:'right',marginTop:-5,marginRight:5}}>
              <i className={(this.state.hideCompanyDetails) ? "fa fa-plus" :"fa fa-minus"} />
          </a></span>

    closeProspectBtns = (!this.state.addProspect) ? "" : <span><a href="javascript:" className="btn btn-xs btn-default"
               onClick={this.toggleProspect}
               style={{float:'right',marginTop:-5}}>
               <i className="fa fa-times" /></a>
               <a href="javascript:" className="btn btn-xs btn-default"
               onClick={this.toggleProspectDetails}
               style={{float:'right',marginTop:-5,marginRight:5}}>
              <i className={(this.state.hideProspectDetails) ? "fa fa-plus" :"fa fa-minus"} />
          </a></span>

    companyHeading = (!this.state.addCompany) ? "" : <h5><i className="fa fa-building" />&nbsp; Company Details</h5>
    prospectHeading = (!this.state.addProspect) ? "" : <h5><i className="fa fa-user" />&nbsp; Prospect Details</h5>
    return (
      <div>
        <form className="createSignal" onSubmit={this.createSignal}>
          <span> 
            <h6 style={{width:140,display:'inline-block',marginBottom:20}}>
              Hiring Profile Name: &nbsp;</h6>
            <input type="text" 
                   style={{display:'inline-block',width:'413px'}} 
                   className="form-control hiring-profile-name" 
                   placeholder="Hiring Profile Name ..."/>
          </span>
          <br/>
          <span> 
            <h6 style={{width:140,display:'inline-block'}}>
              Hiring Role Name: &nbsp;
            </h6>
            <input type="text" 
                   style={{display:'inline-block',width:'50%',marginRight:10}} 
                   data-role="tagsinput"
                   className="form-control hiring-role" />

                <a href="javascript:" 
                   className="btn btn-xs btn-success" style={{display:'none'}}>
                  <i className="fa fa-plus" />
                </a>
          </span>
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
          <hr/> {closeCompanyBtns} {companyHeading}     
          <div style={addCompanyStyle}> {addCompany} </div>

          <hr/> {closeProspectBtns} {prospectHeading}     
          <div style={addProspectStyle}> {addProspect} </div>
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
    showDetails = (this.props.hideCompanyDetails) ? {display: 'none'} : {display:'block'}
    return (
      <div style={showDetails}>
        <form className="createSignal" onSubmit={this.companyFormSubmit}>
          <br/> 
          <h6 style={{display:'inline-block',margin:0,
                      width:140,marginBottom:20}}>Company Size </h6>
            <div className="btn-group" data-toggle="buttons" id="employeeBtns">
              <label className="btn btn-sm btn-default active">
                <input type="checkbox"/> 1 - 50
              </label>
              <label className="btn btn-sm btn-default">
                <input type="checkbox"/> 50 - 250
              </label>
              <label className="btn btn-sm btn-default">
                <input type="checkbox"/> 250 - 1000
              </label>
              <label className="btn btn-sm btn-default">
                <input type="checkbox"/> 1000 +
              </label>
            </div>

            <br/> <h6 style={{display:'inline-block',margin:0,width:140}}>
              Revenue Amount </h6>
            <div className="btn-group" data-toggle="buttons" id="revenueBtns">
              <label className="btn btn-sm btn-default active">
                <input type="checkbox"/> {'< $1M'}
              </label>
              <label className="btn btn-sm btn-default">
                <input type="checkbox"/> $1M - $5M
              </label>
              <label className="btn btn-sm btn-default">
                <input type="checkbox"/> $5M - $25M
              </label>
              <label className="btn btn-sm btn-default">
                <input type="checkbox"/> $25M +
              </label>
            </div>
        </form>
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

/*
  Funding Profile
  - Amount Raised
  - Stage

  People Profile
  - Locale
  - Title

  Company Profile
  - Industries
  - Revenue
  - Locale
  - # of Employees
*/

var GeneralForm = React.createClass({

  render: function() {
    return (
        <form className="createSignal" onSubmit={this.createSignal}>
          <span> <i className="fa fa-suitcase"/> &nbsp;
            <input type="text" style={{display:'inline-block',width:'90%'}} 
                  className="form-control" placeholder="Find Companies Hiring For ..."/>
          </span>
          <br/> <br/>
          <span> <i className="fa fa-users"/> &nbsp;
            <input type="text" style={{display:'inline-block',width:'90%'}} 
                  className="form-control" placeholder="Number of Employees ..."/>
          </span>
          <br/> <br/>
          <span> <i className="fa fa-institution"/> &nbsp;
            <input type="text" style={{display:'inline-block',width:'90%'}} 
                  className="form-control" placeholder="Amount of Funding ..."/>
          </span>
          <br/> <br/>
          <span> <i className="fa fa-money"/> &nbsp;
            <input type="text" style={{display:'inline-block',width:'90%'}} 
                  className="form-control" placeholder="Revenue Amount ..."/>
          </span>
          <br/> <br/>
          <span> <i className="fa fa-wrench"/> &nbsp;
            <input type="text" style={{display:'inline-block',width:'90%'}} 
                  className="form-control" placeholder="Using Technologies Such As..."/>
          </span>
          <br/> <br/>
          <a href="javascript:" 
            onClick={this.createSignal} 
            className="btn btn-default btn-success" 
            style={{display:'block', width:'100%'}}>
            Create Signal
          </a>
        </form>
    )
  }
})
