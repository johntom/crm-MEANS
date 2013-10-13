'use strict';
angular.module('application')
  .factory('lookupCacheUser', function(User, comboHelper, $q) {
    var caches = {
      users: {
        data: [],
        combo: [],
        deferred: null
      }
    };
    // populateCache('vendors', Vendor, 'VenderID')
    var populateCache = function(cacheName, Resource, comboProperty) {
      console.log('populating cache:  '+cacheName);
      //console.log('populating Resource:  '+Resource);

      var thisCache = caches[cacheName];
      thisCache.deferred = $q.defer();
      Resource.findAll().$promise
        .then(function (response) {
          console.log('getting users data from server',response)
          //thisCache.data = response;//if sending back array
          thisCache.data = response.data;//if sending back object;
          //thisCache.combo = comboHelper.buildIndex(thisCache.data, comboProperty);
          thisCache.deferred.resolve(thisCache);
        })
        .catch(function (err) {
          console.error('lookupCache::populateUser failed', err);
          thisCache.deferred.reject(err);
        });
      return thisCache.deferred.promise;
    };
    var serviceAPI = {
//      get: function(cacheName, Resource, comboProperty) {
//        console.log('getting cache: '+cacheName);
//        var thisCache = caches[cacheName];
//        if (thisCache.deferred === null) { // never been tried
//          populateCache(cacheName, Resource, comboProperty);/* returns thisCache.deferred.promise */
//        }
//        return thisCache.deferred.promise;
//      },
      getUsers: function() {
        console.log('getting cache: Users');
        var thisCache = caches.users;
        if (thisCache.deferred === null) { // never been tried
          populateCache('users', User, 'UserName');/* returns thisCache.deferred.promise */
        }
        return thisCache.deferred.promise;
        // // returns promise to the cache.vendors object
        // return serviceAPI.get('vendors', Vendor, 'VenderID');
      },
      resetUsers:function(){
        var thisCache = caches.users;
        thisCache.deferred = null;
        populateCache('users', User, 'UserName');
        return thisCache.deferred.promise;
      },
      pushUser: function(user) {

        var thisCache = caches.users;
        console.log('push user:',user);

        thisCache.data.push(user);
        console.log('thisCache user:',thisCache);
        return thisCache.deferred.promise;
      },
      updateUsers: function(user) {
        var thisCache = caches.users;
        console.log('updateuser :',user);//,'--',vendor);
        var idx = 0;
        //  var match = _.detect(thisCache.data, function (itm) {
        var match = _.find(thisCache.data, function (itm) {
          return itm.id === user.id || ++idx == thisCache.data.length && (idx = -1);
        })

       console.log('idx ',idx,' match ',match,user)
        thisCache.data[idx]=user; // this works also ???

        return thisCache.deferred.promise;
        // // returns promise to the cache.vendors object //return serviceAPI.get('vendors', Vendor, 'VenderID');
      }
//      ,   resetVendors:function(){
//        var thisCache = caches.vendors;
//        thisCache.deferred = null;
//        var vendorPromise = serviceAPI.getVendors();
//        vendorPromise.then(function(cache) {
//          //populateCache('vendors', Vendor, 'VendorID');
//          //console.log('in v reset')
//          return thisCache.deferred.promise;
//        })
//      }




    };
    return serviceAPI;
  })
