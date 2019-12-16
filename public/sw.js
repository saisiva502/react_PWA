importScripts('/idb.js')
var doCache = false;

var CACHE_STATIC_NAME = 'static-v23';
var CACHE_DYNAMIC_NAME = 'dynamic-v3';

// This triggers when user starts the app
self.addEventListener('install', function(event) {
  // data()
  // console.log("SUCCESS", event)
  event.waitUntil(
    caches.open(CACHE_STATIC_NAME)
      .then(function(cache) {
        cache.add('/');
        cache.add('/#/');
        cache.add('/Dishes');
        cache.add('/idb.js');
        cache.add('/DisheProfle');
      })
  );
});


// Delete old caches
self.addEventListener('activate', function(event) {
  var date = new Date();
  var notifyDate =  date.getMinutes() + 2;
  var dailyNotifyTitle = {title: 'Yahooo!!!!'}
  var dailyNotify = {
    body: "New Dishes are arrived Check Once",
    icon: 'assets/icons/3.png',
    vibrate: [100, 50, 200],
    data:{
      url: '/Dishes'
    }
  }

  // setInterval(function() {
  //   self.registration.showNotification(dailyNotifyTitle.title, dailyNotify)
  //   clearInterval()
  // }, 60000);


  // console.log('[Service Worker] Activating Service Worker ....', event);
  event.waitUntil(
    caches.keys()
      .then(function(keyList) {
        return Promise.all(keyList.map(function(key) {
          if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
            // console.log('[Service Worker] Removing old cache.', key);
            return caches.delete(key);
          }
        }));
      })
  );
  return self.clients.claim();
});

let deferredPrompt;

self.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
});

// Here we intercept request and serve up the matching files
self.addEventListener('fetch', function(event) {
  // console.log(event)
  event.respondWith(
    fetch(event.request)
    .then(function(res) {
      return caches.open(CACHE_DYNAMIC_NAME)
        .then(function(cache) {
          cache.put(event.request.url, res.clone());
          return res;
        })
    })
    .catch(function(err) {
        return caches.match(event.request)
        .then(function(res){
          if (res === undefined) {
            // get and return the offline page
          }
          return res;
      })
    })
    // caches.match(event.request)
    //   .then(function(response) {
    //     if (response) {
    //       return response;
    //     } else {
    //       return fetch(event.request)
    //         .then(function(res) {
    //           return caches.open(CACHE_DYNAMIC_NAME)
    //             .then(function(cache) {
    //               cache.put(event.request.url, res.clone());
    //               return res;
    //             })
    //         })
    //         .catch(function(err) {
    //             // console.log(err)
    //         });
    //     }
    //   })
  );
});


// self.addEventListener('fetch', function(event) {
  // console.log(event)
//   event.respondWith(
//     fetch(event.request)
//       .then(function(res) {
//         caches.open(CACHE_DYNAMIC_NAME)
//         .then(function(cache) {
//           cache.put(event.request.url, res.clone());
//           return res;
//         })
//       }).then(function(response){
//         if (response) {
//           return response;
//         } else{
//           caches.match(event.request)
//           .then(function(res) {
//               return res;
//             })
//           .catch(function(err) {
              // console.log(err)
//           });
//         }
//       })
//   );
// });

// Background Synchronisation

self.addEventListener('sync', function(event) {
  if(event.tag == "sync-rating"){
    // console.log("SERVICE WORKER WITH SYNC")
    event.waitUntil(
        data().then(function(rating){
        // console.log(rating, "RATING CHECK WITH SW")
        for(var data of rating){
          fetch('https://foodfie.herokuapp.com/api/v1/dishes/'+ data.dish_id +'/ratings', {
            method: 'POST',
            headers: {
              'Authorization': data.auth,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body:JSON.stringify({
              comment: data.comment,
              tags: data.tags,
              rating: data.rating
            })
          }).then(function(res){
            // console.log("FETCH RES", res)
          })
          // console.log(data)
        }
      })
    );
  }
});


self.addEventListener('notificationclick', function(event) {
  var notification = event.notification;
  var action = event.action;

  // console.log(notification);

  if (action === 'confirm') {
    // console.log('Confirm was chosen');
    notification.close();
  } else {
    // console.log(action);
    event.waitUntil(
      clients.matchAll()
        .then(function(clis) {
          var client = clis.find(function(c) {
            return c.visibilityState === 'visible';
          });

          if (client !== undefined) {
            client.navigate(notification.data.url);
            client.focus();
          } else {
            clients.openWindow(notification.data.url);
          }
          notification.close();
        })
    );
  }
});

self.addEventListener('notificationclose', function(event) {
  // console.log('Notification was closed', event);
});

self.addEventListener('push', function(event) {

  var res_data = event.data.json()
  var data = {title: res_data.title, content: res_data.body};
  var options = {
    body: data.content,
    icon: 'assets/icons/3.png',
    badge: 'images/add_dish.jpg',
    data: {
      url: '/Dishes'
    }
  };

  var dailyNotifyTitle = {title: 'Yahooo!!!!11'}
  var dailyNotify = {
    body: "New Dishes are arrived Check One",
    data:{
      url: '/Dishes'
    }
  }

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});