/** @jsx React.DOM */

//var Parse = require("../lib/parse-require.min.js")
var SideMenuListOption = require('./user_side_menu_list.js.min.js');
var CreateListModal = require('./create_list_modal.js.min.js')
var Messenger = require('./messenger.js.min.js')

var DeleteListModal = require('./delete_list_modal.js.min.js')
var RenameListModal = require('./rename_list_modal.js.min.js')
var SideMenuListOption = require('./user_side_menu_list.js.min.js');

module.exports = React.createClass({
  //SideMenuProspects - SideList
  getInitialState: function() {
    return {
      /*
      createList: 
      renameList:
      deleteList:
      changeList:
      currentList:
      totalCount:
      lists: 
      */
     lists: [],
    }
  },

  createList: function (data) {
    this.props.createList(data)
  },

  componentDidUpdate: function() {
  },

  componentDidMount: function() {
    var _this = this;
    setTimeout(function() {
    $('.dropdown-copy-list-name').on('click', function(e) {
        _id = _.map(($(e.target).attr("class").split(" ")), function(obj) {
          if(obj.indexOf("objectId-") != -1)
            return _.last(obj.split("objectId-"))
        })
        _id = _.first(_.compact(_id))
      //console.log(e.target)
      console.log(_id)
      _this.copySelectedProspects(_id)
    })

    $('.dropdown-move-list-name').on('click', function(e) {
        _id = _.map(($(e.target).attr("class").split(" ")), function(obj) {
          if(obj.indexOf("objectId-") != -1)
            return _.last(obj.split("objectId-"))
        })
        _id = _.first(_.compact(_id))
      //console.log(e.target)
      console.log(_id)
      _this.moveSelectedProspects(_id)
    })
    }, 1000)


    var _this = this;
    Parse.get(this.props.listClassName, { order: '-createdAt'}).done(function(res) {
      console.log(res.results)
      var lists = res.results
      _this.setState({lists: lists})
      _.map(lists, function(_list) {
        console.log(_list)
        qry = {lists: Parse._pointer(_this.props.listClassName, 
                                     _list.objectId)}
        qry = {where: JSON.stringify(qry), count: 1}
        Parse.get(_this.props.className, qry).then(function(res) {
          _objectId = JSON.parse(this._data.where).lists.objectId
          console.log(res.count)
          lists = _.map(lists, function(list) {
            if(list.objectId == _objectId)
              list._count = res.count
            return list
          })
          console.log(lists)
          _this.setState({lists: lists})
        })
      })
    })

    $('.dropdown-copy-list-name').on('click', function(e) {
      console.log(e.target)
      console.log($(e.target).data('objectId'))
      //this.props.copySelectedProspects(listSelect[0].objectId)
    })

    $('.dropdown-move-list-name').on('click', function(e) {
      console.log(e.target)
      console.log($(e.target).data('objectId'))
      //this.props.moveSelectedProspects(listSelect[0].objectId)
    })
  },
  
  removeSelectedProspects: function() {
    // remove selected from list
    selectedProspects = JSON.parse(localStorage.selectedProspects)
    _list = Parse._pointer(this.props.listClassName, this.state.currentListObjectId)
    body = { lists: { '__op' : 'Remove', "objects" : [_list] } }
    if(this.state.currentList == 'All'){ body = { archived: true } }
    Parse.batchUpdate('Prospect', selectedProspects, body)
    // Update List Counts
    //
  },

  moveSelectedProspects: function(_list) {
    // move to list
    // only if the current list is not all
    // remove prospects from currentList
    if(!this.props.currentListObjectId){ console.log('not supported'); return 0}
    selectedProspects = JSON.parse(localStorage.selectedProspects)
    old_list = Parse._pointer(this.props.listClassName, this.props.currentListObjectId)
    new_list = Parse._pointer(this.props.listClassName, _list)
    this.props.removeProspects(selectedProspects)

    var _this = this;
    console.log(_list)
    console.log(this.props.currentListObjectId)
    body = { lists: { '__op' : 'Remove', "objects" : [old_list] } }
    _body = { lists: { '__op' : 'AddUnique', "objects" : [new_list] } }
    /* */

    var lists = _.map(this.state.lists, function(list) {
      //console.log(list)
      if(list.objectId == _list) {
        console.log(selectedProspects)
        console.log(list._count)
        list._count = list._count + selectedProspects.length
      } else if (list.objectId == _this.props.currentListObjectId) {
        list._count = list._count - selectedProspects.length
      }
      return list
    })
    this.setState({lists: lists})
    
    Parse.batchUpdate('Prospect', selectedProspects, body).done(function() {
      increment = {count: {__op: 'Increment', amount: -1*selectedProspects.length}}
      alertify.success("Successfully Moved Prospects to list!")
      Parse.put(_this.props.listClassName+'/'+_list, increment, function(res) {
        console.log(res)
      })

      amount = selectedProspects.length
      var lists = _.map(_this.state.lists, function(item) {
        if(item.objectId == _this.props.currentListObjectId)
          item.count = item.count - amount
        return item
      })
      console.log(lists)
      _this.setState({lists: lists})
    })

    body = { lists: { '__op' : 'AddUnique', "objects" : [new_list] } }
    Parse.batchUpdate('Prospect', selectedProspects, body).done(function() {
      increment = {count: {__op: 'Increment', amount: selectedProspects.length}}
      Parse.put(_this.props.listClassName+'/'+_list, increment, function(res) {
        console.log(res)
      })

      amount = selectedProspects.length
      var lists = _.map(_this.state.lists, function(item) {
        if(item.objectId == _list)
          item.count = (item.count) ? item.count + amount : amount
        return item
      })
      //console.log(lists)
      _this.setState({lists: lists})
    })
    // Update List Counts
  },

  copySelectedProspects: function(_list) {
    // TODO - check to see if prospect exists in the other list
    // TODO - Remove from selected prospects If prospects already exist in list do not increment
    console.log('update')
    selectedProspects = JSON.parse(localStorage.selectedProspects)
    new_list = Parse._pointer(this.props.listClassName, _list)
    body = { lists: { '__op' : 'AddUnique', "objects" : [new_list] } }
    console.log(body)
    var _this = this;
    //qry = {where: JSON.stringify(body)}
    _.map(selectedProspects, function(prospect) {
      //console.log(_this.props)
      Parse.put(_this.props.className, prospect, body).then(function(res) { console.log(res) })
    })
    var lists = _.map(this.state.lists, function(list) {
      //console.log(list)
      if(list.objectId == _list) {
        console.log(selectedProspects)
        console.log(list.count)
        list._count = list._count + selectedProspects.length
      }
      return list
    })
    this.setState({lists: lists})
    /*
    Parse.batchUpdate('Prospect', selectedProspects, body).done(function(res) {
      console.log(res)
      // if success
      increment = {count: {__op: 'Increment', amount: selectedProspects.length}}
      Parse.put(_this.props.listClassName+'/'+_list, increment, function(res) {
        console.log(res)
      })

      amount = selectedProspects.length
      var lists = _.map(_this.state.lists, function(item) {
        if(item.objectId == _list)
            item.count = (item.count) ? item.count + amount : amount
        return item
      })
      console.log(lists)
      _this.setState({lists: lists})
      }) */
  },

  changeList: function(e) {
    /*
    currentList = $(e.target).parent()//.data('list')
    console.log(currentList)
    this.props.changeList(currentList.name, currentList.objectId)
    */
  },

  render: function() {
    if(this.props.currentList == "All")
      styles = {'backgroundColor':'rgb(0, 122, 255)', 'color':'white'} 
    else
      styles =  {}

    lists = [<SideMenuListOption list={{name: 'All', count: this.props.totalCount}} 
                                 iconType={'users'} 
                                 changeList={this.props.changeList} />, 
             <SideMenuListOption list={{name: 'Archived', count: '~'}} 
                                 iconType={'archive'} 
                                 changeList={this.props.changeList} 
                                 hideCount={true}/>]

    for(i=0;i< this.state.lists.length;i++){
      list = this.state.lists[i]
      if(list.list_type == "signal")
        iconType = "wifi"
      else if (list.list_type == "mining_job")
        iconType = "cloudDownload"
      else
        iconType = ""
      if(list.list_type)
        lists.push(<SideMenuListOption list={list} 
                                       iconType={iconType}
                                       listClassName={this.props.listClassName}
                                       changeList={this.props.changeList}/>)
      else 
        lists.push(<SideMenuListOption list={list} 
                                       listClassName={this.props.listClassName}
                                       changeList={this.props.changeList}/>)
    }

    return (
      <div className="col-lg-2 col-md-2 col-sm-2 col-xs-2" 
           style={{padding:'0',height:'438px',backgroundColor:'#e0e9ee',
                   borderRight:'1px solid #b0b8bf',textAlign:'center'}}>
                   <div className="prospect-list-header" style={{paddingLeft:10, textAlign:'center'}}> 
                     Lists

                   </div>
        <div className="btn-group-vertical" 
             style={{width:'100%', height: '320px', overflow: 'auto'}}>
          {lists}
        </div>
        <br/><br/>
        <a href="javascript:" className="btn btn-primary new-list-btn" 
              data-toggle="modal" data-target=".bs-example-modal-sm"
              style={{ backgroundImage: 'linear-gradient(180deg, #0096ff 0%, #005dff 100%)'}}>
          <i className="fa fa-plus-circle" />&nbsp;&nbsp;New List
        </a>
        <CreateListModal createList={this.createList} 
                         updateList={this.updateList}
                         listClassName={this.props.listClassName}/> <br/>
      </div>
    );
  },

  createList: function(data) { 
    this.setState({ lists: [data].concat(this.state.lists) }) 
  },

  updateList: function(_id, objId) {
    updated = _.map(this.state.lists, function(list) {
      if(list.tmp == _id)
          list.objectId = objId
      return list
    })
    console.log("update broski")
    this.setState({lists: updated})
  },

  renameList: function(newListName) {
    thiss = this;
    var filtered = _.filter(this.state.lists, function(item) {
      if(item.name == thiss.state.currentList) {
        item.name = newListName
        return item
      }
      return item
    });

    this.setState({lists : filtered, currentList: newListName})

    $('.modal').click()
    $('#newListName').val('')
    $('.modal-backdrop').click()

    Parse.update(this.props.listClassName, {'name':newListName})
  },

  deleteList: function() {
    var filtered = _.filter(this.state.lists, function(item) {
      if(item.objectId == thiss.state.currentListObjectId)
        return false
      return true
    });

    this.setState({lists: filtered, currentList: 'All'})
    this.changeList('All', '')

    appConfig.closeModal(); 
    $('#newListName').val('');
    Parse.delete(this.props.listClassName+'/'+this.state.currentListObjectId);
  },
});

var CurrentLists = React.createClass({
  listAction: function(e) {
    var listSelect = _.filter(this.props.lists, function(item) {
       return item.name == $(e.target).text()
    });

    this.props.moveSelectedProspects(listSelect[0].objectId)
  },

  render: function() {
    lists = [] 
    for(i=0;i< this.props.lists.length;i++) {
      lists.push(
        <li><a style={{fontWeight:'bold',fontSize:'10px'}} 
            className="dropdown-list-name"
            href="javascript:" 
            onClick={this.listAction}>{this.props.lists[i].name}</a></li>
      )
    }
    //console.log(this.props.copyDropdownStyle)
    return (
      <ul className="dropdown-menu drop-test" id="dropdown" 
          style={{right:-23,top:27}}>
        {lists}
      </ul>
    );
  }
});

var CurrentListsTwo = React.createClass({
  listAction: function(e) {
    listName = $(e.target).text()
    
    var listSelect = _.filter(this.props.lists, function(item) {
       return item.name == listName
    });

    this.copySelectedProspects(listSelect[0].objectId)
  },

  render: function() {
    lists = [] 
    for(i=0;i< this.props.lists.length;i++) {
      lists.push(
        <li><a style={{fontWeight:'bold',fontSize:'10px'}}
               className="dropdown-list-name"
               href="javascript:" 
               onClick={this.listAction}>
          {this.props.lists[i].name}</a></li>
      )
    }
    return (
      <ul className="dropdown-menu drop-test" id="dropdown" 
          style={{width:114,right:-71,top:27}}>
        {lists}
      </ul>
    );
  }
});
