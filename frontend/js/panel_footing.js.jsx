/** @jsx React.DOM */

module.exports = React.createClass({
  // Panel Footing
  paginatePrevious: function() {
    var _this = this;

    qry = {
      where: JSON.stringify({archived:{$in: [false, null]}}),
      order: '-createdAt', count: 1,
      skip: (this.props.currentPage-2)*this.props.prospectsPerPage,
      limit: this.props.prospectsPerPage,
      include: 'company'
    }
    $.ajax({
      url: 'https://api.parse.com/1/classes/'+_this.props.prospectType,
      type:'GET',
      beforeSend: function() {
        console.log('before Send')
        _this.props.setPaginate(true)
      },
      headers: appConfig.parseHeaders,
      data: qry,
      success: function(res){
        console.log(res)
        _this.props.paginate(res.results, _this.props.currentPage - 1)
        _this.props.setPaginate(false)
      },
      error: function(res){ console.log(res) }
    });
  },

  paginate: function(direction) {
    var _this=this;
    prospectsPerPage = this.props.prospectsPerPage
    qry = {count: true}
    if(direction=='previous')
      qry.skip = (this.props.currentPage - 2)*prospectsPerPage
    else if(direction=="forward")
      qry.skip = this.props.currentPage*prospectsPerPage

    Parse.get(this.props.prospectType, qry).done(function(res) {
       console.log(res)
       this.props.paginate(res.results, _this.props.currentPage + 1)
    })
  },

  paginateForward: function() {
    var _this = this;
    qry = {
      where: JSON.stringify({ archived: {$in:[false, null] }}),
      order: '-createdAt', count: 1,
      skip: this.props.currentPage*this.props.prospectsPerPage,
      limit: this.props.prospectsPerPage,
      include: 'company',
    }

    $.ajax({
      url: 'https://api.parse.com/1/classes/'+_this.props.prospectType,
      type:'GET',
      headers: appConfig.parseHeaders,
      data: qry,
      beforeSend: function() {
        _this.props.setPaginate(true)
      },
      success: function(res){
        console.log(res)
        _this.props.paginate(res.results, _this.props.currentPage + 1)
        _this.props.setPaginate(false)
      },
      error: function(res){ console.log(res); }
    });
  },

  componentDidMount: function() {
    paginateForward = this.paginateForward
    paginatePrevious = this.paginatePrevious

    Mousetrap.bind('l', function() { 
      console.log('new forward')
      paginateForward()
    });

    Mousetrap.bind('h', function() { 
      console.log('new back')
      paginatePrevious()
    });
  },

  render: function() {
    // Add Support For Current List
    // Current List
    //console.log('current page')
    //console.log(this.props.currentPage)
    //console.log(this.props.count)

    previous = (this.props.currentPage - 1) ? '' : 'disabled'

    lowerLimit = (this.props.currentPage-1)*this.props.prospectsPerPage
    upperLimit = this.props.currentPage*this.props.prospectsPerPage

    lowerLimit = (lowerLimit) ? lowerLimit : 1
    upperLimit = (upperLimit > this.props.count) ? this.props.count : upperLimit

    lastPage = this.props.currentPage == this.props.pages
    lessThanOnePage = upperLimit - lowerLimit<= this.props.prospectsPerPage - 2
    console.log(this.props.prospectsPerPage)
    forward = (lastPage || lessThanOnePage) ? 'disabled' : ''

    return (
      <div className="panel-footing" 
           id="navbar" 
           style={{height:'35px',padding:'0px', paddingTop:'7px'}}>
          <span style={{float:'right',marginRight:5, width:200}}>
            <a href="javascript:" 
               style={{marginRight:'5px'}} 
               onClick={this.fastPrevious} 
               className={"blue-gradient paginate-fast-backward btn btn-primary btn-xs "+previous} >
            <i className="fa fa-fast-backward" />
          </a>
          <a href="javascript:" 
             onClick={this.paginatePrevious} 
             className={"paginate-back-btn blue-gradient btn btn-primary btn-xs "+previous} >
            <i className="fa fa-chevron-left" />
          </a>
          <span style={{marginLeft:5, marginRight:5,display:'inline',width:'100%', textAlign:'center'}}>
            <span style={(this.props.count) ? {}:{display:'none'}}>
              {lowerLimit+' - '} </span> {upperLimit+' of '+this.props.count}
          </span>
          <a href="javascript:" 
             onClick={this.paginateForward} 
             className={"paginate-forward-btn blue-gradient btn btn-primary btn-xs "+forward}>
            <i className="fa fa-chevron-right" />
          </a>
          <a href="javascript:" 
             style={{marginLeft:'5px'}} 
             onClick={this.fastForward} 
             className={"blue-gradient btn btn-primary btn-xs paginate-fast-forward "+forward}>
            <i className="fa fa-fast-forward" /></a>
          </span>
        </div>
    );
  }, 

  fastPrevious: function() {
    var thiss = this;
    qry = {
      where: JSON.stringify({ user_company: Parse.user_company, 
                              archived:{$in: [null, false]}}),
      order: '-createdAt',
      count: 1,
      limit: thiss.props.prospectsPerPage,
      include: 'company'
    }
    $.ajax({
      url:'https://api.parse.com/1/classes/'+thiss.props.prospectType,
      data: qry,
      beforeSend: function() {
        console.log('before Send')
        thiss.props.setPaginate(true)
      },
      headers: appConfig.headers,
      success: function(res){ console.log(res.results) 
        thiss.props.paginate(res.results, 1)
        thiss.props.setPaginate(false)
      },
      error: function(err) { console.log(err.responseText) }
    })
  },

  fastForward: function() {
    var thiss = this;
    console.log('fast forward')
    console.log(thiss.props.count - thiss.props.prospectsPerPage)
    _prosp = this.props.prospectsPerPage
    qry = {
      where: JSON.stringify({ user_company: Parse.user_company, 
                              archived:{$in: [null, false]}}),
      order: '-createdAt',
      count: 1,
      skip: Math.floor(thiss.props.count / _prosp)*_prosp,
      limit: thiss.props.count - thiss.props.prospectsPerPage,
      include: 'company'
    }
    $.ajax({
      url:'https://api.parse.com/1/classes/'+thiss.props.prospectType,
      data: qry,
      beforeSend: function() {
        console.log('before Send')
        thiss.props.setPaginate(true)
      },
      headers: appConfig.headers,
      success: function(res){ console.log(res.results) 
        page = Math.ceil(thiss.props.count / 50)
        thiss.props.paginate(res.results, page)
        thiss.props.setPaginate(false)
      },
      error: function(err) { console.log(err.responseText) }
    })
  }
});
